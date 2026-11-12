<script setup lang="ts">
// Sağ üst köşe: "Giriş yap" düğmesi ya da "Hoş geldin, Ad ▾" menüsü.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { useOturum } from './oturum'

const { kullanici, ayar, hazir, girisKutusuAcik, yukle, girisIste, girisKutusunuKapat, cik, googleIle, gelistirmeIle } =
  useOturum()

const kok = ref<HTMLElement>()
const menuAcik = ref(false)
const googleYuvasi = ref<HTMLElement>()
const hata = ref('')
const mesgul = ref(false)
const gelistirmeAd = ref('')
const gelistirmeEposta = ref('')

const ilkAd = computed(() => kullanici.value?.ad.trim().split(/\s+/)[0] ?? '')
const basHarf = computed(() => (ilkAd.value[0] ?? '?').toLocaleUpperCase('tr-TR'))

let googleBetigi: Promise<void> | null = null
function googleBetiginiYukle(): Promise<void> {
  googleBetigi ??= new Promise((tamam, olmadi) => {
    const betik = document.createElement('script')
    betik.src = 'https://accounts.google.com/gsi/client'
    betik.async = true
    betik.onload = () => tamam()
    betik.onerror = () => {
      googleBetigi = null
      olmadi(new Error('Google giriş düğmesi yüklenemedi. Bağlantınızı denetleyip yeniden deneyin.'))
    }
    document.head.appendChild(betik)
  })
  return googleBetigi
}

async function googleDugmesiniCiz() {
  const istemci = ayar.value?.googleIstemciKimligi
  if (!istemci) return
  try {
    await googleBetiginiYukle()
    await nextTick()
    if (!googleYuvasi.value) return
    const g = (window as any).google.accounts.id
    g.initialize({
      client_id: istemci,
      callback: async (yanit: { credential: string }) => {
        hata.value = ''
        try {
          await googleIle(yanit.credential)
        } catch (e) {
          hata.value = e instanceof Error ? e.message : 'Giriş yapılamadı.'
        }
      },
    })
    googleYuvasi.value.innerHTML = ''
    g.renderButton(googleYuvasi.value, { theme: 'outline', size: 'large', text: 'signin_with', locale: 'tr', width: 260 })
  } catch (e) {
    hata.value = e instanceof Error ? e.message : 'Giriş yapılamadı.'
  }
}

watch(girisKutusuAcik, async (acik) => {
  if (!acik) return
  hata.value = ''
  menuAcik.value = false
  googleDugmesiniCiz()
})

async function gelistirmeGir() {
  if (mesgul.value) return
  mesgul.value = true
  hata.value = ''
  try {
    await gelistirmeIle(gelistirmeAd.value, gelistirmeEposta.value)
  } catch (e) {
    hata.value = e instanceof Error ? e.message : 'Giriş yapılamadı.'
  } finally {
    mesgul.value = false
  }
}

async function cikisYap() {
  menuAcik.value = false
  try {
    await cik()
  } catch {
    // Çıkış isteği ulaşmadıysa oturum sürüyor demektir; menü olduğu gibi kalır.
  }
}

function disariTiklandi(o: MouseEvent) {
  if (kok.value && !kok.value.contains(o.target as Node)) {
    menuAcik.value = false
    // Google'ın kendi penceresi sayfanın dışındadır; giriş kutusu yalnızca sayfaya tıklanınca kapanır.
    if (girisKutusuAcik.value && !(o.target as Element).closest?.('.katki-kutu')) girisKutusunuKapat()
  }
}
function tusaBasildi(o: KeyboardEvent) {
  if (o.key !== 'Escape') return
  menuAcik.value = false
  if (girisKutusuAcik.value) girisKutusunuKapat()
}

onMounted(() => {
  yukle()
  document.addEventListener('mousedown', disariTiklandi)
  document.addEventListener('keydown', tusaBasildi)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', disariTiklandi)
  document.removeEventListener('keydown', tusaBasildi)
})
</script>

<template>
  <div v-if="hazir" ref="kok" class="katki-menu">
    <template v-if="kullanici">
      <button
        type="button"
        class="katki-menu-dugme"
        aria-haspopup="menu"
        :aria-expanded="menuAcik"
        :title="kullanici.eposta"
        @click="menuAcik = !menuAcik"
      >
        <img v-if="kullanici.resim" class="katki-resim" :src="kullanici.resim" alt="" referrerpolicy="no-referrer" />
        <span v-else class="katki-resim katki-bas-harf" aria-hidden="true">{{ basHarf }}</span>
        <span class="katki-hosgeldin">Hoş geldin, {{ ilkAd }}</span>
        <span class="katki-ok" aria-hidden="true">▾</span>
      </button>
      <div v-if="menuAcik" class="katki-acilir" role="menu">
        <div class="katki-acilir-baslik">
          <strong>{{ kullanici.ad }}</strong>
          <span>{{ kullanici.eposta }}</span>
        </div>
        <a role="menuitem" :href="withBase('/katkilarim')" @click="menuAcik = false">Katkılarım</a>
        <a v-if="kullanici.yonetici" role="menuitem" :href="withBase('/katkilar')" @click="menuAcik = false">
          Tüm katkılar
        </a>
        <button type="button" role="menuitem" @click="cikisYap">Çıkış</button>
      </div>
    </template>

    <template v-else>
      <button
        type="button"
        class="katki-menu-dugme katki-giris-dugme"
        :aria-expanded="girisKutusuAcik"
        aria-label="Giriş yap"
        @click="girisKutusuAcik ? girisKutusunuKapat() : girisIste()"
      >
        <svg class="katki-giris-simge" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v1.5c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V19c0-2.8-3.6-5-8-5Z"
          />
        </svg>
        <span class="katki-giris-yazi">Giriş yap</span>
      </button>
    </template>

    <!-- Oturum süresi dolduğunda kullanıcı hâlâ girişli görünürken de açılabilir. -->
    <div v-if="girisKutusuAcik" class="katki-acilir katki-giris" role="dialog" aria-label="Giriş">
      <p class="katki-giris-aciklama">Not yazmak ve katkılarınızı görmek için Google hesabınızla giriş yapın.</p>
      <div v-if="ayar?.googleIstemciKimligi" ref="googleYuvasi" class="katki-google" />
      <form v-if="ayar?.gelistirmeGirisi" class="katki-gelistirme" @submit.prevent="gelistirmeGir">
        <strong>Geliştirme girişi</strong>
        <span>Yalnızca yerelde görünür; Google hesabı gerekmez.</span>
        <input v-model="gelistirmeAd" required placeholder="Ad" aria-label="Ad" autocomplete="name" />
        <input v-model="gelistirmeEposta" required type="email" placeholder="E-posta" aria-label="E-posta" autocomplete="email" />
        <button type="submit" class="katki-dugme katki-dugme-ana" :disabled="mesgul">Giriş yap</button>
      </form>
      <p v-if="!ayar" class="katki-hata">Sunucuya ulaşılamadı; giriş şu an yapılamıyor.</p>
      <p v-else-if="!ayar.googleIstemciKimligi && !ayar.gelistirmeGirisi" class="katki-hata">
        Giriş henüz ayarlanmadı.
      </p>
      <p v-if="hata" class="katki-hata" role="alert">{{ hata }}</p>
    </div>
  </div>
</template>
