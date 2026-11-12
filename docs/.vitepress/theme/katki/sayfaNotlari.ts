// Açık olan sayfadaki notlar ve sayfadaki işaretleri.
import { ref } from 'vue'
import type { Not } from '../../../../worker/tipler'
import * as api from './api'
import { useOturum } from './oturum'
import { isaretle, isaretleriKaldir } from './yer'

const notlar = ref<Not[]>([])
/** Sayfa metni değiştiği için yeri bulunamayan notların kimlikleri. */
const yersizler = ref<number[]>([])
/** Açılması istenen not (listeden ya da bağlantıdan); NotKatmani izler. */
const acilacak = ref<number | null>(null)
let sira = 0

export const dokumanKoku = () => document.querySelector<HTMLElement>('.VPDoc .vp-doc')

/** Sayfadaki işaretleri kaldırır, giriş varsa notları yeniden çekip işaretler. */
async function yenile(): Promise<void> {
  const benimSiram = ++sira
  const { kullanici, oturumBitti } = useOturum()
  const kok = dokumanKoku()
  if (kok) isaretleriKaldir(kok)
  if (!kok || !kullanici.value) {
    notlar.value = []
    yersizler.value = []
    return
  }
  let liste: Not[]
  try {
    liste = await api.notlar(api.sayfaYolu(location.pathname))
  } catch (e) {
    if (e instanceof api.ApiHatasi && e.durum === 401) oturumBitti()
    liste = []
  }
  // Bu arada başka bir yenileme başladıysa (sayfa değişti) sonucu kullanma.
  if (benimSiram !== sira) return
  const guncelKok = dokumanKoku()
  if (!guncelKok) return
  isaretleriKaldir(guncelKok)
  // Eskiden yeniye işaretle: iç içe işaretlerde en yeni not en içte kalır.
  yersizler.value = isaretle(guncelKok, [...liste].reverse())
  notlar.value = liste
}

export function useSayfaNotlari() {
  return { notlar, yersizler, acilacak, yenile, ac: (id: number) => (acilacak.value = id) }
}
