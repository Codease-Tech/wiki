# Kullanıcıya sorulacaklar

Videoları işlerken çıkan, yanıtı kullanıcıda ya da canlı sistemde olan sorular. Yeni soru çıktıkça buraya eklenir; yanıtlanan soru "Yanıtlananlar" bölümüne tarihiyle taşınır ve ilgili sayfa düzeltilir. Kanıt ve ayrıntı `calisma/celiskiler.md` içindedir (satır numaraları parantezde).

## Açık — 2026-11-12 (site)

S1. **"Hep localhost:5173 yazıyor, link değişmiyor."** Chrome'da denendi: kenar çubuğundan sayfa değiştirince adres `/veri-modeli`, `/akis-tasarimi` gibi değişiyor, yenileyince aynı sayfa açılıyor; derlenmiş sitede de öyle. Kodda değişiklik yapılmadı. Bunu hangi pencerede görüyorsunuz (Claude'un içindeki önizleme paneli, Safari, başka)? Orada adres çubuğu hiç mi değişmiyor?
S2. **Kenar çubuğunda olmayan sayfalar.** `modul-gorevleri`, `sablonlar`, `zamanlanmis-isler`, `havuz-scriptleri-ve-degiskenler`, `ekranlar-ve-paneller` sayfaları var ama menüde bağlantıları yok; adresi bilen açabiliyor. Menüye eklensin mi, hangi grupta?

## Açık — 2026-11-11

### Video ile güncel kod farklı: canlıda hangisi geçerli?

1. **Kopyala'nın önerdiği versiyon numarası.** Videoda 1.0.0'ın kopyası için `1.0.1` öneriliyor; güncel kod `2.0.0` önerir. Sayfada "önerilir, değiştirebilirsiniz" yazıyor. → `docs/dizinler-ve-surecler.md` (çelişki 22)
2. **Zorunlu alan uyarı penceresi.** Videoda başlık "Geçersiz Form"; güncel kodda "Eksik veya Hatalı Bilgi". Sayfadaki görsel eski metni gösteriyor; güncelse yeni ekran görüntüsü gerekir. → `docs/zorunlu-alanlar.md` (çelişki 50)

### Canlı sistemde denenmesi gerekenler

3. **Bileşenin adı "Radyo Buton" mu "Radyo Büton" mu?** Kodda "Büton", videodaki ekran okunaklı değil. Sayfalarda "Radyo Buton" yazıyor. (çelişki 44)
4. **İş listelerinde bir görevi etikete taşımak** onu Gelenler'den çıkarıp Tüm Bekleyenler'de bırakıyor mu? Taşıma düğmesinin arayüzdeki adı ne? "Önemli" nasıl işaretleniyor? → `docs/is-listeleri.md`
5. **Rol scriptinde üst düzey `return`** çalışıyor mu (`return identities;`), yoksa yalnızca son ifade mi (`identities;`)? Sayfada son-ifade biçimi var. → `docs/rol-scriptleri.md` (çelişki 54)
6. **Dinamik doğrulama kuralında grup adı boş bırakılırsa** kural her aksiyonda mı çalışıyor (ipucu metni öyle diyor), yoksa yalnızca Doğrulama Grubu boş aksiyonlarda mı (kod öyle görünüyor)? Sayfaya girmedi. (çelişki 53)
7. **"En az tekrar"** tabloda o sayının altına satır silmeyi engelliyor mu? Doğrulanamadı; sayfada yalnızca başlangıç satır sayısı olarak geçiyor. (çelişki 29)
8. **Deneme Durumu'nda bildirim e-postası** denemeyi yapana mı, gerçek atanana mı gidiyor? `docs/gorev-ayarlari.md` "denemeyi yapana" diyor; son doğrulamada izlenemedi.

9a. **Kütüphane fonksiyonu sonucu: `.then` mi, doğrudan mı?** Güncel kodda yeni süreçlerde çağrı Promise döndürüyor, eski süreçlerde doğrudan değer (Eğitim 8 videosu doğrudan alıyor). `docs/script-kutuphaneleri.md` ana örnekte `.then` kullanıyor, eski biçimi not olarak veriyor. Canlıda müşterilerin çoğu hangisinde? Ana örnek ona göre seçilmeli. (çelişki 67)
9b. **`throw` ile kullanıcıya hata gösterme.** Kod, hatanın ekrana yalnızca Deneme Durumu'nda ya da aksiyonda "İşlemi Takip Et" işaretliyken düştüğünü gösteriyor. Canlıda aktif süreçte işaretsiz aksiyonda hata nereye düşüyor (kullanıcıya bildirim, yöneticiye e-posta)? (çelişki 71)

9c. **Yerelleştirmede dil.** Kod, formun ve bildirim e-postasının akışı başlatanın dilinde gittiğini gösteriyor (alıcının dilinde değil). Canlıda da böyle mi; sayfadaki örnek (İngilizce başlatılan talebi Türkçe kullanan yönetici İngilizce görür) doğru mu? Ayrıca dil ekleme ekranındaki "Language", "Group", "Source Text", "Localized Text" başlıkları Türkçe arayüzde de İngilizce mi kalıyor? (çelişki 79)

9d. **Koşullu İçerik "daha performanslı" mı?** Eğitmen (Veysel) Koşullu İçerik'in yalnızca kendi koşulunu dinlediğini, Biçimlendirme Kuralı'nın her değişiklikte çalıştığı için pahalı olduğunu söylüyor. Güncel kodda ikisi de her değişiklikte birlikte yeniden hesaplanıyor. Performans önerisi sayfaya alınmadı; alınsın mı? (çelişki 85)
9e. **"Deviral" yazımı.** Biçimlendirme Kuralı'ndaki seçenek arayüzde "Deviral" yazıyor (büyük olasılıkla "Devral" olacaktı). Sayfa arayüzdeki gibi yazdı. (çelişki 86)
9f. **Süreci Ctrl + Düzenle ile ortamlar arası taşıma** sayfaya adım adım yazıldı ama denenmedi. Taşımada dikkat edilmesi gereken başka şey var mı (kimlikler, şemalar, web servis adresleri)? Bu yöntem müşterilere önerilen yol mu, yoksa yalnızca iç kullanım mı? (çelişki 96)
9g. **Kaynak satırında müşteri adı.** Bereket videosundan yazılan sayfaların kaynak satırı "Script Eğitimi – Veysel" diye yazıldı (müşteri adı çıkarıldı). Madde 10 yanıtlanınca kesinleşir.

9h. **Aynı şemayı kullanan süreçler.** Kod, eğitmenin uyarısını doğruluyor: bir süreçteki eski şema kopyası, başka süreçten yapılmış alan/ilişki değişikliğini "Değişiklikleri Uygula"da geri alıyor. `docs/veritabanlari.md` üç önlem yazdı (tek süreçten değiştir; uzun aradan sonra yeniden Import; iş bitince şemayı süreçten çıkar). Müşterilere hangisi öneriliyor? Şemayı çıkarmanın başka ortama taşımada sakıncası var mı? (çelişki 99–100)
9i. **Çeviri yazım hataları** (arayüzde böyle görünüyor, sayfada düzeltilmiş hali yazıldı): ilişki tipi "Bire Karşlılık Bir"; "Bire Karşılık Bir yada Sıfır". Arayüz düzeltilecek mi, yoksa sayfa arayüzdeki gibi mi yazsın?

9j. **Lookups / LookupData.** Atılay videosunda `Global` şemasındaki bu iki tablo "ortak alan" diye kullanılıyor; kodda ürünle geldiğine dair bir şey yok. Müşterilere önerilen standart bir kalıp mı (her kurulumda açılıyor mu), yoksa o eğitim ortamına özgü mü? `docs/ayar-ekrani.md` "ürünle hazır gelmez, kendiniz açarsınız" diyor.
9k. **Ayar ekranı sayfasındaki video dışı ekler** denenmeden, koddan yazıldı: (a) grup tablosunda **Satır No XPath'i** = `Id` ile yeni satıra anında kimlik verme, (b) formda silinen satırın `ImportFromXml` ile tablodan da silinmesi. Bir deneme ortamında doğrulamak ister misiniz? (çelişki 115–116)
9l. **"Örnekler" başlığı.** Ayar ekranı sayfası baştan sona bir örnek olduğu için kenar çubuğuna yeni bir "Örnekler" grubu açtım. Konu ağacı sizin onayınızda; başka yere alınabilir.

9m. **Kurulum aracı.** Pakette `CodEase.Configuration.exe` (install / configure / upgrade) var; videolarda kullanılmıyor, her şey elle yapılıyor. Sayfa videodaki elle kurulumu anlatıyor. Araç güncel mi, müşteriye kurulumda kullanılıyor mu? Kullanılıyorsa sayfa ona göre kısalır. Ayrıca: BaseX videoda ayrıca indirildi; müşteriye giden pakette `Tools\BaseX` (nssm dahil) var mı? Agent'ın `-rf`, `-ds`, `-enc`, `-dec`, `-license` anahtarları belgeye girsin mi?
9n. **Kurulum videosunda sistem tablolarına elle dokunulan iki yer** sayfaya alınmadı: (a) yeni kiracının düzeyini 5'ten 10'a çıkarma (süreç geliştirebilmesi için), (b) e-posta ayarı yokken davet bağlantısını ileti tablosundan alma. (a) için kodda `domainDefaultLevel` ayarı görünüyor; kurulumda `workflow.config`'e `domainDefaultLevel="Developer"` yazmak doğru yol mu? Denenmedi.
9o. **Kurulum sayfalarının yeri ve kapsamı.** "Kurulum ve yönetim" diye ayrı bir grup açtım; bu sayfalarda dosya ve ayar adları zorunlu olarak geçiyor ("under the hood yok" kuralını süreç tasarlayanlara yönelik sayfalar için anlıyorum). Bu sayfalar herkese açık sitede mi dursun, ayrı mı? Önkoşullar (Windows/IIS özellikleri, Java ve SQL Server sürümü) videoda da kodda da açık değil; resmi bir liste var mı? SSL kurulumu ve güncelleme adımları videolarda yok.
9p. **Kurulum videolarında müşteri bilgisi.** Alan adı, sunucu adı, kişi adları ve parolalar geçiyor; sayfalarda hiçbiri yok, görüntü de kullanılmadı. Videoların kendisi paylaşılacaksa bu kısımlar kesilmeli (Kurulum 2'de 19:30–22:30 ayrıca özel konuşma).

### Eksik videolar

9. **Eğitim 3, 5 ve 7 – Fatih** `videolar/` klasöründe yok. Eğitim 4 doğrudan Eğitim 3'e dayanıyor (veri tabanı sorgusu, İş Sonrası Script ile kayıt); o konular yazılmadı. Bu videolar var mı?
10. **"Bereket" ve "Atılay"** adlı videolar müşteriye verilmiş eğitim mi? Öyleyse ekran görüntülerinde hangi adlar ve veriler gizlenmeli; müşteri adı sayfanın "Kaynak" satırında geçebilir mi?

### Karar bekleyenler

11. **Sayfa biçimi ve konu ağacı.** Menüdeki dört grup (Kullanım, Süreç tasarımı, Form tasarımı, Scriptler) asistanın geçici dizilişi.
12. **Hedef okuyucu.** Sayfalar süreç tasarlayan kişiye göre yazılıyor; `is-listeleri` son kullanıcıya göre. Sunucu Kurulum videoları sistemi kuran kişiye hitap ediyor: aynı sitede ayrı bölüm mü olsun?
13. **Dil.** Veysel'in örnekleri İngilizce adlar kullanıyor (Expense Request, Submit); sayfalarda örnekler olduğu gibi bırakıldı. Türkçeleştirilsin mi?
14. **Kaynak önceliği** (kod > video > workrunner.github.io) onaylanmadı; şimdiye dek bu sırayla uygulandı.
15. **Sitenin yayın yeri** (herkese açık / şirket içi) ve asistanın modeli.
16. **npm güvenlik uyarısı.** VitePress kurulurken bağımlılıklarda uyarı çıktı; yayından önce `npm audit` ile bakılmalı.

## Yanıtlananlar

(henüz yok)
