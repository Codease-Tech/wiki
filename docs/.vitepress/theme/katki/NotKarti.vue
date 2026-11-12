<script setup lang="ts">
// Tek bir notu gösterir; yazarı düzenleyebilir ve silebilir.
import { computed, nextTick, ref } from 'vue'
import type { Not } from '../../../../worker/tipler'
import * as api from './api'
import { useOturum } from './oturum'

const props = defineProps<{ not: Not; alintiGoster?: boolean; yersiz?: boolean }>()
const emit = defineEmits<{ guncellendi: [not: Not]; silindi: [id: number] }>()

const { girisIste } = useOturum()
const duzenleniyor = ref(false)
const taslak = ref('')
const mesgul = ref(false)
const hata = ref('')
const alan = ref<HTMLTextAreaElement>()

/** Kaydedilmemiş değişiklik var mı? Kutuyu kapatan taraf buna bakar. */
const kirli = computed(() => duzenleniyor.value && taslak.value !== props.not.metin)
defineExpose({ kirli })

function duzenle() {
  taslak.value = props.not.metin
  hata.value = ''
  duzenleniyor.value = true
  nextTick(() => alan.value?.focus())
}

function hatayiIsle(e: unknown) {
  if (e instanceof api.ApiHatasi && e.durum === 401) {
    // Kart ekranda kalsın diye kullanıcı düşürülmez; yalnızca giriş kutusu açılır.
    // Yazılan metin yerinde durur, girişten sonra yeniden Kaydet'e basılır.
    hata.value = "Oturum süresi doldu. Giriş yaptıktan sonra yeniden deneyin."
    girisIste()
  } else {
    hata.value = e instanceof Error ? e.message : 'Beklenmeyen bir hata oluştu.'
  }
}

async function kaydet() {
  if (!taslak.value.trim() || mesgul.value) return
  mesgul.value = true
  hata.value = ''
  try {
    const yeni = await api.notGuncelle(props.not.id, taslak.value)
    duzenleniyor.value = false
    emit('guncellendi', yeni)
  } catch (e) {
    hatayiIsle(e)
  } finally {
    mesgul.value = false
  }
}

async function sil() {
  if (mesgul.value || !confirm('Bu not silinsin mi? Geri alınamaz.')) return
  mesgul.value = true
  hata.value = ''
  try {
    await api.notSil(props.not.id)
    emit('silindi', props.not.id)
  } catch (e) {
    hatayiIsle(e)
  } finally {
    mesgul.value = false
  }
}
</script>

<template>
  <div class="katki-kart">
    <blockquote v-if="alintiGoster" class="katki-alinti">{{ not.alinti }}</blockquote>
    <p v-if="yersiz" class="katki-uyari">Sayfa metni değişmiş; notun yeri bulunamadı.</p>

    <template v-if="duzenleniyor">
      <textarea
        ref="alan"
        v-model="taslak"
        class="katki-metin-alani"
        rows="5"
        aria-label="Not"
        @keydown.enter.ctrl.prevent="kaydet"
        @keydown.enter.meta.prevent="kaydet"
      />
      <p v-if="hata" class="katki-hata" role="alert">{{ hata }}</p>
      <div class="katki-dugmeler">
        <button type="button" class="katki-dugme katki-dugme-ana" :disabled="mesgul || !taslak.trim()" @click="kaydet">
          Kaydet
        </button>
        <button type="button" class="katki-dugme" :disabled="mesgul" @click="duzenleniyor = false">Vazgeç</button>
      </div>
    </template>

    <template v-else>
      <p class="katki-not-metni">{{ not.metin }}</p>
      <p v-if="hata" class="katki-hata" role="alert">{{ hata }}</p>
      <div class="katki-alt">
        <span class="katki-tarih">
          {{ api.tarihYaz(not.olusturma) }}<template v-if="not.guncelleme !== not.olusturma"> · düzenlendi</template>
        </span>
        <span class="katki-dugmeler">
          <slot name="ek" />
          <button type="button" class="katki-dugme katki-dugme-kucuk" :disabled="mesgul" @click="duzenle">Düzenle</button>
          <button type="button" class="katki-dugme katki-dugme-kucuk katki-dugme-sil" :disabled="mesgul" @click="sil">
            Sil
          </button>
        </span>
      </div>
    </template>
  </div>
</template>
