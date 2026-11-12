# Notlar

Kararlar, kullanıcı tercihleri ve işlerken öğrenilenler. En yeni üstte; her girdi tarihli.

## 2026-11-12 — Giriş ve katkı notları uygulandı

- Plan: `calisma/planlar/2026-11-12-giris-ve-katki-notlari.md`; uygulama sırasında verilen kararlar `calisma/planlar/ilerleme.md`.
- `@cloudflare/vitest-pool-workers` kullanımdan kalkmış; yerine `@cloudflare/vitest-plugin` (vitest 4). Testlerde her testten önce `reset()` + `applyD1Migrations`.
- Yerelde tarayıcı 5173'te, Worker 8787'de. Worker başka kökenden gelen POST/PUT/DELETE'i reddettiği için vite vekili hem `Host`'u (`changeOrigin`) hem `Origin` başlığını 8787'ye çevirir (`docs/.vitepress/config.mts`). Bunlardan biri eksikse yerelde her kayıt "Geçersiz köken" (403) verir.
- Oturum çerezinde `Secure` yalnızca https istekte eklenir (Safari http://localhost'ta Secure çerezi saklamıyor).
- Derlenmiş sayfada bloklar arasında boşluk yok; alıntı yakalanırken ayrı paragraf/madde/başlık arasına satır sonu konur (`yer.ts`, `metinModeli`). Alıntı aranırken boşluk farkları yok sayılır.
- Dar ekranda üst çubukta "Giriş yap" yazısına yer yok; kişi simgesi gösterilir, açılan kutular ekrana yaslanır.
- Tarayıcı denemesi için kalıcı araç yok: `puppeteer-core` + kurulu Chrome ile geçici betik yazıldı (proje dışında). Yeniden gerekirse aynı yol.
- Adres şikâyeti yeniden üretilemedi (Chrome'da adres her sayfada değişiyor); SORULAR S1.
- `araclar/soru-sunucu/index.html` yerinde yok (`araclar/` boş); `SORULAR.md`'ye eklenen S1–S2 soru sayfasına işlenemedi.
- Denenmeyen: gerçek Google girişi (istemci kimliği yok) ve gerçek Cloudflare yayını. Belirteç doğrulaması yerel anahtarla test edildi.

## 2026-11-12 — Giriş ve katkı notları (tasarım, kullanıcı onayladı)

- Kullanıcı isteği: yalnızca Google ile giriş; sağ üstte "Hoş geldin, Ad" ve açılır menüde "Katkılarım"; okuyucu sayfada bir yeri seçip güncelleme notu yazar; notlar SQLite benzeri bir yerde toplanır ("sonra bana lazım olacaklar"); tüm sistem Cloudflare Worker'da çalışır; kişi kendi katkılarını hem sayfa içinde hem menüden görür.
- Kullanıcı kararı: herkes okur, Google hesabı olan herkes yazar. Not uzunluğu ve günlük not sayısı için **sınır yok** (asistanın önerdiği 2000 karakter / günde 30 not reddedildi).
- Yapı (asistanın seçimi; tek mantıklı yol olarak sunuldu, itiraz gelmedi): tek Worker hem VitePress çıktısını (statik dosyalar) hem `/api/*` uçlarını sunar; veritabanı Cloudflare D1.
- Giriş: Google Identity Services düğmesi → kimlik belirteci Worker'da doğrulanır → 30 günlük imzalı, HttpOnly oturum çerezi.
- Not: metin seçilince "Not ekle" düğmesi; notla birlikte sayfa yolu, en yakın başlık çapası, seçilen metin ve çevresi saklanır. Kişinin kendi notlarının yeri sayfada işaretlenir; tıklayınca açılır, düzenlenir, silinir. Yer bulunamazsa not sayfa sonundaki "Bu sayfadaki notlarım" listesinde alıntısıyla ve "yer bulunamadı" uyarısıyla görünür (ilk tasarımda "başlığının altında" denmişti; uygulama böyle).
- Görünürlük (asistanın kararı, itiraz gelmedi): notu yalnızca yazan ve yönetici görür. Yönetici e-posta listesindekiler `/katkilar` sayfasında tüm notları görür, CSV indirir.
- Yerelde Google kimliği olmadan deneme için yalnızca geliştirme modunda açık sahte giriş; canlıda kapalı.
- Kullanıcıdan gerekecek: Google OAuth istemci kimliği, Cloudflare hesabı.
- Adres konusu açık: kullanıcı "hep localhost:5173 yazıyor" dedi; VitePress her sayfaya kendi adresini veriyor, kodda neden yok. Hangi tarayıcıda gördüğü soruldu, yanıt gelmedi.

## 2026-11-12 — Kod tabanı taraması başladı

- Kullanıcı isteği: "kodbase i derinlemesine inceleyip bu şekilde dökümanı geliştirebilir misin." Önceki kural ("videoda söylenmeyen şey bilgi olarak yazılmaz") bununla genişledi: videoda hiç geçmeyen özellik de koddan yazılabilir (asistanın yorumu). "Under the hood yok" kuralı sürüyor.
- Yöntem: altı alan için ayrı alt-asistan taraması (süreç tasarımcısı, form tasarımcısı, script nesneleri, veritabanı ve sorgular, kullanıcı ve yönetim ekranları, kurulum). Raporlar `calisma/kod-taramasi/<alan>.md`. Alt-asistanlar sayfa yazmaz; sayfanın dayandığı kritik iddiaları asistan kodda kendisi okur, sonra yazar.
- Koddan yazılıp çalıştırılarak denenmeyen her ek, sayfa dışında `calisma/celiskiler.md`'de "kod taraması" bölümünde izlenir; canlıda denenmesi gerekenler `SORULAR.md`'ye gider.

## 2026-11-11 (gece) — Sunucu Kurulum 1 ve 2 işlendi; eldeki 11 videonun hepsi bitti

- Yeni sayfalar `sunucu-kurulumu`, `sunucu-yapisi` (yeni "Kurulum ve yönetim" grubu; SORULAR 9o).
- Müşteri sunucusu: görüntü yok, yer tutucular (`sirket.com`, `demo`, `codease`), parola yok. Alt-asistana verilen görevde de müşteri adı yazılmadı; yapılandırma şablonlarını okurken gizli değerler maskelendi.
- Dökümde ürün adları: "Codis/Kodiz" = CodEase, "basics" = BaseX, "IES/IAS" = IIS, "pet" = path, "pink" = ping.
- Sistem tablolarına elle dokunma (kiracı düzeyi, ileti tablosu) belgeye alınmadı; SORULAR 9n.

## 2026-11-11 (gece) — Atılay, Veri Tabanı (22.04.2022) işlendi

- Yeni sayfa `ayar-ekrani` (yeni "Örnekler" grubu; SORULAR 9l); ekler: `tablo-duzeninde-icerik` (satır altı ayrıntı alanı, Satır Script, Satır No XPath'i), `scriptte-veri-tabani` (silinen satırlar, `../../Id`).
- Video dosyasının uzantısı yok ama MP4. Zoom kaydı: 1280x720, paylaşılan ekran solda ~960x540, sağda katılımcı kutusu. Kırpma: `crop=…:19..166:138` sonra `scale=iw*1.5` (lanczos). Görüntüler bulanık; ileride aynı ekranlar daha iyi bir kaynaktan yeniden alınabilir.
- Alt-asistanın "Diğer sekmesi" dediği `Satır No XPath'i` aslında **Veri** sekmesinde çıktı; etiket yerlerini kendim de okumalıyım.

## 2026-11-11 (gece) — Bereket – Veritabanı Eğitimi – Veysel işlendi

- Yeni sayfa `veritabanlari`; ekler: `rol-scriptleri` (dört kimlik türü), `acilir-liste` (Veritabanı Sorgusu kaynağı, Sonuçlar, birden çok kaynak, NULL), `veri-modeli` (kullanımdaki süreçte alan ekleme), `tablo-duzeninde-icerik` (sütun sırası).
- Kaynak satırı "Veritabanı Eğitimi – Veysel" (müşteri adı yok; SORULAR 9g).
- Sunucu günlük dosyaları (`_logs_/web.Error.txt` vb.) bu videoda geçti ama yazılmadı; Sunucu Kurulum sayfalarıyla birlikte ele alınacak.
- zsh'te `echo ===` hata veriyor (`=komut` genişlemesi); ayraç olarak `echo "---"` kullan.

## 2026-11-11 (gece) — Bereket – Script Eğitimi – Veysel işlendi

- Altı yeni sayfa: `veritabani-sorgusu`, `dinamik-kurallar`, `form-scripti`, `scriptte-veri-tabani`, `kosullu-yonlendirme`, `islem-sirasi-ve-hatalar`. Ekler: `is-oncesi-ve-is-sonrasi-script` (console), `dizinler-ve-surecler` (süreci taşıma), `zorunlu-alanlar`, `form-tasarimi`, `akis-tasarimi`, `script-kutuphaneleri` (bağlantılar).
- Video müşteri ortamında: tarayıcı çubuğunda müşteri alan adı ve e-posta, sol menüde müşteri dizinleri, tarihçede kişi adları. Kural olarak yalnızca tasarım ekranları kullanıldı, tarayıcı çubuğu kırpıldı (`crop=1920:H:0:72`), müşteri şema/tablo adı bulanıklaştırıldı; kod örneklerinde müşteri tablo adları yerine uydurma adlar (`Egitim`, `Kategoriler`) yazıldı. Kaynak satırında müşteri adı yok ("Script Eğitimi – Veysel").
- Whisper uzun sessizlikten (mola) sonra konuşmayı da kaçırıyor: dökümde art arda aynı cümle varsa o aralık ayrı kesilip `-mc 0` ile yeniden dökülmeli. Bu videoda 67–81 ve 114–124. dakikalar böyle kurtarıldı (`ek1-dk.txt`, `ek2-dk.txt`).
- Eğitmenin bir iddiası kodla çelişti ve sayfaya alınmadı (Koşullu İçerik'in daha ucuz olduğu); SORULAR 9d.

## 2026-11-11 (gece) — Eğitim 6 ve 8 (Fatih) işlendi

- Eğitim 6: yeni sayfa çıkmadı (tekrar + ödev dağıtımı).
- Eğitim 8: yeni sayfa `script-kutuphaneleri`; `is-oncesi-ve-is-sonrasi-script` (SelectAll, hata ayıklama), `acilir-liste` (bağlı listeler, Seçim Listesi), `tablo-duzeninde-icerik` (Excel içeri/dışarı), `form-tasarimi` (Koşullu İçerik) sayfalarına ek. Videonun yalnızca ilk 51 dakikası konuşma.
- Eğitim 8 kırpma: `1058:514:14:118` (`gorsel.sh` bu videoda kullanılmaz; doğrudan ffmpeg).
- Alt-asistan raporundaki iddialardan sayfanın dayandığı kritik olanları kodda kendim okudum (çelişki 67–71). 72–76 yalnızca rapora dayanıyor.
- Kütüphane çağrısı eski süreçlerde doğrudan değer, yenilerde Promise döndürüyor; sayfada ikisi de var, hangisinin ana örnek olacağı SORULAR 9a'da.
- Yerelleştirme sayfası yazıldı (Eğitim 2 – Fatih 17:07–20:00; `docs/yerellestirme.md`). Videoda olmayan ama okuyucuyu yanıltacak iki davranış koddan eklendi: akışın dili başlatanın dilidir; metin değişince çevirisi silinir.
- `{{ }}` içeren satırlar için sayfanın tamamını sarmak yerine `<code v-pre>` de kullanılabiliyor (`acilir-liste`).

## 2026-11-11 — Eğitim 1 ve 4 (Fatih), Eğitim 1 (Veysel) işlendi

- Kullanıcı isteği: "videoları işlemeye kaldığın yerden devam edebilirsin."
- Yedi sayfa yazıldı: `dizinler-ve-surecler`, `veri-modeli`, `akis-tasarimi`, `form-tasarimi`, `acilir-liste`, `tablo-duzeninde-icerik`, `zorunlu-alanlar`. Hepsi taslak; sayfa biçimi ve konu ağacı hâlâ onay bekliyor. Menüdeki iki grup ("Süreç tasarımı", "Form tasarımı") asistanın geçici seçimi.
- Araçlar `calisma/` altında kalıcı: `dakikala.py` (srt → 30 sn'lik `dokum-dk.txt`), `kare.sh` (inceleme karesi), `gorsel.sh` (sayfa görseli; kırpma + bulanıklaştırma + 1,5 kat büyütme), `baglanti-denetle.py` (derlenmiş sitede bağlantı, çapa ve görsel denetimi; `npm run build` sonrası çalıştırılır).
- Kırpma: Fatih kayıtlarında (Eğitim 1, 4) uygulama alanı `905:443:13:150`. Önceki nottaki `990:480:13:135` Eğitim 2'ye ait; her videoda bir kırpılmamış kareyle ölçülmeli. Eğitmen tarayıcıyı yakınlaştırdığında içerik büyür ama alan aynı kalır. Eğitim 1 – Veysel tam ekran kayıt (1920x1040), uygulama alanı `y=72`'den başlar ve çok daha nettir.
- Başlık çapaları: VitePress Türkçe harfleri sadeleştirir ama `ı` harfini korur (`#surec-durumu`, `#listenin-bos-baslaması`). Bağlantı yazarken denetleyiciyle doğrulanır.
- Video ile güncel kod arasında iki yerde fark çıktı (Kopyala'nın önerdiği versiyon no; zorunlu alan uyarı penceresinin metni). Kullanıcı "ekranlar değişmedi" demişti; bu ikisi `calisma/celiskiler.md` 22 ve 50'de. Kullanıcıya sorulacak: canlı sistemde hangisi geçerli?
- Eğitim 3 – Fatih elde yok; Eğitim 4 ona dayanıyor (veri tabanı sorgusu, İş Sonrası Script ile kayıt). O konular Eğitim 3 ya da veri tabanı videoları gelene kadar yazılmadı.
- Eğitim 1 – Veysel aynı akışı masraf örneğiyle anlatıyor; yeni konuları (rol scriptleri, İş Öncesi Script ile formu doldurma, etikette `{{ }}` ifadesi, termin ile bilgilendirme görevi) ayrı sayfalara gidiyor.
- Sayfa metninde `{{ }}` geçiyorsa VitePress derlemesi kırılır; sayfa gövdesi `::: v-pre` ile sarılır (`docs/etikette-hesaplama.md` örnek).
- Çalışma düzeni: video başına döküm okunur, iddialar kod tabanında alt ajanlara doğrulatılır, kritik olanları asistan kendisi açıp okur (`celiskiler.md`'de "asistan doğruladı" diye işaretli), sonra sayfa yazılır.
- `videolar/` içinde artık 11 dosya var. İşlenmeyenler: Eğitim 6 – Fatih (22 dk), Eğitim 8 – Fatih (93 dk), Sunucu Kurulum 1 (66 dk) ve 2 (70 dk), Bereket – Script Eğitimi – Veysel, Bereket – Veritabanı Eğitimi – Veysel, Atılay Veri Tabanı (22.04.2022; uzantısız dosya). "Bereket" ve "Atılay" müşteri adı olabilir; ekranlarında müşteri verisi beklenir.

## 2026-11-11 — Site iskeleti

- Kullanıcı isteği: "site iskeletini kursana bi bakayım." VitePress 1.6.4 ile kuruldu; aracı asistan seçti, kullanıcı onaylamadı.
- Kaynak klasör `docs/` (sayfalar olduğu gibi kullanılır). Ayar: `docs/.vitepress/config.mts`; yeni sayfa için kenar çubuğuna bir satır eklenir. Ana sayfa: `docs/index.md`.
- Çalıştırma: `npm run dev` (yerel, 5173), `npm run build` (çıktı `docs/.vitepress/dist`).
- Kenar çubuğundaki "Süreç tasarımı" grubu geçici; konu ağacı onaylanmadı. Asistan ve yayın yeri henüz yok.

## 2026-11-11 — Örnek sayfadan sonra

- Kullanıcı kararı: "sen eğitime devam et, sayfa yapısına sonra bakarız." Kalan videolar işlenir; sayfa biçimi henüz onaylanmış değil, `docs/gorev-ayarlari.md` kalıbı geçici olarak kullanılır.
- Çalışma sırası: Eğitim 1 – Fatih, Eğitim 4 – Fatih, Eğitim 1 – Veysel. Her video için: döküm → dakikaya göre kareler → kod tabanı doğrulaması → sayfa(lar) + `calisma/celiskiler.md`.

## 2026-11-11 — Ekran görüntüleri

- Kullanıcı kararı: ekran görüntülerindeki kişi adları ve müşteri adı olabilecek klasör adları bulanıklaştırılır.
- Kullanıcı bilgisi: kayıtlar 2021 tarihli ama "ekranlar değişmedi"; video kareleri güncel arayüz olarak kullanılabilir.
- Kayıtlar Google Meet toplantısı; kare `crop=990:480:13:135` ile uygulama alanına kırpılır (katılımcı kutucukları ve tarayıcı çubuğu dışarıda kalır). Bu değerler 1280x720 "Fatih" kayıtları için; Veysel kaydı (1920x1040) ayrı ölçülür.
- Sahne algılama (`select=gt(scene,0.08)`) ekran kaydında işe yaramadı: menü açılması gibi küçük değişiklikleri kaçırıyor. Kareler dökümdeki zaman damgasına göre alınır.
- Whisper large-v3-turbo (whisper.cpp, `calisma/modeller/`): 23 dk video 2 dk 12 sn'de döküldü, Türkçe kalitesi iyi.

## 2026-11-11 — Kaynaklar: video + kod tabanı + workrunner.github.io

- Kullanıcı kararı: sitedeki asistan Gemini ya da benzeri bir dış model kullanır ("gemini falan kullanır diye düşünüyorum"). Bitmiş doküman metninin dış modele gitmesi böylece kabul edildi (asistanın yorumu); video ve dökümler için yerel kuralı sürüyor.
- Kullanıcı kararı: videolarda yanlış ya da eksik anlatılan konular kod tabanından (`../codEase-master`) doğrulanır ve tamamlanır. Dokümanda "under the hood" anlatılmaz: kod yalnızca davranışı doğrulamak içindir; sınıf adı, iç mimari, uygulama ayrıntısı sayfaya yazılmaz.
- Kullanıcı kararı: https://workrunner.github.io kullanıcının kendi belgesi; yeniden yazılana kadar dokümanın kaynaklarından biri olarak kenarda tutulur.
- Kaynak önceliği (asistanın önerisi, onay bekliyor): davranışta kod tabanı > video > workrunner.github.io. Çelişki olursa kod kazanır, sayfada sessizce düzeltilir, ayrıntısı `calisma/celiskiler.md` içine yazılır.
- `videolar/` içinde 4 dosya var: Eğitim 1 - Fatih (70 dk), Eğitim 1 - Veysel (süre başlıkta yok, webm/vp8), Eğitim 2 - Fatih (23 dk), Eğitim 4 - Fatih (52 dk). Deneme videosu: Eğitim 2 - Fatih (en kısa).
- Disk 28 GB boş (önceki 6,8 GB ölçümü geçersiz).

## 2026-11-11 — Çıktı: web sitesi + içinde asistan

- Kullanıcı kararı: doküman bir web sitesi olacak; site yazılırken içine küçük bir asistan da konacak, kullanıcı tüm dokümanı okumak yerine sorarak ilerleyebilecek.
- Kullanıcı kararı: ufak başlanır (önce tek video), asistanın önerisini kabul etti sayılır — itiraz etmedi, üstüne site isteğini ekledi (asistanın yorumu).
- Asistanın yorumu: "sorarak işlem yapmak" = dokümana soru sorup yanıt almak. CodEase içinde işlem yaptıran bir ajan kastedildiyse kapsam değişir; kullanıcıya soruldu.
- Açık: sitenin yayın yeri ve asistanın modeli. Dış API kullanılırsa bitmiş doküman metni dışarı gider; "dış servise gönderilmez" kuralı bugün yalnızca video ve dökümleri kapsıyor, kullanıcı onayı gerekir.

## 2026-11-11 — Proje açıldı

- Kullanıcı: "elimde codease'in onlarca eğitim videosu var, buradan dokümante etmek istiyorum."
- Kullanıcı kararı: bu proje ayrı bir klasörde durur, yol haritası ve hafıza burada tutulur; `codEase-master` hafızası bununla kirletilmez.
- Klasör adını (`codease-dokumantasyon`) asistan önerdi; kullanıcı ayrıca bir ad vermedi.
- Henüz yanıtlanmayanlar: videoların yeri ve toplam süresi, dil, hedef okuyucu, çıktı biçimi (bkz. `YOL-HARITASI.md`).
