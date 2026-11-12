import { env, SELF, applyD1Migrations, reset } from 'cloudflare:test'

// Geliştirme girişi yalnızca localhost'ta çalışır; https, çerezde Secure görülsün diye.
export const KOK = 'https://localhost'

/** Her testten önce: boş veritabanı + tablolar. */
export async function hazirla() {
  await reset()
  await applyD1Migrations((env as any).DB, (env as any).TEST_GOCLERI)
}

export function istek(yol: string, secenek: { yontem?: string; govde?: unknown; cerez?: string } = {}) {
  const basliklar: Record<string, string> = {}
  if (secenek.cerez) basliklar.Cookie = secenek.cerez
  if (secenek.govde !== undefined) basliklar['Content-Type'] = 'application/json'
  return SELF.fetch(KOK + yol, {
    method: secenek.yontem ?? 'GET',
    headers: basliklar,
    body: secenek.govde !== undefined ? JSON.stringify(secenek.govde) : undefined,
  })
}

/** Set-Cookie başlığından yalnızca `ad=değer` kısmını alır. */
export function cerezDegeri(yanit: Response): string {
  return (yanit.headers.get('Set-Cookie') ?? '').split(';')[0]
}

/** Geliştirme girişiyle oturum açar, Cookie başlığı değerini döndürür. */
export async function giris(eposta: string, ad = eposta.split('@')[0]): Promise<string> {
  const y = await istek('/api/gelistirme-girisi', { yontem: 'POST', govde: { ad, eposta } })
  if (y.status !== 200) throw new Error('giriş başarısız: ' + y.status)
  return cerezDegeri(y)
}

export const ornekYer = {
  sayfa: '/veri-modeli',
  sayfaBasligi: 'Veri modeli',
  baslikCapa: 'alan-ekleme',
  baslikMetni: 'Alan ekleme',
  alinti: 'Alan adı boş bırakılamaz',
  once: 'Kaydetmeden önce ',
  sonra: '. Sonra tip seçilir',
}
