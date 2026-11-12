<script setup lang="ts">
// Sayfanın sonunda: okuyucunun bu sayfaya yazdığı notlar.
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useOturum } from './oturum'
import { useSayfaNotlari } from './sayfaNotlari'
import NotKarti from './NotKarti.vue'

const { kullanici } = useOturum()
const { notlar, yersizler, yenile, ac } = useSayfaNotlari()
const { frontmatter } = useData()
const gorunur = computed(() => frontmatter.value.katki !== false && kullanici.value && notlar.value.length > 0)
</script>

<template>
  <section v-if="gorunur" class="katki-sayfa-notlari" aria-label="Bu sayfadaki notlarım">
    <h2 class="katki-bolum-basligi">Bu sayfadaki notlarım ({{ notlar.length }})</h2>
    <p class="katki-bolum-aciklama">Bu notları yalnızca siz ve site yöneticileri görür.</p>
    <ul class="katki-liste">
      <li v-for="n in notlar" :key="n.id" :data-katki-satir="n.id">
        <NotKarti :not="n" alinti-goster :yersiz="yersizler.includes(n.id)" @guncellendi="yenile" @silindi="yenile">
          <template v-if="!yersizler.includes(n.id)" #ek>
            <button type="button" class="katki-dugme katki-dugme-kucuk" @click="ac(n.id)">Sayfada göster</button>
          </template>
        </NotKarti>
      </li>
    </ul>
  </section>
</template>
