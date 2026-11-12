import { defineConfig } from 'vitepress'

// Yeni sayfa eklendiğinde buradaki kenar çubuğuna bir satır eklenir.
// Konu ağacı henüz onaylanmadı; gruplar geçicidir.
export default defineConfig({
  lang: 'tr-TR',
  title: 'CodEase Dokümantasyonu',
  description: 'CodEase kullanım kılavuzu',
  cleanUrls: true,
  lastUpdated: false,

  // Yerelde giriş ve not uçları ayrı çalışan Worker'dadır (`npm run dev` ikisini birlikte açar).
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true,
          // Worker, başka kökenden gelen değişiklik isteklerini reddeder. Yerelde tarayıcı 5173'ten,
          // Worker 8787'den çalıştığı için Origin başlığı Worker'ın adresine çevrilir.
          configure: (vekil) => {
            vekil.on('proxyReq', (istek) => {
              if (istek.getHeader('origin') === 'http://localhost:5173') istek.setHeader('origin', 'http://localhost:8787')
            })
          },
        },
      },
    },
  },

  themeConfig: {
    nav: [{ text: 'Ana sayfa', link: '/' }],

    sidebar: [
      {
        text: 'Kullanım',
        items: [{ text: 'İş listeleri', link: '/is-listeleri' }],
      },
      {
        text: 'Süreç tasarımı',
        items: [
          { text: 'Dizinler, süreçler ve versiyonlar', link: '/dizinler-ve-surecler' },
          { text: 'Veri modeli', link: '/veri-modeli' },
          { text: 'Veritabanları', link: '/veritabanlari' },
          { text: 'Akış tasarımı', link: '/akis-tasarimi' },
          { text: 'Koşullu yönlendirme', link: '/kosullu-yonlendirme' },
          { text: 'Görev ayarları', link: '/gorev-ayarlari' },
          { text: 'Yerelleştirme', link: '/yerellestirme' },
        ],
      },
      {
        text: 'Form tasarımı',
        items: [
          { text: 'Form tasarımı', link: '/form-tasarimi' },
          { text: 'Açılır liste', link: '/acilir-liste' },
          { text: 'Tablo düzeninde içerik', link: '/tablo-duzeninde-icerik' },
          { text: 'Zorunlu alanlar', link: '/zorunlu-alanlar' },
          { text: 'Dinamik kurallar', link: '/dinamik-kurallar' },
          { text: 'Veritabanı Sorgusu bileşeni', link: '/veritabani-sorgusu' },
          { text: 'Etikette hesaplama', link: '/etikette-hesaplama' },
        ],
      },
      {
        text: 'Scriptler',
        items: [
          { text: 'İş Öncesi ve İş Sonrası Script', link: '/is-oncesi-ve-is-sonrasi-script' },
          { text: 'Rol scriptleri', link: '/rol-scriptleri' },
          { text: 'Script kütüphaneleri', link: '/script-kutuphaneleri' },
          { text: 'Form scripti', link: '/form-scripti' },
          { text: 'Scriptte veri tabanı', link: '/scriptte-veri-tabani' },
          { text: 'İşlem sırası ve hatalar', link: '/islem-sirasi-ve-hatalar' },
        ],
      },
      {
        text: 'Örnekler',
        items: [
          { text: 'Listeleri yöneten ayar ekranı', link: '/ayar-ekrani' },
        ],
      },
      {
        text: 'Kurulum ve yönetim',
        items: [
          { text: 'Sunucu kurulumu', link: '/sunucu-kurulumu' },
          { text: 'Sunucu yapısı ve sorun giderme', link: '/sunucu-yapisi' },
        ],
      },
    ],

    outline: { level: [2, 3], label: 'Bu sayfada' },
    docFooter: { prev: 'Önceki', next: 'Sonraki' },
    darkModeSwitchLabel: 'Görünüm',
    lightModeSwitchTitle: 'Açık temaya geç',
    darkModeSwitchTitle: 'Koyu temaya geç',
    sidebarMenuLabel: 'Menü',
    returnToTopLabel: 'Başa dön',

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Ara', buttonAriaLabel: 'Ara' },
          modal: {
            displayDetails: 'Ayrıntılı listeyi göster',
            resetButtonTitle: 'Aramayı temizle',
            backButtonTitle: 'Aramayı kapat',
            noResultsText: 'Sonuç bulunamadı:',
            footer: {
              selectText: 'seç',
              navigateText: 'gezin',
              closeText: 'kapat',
            },
          },
        },
      },
    },
  },
})
