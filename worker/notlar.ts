import type { Env, Kullanici, Not } from './tipler'
import { IstekHatasi, govdeOku, json } from './yanit'

export const NOT_SUTUNLARI =
  'n.id, n.sayfa, n.sayfa_basligi, n.baslik_capa, n.baslik_metni, n.alinti, n.once, n.sonra, n.metin, n.olusturma, n.guncelleme'

export interface NotSatiri {
  id: number
  sayfa: string
  sayfa_basligi: string
  baslik_capa: string | null
  baslik_metni: string | null
  alinti: string
  once: string
  sonra: string
  metin: string
  olusturma: string
  guncelleme: string
}

export function notaCevir(s: NotSatiri): Not {
  return {
    id: s.id,
    sayfa: s.sayfa,
    sayfaBasligi: s.sayfa_basligi,
    baslikCapa: s.baslik_capa,
    baslikMetni: s.baslik_metni,
    alinti: s.alinti,
    once: s.once,
    sonra: s.sonra,
    metin: s.metin,
    olusturma: s.olusturma,
    guncelleme: s.guncelleme,
  }
}

const metinMi = (d: unknown): d is string => typeof d === 'string'
const metinYaDaBos = (d: unknown): string | null => (metinMi(d) && d ? d : null)

function notMetni(d: unknown): string {
  if (!metinMi(d) || !d.trim()) throw new IstekHatasi(400, 'Not boş olamaz')
  return d
}

export async function notlariListele(istek: Request, env: Env, k: Kullanici): Promise<Response> {
  const sayfa = new URL(istek.url).searchParams.get('sayfa')
  const sorgu = sayfa
    ? env.DB.prepare(
        `SELECT ${NOT_SUTUNLARI} FROM notlar n WHERE n.kullanici_id = ? AND n.sayfa = ? ORDER BY n.olusturma DESC, n.id DESC`,
      ).bind(k.id, sayfa)
    : env.DB.prepare(
        `SELECT ${NOT_SUTUNLARI} FROM notlar n WHERE n.kullanici_id = ? ORDER BY n.olusturma DESC, n.id DESC`,
      ).bind(k.id)
  const { results } = await sorgu.all<NotSatiri>()
  return json({ notlar: results.map(notaCevir) })
}

export async function notEkle(istek: Request, env: Env, k: Kullanici): Promise<Response> {
  const g = await govdeOku(istek)
  const metin = notMetni(g.metin)
  // Sayfa yolu bağlantı olarak gösterilir; `//alan` ya da `/\\alan` gibi site dışına çıkan değerler reddedilir.
  if (!metinMi(g.sayfa) || !/^\/(?![/\\])[^\\\s]*$/.test(g.sayfa)) throw new IstekHatasi(400, 'Sayfa eksik')
  if (!metinMi(g.alinti) || !g.alinti) throw new IstekHatasi(400, 'Seçilen metin eksik')
  const simdi = new Date().toISOString()
  const satir = await env.DB.prepare(
    `INSERT INTO notlar (kullanici_id, sayfa, sayfa_basligi, baslik_capa, baslik_metni, alinti, once, sonra, metin, olusturma, guncelleme)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id, sayfa, sayfa_basligi, baslik_capa, baslik_metni, alinti, once, sonra, metin, olusturma, guncelleme`,
  )
    .bind(
      k.id,
      g.sayfa,
      metinMi(g.sayfaBasligi) ? g.sayfaBasligi : '',
      metinYaDaBos(g.baslikCapa),
      metinYaDaBos(g.baslikMetni),
      g.alinti,
      metinMi(g.once) ? g.once : '',
      metinMi(g.sonra) ? g.sonra : '',
      metin,
      simdi,
      simdi,
    )
    .first<NotSatiri>()
  return json({ not: notaCevir(satir!) }, 201)
}

// Sahiplik her sorguda kullanici_id ile denetlenir: başkasının notu "yok" sayılır.

export async function notGuncelle(istek: Request, env: Env, k: Kullanici, id: number): Promise<Response> {
  const metin = notMetni((await govdeOku(istek)).metin)
  const satir = await env.DB.prepare(
    `UPDATE notlar SET metin = ?, guncelleme = ? WHERE id = ? AND kullanici_id = ?
     RETURNING id, sayfa, sayfa_basligi, baslik_capa, baslik_metni, alinti, once, sonra, metin, olusturma, guncelleme`,
  )
    .bind(metin, new Date().toISOString(), id, k.id)
    .first<NotSatiri>()
  if (!satir) throw new IstekHatasi(404, 'Not bulunamadı')
  return json({ not: notaCevir(satir) })
}

export async function notSil(env: Env, k: Kullanici, id: number): Promise<Response> {
  const sonuc = await env.DB.prepare('DELETE FROM notlar WHERE id = ? AND kullanici_id = ?').bind(id, k.id).run()
  if (!sonuc.meta.changes) throw new IstekHatasi(404, 'Not bulunamadı')
  return new Response(null, { status: 204 })
}
