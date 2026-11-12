// Worker ile arayüzün ortak kullandığı tipler.

export interface Kullanici {
  id: number
  ad: string
  eposta: string
  resim: string | null
  yonetici: boolean
}

/** Bir notun sayfadaki yeri. */
export interface Yer {
  /** Sondaki `/` ve `.html` atılmış yol: `/veri-modeli`; ana sayfa `/`. */
  sayfa: string
  sayfaBasligi: string
  /** Seçimden önceki en yakın h2/h3 başlığının çapası. */
  baslikCapa: string | null
  baslikMetni: string | null
  /** Seçilen metin. */
  alinti: string
  /** Alıntının hemen öncesindeki ve sonrasındaki en çok 40 karakter. */
  once: string
  sonra: string
}

export interface Not extends Yer {
  id: number
  metin: string
  /** ISO 8601, UTC. */
  olusturma: string
  guncelleme: string
}

export interface YonetimNotu extends Not {
  yazarAd: string
  yazarEposta: string
}

export interface Ben {
  kullanici: Kullanici | null
  googleIstemciKimligi: string | null
  gelistirmeGirisi: boolean
}

export interface Env {
  DB: D1Database
  ASSETS: Fetcher
  OTURUM_ANAHTARI: string
  GOOGLE_ISTEMCI_KIMLIGI?: string
  YONETICI_EPOSTALARI?: string
  GELISTIRME_GIRISI?: string
}
