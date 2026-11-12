import { SignJWT, jwtVerify } from 'jose'
import type { Env, Kullanici } from './tipler'
import { IstekHatasi } from './yanit'

const CEREZ = 'oturum'
const SURE_SN = 60 * 60 * 24 * 30 // 30 gün

function anahtar(env: Env): Uint8Array {
  if (!env.OTURUM_ANAHTARI) throw new Error('OTURUM_ANAHTARI ayarlanmamış')
  return new TextEncoder().encode(env.OTURUM_ANAHTARI)
}

/** Yerelde (http) tarayıcılar Secure çerezi saklamayabilir; yalnızca https'te eklenir. */
function guvenliEki(istek: Request): string {
  return new URL(istek.url).protocol === 'https:' ? '; Secure' : ''
}

export async function oturumCerezi(kullaniciId: number, istek: Request, env: Env): Promise<string> {
  const belirtec = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(kullaniciId))
    .setIssuedAt()
    .setExpirationTime(`${SURE_SN}s`)
    .sign(anahtar(env))
  return `${CEREZ}=${belirtec}; HttpOnly${guvenliEki(istek)}; SameSite=Lax; Path=/; Max-Age=${SURE_SN}`
}

export function cikisCerezi(istek: Request): string {
  return `${CEREZ}=; HttpOnly${guvenliEki(istek)}; SameSite=Lax; Path=/; Max-Age=0`
}

function cerezOku(istek: Request): string | null {
  for (const parca of (istek.headers.get('Cookie') ?? '').split(';')) {
    const [ad, ...deger] = parca.trim().split('=')
    if (ad === CEREZ) return deger.join('=') || null
  }
  return null
}

export function yoneticiMi(eposta: string, env: Env): boolean {
  const liste = (env.YONETICI_EPOSTALARI ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
  return liste.includes(eposta.toLowerCase())
}

type KullaniciSatiri = { id: number; ad: string; eposta: string; resim: string | null }

export function kullaniciyaCevir(s: KullaniciSatiri, env: Env): Kullanici {
  return { id: s.id, ad: s.ad, eposta: s.eposta, resim: s.resim, yonetici: yoneticiMi(s.eposta, env) }
}

export async function oturumdakiKullanici(istek: Request, env: Env): Promise<Kullanici | null> {
  const belirtec = cerezOku(istek)
  if (!belirtec) return null
  let id: number
  try {
    const { payload } = await jwtVerify(belirtec, anahtar(env), { algorithms: ['HS256'] })
    id = Number(payload.sub)
  } catch {
    return null
  }
  if (!Number.isInteger(id)) return null
  const satir = await env.DB.prepare('SELECT id, ad, eposta, resim FROM kullanicilar WHERE id = ?')
    .bind(id)
    .first<KullaniciSatiri>()
  return satir ? kullaniciyaCevir(satir, env) : null
}

/** Giriş yoksa 401 fırlatır. */
export async function girisGerekli(istek: Request, env: Env): Promise<Kullanici> {
  const k = await oturumdakiKullanici(istek, env)
  if (!k) throw new IstekHatasi(401, 'Giriş gerekli')
  return k
}

/** Kullanıcıyı Google kimliğine göre ekler ya da ad/e-posta/resmini günceller. */
export async function kullaniciKaydet(
  env: Env,
  k: { googleKimlik: string; eposta: string; ad: string; resim: string | null },
): Promise<Kullanici> {
  const satir = await env.DB.prepare(
    `INSERT INTO kullanicilar (google_kimlik, eposta, ad, resim, olusturma) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(google_kimlik) DO UPDATE SET eposta = excluded.eposta, ad = excluded.ad, resim = excluded.resim
     RETURNING id, ad, eposta, resim`,
  )
    .bind(k.googleKimlik, k.eposta, k.ad, k.resim, new Date().toISOString())
    .first<KullaniciSatiri>()
  return kullaniciyaCevir(satir!, env)
}
