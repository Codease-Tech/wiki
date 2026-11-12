<script setup lang="ts">
// Doküman metninde seçim yapılınca "Not ekle" düğmesini, not kutusunu ve
// sayfadaki not işaretlerine tıklanınca açılan kutuyu yönetir.
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { onContentUpdated, useData, useRouter } from 'vitepress'
import type { Not, Yer } from '../../../../worker/tipler'
import * as api from './api'
import { useOturum } from './oturum'
import { dokumanKoku, useSayfaNotlari } from './sayfaNotlari'
import { secimiYakala } from './yer'
import NotKarti from './NotKarti.vue'

type Yakalanan = Omit<Yer, 'sayfa' | 'sayfaBasligi'>

const { kullanici, hazir, yukle, girisIste, oturumBitti } = useOturum()
const { notlar, yersizler, acilacak, yenile } = useSayfaNotlari()
const { frontmatter, title, page } = useData()

/** Katkılarım gibi sayfalarda not yazılmaz. */
const etkin = computed(() => frontmatter.value.katki !== false)

const katman = ref<HTMLElement>()
// Katman yalnızca tarayıcıda çizilir (sunucu tarafı derlemede body'ye taşıma yapılmaz).
const monte = ref(false)
const metinAlani = ref<HTMLTextAreaElement>()
const kart = ref<InstanceType<typeof NotKarti>>()
const router = useRouter()

// Seçimin yanında beliren "Not ekle" düğmesi.
const dugme = reactive({ gorunur: false, ust: 0, sol: 0 })
let yakalanan: Yakalanan | null = null

// Not kutusu: yeni not yazma ya da var olan notu gösterme.
const kutu = reactive({
  acik: false,
  ust: 0,
  sol: 0,
  yer: null as Yakalanan | null,
  not: null as Not | null,
  metin: '',
  hata: '',
  mesgul: false,
})

const KUTU_GENISLIGI = 360

/** Kutuyu verilen dikdörtgenin altına, ekrandan taşmayacak biçimde yerleştirir. */
function kutuyuYerlestir(d: DOMRect) {
  const genislik = Math.min(KUTU_GENISLIGI, window.innerWidth - 24)
  kutu.ust = d.bottom + window.scrollY + 8
  kutu.sol = Math.max(12, Math.min(d.left, window.innerWidth - genislik - 12)) + window.scrollX
}

function kutuyuKapat() {
  kutu.acik = false
  kutu.not = null
  kutu.yer = null
  kutu.metin = ''
  kutu.hata = ''
}

/** Kutuda kaydedilmemiş metin var mı (yeni not ya da düzenlenen not)? */
function taslakVar(): boolean {
  if (!kutu.acik) return false
  return kutu.yer ? !!kutu.metin.trim() : !!kart.value?.kirli
}

/** Kaydedilmemiş metin varsa sorar; kullanıcı vazgeçerse `false` döner ve kutu açık kalır. */
function kapatmayiDene(): boolean {
  if (taslakVar() && !confirm('Yazdığınız not kaydedilmedi. Kapatılsın mı?')) return false
  kutuyuKapat()
  return true
}

function secimDegisti() {
  if (!etkin.value) return
  const kok = dokumanKoku()
  const yer = kok ? secimiYakala(kok) : null
  if (!yer) {
    dugme.gorunur = false
    yakalanan = null
    return
  }
  const dikdortgenler = window.getSelection()!.getRangeAt(0).getClientRects()
  const son = dikdortgenler[dikdortgenler.length - 1]
  if (!son) return
  yakalanan = yer
  dugme.ust = son.bottom + window.scrollY + 6
  dugme.sol = Math.max(12, Math.min(son.right - 40, window.innerWidth - 120)) + window.scrollX
  dugme.gorunur = true
}

// Seçim bittiğinde (fare bırakıldı, klavyeyle seçildi, dokunma bitti) düğmeyi göster.
function secimBitti(o: Event) {
  if (katman.value?.contains(o.target as Node)) return
  setTimeout(secimDegisti, 0)
}
// Seçim kaldırıldıysa düğmeyi hemen gizle.
function secimKalkti() {
  if (window.getSelection()?.isCollapsed) dugme.gorunur = false
}

function yeniNotKutusu(yer: Yakalanan, d: DOMRect) {
  kutu.yer = yer
  kutu.not = null
  kutu.metin = ''
  kutu.hata = ''
  kutuyuYerlestir(d)
  kutu.acik = true
  nextTick(() => metinAlani.value?.focus())
}

function notEkleTiklandi(o: MouseEvent) {
  if (!yakalanan) return
  const yer = yakalanan
  // Dokunmatik ekranda düğmeye basınca seçim kalkmış olabilir; o zaman kutu düğmenin yerinde açılır.
  const secim = window.getSelection()
  const d =
    secim && secim.rangeCount && !secim.isCollapsed
      ? secim.getRangeAt(0).getBoundingClientRect()
      : (o.currentTarget as HTMLElement).getBoundingClientRect()
  dugme.gorunur = false
  if (kullanici.value) yeniNotKutusu(yer, d)
  else girisIste(() => yeniNotKutusu(yer, d))
}

async function kaydet() {
  if (!kutu.yer || !kutu.metin.trim() || kutu.mesgul) return
  kutu.mesgul = true
  kutu.hata = ''
  try {
    await api.notEkle({
      ...kutu.yer,
      sayfa: api.sayfaYolu(location.pathname),
      sayfaBasligi: title.value || page.value.title || '',
      metin: kutu.metin,
    })
    kutuyuKapat()
    window.getSelection()?.removeAllRanges()
    await yenile()
  } catch (e) {
    // Kutu ve yazılan metin yerinde kalır; kullanıcı yeniden deneyebilir.
    if (e instanceof api.ApiHatasi && e.durum === 401) {
      kutu.hata = 'Oturum süresi doldu. Giriş yaptıktan sonra yeniden Kaydet\'e basın.'
      oturumBitti()
      girisIste()
    } else {
      kutu.hata = e instanceof Error ? e.message : 'Not kaydedilemedi.'
    }
  } finally {
    kutu.mesgul = false
  }
}

/** Var olan notu, sayfadaki işaretinin (ya da listedeki satırının) yanında açar. */
function notuAc(id: number, kaydir = false) {
  const not = notlar.value.find((n) => n.id === id)
  if (!not) return
  const hedef =
    dokumanKoku()?.querySelector<HTMLElement>(`mark.katki-isaret[data-not="${id}"]`) ??
    document.querySelector<HTMLElement>(`[data-katki-satir="${id}"]`)
  if (!hedef) return
  if (kaydir) hedef.scrollIntoView({ block: 'center' })
  // Yeri bulunamayan not zaten listede düzenlenebilir; kutu yalnızca işaretliler için açılır.
  if (!hedef.matches('mark')) return
  kutu.yer = null
  kutu.not = not
  kutu.hata = ''
  kutuyuYerlestir(hedef.getBoundingClientRect())
  kutu.acik = true
}

function isareteTiklandi(o: Event) {
  const isaret = (o.target as Element).closest?.('mark.katki-isaret') as HTMLElement | null
  if (!isaret) return
  if (o instanceof KeyboardEvent && o.key !== 'Enter' && o.key !== ' ') return
  // Metin seçerken işaretin üstünden geçildiyse kutu açma.
  if (!window.getSelection()?.isCollapsed) return
  if (o instanceof KeyboardEvent) o.preventDefault()
  // İşaretli metin bir bağlantıysa ya da açılır başlıksa tıklama onun işini yapar; not sayfa sonundaki listeden açılır.
  else if ((o.target as Element).closest('a, summary')) return
  if (kutu.acik && !kapatmayiDene()) return
  notuAc(Number(isaret.dataset.not))
}

function disariTiklandi(o: MouseEvent) {
  const hedef = o.target as Element
  if (!kutu.acik || katman.value?.contains(hedef)) return
  if (hedef.closest?.('mark.katki-isaret, .katki-menu')) return
  // Yazılmakta olan bir şey varsa dışarı tıklamak kutuyu kapatmaz (yazılan kaybolmasın).
  if (kutu.not && !taslakVar()) kutuyuKapat()
}

function tusaBasildi(o: KeyboardEvent) {
  if (o.key === 'Escape' && kutu.acik) kapatmayiDene()
  else isareteTiklandi(o)
}

/** Adresteki `?not=12` → o notu göster. */
function adrestekiNotuAc() {
  const id = Number(new URLSearchParams(location.search).get('not'))
  if (id) nextTick(() => notuAc(id, true))
}

async function sayfayiYenile() {
  kutuyuKapat()
  dugme.gorunur = false
  await yenile()
  adrestekiNotuAc()
}

async function notDegisti() {
  kutuyuKapat()
  await yenile()
}

onContentUpdated(() => {
  if (hazir.value) sayfayiYenile()
})
// Giriş ya da çıkış yapılınca işaretler yeniden çizilir; yazılmakta olan not kutusu yerinde kalır.
watch(kullanici, async (yeni, eski) => {
  // Aynı kişi yeniden giriş yaptıysa (oturum süresi dolmuştu) açık kutuya dokunulmaz.
  if (kutu.not && yeni?.id !== eski?.id) kutuyuKapat()
  await yenile()
})

// Sekme kapatılır ya da yenilenirken kaydedilmemiş not varsa tarayıcı sorar.
function sayfadanCikiliyor(o: BeforeUnloadEvent) {
  if (taslakVar()) o.preventDefault()
}
watch(acilacak, (id) => {
  if (id === null) return
  acilacak.value = null
  notuAc(id, true)
})

onMounted(async () => {
  monte.value = true
  // Site içinde başka sayfaya geçerken kaydedilmemiş not varsa sor; vazgeçilirse geçiş iptal olur.
  const onceki = router.onBeforeRouteChange
  router.onBeforeRouteChange = async (hedef) => {
    if (!kapatmayiDene()) return false
    return onceki?.(hedef)
  }
  window.addEventListener('beforeunload', sayfadanCikiliyor)
  document.addEventListener('mouseup', secimBitti)
  document.addEventListener('keyup', secimBitti)
  document.addEventListener('touchend', secimBitti)
  document.addEventListener('selectionchange', secimKalkti)
  document.addEventListener('click', isareteTiklandi)
  document.addEventListener('mousedown', disariTiklandi)
  document.addEventListener('keydown', tusaBasildi)
  await yukle()
  await sayfayiYenile()
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', sayfadanCikiliyor)
  document.removeEventListener('mouseup', secimBitti)
  document.removeEventListener('keyup', secimBitti)
  document.removeEventListener('touchend', secimBitti)
  document.removeEventListener('selectionchange', secimKalkti)
  document.removeEventListener('click', isareteTiklandi)
  document.removeEventListener('mousedown', disariTiklandi)
  document.removeEventListener('keydown', tusaBasildi)
})
</script>

<template>
  <Teleport v-if="monte" to="body">
    <div ref="katman" class="katki-katman">
      <button
        v-if="dugme.gorunur && !kutu.acik"
        type="button"
        class="katki-not-ekle"
        :style="{ top: dugme.ust + 'px', left: dugme.sol + 'px' }"
        @mousedown.prevent
        @click="notEkleTiklandi"
      >
        ✎ Not ekle
      </button>

      <div
        v-if="kutu.acik"
        class="katki-kutu"
        role="dialog"
        :aria-label="kutu.not ? 'Not' : 'Yeni not'"
        :style="{ top: kutu.ust + 'px', left: kutu.sol + 'px' }"
      >
        <button type="button" class="katki-kapat" aria-label="Kapat" @click="kapatmayiDene">×</button>

        <template v-if="kutu.yer">
          <blockquote class="katki-alinti katki-alinti-kisa">{{ kutu.yer.alinti }}</blockquote>
          <textarea
            ref="metinAlani"
            v-model="kutu.metin"
            class="katki-metin-alani"
            rows="5"
            placeholder="Burada neyin güncellenmesi gerektiğini yazın…"
            aria-label="Not"
            @keydown.enter.ctrl.prevent="kaydet"
            @keydown.enter.meta.prevent="kaydet"
          />
          <p v-if="kutu.hata" class="katki-hata" role="alert">{{ kutu.hata }}</p>
          <div class="katki-dugmeler">
            <button
              type="button"
              class="katki-dugme katki-dugme-ana"
              :disabled="kutu.mesgul || !kutu.metin.trim()"
              @click="kaydet"
            >
              {{ kutu.mesgul ? 'Kaydediliyor…' : 'Kaydet' }}
            </button>
            <button type="button" class="katki-dugme" :disabled="kutu.mesgul" @click="kapatmayiDene">Vazgeç</button>
          </div>
        </template>

        <NotKarti
          v-else-if="kutu.not"
          ref="kart"
          :key="kutu.not.id"
          :not="kutu.not"
          :yersiz="yersizler.includes(kutu.not.id)"
          @guncellendi="notDegisti"
          @silindi="notDegisti"
        />
      </div>
    </div>
  </Teleport>
</template>
