// Giriş durumu: bütün bileşenlerin paylaştığı tek kopya.
import { ref } from 'vue'
import type { Ben, Kullanici } from '../../../../worker/tipler'
import * as api from './api'

const kullanici = ref<Kullanici | null>(null)
const ayar = ref<Ben | null>(null)
/** /api/ben yanıtı geldi mi (giriş durumu biliniyor mu)? */
const hazir = ref(false)
const girisKutusuAcik = ref(false)
let girisSonrasi: (() => void) | null = null
let yukleme: Promise<void> | null = null

function yukle(): Promise<void> {
  yukleme ??= api
    .ben()
    .then((b) => {
      ayar.value = b
      kullanici.value = b.kullanici
    })
    .catch(() => {
      // Sunucuya ulaşılamıyorsa site yine okunur; yalnızca giriş çalışmaz.
      ayar.value = null
    })
    .finally(() => {
      hazir.value = true
    })
  return yukleme
}

function girdi(k: Kullanici) {
  kullanici.value = k
  girisKutusuAcik.value = false
  const sonra = girisSonrasi
  girisSonrasi = null
  sonra?.()
}

/** Giriş kutusunu açar. `sonra` verilirse giriş başarılı olunca bir kez çağrılır. */
function girisIste(sonra?: () => void) {
  girisSonrasi = sonra ?? null
  girisKutusuAcik.value = true
}

function girisKutusunuKapat() {
  girisKutusuAcik.value = false
  girisSonrasi = null
}

async function cik() {
  await api.cikis()
  kullanici.value = null
}

/** Sunucu "giriş gerekli" dediğinde (oturum süresi dolmuş) çağrılır. */
function oturumBitti() {
  kullanici.value = null
}

export function useOturum() {
  return {
    kullanici,
    ayar,
    hazir,
    girisKutusuAcik,
    yukle,
    girisIste,
    girisKutusunuKapat,
    cik,
    oturumBitti,
    googleIle: async (credential: string) => girdi(await api.googleIleGir(credential)),
    gelistirmeIle: async (ad: string, eposta: string) => girdi(await api.gelistirmeGirisi(ad, eposta)),
  }
}
