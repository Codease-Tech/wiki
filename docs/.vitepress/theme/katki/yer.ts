// Bir notun sayfadaki yerini yakalama, yeniden bulma ve işaretleme.
//
// Not kaydedilirken seçilen metin (alıntı) ile iki yanındaki 40'ar karakter saklanır.
// Sayfa yeniden açıldığında alıntı sayfa metninde aranır; birden çok kez geçiyorsa
// çevresindeki metne en çok uyan geçiş seçilir.

import type { Not, Yer } from '../../../../worker/tipler'

const BAGLAM = 40
const ISARET_SINIFI = 'katki-isaret'
// Sayfa metnine sayılmayan parçalar: başlık bağlantı imi, kod kutusunun dil etiketi,
// kopyala düğmesi, satır numaraları.
const BLOK = 'p, li, h1, h2, h3, h4, h5, h6, td, th, pre, blockquote, summary, dt, dd, div'
const DISARIDA = '.header-anchor, button, .lang, .line-numbers-wrapper, script, style'

/** Boşluk dizilerini tek boşluğa indirir; her karakterin özgün metindeki konumunu da verir. */
function sadelestir(metin: string): { sade: string; konum: number[] } {
  let sade = ''
  const konum: number[] = []
  let oncekiBosluk = false
  for (let i = 0; i < metin.length; i++) {
    const bosluk = /\s/.test(metin[i])
    if (bosluk && oncekiBosluk) continue
    sade += bosluk ? ' ' : metin[i]
    konum.push(i)
    oncekiBosluk = bosluk
  }
  return { sade, konum }
}

function ortakSonEk(a: string, b: string): number {
  let n = 0
  while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n++
  return n
}

function ortakOnEk(a: string, b: string): number {
  let n = 0
  while (n < a.length && n < b.length && a[n] === b[n]) n++
  return n
}

/**
 * Alıntının `metin` içindeki yerini bulur. Konumlar özgün `metin`e göredir.
 * Alıntı yoksa (sayfa değişmişse) `null` döner.
 */
export function yerBul(metin: string, alinti: string, once: string, sonra: string): { bas: number; son: number } | null {
  const aranan = sadelestir(alinti).sade.trim()
  if (!aranan) return null
  const { sade, konum } = sadelestir(metin)
  const onceSade = sadelestir(once).sade
  const sonraSade = sadelestir(sonra).sade

  let enIyi = -1
  let enIyiPuan = -1
  let gecis = 0
  for (let i = sade.indexOf(aranan); i !== -1; i = sade.indexOf(aranan, i + 1)) {
    gecis++
    const puan =
      ortakSonEk(sade.slice(Math.max(0, i - onceSade.length), i), onceSade) +
      ortakOnEk(sade.slice(i + aranan.length, i + aranan.length + sonraSade.length), sonraSade)
    if (puan > enIyiPuan) {
      enIyi = i
      enIyiPuan = puan
    }
  }
  if (enIyi === -1) return null
  // Alıntı birden çok yerde geçiyor ama çevresi hiçbirine uymuyor: notun yazıldığı yer
  // silinmiş demektir. Rastgele bir geçişi işaretlemek yerine "bulunamadı" denir.
  // (Tek bir boşluğun tutması uyum sayılmaz; en az üç karakter aranır.)
  const esik = Math.min(3, onceSade.trim().length + sonraSade.trim().length)
  if (gecis > 1 && enIyiPuan < esik) return null
  return { bas: konum[enIyi], son: konum[enIyi + aranan.length - 1] + 1 }
}

// ---- Sayfa (DOM) tarafı ----

interface Parca {
  dugum: Text
  bas: number
}

/** `kok` altındaki metin düğümlerini sırayla toplar; birleşik metni ve her düğümün başlangıcını verir. */
function metinModeli(kok: HTMLElement): { metin: string; parcalar: Parca[] } {
  const gezgin = document.createTreeWalker(kok, NodeFilter.SHOW_TEXT, {
    acceptNode: (d) => (d.parentElement?.closest(DISARIDA) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  })
  const parcalar: Parca[] = []
  let metin = ''
  let oncekiBlok: Element | null = null
  for (let d = gezgin.nextNode(); d; d = gezgin.nextNode()) {
    const veri = (d as Text).data
    // Derlenmiş sayfada bloklar arasında boşluk yoktur; ayrı paragraf, madde ya da başlıktaki
    // metinler birbirine yapışmasın diye araya satır sonu konur.
    const blok = d.parentElement?.closest(BLOK) ?? null
    if (metin && blok !== oncekiBlok && !/\s$/.test(metin) && !/^\s/.test(veri)) metin += '\n'
    oncekiBlok = blok
    parcalar.push({ dugum: d as Text, bas: metin.length })
    metin += veri
  }
  return { metin, parcalar }
}

/** Seçimden önceki en yakın h2/h3 başlığı. */
function yakinBaslik(kok: HTMLElement, aralik: Range): { capa: string | null; metin: string | null } {
  let bulunan: Element | null = null
  for (const b of kok.querySelectorAll('h2, h3')) {
    // Başlık seçimin başından önce mi (ya da seçim başlığın içinde mi)?
    const konum = b.compareDocumentPosition(aralik.startContainer)
    if (konum & Node.DOCUMENT_POSITION_FOLLOWING || konum & Node.DOCUMENT_POSITION_CONTAINED_BY) bulunan = b
    else break
  }
  if (!bulunan) return { capa: null, metin: null }
  const kopya = bulunan.cloneNode(true) as Element
  kopya.querySelectorAll(DISARIDA).forEach((e) => e.remove())
  return { capa: bulunan.id || null, metin: kopya.textContent?.trim() || null }
}

/**
 * Kullanıcının o anki seçimini not yeri olarak yakalar.
 * Seçim boşsa ya da doküman metninin dışına taşıyorsa `null` döner.
 */
export function secimiYakala(kok: HTMLElement): Omit<Yer, 'sayfa' | 'sayfaBasligi'> | null {
  const secim = window.getSelection()
  if (!secim || secim.rangeCount === 0 || secim.isCollapsed) return null
  const aralik = secim.getRangeAt(0)
  if (!kok.contains(aralik.commonAncestorContainer)) return null

  const { metin, parcalar } = metinModeli(kok)
  let bas = -1
  let son = -1
  for (const p of parcalar) {
    if (!aralik.intersectsNode(p.dugum)) continue
    const b = p.dugum === aralik.startContainer ? aralik.startOffset : 0
    const s = p.dugum === aralik.endContainer ? aralik.endOffset : p.dugum.length
    if (s <= b) continue
    if (bas === -1) bas = p.bas + b
    son = p.bas + s
  }
  if (bas === -1) return null
  // Baştaki ve sondaki boşlukları seçimden at.
  while (bas < son && /\s/.test(metin[bas])) bas++
  while (son > bas && /\s/.test(metin[son - 1])) son--
  if (son <= bas) return null

  const baslik = yakinBaslik(kok, aralik)
  return {
    baslikCapa: baslik.capa,
    baslikMetni: baslik.metin,
    alinti: metin.slice(bas, son),
    once: metin.slice(Math.max(0, bas - BAGLAM), bas),
    sonra: metin.slice(son, son + BAGLAM),
  }
}

/**
 * Notların yerini sayfada `<mark class="katki-isaret" data-not="id">` ile işaretler.
 * Yeri bulunamayan notların kimliklerini döndürür.
 */
export function isaretle(kok: HTMLElement, notlar: Not[]): number[] {
  const bulunamayan: number[] = []
  for (const n of notlar) {
    // İşaretleme metin düğümlerini böldüğü için model her not için yeniden kurulur.
    const { metin, parcalar } = metinModeli(kok)
    const yer = yerBul(metin, n.alinti, n.once, n.sonra)
    if (!yer) {
      bulunamayan.push(n.id)
      continue
    }
    let ilkParca = false
    for (const p of parcalar) {
      const b = Math.max(yer.bas, p.bas) - p.bas
      const s = Math.min(yer.son, p.bas + p.dugum.length) - p.bas
      if (s <= b) continue
      // Bloklar arasındaki salt boşluk düğümleri sarılmaz (liste, tablo yapısı bozulmasın).
      if (!p.dugum.data.slice(b, s).trim()) continue
      const orta = b > 0 ? p.dugum.splitText(b) : p.dugum
      if (s - b < orta.length) orta.splitText(s - b)
      const isaret = document.createElement('mark')
      isaret.className = ISARET_SINIFI
      isaret.dataset.not = String(n.id)
      isaret.title = 'Notu aç'
      // Not birden çok parçaya bölünmüşse klavyeyle yalnızca ilk parçada durulur.
      if (!ilkParca) {
        ilkParca = true
        isaret.tabIndex = 0
      }
      orta.parentNode!.insertBefore(isaret, orta)
      isaret.appendChild(orta)
    }
  }
  return bulunamayan
}

/** İşaretleri söker, bölünen metin düğümlerini yeniden birleştirir. */
export function isaretleriKaldir(kok: HTMLElement): void {
  for (const isaret of kok.querySelectorAll('mark.' + ISARET_SINIFI)) {
    const ust = isaret.parentNode!
    while (isaret.firstChild) ust.insertBefore(isaret.firstChild, isaret)
    ust.removeChild(isaret)
    ust.normalize()
  }
}
