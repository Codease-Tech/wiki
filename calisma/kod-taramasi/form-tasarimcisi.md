# Kod taraması: form tasarımcısı ve form bileşenleri

Tarih: 2026-11-12. Kapsam: form tasarımcısı, form bileşenleri, veri kaynakları, kurallar, `{{ }}` ifade dili, form scripti nesneleri.
Karşılaştırılan sayfalar: form-tasarimi, acilir-liste, tablo-duzeninde-icerik, zorunlu-alanlar, dinamik-kurallar, veritabani-sorgusu, etikette-hesaplama, form-scripti, ayar-ekrani.

Kanıt kısaltmaları (hepsi `codEase-master/Src` altında):

- **FD** = `CodEase.Workflow.Web/Forms/FormDesigner.xml`
- **XSD** = `CodEase.Workflow.Web/Forms/FormDesigner.xsd`
- **JS** = `CodEase.WebApp.Resources/js/codease/forms/`
- **CORE** = `CodEase.WebApp.Resources/js/codease/core/`
- **LOC** = `Localization.xml`

Kanıt işaretleri: **okundu** = davranış kodda doğrudan okundu. **çıkarım** = koddan mantık yürütülerek varıldı, canlıda denenmeli.
Arayüz etiketleri FD'nin Türkçe bloğundan (FD:6021-7268) ve LOC'tan alındı. Önem: yüksek / orta / düşük.

Okunmayan ya da kısmen okunan yerler 4. bölümde listelendi. `celiskiler.md`'de "yazıldı/eklendi" işaretli maddeler tekrar edilmedi; "sayfaya girmeyenler" listesindeki konular (Satır Script, Arama Script, hiyerarşi, Seçim Eşlemeleri, Alt Sorgular, Hiyerarşi Sütunu, `$Localization`) burada kod ayrıntısıyla yer alıyor, çünkü sayfalarda hâlâ yoklar.

---

## 1. Dokümanda hiç olmayan özellikler

### 1.A Bileşenler

**1. Bileşen listesinin tamamı ve "Çevir" ile ulaşılan bileşenler** — önem: yüksek
- Nerede: **Yeni Ekle** menüsü ve araç çubuğundaki **Çevir**.
- Ne yapar: Doküman kök menüsünü "… ve diğerleri" diye bırakıyor. Kökün (ve her bölümün) yanındaki okta çıkan tam liste: Açılır Liste, Radyo Büton, Seçim Listesi, Ağaç Listesi, Şablon, Tablo Düzeninde İçerik, Tekrar Eden İçerik, Veri Tablosu, Takvim, Satır Düzeninde İçerik, Veritabanı Sorgusu, XML Veritabanı Sorgusu, Web Servisi Sorgusu, Mesaj, Koşullu İçerik, Sekme Düzeninde İçerik, Etkinlik Akışı, Akış Tarihçesi, Sabit Panel, Etiket Listesi, Expression, XSL Çevrimi, Html, Etiket, Hyperlink. Menünün altında ayrı bir **Çizelgeler** alt menüsü var: Çizgi Grafik, Çubuk Grafik, Pasta Grafik.
- Tipe göre alan bileşenleri (ilki varsayılan, diğerleri **Çevir** ile): metin → Metin Kutusu, Açılır Liste, Radyo Büton, Seçim Listesi, Ağaç Listesi, HTML Düzenleyi, Dosya, Etiket, Hyperlink. Ondalık → Nümerik Kutu, MoneyBox, Range, Etiket. Tamsayı → Nümerik Kutu, Range, Etiket. Evet/hayır → Seçim Kutusu, Etiket. Tarih/saat → Tarih ve Saat Kutusu. Kimlik → Kimlik Seçici. Dosya → Dosya. Çift (Id+Ad) → Açılır Liste, Radyo Büton, Seçim Listesi, Ağaç Listesi. Tartışma tipi → Discussion.
- Türkçe adı olmayan bileşenler arayüzde İngilizce şema adıyla görünür: Expression, Html, Hyperlink, Range, MoneyBox, Discussion.
- Kanıt: JS/contents/designer.js:1218-1317 (eşleme), 1717-1760 (Çevir penceresi), 2077-2099 ve 1600-1609 (menü, Çizelgeler), 868 (ad yoksa şema adı); LOC:2828-2996, 4895-4907 — okundu.
- Nereye: form-tasarimi (tablo genişletilir) + yeni sayfa "Bileşen kataloğu".

**2. Tekrar Eden İçerik (kart listesi)** — önem: yüksek
- Nerede: tekrarlayan eleman → Yeni Ekle / Çevir → **Tekrar Eden İçerik**.
- Ne yapar: Tablonun kart biçimli karşılığı. Her kayıt üç bölgeden oluşur: **Önizleme** (her zaman görünen özet), **Düzenleyici** (kayıttaki **Düzenle** düğmesiyle açılır; altında **Tamam**, **Tamam ve Yeni Ekle**, **Sil** / **Geri Al**; içindeki alanlar geçerli değilse başka kayda geçilmez), **Detaylar** (açılır ek bölge). Tasarım sekmesi: **Yeni Ekleme Etiketi**, **Açılabilir Detaylar** (Evet: kayıtta "Detaylar" aç/kapa düğmesi; Hayır: detay hep açık; yazdırmada hep açık), **Liste Boş Mesajı**, **Satır Genişliği** ve **Satır Yüksekliği** (piksel; verilirse kartlar yan yana dizilir). Veri, Kurallar, Diğer sekmeleri Tablo Düzeninde İçerik ile aynıdır.
- Kanıt: FD:2706-2754; JS/contents/repeatingcontent.js:171-177, 286-357, 394-395, 415-479 — okundu.
- Nereye: yeni sayfa "Tekrar Eden İçerik" (ya da tablo-duzeninde-icerik'e bölüm).

**3. Veri Tablosu (sayfalı, sıralanabilir liste)** — önem: yüksek
- Ne yapar: Okumaya dönük tablo. Sayfalama yapar (varsayılan sayfa başına 25 satır), sütun başlığına tıklayınca sıralar, başlığı sabit tutar, yatay kaydırır. Tasarım: **Yeni Ekleme Etiketi**, **Maks Yükseklik**. Araç çubuğunda **Sütunlar** penceresi; sütun alanları: **Etiket**, **Tip** (Metin / Numara / Tarih / Tarih ve Saat; gösterim biçimini belirler), **Hizalama**, **Bağlı XPath**, **Altbilgi**, **Şablon** (hücre için zengin HTML; boşsa Bağlı XPath değeri görünür). Düzenleyici tanımlıysa satırda kalem simgesi **Düzenle** penceresini açar (Sil / Geri Al orada).
- Veri sekmesi → **Veri Tipi**: **Xml** (tablodaki gibi form verisine bağlı) ya da **JSON**. JSON seçilince **Veri Olay Adı** alanı çıkar: aynı Veri Olay Adı'nı taşıyan bir Veritabanı Sorgusu'nun sonuçları form verisine yazılmadan doğrudan bu tabloda gösterilir; tablo salt okunurdur ve Excel'e aktarma tüm sütunlarla kendiliğinden açılır.
- Kanıt: FD:2870-3031; JS/contents/datatable.js:29-52, 257-279, 299-346; JS/contents/querycontent.js:453-456; CORE/ui/ui.widgets.js:800 — okundu. Sayfa uzunluğu seçenekleri okunmadı.
- Nereye: yeni sayfa "Veri Tablosu".

**4. Takvim** — önem: orta
- Ne yapar: Tekrarlayan kayıtları ay / hafta / gün görünümünde takvim olarak gösterir. Boş aralığa sürükleyerek yeni kayıt açılır (yeni girişe izin varsa), kayda tıklayınca düzenleme penceresi açılır (Sil / Geri Al), kayıt sürüklenerek taşınır ya da kenarından çekilerek süresi değiştirilir. Çalışma saatleri seçilen **Çalışma Takvimi**'nden gelir (varsayılan 09:00-18:00, hafta içi). Son görünüm ve tarih aralığı form verisinde saklanır.
- Veri sekmesi: **Bağlı XPath**, **Satır No XPath'i**, **Girdi XPath'i**, **Başlangıç Tarihi XPath'i**, **Bitiş Tarihi XPath'i**, **İçerik XPath'i**, **Renk XPath'i**, **Filtre XPath'i**. Tasarım: **Çalışma Takvimi**, **Maks Yükseklik**.
- Kanıt: FD:3040-3167; JS/contents/calendar.js:6-10, 22-27, 49-155, 177-183 — okundu (dosyanın 184-483 arası yalnızca tarandı).
- Nereye: yeni sayfa "Takvim".

**5. Etiket Listesi (çoklu seçim)** — önem: orta
- Ne yapar: Tekrarlayan bir elemana bağlı çoklu seçim kutusu; her seçim bir etiket olarak görünür. Seçenekler **Veri Kaynakları**'ndan gelir, seçilmiş olanlar listede tekrar çıkmaz. Listede olmayan metin de yazılabilir (değeri boş kalır). Önceden kaydedilmiş bir etiketi kaldırmak kaydı silinmiş olarak işaretler; yeni eklenen doğrudan kalkar. Veri sekmesi: **Bağlı XPath**, **Değer XPath'i**, **Başlık XPath'i**, **Öğe XPath'i**. Seçim Eşlemeleri her etiket için çalışır.
- Kanıt: FD:2330-2366; JS/contents/controls/taglist.js — okundu.
- Nereye: acilir-liste ("Benzer bileşenler") ya da ayrı kısa sayfa.

**6. Kimlik Seçici ve Eşlemeler sekmesi** — önem: yüksek
- Ne yapar: Kullanıcı / grup seçme kutusu. Seçilenin kimliği alana, adı, tipi ve etki alanı alanın özniteliklerine yazılır. Listede olmayan bir ad yazılırsa alan geçersiz sayılır ("Invalid identity. Please select an existing from list." — metin İngilizce sabit). Panelde ayrı bir **Eşlemeler** sekmesi vardır: **Kaynak** (kullanıcı kaydındaki bir alan) → **Hedef** (formdaki alan). Seçim yapılınca kaynak değerler hedeflere kopyalanır, seçim silinince hedefler boşalır. Tasarım: **Boyut**, **İpuçları**.
- Kanıt: FD:3676-3703; JS/contents/controls/identitypicker.js:19-22, 45-54, 106-151; LOC:448 — okundu.
- Nereye: yeni sayfa "Kimlik Seçici" (ya da form-tasarimi).

**7. Dosya bileşeninin davranışı** — önem: yüksek
- Ne yapar: Alan başına tek dosya. **Dosya Seç** penceresi kaynak sekmeleri gösterir: bilgisayardan (sürükle-bırak ve panodan yapıştırma dahil) ve kameradan anlık görüntü; ortamda tanımlıysa One Drive / Office 365 / Google Drive. Dosya varken düğme "Dosya Seç" ve "Delete File" (İngilizce) seçenekleri sunar. Var olan dosyanın üstüne yenisi yüklenirse **revizyon** olarak kaydedilir. Dosya adına tıklayınca önizleme açılır (resim, PDF, Office belgeleri; HEIC resimler JPEG'e çevrilir; önizlenemeyenlerde bilgi mesajı) ve **İndir** bağlantısı çıkar. Veri sekmesi: **Bağlı XPath**, **Dosya Adı XPath'i** (dosya adının yazılacağı alan; boşsa ad alanın özniteliğinde tutulur). Sekmeler: Tasarım (İpuçları), Kurallar (Zorunluluk Grup Adı, Dinamik Kurallar), Veri.
- Sınırlar: Tarayıcı tarafında dosya türü ya da boyut kısıtı bulunmadı (okundu). Sunucu ayarında istek sınırı yaklaşık 30 MB (çıkarım: `CodEase.Workflow.WebApp/Web.Global.Release.config:70,163`; ortama göre değişebilir).
- Kanıt: FD:2373-2385; JS/contents/controls/file.js:116-131, 170-182, 250, 275-371; CORE/ui/ui.file.js:1-430, 634-645 — okundu.
- Nereye: yeni sayfa "Dosya alanı".

**8. Metin Kutusu → Tip** — önem: orta
- Nerede: Metin Kutusu → Tasarım → **Tip**: Metin, Şifre, E-Posta, Tel, Arama, Adres.
- Ne yapar: Şifre: yazılan gizlenir, göz simgesiyle açılır; salt okunurda `*` görünür. Adres: salt okunurda tıklanabilir bağlantı olur (`http://` yoksa eklenir). E-Posta: salt okunurda e-posta bağlantısı olur. Tipe göre simge gösterilir.
- Kanıt: FD:2045-2084; JS/contents/controls/textbox.js:54-68 ve devamı — okundu (seçenek sırası FD'de ham satırlardan yeniden doğrulanmadı).
- Nereye: form-tasarimi ya da yeni "Metin ve sayı alanları" sayfası.

**9. Örnek, İpuçları, Boyut (ortak Tasarım alanları)** — önem: orta
- Ne yapar: **Örnek** = kutu boşken görünen silik yazı. **İpuçları** = alanın üstüne gelince / alana girince çıkan açıklama (yalnızca alan düzenlenebilirken). **Boyut** = Küçük / Orta / Büyük / Çok Büyük (kutunun genişliği). Sütun içine eklenen alan kendiliğinden en geniş boyutu alır.
- Kanıt: FD:464-487, 527-547; JS/contents/controls/databoundcontrol.js:139-162; textcontrol.js:38; designer.js:999-1001 — okundu.
- Nereye: form-tasarimi.

**10. Nümerik Kutu ayarları ve sınırları** — önem: orta
- Ne yapar: Tasarım → **Ondalık Hanesi** (varsayılan 2), **Hane Ayracını Göster** ("Evet, binlik haneler için ayraç kullan.", varsayılan açık). Ayraçlar kullanıcının diline göre görünür; veri her zaman noktalı ondalıkla, ayraçsız saklanır. Girilebilen aralık ±999.999.999.999,99. Boş alan sıfır olarak gösterilir. **MoneyBox** aynı kutunun para simgeli hâlidir.
- Kanıt: FD:2121-2141; JS/contents/controls/numericbox.js:61-64, 112-116; moneybox.js — okundu.
- Nereye: "Metin ve sayı alanları".

**11. Tarih ve Saat Kutusu ayarları** — önem: orta
- Ne yapar: Kurallar sekmesi → **Format**: Tarih / Saat / Tarih ve Saat (alan tipine göre kendiliğinden seçilir). Tasarım → **"Etiket mi ?"** (alan kutu yerine biçimlenmiş yazı olarak gösterilir), Boyut, Örnek, İpuçları. Seçicide dakikalar 10'ar adım, yıl aralığı bugünden 100 yıl geri / 20 yıl ileri, hafta numaraları ve "Şimdi" düğmesi var. Elle yazılan geçersiz tarih alanı boşaltır ve hata verir.
- Kanıt: FD:2222-2253; JS/contents/controls/datetimebox.js:45-53, 86-87, 152-154, 177-199; designer.js:1006-1030 — okundu.
- Nereye: "Metin ve sayı alanları" ya da ayrı kısa bölüm.

**12. Seçim Kutusu → Seçilme Değeri / Seçili olmama Değeri** — önem: orta
- Ne yapar: Veri sekmesinde işaretliyken ve işaretsizken alana yazılacak değerler (varsayılan `True` ve boş). Karşılaştırma büyük/küçük harfe duyarsızdır. Tasarım → **Etiket** (kutunun yanındaki yazı, `{{ }}` destekler), İpuçları.
- Kanıt: FD CheckBox.Design / CheckBox.Data (2390-2425 dolayı); JS/contents/controls/checkbox.js — okundu.
- Nereye: form-tasarimi.

**13. Range (kaydırma çubuğu)** — önem: düşük
- Ne yapar: Sayı alanını kaydırma çubuğuyla girdirir. Tasarım: **Minimum XPath**, **Maksimum XPath**, **Adım XPath** (sabit sayı ya da alan; varsayılan 0 / 100 / 1). Veri: **Bağlı XPath**, **Değer XPath'i**. Yanında "değer/maks" yazısı görünür.
- Kanıt: FD:2161-2217; JS/contents/controls/range.js — okundu.

**14. HTML Düzenleyi (zengin metin alanı)** — önem: orta
- Ne yapar: Tasarım → **Zengin Editör** (varsayılan açık; kapalıysa düz çok satırlı metin), **Değişiklik Takibi Yapılsın mı ?** (yalnızca zengin editörde; eklenen/silinen metin işaretlenir), **Değişikleri Kaydetme XPath'i** (ipucu: "Tamamen kapatmak için lütfen '0' giriniz"), Boyut, Örnek, İpuçları. Salt okunurda içerikteki script temizlenir, dosya bağlantıları önizleme açar.
- Kanıt: FD:4096-4148; JS/contents/controls/htmlbox.js:74-78 — okundu.

**15. Html bileşeni ve Düzenle penceresi** — önem: yüksek
- Ne yapar: Forma serbest HTML koyar. Araç çubuğundaki **Düzenle** penceresi: **Kaynaklar** (dış `.css` / `.js` dosyası: **Url** ya da **Dosya**; "Kaynak dosyasını sistemde sakla" seçeneği; başka uzantı kabul edilmez: "Web adresinde css veya js dosyası bulunmalıdır."), **İçerik** altında **Stil**, **Html**, **Script** bölümleri, **Önizleme** ve **Yapay Zekaya Sor** düğmesi. Html içinde `{{ }}` ifadeleri çalışır; script bölümü form scripti gibi çalışır ve bileşenin kendisine `$Html` ile ulaşır. Forma özel stil vermenin arayüzdeki yolu budur.
- Kanıt: FD:3797-4093; JS/contents/controls/Html.js:6-35, 50-53, 96-138 — okundu. "Yapay Zekaya Sor" scripti (FD:4016-4054) ayrıntılı okunmadı.
- Nereye: yeni sayfa "Html bileşeni" (form-scripti'nden bağlantı).

**16. Expression (hesaplanıp veriye yazılan etiket)** — önem: yüksek
- Ne yapar: Etiket gibi `{{ }}` ifadesi gösterir, farkı sonucu **Veri → Hedef** alanındaki XPath'e de yazmasıdır ("Formül sonucunu saklamak üzere hedef xpath."). Her yeniden hesaplamada yazar; yalnızca bileşen görünürken. Hesaplanan toplamı veride saklamanın scriptsiz yolu.
- Kanıt: FD:4150-4190 dolayı (Expression.Design / Expression.Data); JS/contents/controls/expression.js:18-33 — okundu.
- Nereye: etikette-hesaplama.

**17. Hyperlink** — önem: düşük
- Ne yapar: Tasarım → **Metin**, **Url**, **İpuçları**; ikisi de `{{ }}` destekler (Url boşsa alanın kendi değeri). `http` ya da `/` ile başlayan adres yeni sekmede açılır.
- Kanıt: FD Hyperlink.Design (5950-5986 dolayı); JS/contents/controls/hyperlink.js — okundu.

**18. Mesaj bileşeni → Tip** — önem: orta
- Ne yapar: Tasarım → **Tip**: Bilgi / Hata / Başarı / Uyarı, **İçerik**. **Bilgi** tipindeki mesaj form salt okunurken gizlenir; diğer tipler görünür kalır.
- Kanıt: FD:5907-5947; JS/contents/message.js:16-21 — okundu.
- Nereye: form-tasarimi.

**19. Sekme Düzeninde İçerik ayrıntıları** — önem: orta
- Ne yapar: Tasarım → **Sekmeler** (sekme adları listesi); araç çubuğunda yeni sekme ekleme; her sekmenin **Etiket**'i. Veri → **Aktif Tab XPath'i**: açık sekmenin sıra numarası bu alana yazılır, alan değişince sekme değişir (script ile sekme açmak için). İçinde geçersiz alan olan sekmenin başlığı kırmızı işaretlenir. Kuralı gizleyen sekme başlığıyla birlikte kaybolur. Yazdırmada sekmeler alt alta bölümler olarak basılır.
- Kanıt: FD TabbedContent.* (2815-2868 dolayı); JS/contents/tabbedcontent.js:14-26, 36-41, 52-68, 94-98 — okundu.
- Nereye: form-tasarimi.

**20. Akış Düzeni İçerik ve Sabit Panel** — önem: düşük
- Ne yapar: Akış Düzeni İçerik: içindeki bileşenleri **Sütun Adedi** (varsayılan 2) kadar eşit sütuna sırayla dizer. Sabit Panel: yalnızca Kurallar ve Veri sekmesi olan gruplayıcı kap.
- Kanıt: FD FlowContent.Design (4150 dolayı); JS/contents/flowcontent.js; designer.js form listeleri — okundu. Sabit Panel'in ekrandaki "sabit" davranışı okunmadı.

**21. Grafikler (Çizelgeler)** — önem: orta
- Ne yapar: Çizgi, Çubuk, Pasta Grafik. Tasarım: **Başlık**, **Boyut** (2D/3D), **Veri Formatı** (Yüzde/Değer; pasta), **X Eksen Etiketi**, **X Ekseni Değer Formatı** (Sayısal/Tarih), **Y Eksen Etiketi**, **Y Ekseni Değer Formatı**. Veri: çizgi için Çizgi XPath'i, Veri XPath'i, X Değer XPath'i, Y Değer XPath'i, Etiket XPath'i ("Yeni Çizgi Ekle"); çubuk için Çubuk XPath'i, Veri XPath'i, Değer XPath'i, Etiket XPath'i, Kategori XPath'i; pasta için Pasta XPath'i, Değer XPath'i, Değer Birim XPath'i, Etiket XPath'i.
- Kanıt: FD:4193-4530 dolayı — okundu (çizim kodu okunmadı).
- Nereye: yeni sayfa "Grafikler".

**22. Discussion (yorum / tartışma alanı)** — önem: orta
- Ne yapar: Yorum listesi. Yeni yorum ekleme düğmesi; **Tip** "Dizi" ise yorumlara **Yanıtla** çıkar, "Normal" ise çıkmaz; **Zengin Editör** Evet/Hayır. Her yorumda yazan ve tarih görünür; kişi yalnızca henüz kaydedilmemiş kendi yorumunu düzenleyebilir; boş bırakılan yeni yorum kendiliğinden silinir. Zorunluluk Grup Adı verilirse o aksiyonda kullanıcının boş olmayan yeni bir yorum eklemesi şart olur.
- Kanıt: FD:3710-3780; JS/contents/controls/discussion.js:183-187 — okundu.

**23. XSL Çevrimi, Şablon, Etkinlik Akışı, Akış Tarihçesi** — önem: düşük
- XSL Çevrimi: Veri → **Bağlı XPath**, **Hedef XPath**; **Düzenle** ile yazılan XSL her veri değişiminde uygulanır, çıktı gösterilir ve istenirse hedefe yazılır (JS/contents/controls/xsltransform.js — okundu).
- Şablon: Tasarım → **Parametreler** (Parametre Adı, Ad/Değer listesi) (FD:2457-2543 — okundu; davranış kodu okunmadı).
- Etkinlik Akışı: **Bağlantı Şablonu**, **Nesne Id XPath** (FD ActivityStream.Design — okundu; davranış okunmadı).
- Akış Tarihçesi: ayarı yok, yalnızca Kurallar/Veri (davranış okunmadı).

**24. XML Veritabanı Sorgusu ve Web Servisi Sorgusu bileşenleri** — önem: orta
- Ne yapar: Veritabanı Sorgusu'nun iki kardeşi; aynı Tasarım / Kurallar / Veri sekmeleri ve **Düzenle** penceresi. XML Veritabanı Sorgusu: Tasarım'da **Otomatik Ara**, **Önce Temizle**; Düzenle'de **Sorgu** ve **Parametreler** sekmeleri ve önizleme.
- Kanıt: FD:5705-5822 dolayı; designer.js:1218-1245 — okundu. Çalışma kodu (xmlquerycontent.js, servicequerycontent.js) okunmadı.

### 1.B Form ve tasarımcı düzeyi

**25. Form → Maks. Genişlik** — önem: orta
- Nerede: tasarımcıda en üstteki form satırı seçilince Tasarım sekmesi (formun tek sekmesi).
- Ne yapar: Formun en büyük genişliği: Otomatik, 600, 768, 800, 960, 1080 ("Form'un en büyük genişliği"). Otomatik'te ekran boyutu kullanılır.
- Kanıt: FD:5825-5859; JS/contents/form.js:20-22 — okundu.
- Nereye: form-tasarimi.

**26. Sütunun telefon / tablet / masaüstü seçenekleri** — önem: orta
- Ne yapar: Sütun → Tasarım → **Genişlik** listesinde "Daha küçükten Deviral" ve 1-12 arası; **Duyarlı Tasarım** altında masaüstü, tablet ve telefon için ayrı liste; telefon/tablet listesinde **Bu Cihazda Gizle** ve **Tam Genişlik** de var. Doküman Genişlik ve Duyarlı Tasarım'ı anıyor ama "Bu Cihazda Gizle" ve "Daha küçükten Deviral" seçeneklerini anlatmıyor. Not: Türkçe listede "1 Sütun - 1/2" yazıyor, doğrusu 1/12 (ürün yazım hatası).
- Kanıt: FD:3205-3545; JS/contents/column.js — okundu.
- Nereye: form-tasarimi (Genişlik bölümü).

**27. Yapıştırma, sürükleme ve kök kısıtları** — önem: düşük
- Ne yapar: **Yapıştır** yalnızca içine bileşen alabilen kaplarda görünür ve yapıştırılan bileşenlerin kimlikleri yenilenir. Formun kökü kesilemez, kopyalanamaz, silinemez, çevrilemez. En üst düzey bileşenler kısa bir basılı tutmadan (yaklaşık 0,3 sn) sonra sürüklenerek sıralanır.
- Kanıt: JS/contents/designer.js:1642-1669, 2114-2155 — okundu.

**28. Önizlemede XML ve Kopyala** — önem: düşük
- Ne yapar: Önizleme formu örnek veriyle açar ve üstünde form verisini gösteren **XML** ile **Copy** düğmeleri çıkar.
- Kanıt: JS/contents/designer.js:259-272; JS/contents/root.js:31-67 — okundu.

**29. Yazdırma görünümünün davranışı** — önem: orta
- Ne yapar: Yazdırmada formun başlığı sayfa başlığı olarak basılır; kapalı bölümler açık, sekmeler alt alta, Tekrar Eden İçerik detayları açık basılır; bölümler salt okunur olur. Scriptlerde `$PrintMode` değişkeni yazdırma sırasında `true` gelir.
- Kanıt: JS/contents/form.js:13-18; rowcontent.js:41-78; tabbedcontent.js:52-68; JS/widgets.js:455-460; `CodEase.Workflow.WebApp.Resources/.../workitem.widgets.js:238` — okundu.
- Nereye: form-tasarimi ya da yazdırma sayfası.

### 1.C Tablo ve tekrarlayan içerik

**30. Filtre XPath'i ve Sıralama XPath'i** — önem: yüksek
- Nerede: tablo / tekrar eden içerik → Veri sekmesi.
- Ne yapar: **Filtre XPath'i** yalnızca koşulu sağlayan satırları gösterir (veri silinmez). **Sıralama XPath'i** satırları bu değere göre sıralı gösterir.
- Kanıt: FD:1675-1690; JS/contents/iteratingcontent.js:189, 462-489, 503, 520 — okundu.
- Nereye: tablo-duzeninde-icerik.

**31. Hiyerarşi (iç içe satırlar) ve taşıma düğmeleri** — önem: orta
- Ne yapar: **Hiyerarşi XPath'i** (yalnızca veri modelinde uygun eleman varsa görünür) satırları girintili ağaç olarak gösterir; yeni alt satır üst satırın altına eklenir. **Taşıma İzin XPath'i** açıksa satırda **Taşı** düğmesi çıkar: Yukarı / Aşağı (ayrıca **Yukarı/Aşağı Taşıma XPath'i** gerekir) ve hiyerarşi varsa Sola / Sağa. Tabloda taşıma varsayılan olarak kapalıdır.
- Kanıt: FD:1631-1700, 2582-2640; JS/contents/iteratingcontent.js:188, 501-513; tablecontent.js:48-109; XSD:959 — okundu.

**32. İzlenen XPath'ler** — önem: orta
- Nerede: tablo → Diğer sekmesi; ayrıca liste bileşenlerinde.
- Ne yapar: Buraya yazılan alanlardan biri değişince tablo / liste yeniden çizilir (tablonun dışındaki bir alana bağlı filtre ya da izin kullanılıyorsa gerekir).
- Kanıt: FD:2649-2664; JS/contents/iteratingcontent.js:171-173; controls/listcontrol.js:30-32 — okundu.

**33. Satır Kuralları** — önem: orta
- Nerede: tablo → Kurallar sekmesi.
- Ne yapar: Tablo düzeyindeki **Dinamik Kurallar** tablonun bütününe, **Satır Kuralları** her satıra ayrı ayrı uygulanır (ör. satırdaki bir değere göre o satırı renklendirme ya da kapatma). Sütunun Kurallar sekmesindeki kurallar da hücre hücre uygulanır.
- Kanıt: FD:2546-2572; JS/contents/iteratingcontent.js:32-38; tablecontent.js:374-390 — okundu.

**34. Sütun → Tekrar Sayısı** — önem: düşük
- Nerede: tablo sütunu → Veri sekmesi (Bağlı XPath doluyken görünür).
- Ne yapar: Sütunu N kez yineler (sayı ya da XPath); i. hücre bağlı elemanın i. tekrarına bağlanır; başlıkta `$index` kullanılabilir (ör. dönem sütunları).
- Kanıt: FD:3596-3610; JS/contents/tablecontent.js:135-147, 177-181, 395-397, 553-566 — okundu.

**35. Tablo → Maks Yükseklik ve Sütunlar listesi** — önem: orta
- Ne yapar: **Maks Yükseklik** verilirse tablo bu yükseklikte kayar, başlık ve altbilgi sabit kalır. Tasarım sekmesindeki **Sütunlar** listesi sütun etiketlerini tek yerde gösterir. Sütun genişlikleri toplamı 100'ü geçerse tablo sabit yerleşime geçer. İçinde bileşen olmayan sütun alanın değerini düz yazı olarak gösterir.
- Kanıt: FD:3172-3200; JS/contents/tablecontent.js:419-427, 455-466, 612-634 — okundu.

**36. Liste Boş Mesajını Göster** — önem: düşük
- Ne yapar: Evet/Hayır; Hayır'da boş tablo mesajı hiç çıkmaz. Doküman yalnızca mesajın değiştirilmesini anlatıyor.
- Kanıt: FD:390-435; JS/contents/iteratingcontent.js:689-721 — okundu.

### 1.D Veri kaynakları ve sorgu penceresi

**37. Seçim Eşlemeleri (seçince başka alanları doldurma)** — önem: yüksek
- Nerede: Veri Kaynakları → kaynağın **Sonuçlar** sekmesi.
- Ne yapar: **Kaynak** (sorgu sütunu ya da XPath) → **Hedef** (formdaki alan). Kullanıcı seçim yapınca kaynak değerler hedef alanlara kopyalanır; seçim silinince hedefler boşalır. Eşlemede kullanılan sütunlar sorguya kendiliğinden eklenir. Hedef, listenin bağlı olduğu elemana göre görelidir. "Müşteri seçilince vergi numarası dolsun" ihtiyacının scriptsiz yolu.
- Kanıt: FD:4629-4676; JS/data.js:63-111, 486-490 — okundu.
- Nereye: acilir-liste (yeni bölüm).

**38. Sonuçlar sekmesi: Görünür Metin Formatı / Değer Formatı** — önem: orta
- Ne yapar: Seçenek yazısı ve değeri `{{Kolon}}` kalıplarıyla kurulur; birden çok sütun birleştirilebilir (ör. `{{Kod}} - {{Ad}}`). Aynı değere sahip satırlar tek seçenek olur.
- Kanıt: FD:4559-4628; JS/data.js:486-520 dolayı — okundu (birleştirme örneği çıkarım).

**39. Hiyerarşi Sütunu / Hiyerarşi XPath'i ve Ağaç Listesi** — önem: orta
- Ne yapar: Ağaç Listesi seçenekleri iç içe, açılır pencerede gösterir; alt seçenekler üst seçenek açıldıkça yüklenir. Üst-alt bağı veri kaynağının Sonuçlar sekmesindeki **Hiyerarşi Sütunu** (tablo sorgusu) ya da **Hiyerarşi XPath'i** (diğer kaynaklar, `$parent` değişkeniyle) ile kurulur. Yazarak arama açıktır.
- Kanıt: FD:4687-4692, 4701-4867; JS/contents/controls/treepicker.js; JS/data.js:492-494 — okundu.

**40. Yedi kaynak tipinden anlatılmayan beşi** — önem: yüksek
- **Form Verisi Sorgusu:** Sorgu → **Kaynak XPath**; Sonuçlar → **Öğe XPath'i**, formatlar, Seçim Eşlemeleri, Hiyerarşi XPath'i. Seçenekler formdaki başka bir tekrarlayan bölümden gelir ve o bölüm değiştikçe liste kendiliğinden yenilenir (ör. tabloya girilen kalemlerden seçtirme).
- **XML Veritabanı Sorgusu:** Sorgu (XQuery metni), **Parametreler** (**Veri Deposu**: Alan Veritabanı / Süreç Veritabanı; Ad/Değer listesi), Sonuçlar (Öğe XPath'i, formatlar, eşlemeler, Hiyerarşi XPath'i).
- **Web Servisi Sorgusu:** Sorgu → **Süreç** ("Şu anki Süreç" ya da başka süreç), **Servis**, **Kontrat**, **Operasyon** (zorunlu), **Parametreler** (her giriş parametresi için bir XPath); Sonuçlar → Öğe XPath'i ve formatlar (zorunlu), eşlemeler. Parametre alanları değişince liste yenilenir.
- **İçerik Tipleri:** sürecin içerik tiplerini listeler; ayar penceresi yoktur.
- **Güvenlik Profilleri:** alanın güvenlik profillerini listeler; ayar penceresi yoktur.
- Kanıt: FD:4701-5472; JS/data.js:557-559, 623-648, 1132-1175; JS/datasources.designer.js:37-38 — okundu.
- Nereye: acilir-liste (ya da yeni sayfa "Veri kaynakları").

**41. Sorgu penceresinin anlatılmayan bölümleri** — önem: yüksek
- **Alanlar → Formül:** Yok, Adet, Toplam, Ortalama, En Küçük Değer, En Büyük Değer, Tekil Değerlerin Ortalaması / Toplamı / Adedi. Alan satırının detayında **Dil** ("Sütun için dil seçeneği. Belirtilmemişse süreç örneğinin dili geçerlidir."), **Başlık**, **Eşlenen XPath**. Hiç alan tanımlanmazsa tüm alanlar kullanılır.
- **Sıralama:** Alan + **Sıralama Tipi** (Artan / Azalan).
- **Kriter:** Alan, Formül, **Karşılaştırma** (Eşit, Farklı, Benzer, Küçük, Büyük, Küçük veya Eşit, Büyük veya Eşit), Değer, **Koşul** (Ve / Veya). Kriter detayında **Yoksayılan Değerler** ("Kriteri yoksaymak için değerler listesi": değer bunlardan biriyse kriter hiç uygulanmaz; boş bırakılan filtre alanı için) ve **Tekrar XPath'i** (kriteri tekrarlayan bir elemanın her kaydı için çoğaltır).
- **Bloklar:** "Yeni Blok Ekle" ile iç içe kriter grupları (kendi Ve/Veya'sı ve Tekrar XPath'i ile); parantezli koşul kurmanın yolu.
- **Alt Sorgular:** "Yeni Alt Sorgu Ekle": **İlişki**, **Eşlenen XPath**, "Tüm Alanlar İsteniyor mu ?" ve iç sorgu; ana kaydın altındaki tekrarlayan bölümü ilişkili tablodan doldurur (var olan alt kayıtlar önce silinir).
- **Parametreler:** Hedef Şema, Hedef Tablo, **Dil Seçeneği Ekle**, **"Tüm Alanlar İsteniyor mu ? – Evet, tüm alanlar kullanılsın."**
- Kanıt: FD:722-763, 818-1056, 1080, 1113-1214, 1231-1373, 1458-1506; CORE/query.js:173-330; JS/contents/querycontent.js:217-266 — okundu.
- Nereye: veritabani-sorgusu ve acilir-liste (ortak "Sorgu penceresi" bölümü ya da sayfası).

### 1.E Veritabanı Sorgusu bileşeni

**42. Düzenle penceresinin Script ve Veri sekmeleri** — önem: yüksek
- **Script → Satır Script:** içeri alınan her satır için çalışır; `$Row` veritabanı satırı, `$NewChild` forma eklenen kayıttır.
- **Script → Arama Script:** arama başlamadan çalışır; `$Query.AddColumn(kolon, xpath, formül)`, `$Query.AddCriteria(kolon, değer, karşılaştırma)` ile sorgu değiştirilir; `return false` aramayı iptal eder.
- **Veri → Satır No XPath'i:** aynı anahtara sahip kayıt (sorgudaki `Id` sütunu ile karşılaştırılır; varsayılan `Id`) ikinci kez eklenmez. **Hiyerarşi Sütunu** + **Hiyerarşi XPath'i:** gelen satırlar üst kaydın altına yerleşir (sütun verilmeden XPath verilirse "Hierarchy column is not set." hatası).
- Kanıt: FD:5620-5667; JS/contents/querycontent.js:112-116, 142-148, 365, 497-501, 577-602 — okundu.
- Nereye: veritabani-sorgusu.

**43. Filtre alanları, Doğrulama Grubu, Veri Olay Adı** — önem: yüksek
- Ne yapar: Veritabanı Sorgusu'nun içine eklenen bileşenler arama filtresi alanı olur; içlerinde Enter aramayı başlatır. Kurallar → **Doğrulama Grubu** ("Arama kriterleri için doğrulama grup adı"): arama öncesi bu grubun zorunluluk ve doğrulama kuralları denetlenir. Veri → **Veri Olay Adı** ("Verileri görüntüleyecek arayüzü tetikleyen olay adı"): sonuçlar aynı adı taşıyan Veri Tablosu'na gönderilir (bkz. 3). Kurallar'da ayrıca **Bölüm Adı** ve Dinamik Kurallar vardır.
- Kanıt: FD:5475-5508, 5676-5703; JS/contents/querycontent.js:405-420, 453-456, 567-573 — okundu.

**44. Sonuç penceresi ve tek kayıt hedefi** — önem: orta
- Ne yapar: "Arama Sonuçları" penceresi 10'ar satır sayfalar, sütuna göre sıralar; hedef tek kayıtsa tek seçim, tekrarlayansa onay kutularıyla çoklu seçim yapılır. Hedef tekrarlamayan bir bölümse (Öğe XPath'i `.`) seçilen satır o bölümün alanlarına yazılır ve **Önce Temizle** yalnızca eşlenen alanları boşaltır. **Otomatik Ara** kriter alanları değiştikçe aramayı yeniden çalıştırır.
- Kanıt: JS/contents/querycontent.js:127-136, 270-285, 424-426, 464-486, 605-640 — okundu.

### 1.F Kurallar

**45. Bölüm Adı'nın form tarafı** — önem: orta
- Nerede: kapların (Satır, Sekme, Sabit Panel, Mesaj, Akış Düzeni, tablo, sütun, Koşullu İçerik, sorgu, Discussion) Kurallar sekmesi.
- Ne yapar: Bileşene bir bölüm adı verilir ("Yanlız okunur veya görünürlüğü kontrol etmek üzere form bölümünün adı"); görev ayarlarında o bölüm Gizli ya da Düzenlemeye Kapalı yapılınca bileşen ve içindekiler buna uyar. gorev-ayarlari bölüm durumunu anlatıyor; form sayfalarında adın nereden verildiği yok.
- Kanıt: FD:2430-2447; JS/widgets.js:430-462 — okundu.
- Nereye: form-tasarimi (gorev-ayarlari'na bağlantıyla).

**46. Kendiliğinden çalışan doğrulamalar** — önem: orta
- Ne yapar: Tasarımcı kural yazmasa da: geçersiz tarih, Kimlik Seçici'de listede olmayan ad, **Yeni Eklemeye İzin Ver** kapalı Seçim Listesi'nde listede olmayan metin alanı geçersiz kılar. Bu kuralların grup adı boştur.
- Kanıt: JS/contents/controls/datetimebox.js:45-53; identitypicker.js:45-54; selectlist.js:27-39 — okundu.

**47. Gizli ve kapalı alanlarda doğrulama, kural sırası** — önem: orta
- Ne yapar: Düzenlemeye kapalı alanın ve silinmiş olarak işaretli satırın doğrulama kuralları çalışmaz; gizli kabın içindekiler de denetlenmez. Gizlilik ve kapalılık üst bileşenden alta miras kalır. Aynı bileşende birden çok biçimlendirme kuralı sırayla uygulanır, sonraki öncekini ezer; **Deviral** seçili özellik değişmez.
- Kanıt: JS/rules.js:96, 180, 244, 268-326, 377-404, 617-643 — okundu.
- Nereye: dinamik-kurallar.

**48. Dinamik kuralda zaman uyumsuz script: `$Complete`** — önem: düşük
- Ne yapar: Kural ya da script metninde `$Complete` geçiyorsa sonuç `return` ile değil `$Complete(sonuç)` çağrısıyla verilir; o ana kadar bekleme göstergesi çıkar (ör. servis çağrısının yanıtına göre karar).
- Kanıt: JS/scripting/script.js:33, 99-101, 115-125 — okundu.

### 1.G İfade dili `{{ }}`

**49. İşlevlerin tamamı** — önem: yüksek
- Ürüne özel işlevler (okundu: CORE/xml/functionresolver.js:8-138):

| İşlev | İmza | Örnek |
|---|---|---|
| iif | `iif(koşul, doğruysa, yanlışsa)` (tam üç değer) | `{{iif(Tutar > 1000, 'Yüksek', 'Normal')}}` |
| format | `format(değer, biçim, kültür)`; biçim ve kültür isteğe bağlı | `{{format(sum(Kalemler/Kalem/Tutar), 'n0')}}`, `{{format(Tarih, 'd')}}` |
| min / max / avg | `min(düğümler)`, `max(düğümler)`, `avg(düğümler)` | `{{avg(Kalemler/Kalem/Tutar)}}` |
| now | `now()` | `{{now()}}` |
| current | `current()` | bağlam düğümü |

- `format` sayıda `'n0'`, `'n2'` gibi sayı biçimlerini; tarihte `'d'`, `'f'` (varsayılan), `'o'` (ISO) gibi tarih biçimlerini alır; diğer metinleri olduğu gibi döndürür. `min/max/avg` düğüm kümesi dışında bir şey alırsa hata verir; `avg` kayıt sayısına böler. Üründen örnekler: `{{format(count(Blocks/*),'n0')}}`, `{{iif(@Type = 'Text', 'string', iif(@Type = 'Date', 'date', 'decimal'))}}` (FD:1724).
- Standart işlevler (okundu: `external/xmldom/xpath.js:3564-3590`): `last`, `position`, `count`, `id`, `local-name`, `namespace-uri`, `name`, `string`, `concat`, `starts-with`, `contains`, `substring-before`, `substring-after`, `substring`, `string-length`, `normalize-space`, `translate`, `boolean`, `not`, `true`, `false`, `lang`, `number`, `sum`, `floor`, `ceiling`, `round`. Örnekler: `{{concat(Ad, ' ', Soyad)}}`, `{{substring(Kod, 1, 3)}}`, `{{round(Tutar * 0.18)}}`, `{{count(Kalemler/Kalem[Tutar > 0])}}`.
- Nereye: etikette-hesaplama (işlev tablosu).

**50. Koşullu biçim, yineleme ve değişkenler** — önem: yüksek
- `{{if KOŞUL then METİN else METİN}}`: `else` isteğe bağlı; `then` / `else` bölümlerinde iç içe `{{ }}` kullanılabilir. Üründen örnek: `{{if Template != "" then {{Template}} else {{@XPath}}}}`.
- `{{YOL => ŞABLON}}`: yolun seçtiği her kayıt için şablonu yineler (ör. `{{Kalemler/Kalem => {{Ad}}, }}`). Html içeriğinde bir etikete `x-repeat="yol"` yazmak da aynı işi görür.
- `$değişken`: ifade içinde form değişkenleri kullanılabilir. Her formda bulunanlar: `$ActiveUser` (Id, Name), `$StaticUrl`, `$DomainUrl`; XPath içinde `$poolRoot` (verinin kökü), noktalı kullanım `$ActiveUser.Id`. Tanımsız değişken hata verir.
- Kanıt: CORE/literal.js:65-87, 207-209, 292-344, 417-536; CORE/xml/variableresolver.js:21-39, 77-79; JS/forms.js:140-163, 266; JS/contents/datatable.js:36 — okundu. `=>` örneği çıkarım (sözdizimi okundu, örnek denenmedi).
- Nereye: etikette-hesaplama.

**51. Sonucun kendiliğinden biçimlenmesi** — önem: orta
- Ne yapar: `{{ }}` sonucu sayıysa kullanıcının diline göre binlik ayraçlı sayı, tarihse yerel tarih-saat, evet/hayır ise işaretli / boş kutu simgesi olarak gösterilir. Farklı görünüm için `format` kullanılır. Etiket içeriğinde `[time …/]` yazımı tarih gösterimine çevrilir.
- Kanıt: CORE/literal.js:132-167; JS/contents/controls/literal.js:87-92 — okundu.

**52. Form scriptinde kendi işlevini tanımlama** — önem: orta
- Ne yapar: Form scriptinde `$Form.exports.ad = function (node) { … }` yazılırsa `ad()` tüm `{{ }}` ifadelerinde ve XPath alanlarında işlev olarak çağrılabilir; sonuç metne çevrilir. Tasarımcıda bu işlevler boş döner (uyarı verir).
- Kanıt: JS/functionresolver.js:21-66; JS/contents/root.js:159-167 — okundu.
- Nereye: form-scripti + etikette-hesaplama.

### 1.H Form scripti nesneleri

**53. `$Xml`'in tüm yöntemleri** — önem: yüksek
- Dokümanda yalnızca Bind, Live, Evaluate, SetValue var. Kodda okunanlar: `SelectAll(xpath, fn)`, `SelectSingle`, `GetParent`, `Evaluate`, `EvaluateNumber`, `EvaluateDateTime`, `EvaluateBoolean`, `SetValue`, `SetDefaultValue(xpath, değer)` (yalnızca boşsa yazar), `Count(xpath)` ve `Sum(xpath)` (silinmiş işaretli satırları saymaz), `Equals(xpath, değer)`, `IsEmpty`, `DeleteSelf`, `Remove(xpath)`, `SetAttribute` / `GetAttribute` / `RemoveAttribute`, `Trigger(olay)`, `Bind`, `Live`, `AppendChild(xpath, fn)`, `AppendChildXml(xml, önce)`, `CommitDeletes()`, `Assert(xpath, mesaj, detayXPath)`, `Parse(xmlMetni)`, `Clone(fn)`, `Copy(kaynakXPath, hedef)`, `Sync(...)`, `InnerXml([değer])`, `OuterXml([değer])`, `Format(şablon, seçenekler)` (`{{ }}` şablonunu hesaplar), `Transform(xslt, parametreler)`, ad alanı yöntemleri. `Live` geri çağrısı olay nesnesi alır (`e.target`, `e.currentTarget`).
- Kanıt: JS/scripting/xmlproxy.js (tamamı; Live 182-197) — okundu.
- Nereye: form-scripti (başvuru tablosu).

**54. Diğer script nesneleri** — önem: yüksek
- `$Form`: `element`, `rebuild()`, `refresh()`, `readonly`, `exports` (yalnızca form scriptinde).
- `$HttpClient.DownloadString({Address, QueryString, Headers}, geriÇağrı)` ve `$HttpClient.UploadString({Address, QueryString, Data, Headers}, geriÇağrı)`: dış adrese istek (istek sunucu üzerinden gider).
- `$Services.ServisAdı.KontratAdı.Operasyon(girdi, başlıklar, geriÇağrı, hata)`: süreçte tanımlı web servisini çağırır.
- `$Calendar` (form sürümü 4 ve üstü): `AddTimeSpan`, `Add` (saat), `AddDays`, `AddMonths`, `AddYears`, `Subtract`, `ChangeTimeZone`, `GetTimeZone`, `GetToday`, `GetHoursInDay`, `GetDateTime`, `GetBusinessHours`, `GetStandardCalendar`, `GetWeekendCalendar`, `GetCalendar(ad)`, `GetCalendarNames`; sonuçlar geri çağrıyla gelir.
- `$Localization`, `$Complete`, her form değişkeni `$Ad` olarak (`$ActiveUser`, `$StaticUrl`, `$DomainUrl`, `$PrintMode`).
- Bağlama özel: Satır Script'te `$NewChild` (ve `$Xml` = tablonun bağlı elemanı); sorgu Satır Script'inde `$Row`; Arama Script'te `$Query`; Html bileşeni scriptinde `$Html`.
- Kanıt: JS/scripting/script.js:44-57, 150-152; httpclient.js; webservice.js:14-62; calendar2.js:18-116; JS/contents/root.js:159-167; iteratingcontent.js:439-441; querycontent.js:497-501, 577-602; controls/Html.js:50-53 — okundu. Yöntemlerin parametre ayrıntıları ve `$Localization`'ın içeriği okunmadı.
- Nereye: form-scripti.

**55. Form scriptinin çalışma anı ve yenileme** — önem: düşük
- Ne yapar: Form scripti tasarımcıda ve önizleme dışındaki tasarım ekranında çalışmaz; formda alanlar çizilmeden önce bir kez çalışır (dokümanda var). Veri her değiştiğinde kurallar ve ekran yaklaşık 0,1 sn sonra toplu yenilenir. Kaydederken silinmiş işaretli satırlar veriden çıkarılır.
- Kanıt: JS/contents/root.js:133-169; JS/forms.js:298-317 — okundu.

---

## 2. Dokümanda var ama eksik anlatılmış

**1. form-tasarimi → panel sekmeleri tablosu** — önem: orta
- Eksik: Tabloda **Eşlemeler** (Kimlik Seçici) sekmesi yok; **Diğer** yalnızca izinler diye geçiyor, oysa **İzlenen XPath'ler** ve **Satır Script** de orada. Hangi bileşende hangi sekmenin çıktığı yok (ör. form: yalnızca Tasarım; Koşullu İçerik: Kurallar + Veri; Expression: Tasarım + Veri; tablo: Tasarım + Kurallar + Veri + Diğer; liste bileşenleri: + Veri Kaynakları).
- Kanıt: `*.designer.js` içindeki sekme listeleri; FD:2582-2699; LOC:444-456 — okundu.

**2. form-tasarimi → araç çubuğu** — önem: orta
- Eksik: Bileşene göre çıkan ek komutlar: Satır Düzeninde İçerik ve Veri Tablosu'nda **Sütunlar**; tabloda **Yeni Sütun Ekle**; sekmede yeni sekme ekleme; Veritabanı Sorgusu, Html ve XSL Çevrimi'nde **Düzenle**. **Çevir** penceresinde hangi bileşenlerin çıktığı (bkz. 1.1).
- Kanıt: JS/contents/*.designer.js; designer.js:1717-1760; LOC:2056-2060 — okundu.

**3. form-tasarimi → Koşullu İçerik** — önem: düşük
- Eksik: Kurallar sekmesinde **Koşul** yanında **Bölüm Adı** da var.
- Kanıt: FD:3619-3635 — okundu.

**4. acilir-liste → Seçim Listesi** — önem: orta
- Eksik: **Yeni Eklemeye İzin Ver** açıkken listede olmayan metin başlık alanına yazılır, değer alanı boş kalır; kapalıyken listede olmayan metin alanı boşaltır ve geçersiz işaretler. Liste düğmesi tüm seçenekleri açar, Enter aramayı başlatır. Arama büyük/küçük harfe duyarsız "içinde geçen" eşleşmesidir.
- Kanıt: JS/contents/controls/selectlist.js:27-39, 99-137; JS/data.js:340-376 — okundu.

**5. acilir-liste → Veri sekmesi** — önem: düşük
- Eksik: Liste bileşenlerinde Veri sekmesi **Bağlı XPath**, **Değer XPath'i**, **Başlık XPath'i** üçlüsüdür; başlık alanı yoksa başlık değer alanının özniteliğinde tutulur.
- Kanıt: FD ListControl.Data; JS/contents/controls/listcontrol.js:65-77 — okundu.

**6. acilir-liste → Radyo Büton / Ağaç Listesi** — önem: düşük
- Eksik: Radyo Büton'da **Yerleşim** varsayılanı Yatay. Ağaç Listesi tek cümle; ayrıntı 1.39'da.
- Kanıt: XSD (RadioList Layout varsayılanı); JS/contents/controls/treepicker.js — okundu.

**7. tablo-duzeninde-icerik → Zorunluluk Grup Adı** — önem: yüksek
- Eksik (tuzak): "En az bir satır" denetimi silinmiş olarak işaretlenen satırları da sayar; kullanıcı tek satırı silip **Geri Al** yapmadan ilerlerse tablo boş kalmasına rağmen zorunluluk geçer.
- Kanıt: JS/contents/iteratingcontent.js:280-286 — çıkarım (sayım ifadesi okundu; canlıda denenmeli).

**8. tablo-duzeninde-icerik → izin alanları** — önem: orta
- Eksik: Diğer sekmesindeki izin alanları `1` (izinli), `0` (izinsiz), boş (varsayılan) ya da bir XPath koşulu alır; tabloda **Taşıma İzin XPath'i** varsayılan olarak kapalıdır ve Yukarı/Aşağı düğmeleri için **Yukarı/Aşağı Taşıma XPath'i** de gerekir.
- Kanıt: JS/contents/iteratingcontent.js:242-271; tablecontent.js:48-109; XSD:959 — okundu.

**9. tablo-duzeninde-icerik → Excel** — önem: düşük
- Eksik: **Dışarı Almaya İzin Ver** varsayılan açık, **İçeri Almaya İzin Ver** varsayılan kapalı. Sütun **Tip**'i (Metin / Tarih / Tarih ve Saat / Numara) yapıştırılan değerin seçilen **Dil**'e göre çözülmesini belirler; sayıya çevrilemeyen hücre boş kalır. Ayraç (sekme, noktalı virgül, virgül) kendiliğinden algılanır. "Var olan kayıtları sil" eski satırları silinmiş olarak işaretler. İndirilen dosya `.xlsx`, sayfa adı "exported".
- Kanıt: XSD:220-221; JS/data.js:1179-1200, 1238-1260, 1301-1307, 1337-1450 — okundu.

**10. tablo-duzeninde-icerik → Satır No XPath'i** — önem: düşük
- Eksik: Form açılırken numarası boş olan mevcut satırlara da numara verilir. Yeni eklenen satır kısa süre vurgulanır.
- Kanıt: JS/contents/iteratingcontent.js:202-206 — okundu.

**11. zorunlu-alanlar → sayı alanları ve grup seçimi** — önem: orta
- Eksik: Nümerik Kutu'da boş ve `0` ikisi de boş sayılır (dokümandaki "`0` boş sayılır" notu sayı alanında özellikle geçerli; "0 adet" girilmesi gereken alan zorunlu yapılamaz). **Zorunluluk Grup Adı** kutusu aksiyonlarda tanımlı grup adlarını öneri olarak listeler. **Maksimum Uzunluk** varsayılanı 255. **Girdi Maskesi** imleri: `9` rakam, `a` harf, `*` harf ya da rakam.
- Kanıt: JS/contents/controls/numericbox.js:22-34; databoundcontrol.js:62-74; FD:446-457 ve TextBox.Rules; textbox.js:33-45 — okundu.

**12. dinamik-kurallar → Hata Mesajı** — önem: düşük
- Eksik: Alanın ipucu "Gerekli ise {{ xpath }} formatını kullanabilirsiniz" diyor; mesajda alan değeri gösterilebileceğini ima ediyor. Kodda bu çözümlemenin yapıldığı yer doğrulanamadı (bkz. 4.4).
- Kanıt: FD:1964 — okundu.

**13. dinamik-kurallar → Biçimlendirme Kuralı kapsamı** — önem: düşük
- Eksik: Kural yalnızca alanlara değil kaplara, sütunlara, tablo satırlarına (Satır Kuralları) ve sekmelere de yazılabilir; kaba yazılan gizleme içindekilerin tümünü gizler.
- Kanıt: FD:2430-2447, 2546-2572; JS/rules.js:377-404 — okundu.

**14. veritabani-sorgusu → Tasarım sekmesi** — önem: düşük
- Eksik: **Otomatik Ara** işaretliyken **Tümünü Otomatik Seç** kutusu gizlenir (otomatik aramada tüm sonuçlar zaten pencere açılmadan alınır).
- Kanıt: FD:5539-5541; JS/contents/querycontent.js:605-607 — okundu.

**15. etikette-hesaplama → yenilenme** — önem: düşük
- Eksik: Tek bir alana bakan ifade o alan değişince, `sum` gibi hesap ifadeleri formdaki herhangi bir değişiklikte yeniden hesaplanır. İfade Seçim Kutusu etiketinde, Hyperlink metni ve adresinde, Html içeriğinde, tablo altbilgisinde, Veri Tablosu şablonunda da çalışır.
- Kanıt: CORE/literal.js:392-410; checkbox.js; hyperlink.js; Html.js; datatable.js — okundu.

**16. form-scripti → `alert` dışındaki olanaklar** — önem: orta
- Eksik: Sayfa `$Xml`'i dört yöntemle sınırlı tanıtıyor; satır ekleme/silme, toplama, varsayılan değer, servis ve HTTP çağrısı gibi sık gereken işler yok (bkz. 1.53, 1.54).

---

## 3. Dokümandaki yanlışlar

**1. etikette-hesaplama.md:50** — önem: yüksek
- Cümle: "İpucu metinlerinde çalışmaz; orada yazdığınız olduğu gibi görünür."
- Doğrusu: Alanların **İpuçları** metni ifade çözümleyicisinden geçirilir; `{{ }}` ifadeleri hesaplanır ve alanın kendi elemanına göre çözülür (`{{.}}` alanın kendi değeri, `{{../Diger}}` kardeş alan). Yol alanın kendisine göre göreli olduğu için bölüm köküne göre yazılmış bir ifade boş dönmüş ve "çalışmıyor" izlenimi vermiş olabilir.
- Kanıt: JS/contents/controls/databoundcontrol.js:149-162 — okundu; canlıda denenmeli (celiskiler #64 ile çelişiyor).

**2. dinamik-kurallar.md:82** — önem: orta
- Cümle: "Kurallar kullanıcı yazarken değil, **aksiyona basıldığında** denetlenir"
- Doğrusu: İlk denetim aksiyona basınca yapılır; ama bir aksiyon denendikten sonra her veri değişikliğinde aynı grubun kuralları yeniden çalışır, yani hata işaretleri kullanıcı yazarken güncellenir ve düzeltilen alanın hatası kendiliğinden kalkar. Cümle ayrıca yalnızca Doğrulama Kuralı için geçerlidir; Biçimlendirme Kuralları her veri değişikliğinde çalışır.
- Kanıt: JS/rules.js:88-93; JS/contents/root.js:133-147 — çıkarım (akış okundu; canlıda denenmeli).

**3. dinamik-kurallar.md:83** — önem: orta
- Cümle: "**Doğrulama Grup Adı**'nı boş bırakmayın; aksiyondaki adla aynı adı yazın."
- Doğrusu: Ürün ipucu tersini söylüyor: "Her zaman kontrol etmek için boş bırakınız". Kodda ise boş gruplu kural yalnızca aksiyonun Doğrulama Grubu da boşsa çalışıyor. Yani dokümanın önerisi pratikte güvenli, ama gerekçesi yazılmalı ve ürün ipucunun yanıltıcı olduğu belirtilmeli (celiskiler #53/#87 kodla doğrulandı).
- Kanıt: FD:1941-1980 (ipucu); JS/rules.js:57-75, 140, 687 — okundu.

**4. acilir-liste.md:124** — önem: düşük
- Cümle: "**Radyo Buton:** …"
- Doğrusu: Arayüzdeki ad "Radyo Büton" (ürün yazımı). celiskiler #44'te açık madde; burada yalnızca kanıt eklendi.
- Kanıt: LOC:2912 — okundu.

**5. tablo-duzeninde-icerik.md:128** — önem: düşük
- Cümle: "Tekrarlayan bir eleman şu bileşenlerle de gösterilebilir: Tekrar Eden İçerik, Veri Tablosu, Takvim, Etiket Listesi."
- Doğrusu: Yanlış değil ama eksik liste: Çizelgeler (grafikler) ve Veritabanı Sorgusu ailesi de tekrarlayan elemana bağlanır; Etiket Listesi kök menüden eklenir. Bileşenlerin kendisi 1.2-1.5'te.
- Kanıt: JS/contents/designer.js:1218-1245 — okundu.

**6. form-tasarimi.md:78** — önem: düşük
- Cümle: "Diğer | Tablo gibi tekrarlayan bileşenlerde ekleme, silme ve taşıma izinleri."
- Doğrusu: Diğer sekmesinde izinlere ek olarak **İzlenen XPath'ler** ve **Satır Script** bulunur (tablo sayfası Satır Script'i doğru yere koyuyor; iki sayfa uyumsuz).
- Kanıt: FD:2582-2699 — okundu.

---

## 4. Doğrulanamayanlar / canlıda denenmeli

1. **Tablo sütunlarını Tasarım → Sütunlar listesinden sıralama.** Liste "Sortable.Items" adlı şablondan geliyor ama içindeki tabloda taşıma izni tanımlı değil ve tabloda taşıma varsayılanı kapalı. Dokümandaki "sütunlar sürüklenerek taşınamaz, XML ile taşınır" cümlesi doğru olabilir. Kanıt: FD:353-365, 3185-3190; XSD:959 — çıkarım. Canlıda: listede Taşı düğmesi çıkıyor mu?
2. **İpuçları'nda `{{ }}`** (3.1). Canlıda: bir alanın İpuçları'na `{{.}}` ve `{{../BaşkaAlan}}` yazıp formda üstüne gelin.
3. **Doğrulamanın ilk aksiyondan sonra canlı güncellenmesi** (3.2).
4. **Hata Mesajı'nda `{{ xpath }}`.** İpucu var (FD:1964); kural mesajı ham metin olarak okunuyor (JS/rules.js:184), mesajın gösterildiği yerde çözümlenip çözümlenmediği okunmadı (CORE/ui doğrulama gösterimi).
5. **Yalnızca silinmiş satırları olan tabloda zorunluluk** (2.7).
6. **Dosya boyut sınırı.** Yaklaşık 30 MB değeri bir yapılandırma dosyasından çıkarım; ortamdan ortama değişir. İzin verilen dosya türleri için sunucu tarafı okunmadı.
7. **Yeni Ekle listesinde isteğe bağlı elemanların çıkmaması.** JS/contents/designer.js:1399 koşulu böyle okunuyor; etkisi denenmeli.
8. **Form scriptinin, stilin ve yazdırma ayarının süreç ekranındaki yeri.** form-scripti.md:11'deki "Formlar → ok → Script" yolu kodda doğrulanmadı; süreç tasarımcısında görev yazdırma formu (`processdesigner.widgets.js:1897-1900`) ve genel script formu (2290) görüldü, menü metinleri okunmadı.
9. **Süreç değişkenlerinin tanımlandığı ekran.** Tasarımcı süreçte tanımlı değişkenleri içeri alıyor (JS/contents/designer.js:147-163); arayüzde nerede tanımlandığı bulunmadı.
10. **Etikete stil sınıfı verme.** Etiketin `Style` özniteliği `userStyle-…` sınıfına dönüşüyor (JS/contents/controls/label.js:10-13); panelde karşılığı görülmedi. Sütundaki `HtmlClass`, Kimlik Seçici'deki tip kısıtı (EnabledTypes, ShowInternals), Ağaç Listesi'ndeki yazarak arama anahtarı ve Tekrar Eden İçerik'teki detay izni de yalnızca XML'de; arayüz alanı yok.
11. **Telefonlarda tablonun kart görünümü.** Hücrelere başlık etiketi ekleniyor (JS/contents/tablecontent.js:435); görünümü belirleyen stil dosyası okunmadı.
12. **Veri Tablosu sayfa uzunluğu seçenekleri**, **Takvim düzenleme penceresinin içeriği** (calendar.js:184-483 tarandı), **grafiklerin çizimi**: ayar alanları okundu, ekran davranışı okunmadı.
13. **Okunmayan dosyalar:** xmlquerycontent.js, servicequerycontent.js, applytemplate.js, template.js, instancehistory.js, activitystream.js, columncontent.js, stage.js, dropdown.js, view.localization.js; `scripting/types/*.json` (script düzenleyicisinin otomatik tamamlama tanımları; hangilerinin form tarafında geçerli olduğu belirsiz). XML Veritabanı Sorgusu, Web Servisi Sorgusu, Şablon, Etkinlik Akışı ve Akış Tarihçesi'nin çalışma davranışı bu yüzden yalnızca ayar alanlarıyla raporlandı.
14. **Metin Kutusu Tip listesinin ve Tarih Format listesinin tam sırası/etiketleri.** Özet çıktıda eşleşme kaymıştı; FD:2055-2085 ve 2230-2245 ham satırlarından yeniden bakılmalı.
15. **Html penceresindeki "Yapay Zekaya Sor".** Düğme ve betiği var (FD:4016-4054); ne gönderdiği ve hangi ortamlarda açık olduğu okunmadı.
16. **ayar-ekrani sayfası.** Form tasarımcısı kodunda bu sayfayla ilgili ayrı bir bulgu çıkmadı; ayar ekranı formlarının tanımı bu taramada okunmadı.
