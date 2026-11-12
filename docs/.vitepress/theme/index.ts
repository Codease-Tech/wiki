// Varsayılan VitePress temasına giriş ve katkı notlarını ekler.
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import KullaniciMenusu from './katki/KullaniciMenusu.vue'
import NotKatmani from './katki/NotKatmani.vue'
import SayfaNotlari from './katki/SayfaNotlari.vue'
import Katkilarim from './katki/Katkilarim.vue'
import TumKatkilar from './katki/TumKatkilar.vue'
import './katki/katki.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(KullaniciMenusu),
      'doc-after': () => h(SayfaNotlari),
      'layout-bottom': () => h(NotKatmani),
    }),
  enhanceApp({ app }) {
    app.component('Katkilarim', Katkilarim)
    app.component('TumKatkilar', TumKatkilar)
  },
} satisfies Theme
