// /api uçlarına yapılan çağrılar.
import type { Ben, Kullanici, Not, Yer, YonetimNotu } from '../../../../worker/tipler'

export class ApiHatasi extends Error {
  constructor(public durum: number, mesaj: string) {
    super(mesaj)
  }
}

async function cagir<T>(yol: string, yontem = 'GET', govde?: unknown): Promise<T> {
  let yanit: Response
  try {
    yanit = await fetch(yol, {
      method: yontem,
      headers: govde === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: govde === undefined ? undefined : JSON.stringify(govde),
    })
  } catch {
    throw new ApiHatasi(0, 'Sunucuya ulaşılamadı. Bağlantınızı denetleyip yeniden deneyin.')
  }
  if (yanit.status === 204) return undefined as T
  let veri: any = null
  try {
    veri = await yanit.json()
  } catch {
    // JSON olmayan yanıt (ör. sunucu kapalıyken gelen hata sayfası)
  }
  if (!yanit.ok || veri === null) throw new ApiHatasi(yanit.status, veri?.hata ?? 'Beklenmeyen bir hata oluştu.')
  return veri as T
}

export const ben = () => cagir<Ben>('/api/ben')
export const googleIleGir = async (credential: string) =>
  (await cagir<{ kullanici: Kullanici }>('/api/giris', 'POST', { credential })).kullanici
export const gelistirmeGirisi = async (ad: string, eposta: string) =>
  (await cagir<{ kullanici: Kullanici }>('/api/gelistirme-girisi', 'POST', { ad, eposta })).kullanici
export const cikis = () => cagir<void>('/api/cikis', 'POST')

export const notlar = async (sayfa?: string) =>
  (await cagir<{ notlar: Not[] }>('/api/notlar' + (sayfa ? '?sayfa=' + encodeURIComponent(sayfa) : ''))).notlar
export const notEkle = async (v: Yer & { metin: string }) => (await cagir<{ not: Not }>('/api/notlar', 'POST', v)).not
export const notGuncelle = async (id: number, metin: string) =>
  (await cagir<{ not: Not }>('/api/notlar/' + id, 'PUT', { metin })).not
export const notSil = (id: number) => cagir<void>('/api/notlar/' + id, 'DELETE')
export const tumNotlar = async () => (await cagir<{ notlar: YonetimNotu[] }>('/api/yonetim/notlar')).notlar

/** Adres yolunu notların saklandığı biçime getirir: `/veri-modeli`, ana sayfa `/`. */
export function sayfaYolu(yol: string): string {
  const sade = yol.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1')
  return sade || '/'
}

const tarihBicimi = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeStyle: 'short' })
export const tarihYaz = (iso: string) => tarihBicimi.format(new Date(iso))
