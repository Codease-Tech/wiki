// Tek Worker: /api/* isteklerini yanıtlar, geri kalan her şeyi VitePress çıktısından sunar.
import type { Ben, Env } from './tipler'
import { IstekHatasi, govdeOku, hata, json } from './yanit'
import { cikisCerezi, girisGerekli, kullaniciKaydet, oturumCerezi, oturumdakiKullanici } from './oturum'
import { googleKimlikDogrula } from './google'
import { notEkle, notGuncelle, notSil, notlariListele } from './notlar'
import { tumNotlar } from './yonetim'

/** Sahte giriş iki koşula bağlıdır: değişken açık olmalı ve istek bu bilgisayara gelmiş olmalı. */
function gelistirmeGirisiAcik(istek: Request, env: Env): boolean {
  const sunucu = new URL(istek.url).hostname
  return env.GELISTIRME_GIRISI === '1' && (sunucu === 'localhost' || sunucu === '127.0.0.1')
}

async function api(istek: Request, env: Env, yol: string): Promise<Response> {
  const yontem = istek.method

  // Başka bir siteden tarayıcı aracılığıyla gönderilen değişiklik isteklerini reddet.
  if (yontem !== 'GET' && yontem !== 'HEAD') {
    const koken = istek.headers.get('Origin')
    if (koken && koken !== new URL(istek.url).origin) return hata(403, 'Geçersiz köken')
  }

  if (yol === '/api/ben' && yontem === 'GET') {
    const ben: Ben = {
      kullanici: await oturumdakiKullanici(istek, env),
      googleIstemciKimligi: env.GOOGLE_ISTEMCI_KIMLIGI || null,
      gelistirmeGirisi: gelistirmeGirisiAcik(istek, env),
    }
    return json(ben)
  }

  if (yol === '/api/giris' && yontem === 'POST') {
    const { credential } = await govdeOku(istek)
    if (!env.GOOGLE_ISTEMCI_KIMLIGI) return hata(503, 'Google girişi henüz ayarlanmadı')
    let kimlik
    try {
      kimlik = await googleKimlikDogrula(String(credential ?? ''), env.GOOGLE_ISTEMCI_KIMLIGI)
    } catch {
      return hata(401, 'Google girişi doğrulanamadı')
    }
    const kullanici = await kullaniciKaydet(env, {
      googleKimlik: kimlik.sub,
      eposta: kimlik.email,
      ad: kimlik.name,
      resim: kimlik.picture ?? null,
    })
    return json({ kullanici }, 200, { 'Set-Cookie': await oturumCerezi(kullanici.id, istek, env) })
  }

  // Yalnızca yerel geliştirme; koşullar tutmuyorsa bu uç yoktur.
  if (yol === '/api/gelistirme-girisi' && yontem === 'POST' && gelistirmeGirisiAcik(istek, env)) {
    const { ad, eposta } = await govdeOku(istek)
    if (typeof ad !== 'string' || !ad.trim() || typeof eposta !== 'string' || !eposta.includes('@')) {
      return hata(400, 'Ad ve e-posta gerekli')
    }
    const kullanici = await kullaniciKaydet(env, {
      googleKimlik: 'gelistirme:' + eposta.trim().toLowerCase(),
      eposta: eposta.trim(),
      ad: ad.trim(),
      resim: null,
    })
    return json({ kullanici }, 200, { 'Set-Cookie': await oturumCerezi(kullanici.id, istek, env) })
  }

  if (yol === '/api/cikis' && yontem === 'POST') {
    return new Response(null, { status: 204, headers: { 'Set-Cookie': cikisCerezi(istek) } })
  }

  if (yol === '/api/notlar') {
    if (yontem === 'GET') return notlariListele(istek, env, await girisGerekli(istek, env))
    if (yontem === 'POST') return notEkle(istek, env, await girisGerekli(istek, env))
  }

  const tekNot = yol.match(/^\/api\/notlar\/([^/]+)$/)
  if (tekNot && (yontem === 'PUT' || yontem === 'DELETE')) {
    const kullanici = await girisGerekli(istek, env)
    if (!/^\d+$/.test(tekNot[1])) return hata(404, 'Not bulunamadı')
    const id = Number(tekNot[1])
    return yontem === 'PUT' ? notGuncelle(istek, env, kullanici, id) : notSil(env, kullanici, id)
  }

  if (yol === '/api/yonetim/notlar' && yontem === 'GET') {
    const kullanici = await girisGerekli(istek, env)
    if (!kullanici.yonetici) return hata(403, 'Yetki yok')
    return tumNotlar(istek, env)
  }

  return hata(404, 'Bulunamadı')
}

export default {
  async fetch(istek: Request, env: Env): Promise<Response> {
    const yol = new URL(istek.url).pathname
    if (!yol.startsWith('/api/')) return env.ASSETS.fetch(istek)
    try {
      return await api(istek, env, yol)
    } catch (e) {
      if (e instanceof IstekHatasi) return hata(e.durum, e.message)
      console.error(e)
      return hata(500, 'Sunucu hatası')
    }
  },
} satisfies ExportedHandler<Env>
