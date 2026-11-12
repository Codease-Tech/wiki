<script setup lang="ts">
// "Katkılarım" sayfası: giriş yapan kişinin bütün notları, sayfaya göre gruplu.
import { computed, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import type { Not } from '../../../../worker/tipler'
import * as api from './api'
import { useOturum } from './oturum'
import NotKarti from './NotKarti.vue'

const { kullanici, hazir, yukle, girisIste, oturumBitti } = useOturum()
const notlar = ref<Not[]>([])
const yukleniyor = ref(false)
const hata = ref('')

async function getir() {
  if (!kullanici.value) {
    notlar.value = []
    return
  }
  yukleniyor.value = true
  hata.value = ''
  try {
    notlar.value = await api.notlar()
  } catch (e) {
    if (e instanceof api.ApiHatasi && e.durum === 401) oturumBitti()
    else hata.value = e instanceof Error ? e.message : 'Notlar alınamadı.'
  } finally {
    yukleniyor.value = false
  }
}

/** Sayfaya göre gruplar; gruplar en yeni notuna göre sıralı kalır (liste zaten yeniden eskiye). */
const gruplar = computed(() => {
  const harita = new Map<string, { sayfa: string; baslik: string; notlar: Not[] }>()
  for (const n of notlar.value) {
    if (!harita.has(n.sayfa)) harita.set(n.sayfa, { sayfa: n.sayfa, baslik: n.sayfaBasligi || n.sayfa, notlar: [] })
    harita.get(n.sayfa)!.notlar.push(n)
  }
  return [...harita.values()]
})

const baglanti = (n: Not) => withBase(n.sayfa) + '?not=' + n.id

onMounted(async () => {
  await yukle()
  await getir()
})
watch(kullanici, getir)
</script>

<template>
  <div v-if="hazir" class="katki-sayfa">
    <div v-if="!kullanici" class="katki-bos">
      <p>Katkılarınızı görmek için giriş yapın.</p>
      <button type="button" class="katki-dugme katki-dugme-ana" @click="girisIste()">Giriş yap</button>
    </div>

    <p v-else-if="hata" class="katki-hata" role="alert">
      {{ hata }} <button type="button" class="katki-dugme katki-dugme-kucuk" @click="getir">Yeniden dene</button>
    </p>

    <p v-else-if="yukleniyor && !notlar.length" class="katki-bolum-aciklama">Yükleniyor…</p>

    <div v-else-if="!notlar.length" class="katki-bos">
      <p>Henüz not yazmadınız.</p>
      <p>
        Bir doküman sayfasında güncellenmesi gereken yeri fareyle seçin, beliren <strong>Not ekle</strong> düğmesine
        basıp notunuzu yazın. Yazdıklarınız burada listelenir.
      </p>
    </div>

    <template v-else>
      <p class="katki-bolum-aciklama">
        Toplam {{ notlar.length }} not. Bu notları yalnızca siz ve site yöneticileri görür.
      </p>
      <section v-for="g in gruplar" :key="g.sayfa" class="katki-grup">
        <h2 class="katki-bolum-basligi">
          <a :href="withBase(g.sayfa)">{{ g.baslik }}</a>
        </h2>
        <ul class="katki-liste">
          <li v-for="n in g.notlar" :key="n.id">
            <p v-if="n.baslikMetni" class="katki-konum">{{ n.baslikMetni }}</p>
            <NotKarti :not="n" alinti-goster @guncellendi="getir" @silindi="getir">
              <template #ek>
                <a class="katki-dugme katki-dugme-kucuk" :href="baglanti(n)">Sayfada göster</a>
              </template>
            </NotKarti>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
