<script setup lang="ts">
// Yönetici sayfası: herkesin notları, süzme ve CSV dökümü.
import { computed, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import type { YonetimNotu } from '../../../../worker/tipler'
import * as api from './api'
import { useOturum } from './oturum'

const { kullanici, hazir, yukle, girisIste, oturumBitti } = useOturum()
const notlar = ref<YonetimNotu[]>([])
const yukleniyor = ref(false)
const hata = ref('')
const yazar = ref('')
const sayfa = ref('')

async function getir() {
  if (!kullanici.value?.yonetici) {
    notlar.value = []
    return
  }
  yukleniyor.value = true
  hata.value = ''
  try {
    notlar.value = await api.tumNotlar()
  } catch (e) {
    if (e instanceof api.ApiHatasi && e.durum === 401) oturumBitti()
    else hata.value = e instanceof Error ? e.message : 'Notlar alınamadı.'
  } finally {
    yukleniyor.value = false
  }
}

const sirala = (a: string, b: string) => a.localeCompare(b, 'tr')
const yazarlar = computed(() =>
  [...new Map(notlar.value.map((n) => [n.yazarEposta, n.yazarAd])).entries()].sort((a, b) => sirala(a[1], b[1])),
)
const sayfalar = computed(() =>
  [...new Map(notlar.value.map((n) => [n.sayfa, n.sayfaBasligi || n.sayfa])).entries()].sort((a, b) => sirala(a[1], b[1])),
)
const suzulmus = computed(() =>
  notlar.value.filter((n) => (!yazar.value || n.yazarEposta === yazar.value) && (!sayfa.value || n.sayfa === sayfa.value)),
)

onMounted(async () => {
  await yukle()
  await getir()
})
watch(kullanici, getir)
</script>

<template>
  <div v-if="hazir" class="katki-sayfa">
    <div v-if="!kullanici" class="katki-bos">
      <p>Bu sayfa yalnızca yöneticiler içindir.</p>
      <button type="button" class="katki-dugme katki-dugme-ana" @click="girisIste()">Giriş yap</button>
    </div>
    <div v-else-if="!kullanici.yonetici" class="katki-bos">
      <p>Bu sayfa yalnızca yöneticiler içindir.</p>
    </div>

    <p v-else-if="hata" class="katki-hata" role="alert">
      {{ hata }} <button type="button" class="katki-dugme katki-dugme-kucuk" @click="getir">Yeniden dene</button>
    </p>
    <p v-else-if="yukleniyor && !notlar.length" class="katki-bolum-aciklama">Yükleniyor…</p>
    <div v-else-if="!notlar.length" class="katki-bos"><p>Henüz kimse not yazmadı.</p></div>

    <template v-else>
      <div class="katki-arac-cubugu">
        <label>
          Yazar
          <select v-model="yazar">
            <option value="">Hepsi</option>
            <option v-for="[eposta, ad] in yazarlar" :key="eposta" :value="eposta">{{ ad }} ({{ eposta }})</option>
          </select>
        </label>
        <label>
          Sayfa
          <select v-model="sayfa">
            <option value="">Hepsi</option>
            <option v-for="[yol, baslik] in sayfalar" :key="yol" :value="yol">{{ baslik }}</option>
          </select>
        </label>
        <span class="katki-sayi">{{ suzulmus.length }} / {{ notlar.length }} not</span>
        <a class="katki-dugme katki-dugme-ana" href="/api/yonetim/notlar?bicim=csv" download>CSV indir (tümü)</a>
      </div>

      <div class="katki-tablo-sarmal">
        <table class="katki-tablo">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Yazar</th>
              <th>Sayfa</th>
              <th>Seçilen metin</th>
              <th>Not</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="n in suzulmus" :key="n.id">
              <td class="katki-dar">{{ api.tarihYaz(n.olusturma) }}</td>
              <td>
                {{ n.yazarAd }}<br /><span class="katki-tarih">{{ n.yazarEposta }}</span>
              </td>
              <td>
                <a :href="withBase(n.sayfa) + (n.baslikCapa ? '#' + n.baslikCapa : '')">{{ n.sayfaBasligi || n.sayfa }}</a>
                <template v-if="n.baslikMetni"><br /><span class="katki-tarih">{{ n.baslikMetni }}</span></template>
              </td>
              <td class="katki-hucre-metin">{{ n.alinti }}</td>
              <td class="katki-hucre-metin">{{ n.metin }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
