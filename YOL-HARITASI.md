# CodEase dokümantasyonu — yol haritası

Amaç: eldeki CodEase eğitim videolarından (onlarca video) yazılı, konuya göre düzenlenmiş bir dokümantasyon üretmek.

Durum (2026-11-11, akşam): `videolar/` içinde 11 video var; **hepsi işlendi**, `docs/` altında 24 taslak sayfa var ve site yerelde çalışıyor (`npm run dev`). Dökümler `calisma/<video>/dokum-dk.txt`. Sıradaki iş kullanıcının `SORULAR.md`'ye bakması ve biçim/konu ağacı onayı. Sayfa biçimi ve konu ağacı kullanıcı onayı bekliyor. Whisper kurulu (`whisper-cli`, model `calisma/modeller/`).

### Video durumu

| Video | Süre | Döküm | Sayfa |
|---|---|---|---|
| Eğitim 1 – Fatih | 70 dk | var | is-listeleri, dizinler-ve-surecler, veri-modeli, akis-tasarimi, form-tasarimi, acilir-liste |
| Eğitim 1 – Veysel | 67 dk | var | rol-scriptleri, is-oncesi-ve-is-sonrasi-script, etikette-hesaplama (+ eski sayfalara ekler) |
| Eğitim 2 – Fatih | 23 dk | var | gorev-ayarlari, yerellestirme |
| Eğitim 3 – Fatih | — | **video elde yok** | — (veri tabanı sorgusu, İş Sonrası Script ile kayıt) |
| Eğitim 4 – Fatih | 52 dk | var | veri-modeli, akis-tasarimi, tablo-duzeninde-icerik, zorunlu-alanlar |
| Eğitim 5, 7 – Fatih | — | **video elde yok** | — |
| Eğitim 6 – Fatih | 22 dk | var | yeni sayfa yok: veri modeli ve tablo tekrarı, sonrası ödev dağıtımı (müşteri/proje tanım süreci, Excel içeri/dışarı alma — anlatımı yok) |
| Eğitim 8 – Fatih | 93 dk (51 dk konuşma) | var | script-kutuphaneleri (+ script, açılır liste, tablo, form sayfalarına ekler) |
| Bereket – Script Eğitimi – Veysel | 163 dk | var (+ ek1, ek2) | veritabani-sorgusu, dinamik-kurallar, form-scripti, scriptte-veri-tabani, kosullu-yonlendirme, islem-sirasi-ve-hatalar (+ ekler) |
| Bereket – Veritabanı Eğitimi – Veysel | 98 dk | var | veritabanlari (+ rol-scriptleri, acilir-liste, veri-modeli, tablo ekleri) |
| Atılay Veri Tabanı (22.04.2022) | 79 dk | var | ayar-ekrani (+ tablo-duzeninde-icerik, scriptte-veri-tabani ekleri) |
| Sunucu Kurulum 1, 2 | 66 + 70 dk | var | sunucu-kurulumu, sunucu-yapisi (hedef okuyucu: sistemi kuran; görüntü kullanılmadı) |

### Yazılmayı bekleyen konular (dökümü olan videolardan)

- SSL kurulumu, sürüm güncelleme, yedekleme: videolarda yok.
- Değerlendirme (zamanlanmış script) — Eğitim 1 – Veysel'de yalnızca değinildi.

## Açık sorular (kullanıcı yanıtlayacak)

1. Videolar nerede (Mac'te dosya / YouTube / Drive) ve toplam kaç saat?
2. Anlatım dili ve dokümanın dili (Türkçe / İngilizce)?
3. Hedef okuyucu: son kullanıcı, süreç tasarlayan, sistemi kuran/yöneten?
4. ~~Çıktı biçimi~~ — yanıtlandı (2026-11-11): web sitesi olacak, içinde dokümana soru sorulabilen küçük bir asistan bulunacak.
5. Site nerede yayınlanacak (herkese açık / şirket içi) ve asistan hangi modelle çalışacak (dış API / yerel)?

## Aşamalar

### Aşama 0 — Hazırlık
- [ ] Açık sorular yanıtlanır.
- [ ] Videolar `videolar/` klasörüne konur (ya da yolları verilir).
- [x] Yerel konuşma tanıma aracı kurulur (whisper.cpp, Homebrew ile; model large-v3-turbo).
- [ ] Disk: bu Mac'te 2026-11-11'de yalnızca 6,8 GB boş yer vardı. Videolar ve model sığmayabilir; videolar harici diskte kalabilir, `calisma/` küçük tutulur.

### Aşama 1 — Tek video ile deneme
- [x] Bir video seçilir; ses çıkarılır, zaman damgalı döküm alınır. (Eğitim 2 – Fatih, `calisma/egitim-2-fatih/dokum.srt`)
- [x] Ekran görüntüleri çıkarılır. (Sahne algılama işe yaramadı; dökümdeki dakikaya göre alındı, kırpıldı, adlar bulanıklaştırıldı.)
- [x] O videodan bir örnek doküman sayfası yazılır. (`docs/gorev-ayarlari.md`; kod tabanı farkları `calisma/celiskiler.md`)
- [ ] Kullanıcı kaliteyi, sayfa biçimini ve süreyi onaylar ya da düzeltir.

### Aşama 2 — Toplu işleme
- [ ] Tüm videolar için döküm + kareler (`calisma/<video-adı>/`). (11/11 döküm ve sayfa tamam; ham not yerine doğrudan taslak sayfa + `calisma/celiskiler.md` tutuldu.)
- [ ] Terim sözlüğü: tanıma modelinin yanlış yazdığı ürün terimleri ve özel adlar (`calisma/sozluk.md`). (Her videoda genişliyor.)
- [ ] Video başına ham not: anlatılan konu, adımlar, ekranlar, dakika atıfları.

### Aşama 3 — Konuya göre birleştirme
- [ ] Konu ağacı çıkarılır (ör. süreç tasarımı, form tasarımı, betikler, yönetim) ve kullanıcıya onaylatılır.
- [ ] Aynı konu birden çok videoda geçiyorsa tek sayfada toplanır; her sayfa kaynak videoya ve dakikaya atıf verir.
- [ ] Sayfalar `docs/` altına yazılır.

### Aşama 3b — Kod tabanı taraması (kullanıcı isteği, 2026-11-12)
- [ ] Altı alan taranır, raporlar `calisma/kod-taramasi/` altına yazılır: süreç tasarımcısı, form tasarımcısı, script nesneleri, veritabanı ve sorgular, kullanıcı ve yönetim ekranları, kurulum.
- [ ] Rapordaki kritik iddialar kodda asistan tarafından okunur.
- [ ] Var olan sayfalardaki yanlışlar düzeltilir, eksikler eklenir.
- [ ] Videolarda hiç geçmeyen konular için yeni sayfalar yazılır (konu ağacındaki yerleri kullanıcı onayına kadar geçici).
- [ ] Canlıda denenmesi gerekenler `SORULAR.md`'ye eklenir.

### Aşama 4 — Gözden geçirme ve yayın
- [ ] Kullanıcı son okumayı yapar; düzeltmeler işlenir.
- [ ] Seçilen biçimde çıktı üretilir.

### Aşama 5 — Sitede soru-cevap asistanı
- [x] Site iskeleti Aşama 1'deki örnek sayfayla birlikte kurulur; sayfalar yazıldıkça siteye girer. (VitePress; `npm run dev` → http://localhost:5173. Kullanıcı henüz bakıp onaylamadı.)
- [ ] Asistan yalnızca `docs/` içeriğinden yanıt verir, yanıtında ilgili sayfaya bağlantı gösterir; dokümanda olmayan şeyi "dokümanda yok" diye söyler.
- [ ] Model anahtarı tarayıcıya konmaz; küçük bir sunucu ucu gerekir.
- [ ] Sayfalar asistanın bulabileceği biçimde yazılır: tek konu, açık başlıklar, kısa bölümler.

### Aşama 6 — Giriş ve katkı notları (kullanıcı isteği, 2026-11-12)
- [x] Tek Cloudflare Worker: site + `/api` uçları; notlar D1'de. (`worker/`, `migrations/`, `wrangler.jsonc`)
- [x] Yalnızca Google ile giriş; sağ üstte "Hoş geldin, Ad" ve menüde Katkılarım / Çıkış.
- [x] Metin seçip not yazma; kişinin kendi notları sayfada işaretli, sayfa sonunda ve `/katkilarim`'da listeli.
- [x] Yönetici: `/katkilar` sayfası ve CSV dökümü.
- [x] Yerelde denendi (38 test, tarayıcıda 35 adım). Gerçek Google girişi **denenmedi**: istemci kimliği yok.
- [ ] Kullanıcı: Google istemci kimliği ve Cloudflare hesabı; `YAYIN.md` adımları.
- [ ] Yayın sonrası gerçek Google hesabıyla giriş denenir.

## Klasör düzeni

- `videolar/` — kaynak videolar (ya da yollarını tutan liste)
- `calisma/` — ara çıktılar: ses, döküm, kareler, ham notlar (yeniden üretilebilir)
- `docs/` — bitmiş doküman sayfaları; `docs/.vitepress/theme/katki/` giriş ve not arayüzü
- `worker/`, `migrations/`, `test/` — Cloudflare Worker (giriş, notlar), veritabanı şeması, testler

## İlkeler

- Döküm yerelde alınır; videolar dış servise gönderilmez (ekranda müşteri verisi olabilir).
- Doküman video sırasına göre değil konuya göre düzenlenir.
- Videoda söylenmeyen şey dokümana "bilgi" olarak yazılmaz; çıkarım yapılan yer açıkça işaretlenir.
- Üç kaynak var: videolar, kod tabanı (`../codEase-master`, yalnızca okunur) ve https://workrunner.github.io (kullanıcının kendi belgesi; yeniden yazılana kadar kaynak).
- Videoda yanlış ya da eksik anlatılan konu kod tabanından doğrulanır ve tamamlanır.
- Dokümanda "under the hood" yok: kullanıcının gördüğü davranış yazılır; sınıf adı, iç mimari, uygulama ayrıntısı yazılmaz.
