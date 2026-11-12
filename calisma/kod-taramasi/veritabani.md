# Kod taraması: veri tabanı tasarımı ve sorgu pencereleri

Tarih: 2026-11-12. Kapsam: şema / tablo / alan / ilişki tasarımı, sorgu penceresi (liste kaynağı, **Veritabanı Sorgusu** bileşeni, script sihirbazı), `$Database`. Karşılaştırılan sayfalar: `veritabanlari`, `veritabani-sorgusu`, `scriptte-veri-tabani`, `acilir-liste`, `ayar-ekrani`. Bu dosya siteye girmez; doküman sayfaları değiştirilmedi.

Kanıt kısaltmaları (hepsi `../codEase-master/Src` altında):

| Kısaltma | Dosya |
|---|---|
| `PD` | `CodEase.Workflow.Web/Forms/ProcessDesigner.xml` |
| `FD` | `CodEase.Workflow.Web/Forms/FormDesigner.xml` |
| `LOC` | `Localization.xml` |
| `Q` | `CodEase.WebApp.Resources/js/codease/core/query.js` |
| `QC` | `CodEase.WebApp.Resources/js/codease/forms/contents/querycontent.js` |
| `D` | `CodEase.WebApp.Resources/js/codease/forms/data.js` |
| `SM` | `CodEase.Framework/Data/Repository/Server/SchemaManager.cs` |
| `GDQ` | `CodEase.Framework/Data/Repository/Server/GetDataQueryContext.cs` |
| `SDC` | `CodEase.Framework/Data/Repository/Server/SaveDataContext.cs` |
| `DBC` | `CodEase.Framework/Data/Repository/Server/DatabaseContext.cs` |
| `CE` | `CodEase.Framework/Data/Repository/Server/ColumnExpression.cs` |
| `AA` | `CodEase/Data/Access/AbstractAdapter.cs` |
| `RPC` | `CodEase.Workflow.Web/RPC/DataStore.cs` |
| `PVP` | `CodEase.Workflow/Business/Server/Logic/ProcessVersionPublisher.cs` |
| `DP` / `DTP` / `QP` | `CodEase.Framework/Scripting/Execution/DatabaseProxy.cs` / `DataTableProxy.cs` / `QueryParser.cs` |
| `DR` | `CodEase/Data/DataRow.cs` |

"okundu" = satırı kendim açıp okudum. "çıkarım" = okuduğum koddan vardığım sonuç; çalıştırılarak denenmedi. Kod hiç çalıştırılmadı; bütün davranış ifadeleri kod okumasına dayanır.

## Görevde sorulanlara kısa yanıt

| Soru | Yanıt | Ayrıntı |
|---|---|---|
| Alan için zorunlu / tekil / varsayılan değer / hesaplanan alan / hassasiyet ayarı var mı? | Yok. Alan satırında yalnızca **Ad**, **Tip**, **Boyut** (ve metin alanlarında **Diller**) var. | 2.2 |
| İndeks penceresi var mı? | Yok. Tablo ayrıntısında beş sekme var; indeks tanımı yok. | 2.2 |
| Şemada Export var mı? | Yok; şema listesinde yalnızca **Import** görünür, dışarı aktarma komutu gizli. | `schemas.js:96-98` okundu |
| Ham SQL / saklı yordam çağırma var mı? | Sorgu penceresinde de `$Database` nesnesinde de yok. | `DP:49-248` okundu; `Scripting/Execution` ve `Data/Repository` altında arama sonuç vermedi |
| Sorgu penceresinde "en çok kayıt" / sayfalama var mı? | Pencerede yok. Yalnızca **Arama Sonuçları** penceresi 10'ar kayıt sayfalar; scriptte `MaxLength` ve `Start` elle yazılabilir. | 1.19, 2.8 |
| Harici veri tabanına bağlanma var mı? | Var: şemada **Kaynak Yeri** = **Harici** + **Bağlantı Adı**. Bulut kurulumunda görünmez. | 1.8 |
| Hazır veri tarayıcı / tablo verisi düzenleme ekranı var mı? | Genel bir veri tarayıcı yok. Tablo verisi yalnızca süreç tasarımcısındaki **Veri** sekmesinden düzenlenir (Excel'e dışarı aktarma var, içeri alma yok). HR tablolarını organizasyon düzenleme ekranı yönetir (bu taramanın alanı dışında). | 2.4; `Configuration.global/System/OrganizationEditor.xml:129-248` okundu |
| Tabloyu kim okur / yazar? | Tablo başına okuma/yazma izni yok. Satır düzeyinde **Yetkilendiren** (1.1) ve kiracı düzeyinde bir sıkılaştırma ayarı (1.20) var. Yazmada yetki denetimi yok. | 1.1, 1.20 |
| Kiracılar arası yalıtım | Sorgular oturumdaki kiracının veri deposunda çalışır; tasarımcıda başka kiracının şemasını seçmenin yolu yok. Kullanıcıya yansıyan bir ayar bulunamadı. | `RPC:44,100` okundu |

---

## 1. Dokümanda hiç olmayan özellikler

### 1.1 Yetkilendiren (satır düzeyi yetki)

- **Arayüzde:** Süreç → **Veritabanları** → tablo → **Detaylar** → **Genel** sekmesi, **Birincil Anahtar (Primary Key)**'in altında **Yetkilendiren** açılır listesi.
- **Seçenekler:** **Yok** (varsayılan) ve tablodaki **Tekil Tanımlayıcı** tipindeki alanlar. Başka tipte alan listede çıkmaz.
- **Ne yapar:** Seçilen alan, her kaydın "kime ait olduğunu" tutar: içine bir kullanıcının, grubun, departmanın ya da pozisyonun kimliği yazılır. Formdan yapılan sorgularda kullanıcı yalnızca **kendisinin üyesi olduğu** kimliğe ait kayıtları görür; diğer kayıtlar sonuçtan çıkarılır.
  - Alan kullanıcının kendi kimliğini tutuyorsa kayıt o kullanıcıya görünür.
  - Alan bir grup / departman / pozisyon kimliği tutuyorsa o grubun, departmanın (alt departmanlar dahil) ya da pozisyonun üyelerine görünür.
  - Alanı **boş** olan kayıt **herkese** görünür.
  - Alandaki değer tanınan bir kimlik değilse kayıt kimseye görünmez.
- **Nerede uygulanır:** Açılır liste ve benzeri bileşenlerin **Veritabanı Sorgusu** kaynağında, **Veritabanı Sorgusu** bileşeninde, **Alt Sorgular**'ın tablolarında (alt tablonun kendi **Yetkilendiren**'i varsa), tasarımcıdaki **Veri** sekmesinde.
- **Nerede uygulanmaz (tuzaklar):**
  - Görev scriptlerindeki `$Database.Get`, `ExportToXml`, `GetData` bu süzmeyi **yapmaz**; script bütün kayıtları görür.
  - Yazmada denetim yoktur: `ImportFromXml` / `Save` her kaydı yazar.
  - Yalnızca sorgunun **hedef tablosu** süzülür. İlişki üzerinden noktayla alınan sütunlarda (`Position.Name`) ilişkili tablonun **Yetkilendiren**'i dikkate alınmaz.
  - Yetkilendiren alanı sorguda seçili olmasa da süzme çalışır; alanı **Alanlar** listesine eklemek gerekmez.
- **Değişiklik uygulanırken:** **Yetkilendiren** değiştirilirse onay penceresinin **Uyarı** sekmesinde `TableAuthorizationChange` satırı çıkar.
- **Kanıt:** `PD:2018-2037` (alan, **Yok**, yalnız `Guid`) okundu; `LOC:1424` (**Yetkilendiren**); `GDQ:347-365, 458-473, 580-586` (süzme, boş değer) okundu; `RowAuthorizationContext.cs:25-37` (boş → görünür, üyelik denetimi) okundu; `Organization/OrganizationSchema.cs:153-193` (üyelik: kendisi, grup üyesi, departmanın üst departmanı) okundu — kullanıcının departman ve pozisyon üyeliği dalları 193. satırdan sonra, okunmadı; o iki madde **çıkarım**; `DP:61, 109` (script kullanıcı bağlamı vermez) okundu; `RPC:51` (form sorgusu kullanıcı bağlamı verir) okundu; `GDQ:610` (alt sorguya kullanıcı bağlamı geçer) okundu; `GDQ:348` içindeki not "yalnızca kök tablo yetkilendirilir" okundu; `SM:480-502` (`TableAuthorizationChange`) okundu. Veri sekmesinde uygulanması **çıkarım** (aynı çağrıyı kullanıyor: `PD:2674`).
- **Nereye:** `veritabanlari` → "Tablo tanımlama" altında yeni bölüm "Kayıtları kullanıcıya göre süzme: Yetkilendiren". `scriptte-veri-tabani`'na tek cümle: "scriptte süzme uygulanmaz".
- **Önem:** yüksek (güvenlik beklentisi; script ile form arasındaki fark).

### 1.2 Güncelleme Kuralı: Aksiyon Alma / Kademeli Eşle

- **Arayüzde:** Tablo → **Detaylar** → **İlişkiler** → ilişki → **Düzenle**; **Ad** ve **Tip**'in yanındaki üçüncü kutu **Güncelleme Kuralı**.
- **Seçenekler:** **Aksiyon Alma** (varsayılan), **Kademeli Eşle**.
- **Ne yapar (Kademeli Eşle seçiliyse):**
  1. **Silme zincirlenir.** Bu tablodan bir kayıt scriptle silindiğinde (`ImportFromXml` ile formda silinmiş satır, `DeleteData`, satırın `Delete()` + `Save()`), ilişkinin gösterdiği tabloda **Kaynak Alan = Hedef Alan** eşleşen kayıtlar da silinir. Hedef tablonun kendi **Kademeli Eşle** ilişkileri varsa zincir devam eder.
  2. **Alt kayıtlar birlikte yazılır.** Sorguda bu ilişki için **Alt Sorgu** tanımlıysa (1.3), `ImportFromXml` üst kayıtla birlikte alt kayıtları da yazar ve alt kayıttaki bağ alanını üst kaydın değeriyle kendisi doldurur.
- **Aksiyon Alma seçiliyse:** Silme yalnızca o kaydı siler; ilişkili kayıtlar yerinde (sahipsiz) kalır. Alt Sorgu ile gelen alt kayıtlar `ImportFromXml`'de **sessizce yazılmaz**, hata da çıkmaz.
- **Tuzaklar:**
  - Kural veri tabanında bir kısıt oluşturmaz; yalnızca CodEase üzerinden yapılan yazma/silmede geçerlidir. İlişki tanımlamak "olmayan kayda bağ yazılamaz" denetimi de getirmez.
  - Tasarımcıdaki **Veri** sekmesinden yapılan silme zincirlenmez; yalnızca o satır silinir.
  - Silme zinciri ilişkinin **tipine bakmaz**. **Çoka Karşılık Bir** bir ilişkide (alt → üst) **Kademeli Eşle** seçilirse alt kayıt silinince bağlı olduğu **üst kayıt** da silinir (çıkarım; 4.1). Kuralı yalnızca üst tablodaki **Bire Karşılık Çok** ilişkide seçmek güvenli olandır.
  - Uygulama penceresinde kural değişikliği `RelationChange` satırı olarak görünür.
- **Kanıt:** `PD:2116-2140` okundu; `LOC:1436, 2536, 2540` (**Güncelleme Kuralı**, **Aksiyon Alma**, **Kademeli Eşle**); `CodEase/Data/Repository/Relation.cs:14` (varsayılan) okundu; `SDC:224-283` (silme zinciri, tip denetimi yok, 20 basamak sınırı) okundu; `SDC:397-398, 475-487` okundu; `SDC:412-430` (alt tablo yalnız `Cascade` ise yazılır) okundu; `SDC:344-351` (bağ alanı üstten doldurulur) okundu; `AA:1090-1110, 627-690` (zincirli silme) okundu; `SM:257-258, 314-317` (Veri sekmesi silmesi düz) okundu; `DBC:84-97` (tablo oluştururken ilişki kısıtı yok) okundu.
- **Nereye:** `veritabanlari` → "İlişkiler" tablosuna satır + ayrı uyarı kutusu. `scriptte-veri-tabani` → "Silinen satırlar"a bir cümle.
- **Önem:** yüksek (veri kaybı ve sessizce yazılmayan alt kayıt).

### 1.3 Alt Sorgular

- **Arayüzde:** Sorgu penceresinin en altında, kapalı gelen **Alt Sorgular (n)** bölümü → **Yeni Alt Sorgu Ekle**. Liste kaynağı, **Veritabanı Sorgusu** bileşeni ve script sihirbazının üçünde de var.
- **Alanlar (alt sorgu satırı → Düzenle):**

| Alan | Ne yazılır | Varsayılan |
|---|---|---|
| **İlişki** | Hedef tablonun ilişkilerinden biri (liste hazır gelir). | — |
| **Eşlenen XPath** | Alt kayıtların yazılacağı eleman, **üst satıra göre**. | Boşsa ilişkinin adı. |
| **Tüm Alanlar İsteniyor mu ?** — *Evet, tüm alanlar kullanılsın.* | Alt tablonun bütün alanları gelsin. | işaretsiz |

  Alt sorgu satırının **Detaylar**'ında ana sorgudaki bölümlerin aynısı açılır: **Alanlar**, **Sıralama**, **Kriter**, **Bloklar** ve kendi **Alt Sorgular**'ı (iç içe sürdürülebilir). Alan seçici burada ilişkinin gösterdiği tablonun alanlarını listeler.
- **Ne yapar (okurken):** Ana sorgunun getirdiği **her kayıt için** ilişkili tablodan o kayda bağlı kayıtları ayrıca çeker ve üst satırın altındaki elemana yazar. Tek sorguyla üst–alt (sipariş–kalemler) yapısını doldurmanın yoludur; `ayar-ekrani` sayfasındaki iki ayrı sorgu + `Parent` kriteri yerine kullanılabilir.
  - İlişki **Bire Karşılık Çok** ise: hedef elemanın altındaki eski alt elemanlar silinir, her kayıt için bir alt eleman eklenir.
  - Diğer tiplerde: tek kayıt beklenir, sütunlar doğrudan **Eşlenen XPath**'teki elemanın alanlarına yazılır (yeni eleman eklenmez).
  - Bağ alanını (ilişkinin **Kaynak Alan**'ı) listeye eklemek gerekmez; kendiliğinden eklenir.
- **Ne yapar (yazarken, `ImportFromXml`):** Üst satırın altında **Eşlenen XPath**'teki eleman aranır; altındaki elemanlar alt tabloya yazılır. Alt tablonun sütunları, eleman adları tablo alan adlarıyla **aynı** olanlardan kendiliğinden çıkarılır. İlişkide **Güncelleme Kuralı = Kademeli Eşle** değilse alt kayıtlar yazılmaz (1.2).
- **Tuzaklar:**
  - Hedef eleman veri modelinde yoksa hata: formda "… not found under row node …", scriptte "… xpath not found while importing subquery."
  - **İlişki** boş bırakılırsa hata: "Subquery name is not set."
  - Ana sorgunun her kaydı için ayrı sorgu çalışır; çok kayıt getiren listelerde yavaşlatır.
  - Formda alt elemanlar için tek tek eşleme yoktur: hedef elemanın **bütün** alt elemanları satır sayılır.
- **Kanıt:** `FD:1231-1379` okundu; `LOC:4095, 4135, 4107, 4079, 4111, 4115`; `GDQ:380-394, 591-627` okundu; `QC:217-266` (forma yazma, eski alt elemanları silme, tek kayıt) okundu; `DR:299-362` (yazma, sütunları addan çıkarma, hata metni) okundu; `SDC:412-430` okundu; `GDQ:594-603` (hata metinleri) okundu.
- **Nereye:** yeni sayfa önerisi "Üst–alt kayıtları tek sorguyla okuma ve yazma: Alt Sorgular" ya da `veritabani-sorgusu` altında bölüm; `ayar-ekrani`'ndan bağlantı.
- **Önem:** yüksek.

### 1.4 Seçim Eşlemeleri

- **Arayüzde:** Liste bileşeni (Açılır Liste, Seçim Listesi, Radyo Buton, Ağaç Listesi) → **Veri Kaynakları** → **Veritabanı Sorgusu** kaynağı → kalem → **Sonuçlar** sekmesi → **Seçim Eşlemeleri** bölümü. Aynı bölüm XML, form verisi ve web servisi kaynaklarında da vardır (orada iki kutu da serbest metin).
- **Alanlar:** **Kaynak** (sorgudaki sütunlardan seçilir; zorunlu) → **Hedef** (form verisinde bir alan, XPath seçiciyle; zorunlu). Satır önizlemesi `Kaynak -> Hedef` biçimindedir.
- **Ne yapar:** Kullanıcı listeden bir seçenek seçtiğinde, seçilen kaydın **başka sütunları** formdaki başka alanlara kopyalanır. Örnek: müşteri seçilince vergi numarası ve adresi de dolsun. **Değer XPath'i / Başlık XPath'i**'nin yazdığı iki alana ek olarak çalışır.
  - **Hedef** yolu, liste bileşeninin bağlı olduğu elemanın **bir üstüne** göre yazılır (liste `Musteri`'ye bağlıysa `VergiNo`, `Musteri`'nin kardeşidir).
  - Seçim **temizlenince** eşlenen hedef alanlar da boşaltılır.
  - **Kaynak** sütununu **Alanlar** listesine ayrıca eklemek gerekmez; sorguya kendiliğinden eklenir. İlişkili tablo sütunu da (`Sehir.Ad`) kaynak olabilir.
  - Hedef bulunamazsa hata çıkmaz; yalnızca tarayıcı konsoluna uyarı düşer.
- **Kanıt:** `FD:4629-4686` okundu; `LOC:848, 816, 820`; `D:57-110` (kopyalama, hedef bulunamazsa uyarı) okundu; `D:223-254` (üst elemana göre; seçim yokken temizleme) okundu; `D:480-490` (kaynak sütunların sorguya eklenmesi) okundu; `RPC:33-39` okundu.
- **Nereye:** `acilir-liste` → "Veritabanı Sorgusu" altında yeni bölüm "Seçince başka alanları da doldurma".
- **Önem:** yüksek (çok sık ihtiyaç; şu an scriptle yapılacağı sanılıyor).

### 1.5 Hiyerarşi Sütunu (liste kaynağında)

- **Arayüzde:** **Veritabanı Sorgusu** kaynağı → **Sonuçlar** sekmesi → en altta **Hiyerarşi Sütunu** metin kutusu.
- **Ne yapar:** Kendi kendine bağlı tablolarda (her kaydın "üstü" aynı tablodaki başka bir kayıt: departman ağacı, kategori ağacı) üst kaydı tutan sütunun adı yazılır (örnek: `Parent`). Liste her düzeyi ayrı sorguyla getirir: sorguya "**Hiyerarşi Sütunu** = açılan düğümün değeri" kriterini kendisi ekler. **Ağaç Listesi** ile birlikte kullanılır; kullanıcı bir düğümü açtıkça altındakiler yüklenir.
- **Tuzak:** Kutu serbest metindir; sütun adı yanlış yazılırsa sorgu hata verir ("… named field not found table …").
- **Kanıt:** `FD:4687-4694` okundu; `LOC:1092`; `D:447, 492-494` okundu; `forms/contents/controls/treepicker.js:26` (üst düğüm değeri kaynağa geçer) okundu; `CE:34-35` (hata metni) okundu. Kök düzeyde hangi kayıtların geldiği **doğrulanamadı** (4.4).
- **Nereye:** `acilir-liste` → "Radyo düğme ve diğer liste bileşenleri" → **Ağaç Listesi** maddesi genişletilir.
- **Önem:** orta.

### 1.6 Hiyerarşi Sütunu ve Hiyerarşi XPath'i (Veritabanı Sorgusu bileşeninde)

- **Arayüzde:** **Veritabanı Sorgusu** bileşeni → **Düzenle** → açılan pencerede üç sekme var: **Sorgu**, **Script**, **Veri**. **Veri** sekmesinde: **Satır No XPath'i**, **Hiyerarşi Sütunu**, **Hiyerarşi XPath'i**. (Doküman bu pencerenin yalnızca **Sorgu** sekmesini anlatıyor.)
- **Ne yapar:** Kendi kendine bağlı tablodan gelen kayıtları veri modelinde **iç içe** yerleştirir. **Hiyerarşi Sütunu** tabloda üst kaydın kimliğini tutan sütundur; **Hiyerarşi XPath'i** satır elemanının içinde alt satırların konacağı elemandır. Üstü bulunan kayıt, üst satırın o elemanının içine; üstü bulunamayan kayıt hedefin köküne eklenir. Üst–alt eşleşmesi kaydın `Id` sütunu ile satırdaki **Satır No XPath'i** (boşsa `Id`) üzerinden yapılır.
- **Tuzak:** **Hiyerarşi XPath'i** dolu, **Hiyerarşi Sütunu** boşsa bileşen hata verir: "Hierarchy column is not set."
- **Kanıt:** `FD:5620-5675` okundu; `LOC:976, 1092, 980`; `QC:6-76, 79-95, 140-152, 365-370` okundu.
- **Nereye:** `veritabani-sorgusu` → yeni bölüm "Düzenle penceresinin diğer sekmeleri".
- **Önem:** düşük–orta.

### 1.7 Çok dilli alanlar: Diller, Dil, Dil Seçeneği Ekle

- **Arayüzde (tanım):** Tablo → **Alanlar** sekmesi → **Limitli Metin** ya da **Limitsiz Metin** tipindeki alan satırında **Düzenle** → **Diller** tablosu → **Yeni Dil Ekle** → **Dil** kutusuna dil kodu (`en`, `de`). Başka tipteki alanlarda bu bölüm çıkmaz.
- **Ne yapar:** Alanın her dil için ayrı bir değeri tutulur. Asıl alan varsayılan dildeki metni taşır; eklenen her dil için **İlk Veri** ve **Veri** sekmelerinde `Alan_dil` başlıklı ek sütun görünür (`Ad_en`) ve çeviri oraya yazılır.
- **Sorguda:**
  - Formdan çalışan sorgu kullanıcının arayüz dilini kendisi ekler (`tr-TR` → `tr`). Alanın o dilde değeri varsa **çevirisi**, yoksa (dil tanımlı değilse ya da o kayıtta çeviri boşsa) **asıl değer** gelir. Ek ayar gerekmez.
  - **Sıralama** ve **Kriter** de aynı kurala uyar: alanın o dilde tanımı varsa çeviri sütunu üzerinden sıralanır / aranır.
  - Dili sabitlemek için sorgu penceresinde **Parametreler** bölümündeki **Dil Seçeneği Ekle**'ye basıp **Dil** yazılır (en çok bir tane); sorgu kullanıcının dili ne olursa olsun o dilde çalışır.
  - Tek bir sütunu belirli dilde almak için: alan satırı → **Düzenle** → **Dil** kutusu. İpucu: "Sütun için dil seçeneği. Belirtilmemişse süreç örneğinin dili geçerlidir." Aynı alan farklı dillerle listeye iki kez eklenebilir.
- **Yazarken:** Sorguda dil belirtilmişse (`Parameters.Language`) ve alanın o dilde tanımı varsa değer çeviri sütununa yazılır; belirtilmemişse asıl alana.
- **Tuzaklar:**
  - Scriptteki `$Database` sorguları dili kendiliğinden eklemez; `Parameters` içine `Language` yazılmazsa hep asıl değer gelir.
  - Dil listesinden bir dili silmek veri tabanındaki çeviriyi silmez (silme genel olarak uygulanmaz); uygulama penceresinde yeni dil **Bilgi** sekmesinde `LocalizationCreate`, çok dilli alanın adı/tipi/boyutu değişirse **Uyarı**'da `LocalizationUpdate` satırı çıkar.
  - **Veri** sekmesindeki **Filtre** metin alanlarında çeviri sütunlarını da arar.
- **Kanıt:** `PD:1967-1997` okundu; `LOC:1408, 1692, 1412`; `PD:2299-2301, 2324-2335, 2423-2434` (`Alan_dil` sütunları) okundu; `DBC:43-49, 162-168, 208-253` okundu; `CE:44-53` okundu; `GDQ:162-217` (dil → çeviri sütunu), `GDQ:252-256` (sıralama), `GDQ:292-308` (kriter), `GDQ:560-562` (boş çeviride asıl değer) okundu; `Q:360-372` (arayüz dili eklenir) okundu; `FD:1113-1126, 1456-1493` okundu; `LOC:4815, 4819`; `SDC:305-331` okundu; `DP:61` (script dil eklemez — çıkarım: `DP`'de dil ekleyen satır yok).
- **Nereye:** yeni sayfa önerisi "Çok dilli tablo alanları"; `yerellestirme` sayfasından bağlantı.
- **Önem:** orta (çok dilli kurulumlarda yüksek).

### 1.8 Harici şema: Kaynak Yeri, Bağlantı Adı, Veri Deposu

- **Arayüzde:** **Veritabanları** → şema satırı → **Düzenle**: **Ad**, **Ön Ek**, **Kaynak Yeri** (**Dahili** / **Harici**). **Harici** seçilince **Bağlantı Adı** kutusu açılır. Şemanın **Detaylar**'ında, şema bir veri deposuna bağlanmışsa **Veri Deposu** satırı (salt okunur) görünür.
- **Kısıt:** **Kaynak Yeri** satırı bulut kurulumunda **gösterilmez**; yalnızca kurum içi kurulumda vardır. Bulutta harici şema içeren süreç uygulanırsa şema süreçten çıkarılır.
- **Ne yapar:** Şemanın tablolarını CodEase'in kendi veri tabanında değil, sunucuda tanımlı **başka bir veri tabanı bağlantısında** arar. **Bağlantı Adı**, sunucu yapılandırmasındaki bağlantının adıdır (bağlantı dizesi burada yazılmaz; yöneticinin sunucuda tanımlaması gerekir). Sorgu penceresinde **Hedef Şema** olarak harici şema seçildiğinde sorgu kendiliğinden o bağlantıya yönlenir.
- **Dahili şemadan farkı:**
  - **Değişiklikleri Uygula** harici şemada **tablo oluşturmaz, alan eklemez, değiştirmez**; yalnızca tanımı kaydeder. Tablolar o veri tabanında zaten var olmalı, alan adları ve tipleri elle birebir yazılmalıdır.
  - **Bağlantı Adı** boşsa uygulama hata verir: "External schema … must have a connection string."
- **Kanıt:** `PD:1796-1831` (`ShowOnCloud="false"`, koşullu **Bağlantı Adı**) okundu; `PD:1834-1848` okundu; `LOC:4523, 4807, 4811, 4527, 4531`; `CodEase.Workflow.Web/RPC/Forms.cs:91` (bulutta gizleme) okundu; `PVP:64-97` okundu; `SM:132-144` (harici şemada tablo işlemi yapılmaz) okundu; `FD:1410-1414` + `RPC:46-49` (sorgunun bağlantıya yönlenmesi) okundu.
- **Desteklenen veri tabanı türleri:** kodda üç bağdaştırıcı var: SQL Server, Oracle, PostgreSQL (`CodEase/Data/Access/Adapters/` klasör adları okundu). Harici bağlantının bunlardan hangileriyle sınandığı **doğrulanamadı** (4.3).
- **Nereye:** yeni sayfa önerisi "Başka bir veri tabanındaki tabloları kullanma (harici şema)"; sunucu tarafı için `sunucu-yapisi` ile bağlantı.
- **Önem:** orta (yalnız kurum içi kurulum).

### 1.9 Formül (toplama işlevleri)

- **Arayüzde:** Sorgu penceresinde **Alanlar** tablosunun ve **Kriter** tablosunun **Formül** sütunu.
- **Seçenekler:** **Yok** (varsayılan), **Adet**, **Toplam**, **Ortalama**, **En Küçük Değer**, **En Büyük Değer**, **Tekil Değerlerin Ortalaması**, **Tekil Değerlerin Toplamı**, **Tekil Değerlerin Adedi**.
- **Ne yapar:** Bir alana formül verilince sorgu **özet** döndürür: formülsüz alanlar gruplama anahtarı olur, formüllü alan her grup için hesaplanır. Örnek: `Musteri` (formülsüz) + `Tutar` (**Toplam**) → müşteri başına toplam tutar.
  - **Kriter**'de formül seçilirse koşul grupların **hesaplanmış** değerine uygulanır (toplamı 1000'den büyük müşteriler). Formülsüz kriterler gruplamadan önce uygulanır.
  - **Toplam** ve **Ortalama** (tekil olanları dahil) yalnızca **Tam Sayı**, **Noktalı Sayı** ve **Para** alanlarında çalışır; başka tipte hata: "Invalid formula (…) type for … at column …". **Adet** her tipte çalışır ve tam sayı döner.
  - Aynı alan iki ayrı formülle eklenirse sonuç sütunları `Alan.Formül` adını alır (`Tutar.Sum`, `Tutar.Avg`); **Görünür Metin Formatı**'nda ve eşlemede bu adla anılır.
- **Tuzaklar:**
  - Formül kullanılan sorguda birincil anahtar kendiliğinden eklenmez (eklenseydi her kayıt ayrı grup olurdu). `Id`'yi elle eklerseniz özet bozulur.
  - **Sıralama**'ya eklenen alan da gruplama anahtarı olur.
- **Kanıt:** `FD:722-771, 805-811, 1103-1109` okundu; `LOC:4043, 1740, 4263-4287`; `GDQ:121-146` (tip kuralı, hata metni), `GDQ:190-199` (`Alan.Formül`), `GDQ:396-416` (anahtar eklenmez), `GDQ:284-288, 430-431` (kriterin gruptan sonra uygulanması) okundu; `AA:936-1006` (gruplama, sıralama alanları) okundu. **Para** tipinin sayı sayılması `TypeHelper` okunmadan **çıkarım**.
- **Nereye:** yeni sayfa önerisi "Sorgu penceresi başvurusu" (1.9–1.14 ve 2.7–2.8 birlikte) ya da `veritabani-sorgusu` altında.
- **Önem:** orta.

### 1.10 Karşılaştırma seçeneklerinin tamamı ve Benzer'in joker kuralı

- **Arayüzde:** **Kriter** → **Karşılaştırma**.

| Seçenek | Anlamı |
|---|---|
| **Eşit** (varsayılan) | Değer aynı. |
| **Farklı** | Değer aynı değil. |
| **Benzer** | Metin içinde arama. |
| **Küçük** / **Büyük** | Küçüktür / büyüktür. |
| **Küçük veya Eşit** / **Büyük veya Eşit** | — |

- **Benzer kuralı (formda):** Değerde `*` ya da `%` yoksa "içinde geçen" aranır (`an` → "Ankara", "İzmir Limanı"). `*` yazılırsa yeri belirlenir: `an*` "an" ile başlayan, `*an` "an" ile biten. `%` de aynı işi görür.
- **Scriptte:** `$Database` sorgularında bu çevrim **yapılmaz**; `"Comparison": "Like"` ile `%` işaretini değere kendiniz yazarsınız, `*` joker sayılmaz.
- **`NULL`:** **Eşit** ve **Benzer** ile boş olanlar, **Farklı** ile dolu olanlar gelir; **Küçük / Büyük** türü karşılaştırmalarla hata verir ("Invalid comparison operator for null value"). (Dokümanda yalnızca **Eşit** / **Farklı** yazıyor.)
- "Arasında", "listede" gibi seçenekler arayüzde **yoktur**; aralık iki kriterle (**Büyük veya Eşit** + **Küçük veya Eşit**) kurulur.
- **Kanıt:** `FD:813-857` okundu; `LOC:4047, 4291-4315`; `Q:345-355` (joker çevrimi yalnız formda) okundu; `QP:111-156` (scriptte çevrim yok) okundu; `AA:402-431` okundu.
- **Nereye:** `acilir-liste` → "Birbirine bağlı listeler" ve sorgu başvuru sayfası.
- **Önem:** yüksek (her sorguda kullanılıyor, tam liste hiçbir yerde yok).

### 1.11 Koşul (Ve / Veya) ve Bloklar

- **Arayüzde:** **Kriter** tablosunun son sütunu **Koşul**: **Ve** (varsayılan) / **Veya**. İpucu: bir sonraki kriterle nasıl birleşeceği. Altında kapalı gelen **Bloklar (n)** → **Yeni Blok Ekle**.
- **Ne yapar:** **Koşul**, o satırın **kendisinden sonraki** kriterle bağını belirler. Karışık koşullarda (A **ve** (B **veya** C)) parantez için **Blok** kullanılır: her blok kendi **Kriter** tablosu olan bir parantezdir. Blok satırında **Düzenle** → **Koşul** (bloğun sonraki blokla bağı) ve **Tekrar XPath'i**; blok **Detaylar**'ında iç içe yeni bloklar eklenebilir.
- **Kanıt:** `FD:881-905, 951-1062` okundu; `LOC:1064, 4319, 4323, 4071, 4123`; `GDQ:264-331` okundu.
- **Nereye:** sorgu başvuru sayfası.
- **Önem:** orta.

### 1.12 Yoksayılan Değerler (isteğe bağlı kriter)

- **Arayüzde:** **Kriter** satırı → **Düzenle** → **Yoksayılan Değerler** tablosu ("Kriteri yoksaymak için değerler listesi."). Liste kaynağında ve **Veritabanı Sorgusu** bileşeninde var; script sihirbazında gizli.
- **Ne yapar:** Kriterin o anki değeri listedeki değerlerden birine eşitse kriter **hiç uygulanmaz**. Formdaki bir alana bağlı süzgeci isteğe bağlı yapmak için kullanılır: listeye boş bir satır eklenirse, alan boşken "hepsi" gelir; alan dolunca süzülür. "Tümü" gibi özel bir seçenek değeri de yazılabilir.
- **Scriptte karşılığı:** kriterde `"Properties": { "IgnoreIfEquals": değer }`.
- **Kanıt:** `FD:907-938` okundu; `LOC:4055, 4059`; `GDQ:268-278` okundu; `forms/contents/controls/codemirrorbox.js:117-131` (sihirbazda gizli) okundu; `QP:152-153` okundu. Boş satırın boş alan değeriyle eşleşmesi **çıkarım** (4.6).
- **Nereye:** `acilir-liste` → "Birbirine bağlı listeler".
- **Önem:** orta–yüksek (şu an "alan boşken liste boş geliyor" sorununun çözümü).

### 1.13 Tekrar XPath'i (çoklu değerle süzme)

- **Arayüzde:** **Kriter** satırı → **Düzenle** → **Tekrar XPath'i**; blok satırında da var. Script sihirbazında gizli.
- **Ne yapar:** Yazılan yola uyan **her eleman için** kriter (ya da blok) bir kez çoğaltılır; **Değer**'deki `{{ }}` ifadesi o elemana göre hesaplanır. Formda birden çok satır / çoklu seçim varken "bunlardan herhangi biri" süzgecini kurar: **Tekrar XPath'i** = `Kategoriler/Kategori`, **Değer** = `{{Id}}`, **Koşul** = **Veya**.
  - Yola uyan eleman yoksa kriter sorgudan tümüyle çıkarılır (süzme yapılmaz).
  - Bu elemanlar değiştiğinde (satır eklenip silindiğinde) sorgu yeniden çalışır.
- **Kanıt:** `FD:939-946, 1014-1024` okundu; `LOC:952`; `Q:169-209, 260-333` okundu.
- **Nereye:** sorgu başvuru sayfası.
- **Önem:** düşük–orta. Davranış karmaşık; yazmadan önce canlıda denenmeli (4.7).

### 1.14 Tüm Alanlar İsteniyor mu ? ve boş alan listesi

- **Arayüzde:** Sorgu penceresi → **Parametreler** → **Tüm Alanlar İsteniyor mu ?** — *Evet, tüm alanlar kullanılsın.* (Alt sorguda da var.)
- **Ne yapar:**
  - **Alanlar** listesi **boşsa** tablonun bütün alanları kendiliğinden gelir (boş listede bu yazıyor; metin çevrilmemiş, İngilizce görünür).
  - Listeye alan ekleyince yalnızca onlar gelir. Kutu işaretlenirse listedekilere **ek olarak** tablonun bütün alanları da gelir; ilişkili tablodan birkaç sütun (`Position.Name`) ekleyip asıl tablonun hepsini de almak için kullanılır.
  - Kutu işaretliyken liste kaynağının **Görünür Metin Formatı**, **Değer Formatı** ve **Seçim Eşlemeleri → Kaynak** listelerinde tablonun bütün alanları seçenek olarak çıkar.
- **Kanıt:** `FD:1076-1082, 1495-1512` okundu; `LOC:4111, 4115`; `GDQ:367-378` okundu; `FD:4598-4599, 4621-4622, 4658-4659` okundu.
- **Nereye:** `acilir-liste` ve `veritabani-sorgusu`'ndaki "Alan Ekle" adımına not.
- **Önem:** orta.

### 1.15 Veritabanı Sorgusu bileşeni: Arama Script ve Satır Script

- **Arayüzde:** Bileşen → **Düzenle** → **Script** sekmesi: **Satır Script** ve **Arama Script**. (Çelişki tablosunda "eğitmen ihtiyaç olunca dedi" diye ertelenmiş.)
- **Arama Script:** Sorgu çalışmadan hemen önce, her aramada çalışır. `$Query.AddCriteria(alan, değer, karşılaştırma)` ve `$Query.AddColumn(alan, eşlenenXPath, formül)` ile o aramaya özel kriter / alan ekler (bir sonraki aramada silinip yeniden eklenir). Script `false` döndürürse arama **iptal edilir**. Kullanıcının doldurduğu süzgeç alanlarına göre koşullu kriter kurmak için.
- **Satır Script:** Sorgunun forma eklediği **her yeni satır** için çalışır. `$Row` tablodan gelen kayıt (sütunlar adlarıyla), `$NewChild` forma eklenen satır. Tablodan gelmeyen alanları hesaplayıp doldurmak için. Var olan satıra (tek kayıt kipinde ya da zaten eklenmiş kayıtta) çalışmaz.
- **Kanıt:** `FD:5632-5640` okundu; `LOC:1016, 1144`; `QC:577-603` (arama scripti, `false` → iptal) okundu; `QC:495-504` (`$Row`, `$NewChild`) okundu; `QC:157-180` (yalnız yeni eklenen satırda) okundu.
- **Nereye:** `veritabani-sorgusu` → yeni bölüm.
- **Önem:** orta.

### 1.16 Veritabanı Sorgusu bileşeni: süzgeç alanları, Doğrulama Grubu, Bölüm Adı, Dinamik Kurallar, Veri Olay Adı

- **Süzgeç alanları:** **Otomatik Ara** işaretsizken bileşenin üzerinde **Yeni Ekle** komutu çıkar; bileşenin içine bırakılan alanlar **Ara** düğmesinin **soluna** dizilir ve kullanıcıya arama kutusu olur. Alanlardan birinde **Enter**'a basmak **Ara**'ya basmakla aynıdır. Alanların değerleri kriterde `{{ }}` ile kullanılır. **Otomatik Ara** işaretlenince **Yeni Ekle** kaybolur.
- **Kurallar sekmesi:**
  - **Doğrulama Grubu** ("Arama kriterleri için doğrulama grup adı"): **Ara**'ya basılınca önce bu gruptaki zorunluluk / doğrulama kuralları çalışır; hata varsa arama yapılmaz, uyarılar gösterilir.
  - **Bölüm Adı**: bileşeni görev bazında gizlemek / salt okunur yapmak için form bölümü adı. Bileşen devre dışıyken **Ara** düğmesi çizilmez; çelişki 11'deki "bölüm Kapalı iken düğme kayboluyor" gözleminin karşılığı büyük olasılıkla budur (çıkarım: bölüm durumunun bileşeni devre dışı bıraktığı ayrıca okunmadı).
  - **Dinamik Kurallar**: diğer bileşenlerdeki gibi.
- **Veri sekmesi → Veri Olay Adı** ("Verileri görüntüleyecek arayüzü tetikleyen olay adı."): sorgu sonuçları geldiğinde bu adla bir sayfa olayı yayınlanır; forma gömülü özel HTML / script (grafik gibi) sonuçları bu olaydan alır. Hedef XPath verilmese de çalışır.
- **Kanıt:** `querycontent.designer.js:8-39` (süzgeç alanları, **Yeni Ekle** görünürlüğü) okundu; `QC:388-420` (**Ara**'nın yeri, Enter; devre dışıyken düğme yok) okundu; `FD:5676-5707` okundu; `LOC:1624, 3975, 972, 896`; `QC:571-575` okundu; `FD:5500-5512` okundu; `LOC:5063, 5079`; `QC:453-456` okundu.
- **Nereye:** `veritabani-sorgusu`.
- **Önem:** orta (süzgeç alanları); düşük (Veri Olay Adı).

### 1.17 Veritabanı Sorgusu bileşeni: tek kayıt kipi

- **Ne yapar:** **Öğe XPath'i** tekrarlamayan bir elemanı gösteriyorsa (ya da `.` yazılmışsa) bileşen satır **eklemez**; bulunan kaydın sütunlarını doğrudan o elemanın alanlarına yazar. "Sicil no yazılınca kişi bilgileri dolsun" türü kullanım budur.
  - **Arama Sonuçları** penceresinde onay kutuları yerine satıra tıklayarak tek kayıt seçilir.
  - **Önce Temizle** bu kipte satır silmez; eşlenen alanların değerini boşaltır (alt elemanı olan alanlara dokunmaz).
  - **Otomatik Ara** her açılışta çalışır (2.9'daki "hedef boşsa" koşulu bu kipte hep sağlanır).
- **Kanıt:** `QC:118-137, 464-493, 516-535, 620-634, 431-439` okundu.
- **Nereye:** `veritabani-sorgusu` → "Kayıtların nereye yazılacağı".
- **Önem:** orta–yüksek (sık kullanım; sayfa yalnız çok satırlı kullanımı anlatıyor).

### 1.18 Aynı kayıt ikinci kez eklenmez

- **Ne yapar:** Bileşen bir kaydı forma yazmadan önce hedefte **Satır No XPath'i** (boşsa `Id`) değeri kaydın `Id` sütununa eşit bir satır arar; varsa o kaydı **atlar** (satırı güncellemez de). Kullanıcı **Ara** ile aynı kaydı yeniden seçse de çift satır oluşmaz.
- **Kısıt:** Eşleşme kaydın **`Id` adlı** sütunu üzerinden yapılır. Tablonun anahtarı başka adla tanımlıysa bu koruma çalışmaz ve satırlar yinelenir. `veritabanlari` sayfasındaki "her tabloya `Id` ekleyin" önerisinin bir gerekçesi de budur.
- **Kanıt:** `QC:8, 86, 112-118, 353, 365` okundu.
- **Nereye:** `veritabani-sorgusu` → "Sorgu ne zaman çalışır".
- **Önem:** orta.

### 1.19 `$Database`'in sayfada olmayan işlevleri

Sayfa yalnız `ImportFromXml`, `ExportToXml`, `Get` ve `Each` / `Save`'i anlatıyor. Kodda ayrıca:

| İşlev | Ne yapar |
|---|---|
| `$Database.GetData(şema, tablo, alan, değer)` | Tek koşullu kısa sorgu: `alan = değer` olan kayıtlar, bütün alanlarıyla. |
| `$Database.AddData(şema, tablo, { Alan: değer, … })` | Tek kayıt ekler ve kaydeder; eklenen kaydı döndürür. Alan adlarında büyük-küçük harf önemsiz. |
| `$Database.EnsureData(şema, tablo, alan, değer, değerler, ilkDeğerler)` | `alan = değer` olan kayıt varsa `değerler`'i yazar; yoksa `değerler` + `ilkDeğerler` ile yeni kayıt ekler. Kaydeder. |
| `$Database.DeleteData(şema, tablo, alan, değer)` | `alan = değer` olan kayıtları siler; silinen kayıt sayısını döndürür. **Kademeli Eşle** ilişkileri uygulanır (1.2). |
| `$Database.Empty(sorgu)` | Kayıt okumadan boş bir liste verir; `Add` + `Save` ile toplu ekleme için. |

Dört kısa işlevin başına veri deposu adı yazılan beş parametreli biçimi de vardır (harici şema için; 1.8).

`Get` / `Empty` / `GetData`'nın döndürdüğü liste üzerinde:

| İşlev | Ne yapar |
|---|---|
| `RowCount()` | Kayıt sayısı. |
| `Rows()` | Kayıtların dizisi. |
| `Map(fn)` | `Each` gibi dolaşır, fonksiyonun döndürdüklerini dizi olarak verir. Fonksiyona `(kayıt, sıra)` geçer; `this` de kayıttır. |
| `Add({ … })` | Listeye yeni kayıt ekler (yazmak için `Save`). |
| `DeleteAll()` | Bütün kayıtları silinmek üzere işaretler (yazmak için `Save`). |
| `ToDictionary('Alan')` | Kayıtlara alan değeriyle erişilen bir sözlük verir (`sozluk['K01']`); birden çok alan `,` ile, anahtar ayracı varsayılan `.`. |
| `Columns` | Sütun adları. |
| kayıt üzerinde `Delete()` | O kaydı silinmek üzere işaretler. |

Sorgu nesnesinde sihirbazın üretmediği ama elle yazılabilen alanlar: `"MaxLength": n` (en çok kayıt), `"Start": n` (atlanacak kayıt) — sayfalama; `"Order": [{ "Name": …, "Type": "Descending" }]`; `"Where": { "Criteria": [ { "Name", "Value", "Comparison", "Condition", "Formula" } ], "Blocks": [ … ] }`; `"SubQueries": [ … ]`.

- **Sihirbaz notu:** Kriter **Değer**'ine `{{Yol}}` yazılırsa sihirbaz bunu scriptte `$Xml.Format("{{Yol}}")` olarak üretir; değer script çalışırken form verisinden okunur.
- **Kanıt:** `DP:49-224` okundu; `DTP:129-271, 302-369, 470-476` okundu; `DataRowProxy.cs:64-69` okundu; `DataTableMapProxy.cs:54-64` okundu; `QP:238-291` (`MaxLength`, `Start`, `Order`, `SubQueries`) okundu; `codemirrorbox.js:42-47` (`$Xml.Format`) okundu. Sihirbazın yeniden açılıp kapatıldığında `MaxLength` / `Start`'ı koruyup korumadığı **doğrulanamadı** (4.9).
- **Nereye:** `scriptte-veri-tabani` → yeni bölümler "Kısa işlevler" ve "Sorguyu elle genişletme".
- **Önem:** yüksek (`GetData` / `AddData` / `DeleteData` günlük işler; "tek kayıt sil" şu an dokümanda yok).

### 1.20 Kiracı ayarı: veri tabanı erişiminde yetki denetimi

- **Arayüzde:** Sistem yöneticisinin kiracı (tenant) düzenleme ekranında bir onay kutusu. Etiket çevrilmemiş: "Authorization control is required for database access." Varsayılan: kapalı.
- **Ne yapar (açıkken):** Tarayıcıdan gelen her tablo sorgusu, **o süreçte tanımlı bir sorgu** ile eşleşmek zorundadır ve kullanıcının o ekrana erişimi denetlenir:
  - Süreç tasarımcısından: süreçte tam yetki gerekir.
  - Görev formundan: kullanıcı akışı başlatan ya da görevin atandığı kişi olmalıdır.
  - Başlangıç formundan (dizin ekranı): dizinde okuma yetkisi gerekir.
  - Sorgunun alanları ve tablosu süreçteki tanımdan alınır; tarayıcıdan yalnızca kriter değerleri ve dil kabul edilir. Tanımda olmayan sorgu "Query not found" hatası verir.
- **Kapalıyken:** Oturum açmış her kullanıcının tarayıcısından gelen sorgu olduğu gibi çalıştırılır; hangi tablonun hangi alanlarının okunacağını formdaki tanım belirler, sunucu ayrıca denetlemez.
- **Kanıt:** `Configuration.global/System/EditDomain.xml:2087-2092` okundu (tr çevirisi `LOC`'ta yok); `CodEase.Workflow/Business/DomainProperties.cs:41, 388-389` okundu; `RPC:114-251` okundu; `RPC:59-95` (yalnız kriter / dil alınır) okundu.
- **Nereye:** `sunucu-yapisi` ya da yönetici ayarları sayfası; `veritabanlari`'ndan "tablo verisine kim erişir" başlığıyla bağlantı.
- **Önem:** orta (güvenlik; ekranın menüdeki yeri doğrulanamadı — 4.5).

---

## 2. Dokümanda var ama eksik anlatılmış

### 2.1 Yeni şema: Ön Ek ve diğer kutular — `veritabanlari` "Şemayı sürece alma"

- Sayfa: "**Yeni Şema Ekle**'ye basıp **Ad** ve **Ön Ek** verin."
- Eksik: **Ön Ek** boş bırakılırsa şema adının **ilk üç harfi** ön ek olur. Kurum içi kurulumda aynı pencerede **Kaynak Yeri** de vardır (1.8). Şemanın **Detaylar**'ında **Veri Deposu** satırı görünebilir.
- Ön ekin sonradan değiştirilmesinin etkisi **doğrulanamadı** (4.8); sayfaya "sonradan değiştirmeyin" uyarısı ancak denendikten sonra yazılmalı.
- Kanıt: `PD:1780-1848` okundu; `CodEase/Data/Repository/Schema.cs:133-141` okundu.
- Önem: düşük.

### 2.2 Alan tipleri ve alan ayarları — `veritabanlari` "Alan tipleri"

- **Boyut** sütunu yalnızca **Limitli Metin** satırlarında görünür; diğer tiplerde kutu gizlidir. (`PD:1951-1965` okundu)
- **Noktalı Sayı** virgülden sonra **dört hane** tutar; hassasiyet ayarı yoktur (SQL Server'da; diğer veri tabanı türleri okunmadı). **Para** ayrı bir tutar tipidir. (`Adapters/MSSQL/SqlDataAdapter.cs:55-56, 65-66` okundu)
- **Tarih/Saat** saat dilimi bilgisiyle saklanır. (`SqlDataAdapter.cs:51-52` okundu)
- Alan için **zorunlu, tekil, varsayılan değer, hesaplanan alan** ayarı **yoktur**; birincil anahtar dışındaki bütün alanlar boş bırakılabilir. Zorunluluk formda kurulur. **İndeks** tanımlanamaz. (`PD:1882-1998` — alan satırında yalnız Ad / Tip / Boyut / Diller; `DBC:148-160` okundu)
- **Dosya** tipindeki alanlar **İlk Veri** ve **Veri** sekmelerinde sütun olarak görünmez ve **Filtre**'de aranmaz. (`PD:2472, 2588, 2684` okundu)
- **Limitli Metin / Limitsiz Metin** alan satırının **Düzenle**'sinde **Diller** bölümü vardır (1.7).
- Önem: orta.

### 2.3 İlişkiler — `veritabanlari` "İlişkiler"

- **Kaynak Alan / Hedef Alan** çifti **Kısıtlamalar** bölümünde **Yeni Koşul Ekle** ile eklenir; **birden çok çift** eklenebilir (iki alanla bağlanan tablolar). Sayfadaki tablo bunu tek çift gibi gösteriyor. (`PD:2203-2265` okundu; `LOC:1448, 1700`)
- **Hedef Şema**'nın ilk seçeneği **Şu anki Şema**'dır (boş değer); aynı şemadaki tabloya bağlanırken şema adı seçmek gerekmez. Diğer seçenekler **süreçteki** öbür şemalardır: başka şemadaki tabloya ilişki kurmak için o şema da sürece alınmış olmalıdır. (`PD:2154-2168` okundu; `LOC:2388`)
- **Ad** ve **Hedef Tablo** zorunludur (uyarı metinleri çevrilmemiş: "Relation name is required.", "Target table is required."). (`PD:2066-2075, 2181-2190` okundu)
- **Güncelleme Kuralı** kutusu anlatılmamış (1.2).
- Sorgu penceresindeki alan seçicide ilişkinin yanında tipi kısaltmayla görünür: `(1)` bire bir ve çoka bir, `(1/0)` bir ya da sıfır, `(N)` bire çok. İlişkinin altı açıldığında hedef tablonun **bağ alanı listede çıkmaz** (zaten kaynak alanla aynı değerdedir). Alanlar ve ilişkiler ada göre sıralı gelir, önce alanlar. (`FD:606-657` okundu)
- İlişki tipinin sorguya etkisi yalnızca o ilişki üzerinden bir alan, kriter ya da sıralama **kullanıldığında** ortaya çıkar; ilişkiyi tanımlamak tek başına sorgu sonucunu değiştirmez. (`CE:58-99` okundu)
- İlişki veri tabanında kısıt oluşturmaz; var olmayan bir kayda bağ yazılabilir. (`DBC:84-97` okundu)
- Önem: orta.

### 2.4 Veri sekmesi — `veritabanlari` "Veri sekmesi"

Sayfa: "yazdığınız metni içeren kayıtlar listelenir (en çok 100 kayıt); `*` hepsini getirir."

- Arama yazılanın **türüne göre** alan seçer ve alanları **veya** ile birleştirir:
  - Metin alanlarında "içinde geçen" aranır; `*` yeri belirler (`an*`).
  - Sayıya benzeyen yazı **Tam Sayı / Noktalı Sayı / Para** alanlarında tam eşitlikle aranır.
  - `true` / `false` **Evet/Hayır** alanlarında, içinde `-` olan tarih biçimli yazı **Tarih/Saat** alanlarında, kimlik biçimli yazı **Tekil Tanımlayıcı** alanlarında aranır.
  - `NULL` yazılırsa herhangi bir alanı boş olan kayıtlar gelir.
- **Sonuçları Temizle** düğmesi listeyi boşaltır (kayıtları silmez). Filtre değişince liste baştan dolar; uygulanmamış satır düzeltmeleri bu sırada listeden gider (çıkarım: `PD:2669`).
- Tabloda **Excel'e dışarı aktarma** açıktır, içeri alma kapalıdır (**İlk Veri** sekmesinde de aynı).
- Çok dilli alanlar `Alan_dil` sütunlarıyla görünür (1.7).
- Tabloda **Yetkilendiren** tanımlıysa tasarımcı da yalnız kendi görebildiği kayıtları görür (çıkarım; 1.1).
- Buradan yapılan silme **Kademeli Eşle** ilişkilerini izlemez (1.2).
- Kanıt: `PD:2571-2674` (arama kuralları, 100 sınırı) okundu; `PD:2358-2367` okundu; `LOC:1472`; `PD:2307, 2406` (`AllowImport="False" AllowExport="True"`) okundu.
- Önem: orta.

### 2.5 İlk Veri — `veritabanlari` sekme tablosu

- Sayfa: "Tablo ilk kez oluşturulurken içine konacak kayıtlar." Doğru; eksik olan: tablo **zaten varsa** buraya eklenen kayıtlar veri tabanına **yazılmaz** (yalnızca tanımda saklanır; tablo başka bir ortamda ilk kez oluşturulurken kullanılır). Var olan tabloya kayıt **Veri** sekmesinden eklenir.
- Anahtar boş bırakılırsa ve anahtar **Tekil Tanımlayıcı** ise üretilir; başka tipteyse uygulama hata verir: "Primary key is not specified for initial data."
- Kanıt: `SM:344-357` (yalnız yeni tabloda), `SM:466-478` (var olan tabloda yalnız saklanır), `SM:320-332` okundu.
- Önem: orta (süreci başka ortama taşıyanlar için).

### 2.6 Uygulama penceresindeki satırlar — `veritabanlari` "Değişiklikler ne zaman uygulanır"

Tabloda olmayan satırlar:

| Satır | Sekme | Anlamı |
|---|---|---|
| `TableAuthorizationChange` | Uyarı | Tablonun **Yetkilendiren** alanı değişecek. |
| `LocalizationCreate` | Bilgi | Çok dilli alana yeni dil eklenecek. |
| `LocalizationUpdate` | Uyarı | Çok dilli alanın adı / tipi / boyutu değiştiği için dil sütunları da değişecek. |

- **Birincil Anahtar** başka alana çevrilirse yeni anahtar alanı için `FieldChange` çıkar.
- `TableDelete`, `FieldDelete`, `LocalizationDelete` satırları kodda tanımlı ama süreç uygulanırken hiç üretilmez (silme uygulanmadığı için); sayfaya yazılmamalı.
- Kanıt: `SM:404-416, 480-502` okundu; `DBC:184-253` okundu; `SM:224-240, 419-431` + `PVP:97` okundu.
- Önem: düşük–orta.

### 2.7 Sorgu penceresinde alan ayrıntısı ve Sıralama — `veritabani-sorgusu`, `acilir-liste`

- Alan satırının **Düzenle**'sinde bileşende üç kutu vardır: **Dil** (1.7), **Başlık**, **Eşlenen XPath**. Sayfa iki kutu diyor ("oka basınca iki kutu açılır"). Liste kaynağında yalnızca **Dil** görünür (**Başlık** ve **Eşlenen XPath** gizlidir); script sihirbazında `ImportFromXml` / `ExportToXml` için **Dil** + **Eşlenen XPath**, `Get` için yalnız **Dil**.
- **Sıralama (n)** bölümü kapalı gelir; **Sıralama yapılacak Alan** ile satır eklenir, **Sıralama Tipi**: **Artan** / **Azalan**. Birden çok satır eklenebilir; ilişkili tablo alanıyla da sıralanır. Başlıktaki sayı tanımlı satır sayısıdır (**Bloklar** ve **Alt Sorgular**'da da öyle).
- Sorgu penceresinin **Parametreler** bölümünde **Hedef Şema**, **Hedef Tablo**'nun yanında **Dil Seçeneği Ekle** ve **Tüm Alanlar İsteniyor mu ?** vardır (1.7, 1.14).
- Kanıt: `FD:1112-1155, 1161-1229, 1382-1519` okundu; `LOC:4083, 4131, 4091, 4327, 4331`; `forms/datasources.designer.js:33` (liste kaynağında gizlenen bölümler) okundu; `codemirrorbox.js:117-131` okundu.
- Önem: orta.

### 2.8 Arama Sonuçları penceresi — `veritabani-sorgusu` "Sorgu ne zaman çalışır"

- Pencere kayıtları **10'ar** sayfalar; sütun başlığına göre sıralama isteği sunucuya gider (sorgudaki **Sıralama**'nın yerine geçer).
- Hedef tek kayıtlıksa (1.17) onay kutusu yerine satır seçimi vardır.
- Başlık verilen sütun ilişkili tablodan geliyorsa (`Tur.Ad`) da gösterilir.
- Kanıt: `QC:270-285, 291-337, 620-640` okundu. Sıralamanın arayüzde nasıl tetiklendiği **çıkarım** (tablo bileşeninin kendisi okunmadı).
- Önem: düşük.

### 2.9 Otomatik Ara: açılışta neyin çalıştığı — `veritabani-sorgusu`

- Sayfa hedefte kayıt yoksa çalıştığını doğru yazıyor. Eksik: **Otomatik Ara** işaretliyken bileşen tasarımcıda süzgeç alanı kabul etmez (1.16) ve **Tümünü Otomatik Seç** kutusu **Tasarım** sekmesinden kalkar (zaten hepsi alınır).
- Hedef XPath **boş değil ama bulunamıyorsa** (yanlış yol) açılışta sorgu hiç çalışmaz ve hata da çıkmaz.
- Kanıt: `FD:5534-5552` okundu; `querycontent.designer.js:26-31` okundu; `QC:376, 428-441, 458` okundu.
- Önem: düşük–orta.

### 2.10 Liste seçeneklerinin tarayıcıda bekletilmesi — `acilir-liste`

- **Veritabanı Sorgusu** kaynağının sonucu tarayıcıda **bir dakika** bekletilir: aynı sorgu (aynı kriter değerleriyle) bir dakika içinde yeniden sorulursa tabloya gidilmez. Tabloya yeni eklenen bir seçenek listede en geç bir dakika sonra (ya da sayfa yenilenince) görünür. Ayar ekranı (`ayar-ekrani`) ile seçenek ekleyip hemen başka formda arayanlar için not.
- **Veritabanı Sorgusu** bileşeninin **Arama Sonuçları** penceresi ve tasarımcıdaki **Veri** sekmesi bekletmez.
- Kanıt: `D:496` (liste kaynağı bekletmeli çağırır) okundu; `core/datastore.js:7, 31-51` okundu; `core/cache.js:36-37, 51-55` (60 sn) okundu; `PD:2674` (Veri sekmesi bekletmesiz) okundu. Bileşende bekletme form ayarına bağlı (`QC:327, 550, 624`); varsayılanı **doğrulanamadı**.
- Önem: orta.

### 2.11 Sonuçlar sekmesi kutuları — `acilir-liste`

- **Görünür Metin Formatı** ve **Değer Formatı** serbest metin kutusu değil, sorgudaki alanları `{{Alan}}` biçiminde öneren seçim listeleridir; öneriyi seçmek ya da elle birleşik biçim yazmak mümkündür. Sayfa yalnızca elle yazmayı anlatıyor.
- Aynı sekmede **Seçim Eşlemeleri** (1.4) ve **Hiyerarşi Sütunu** (1.5) vardır.
- Kanıt: `FD:4586-4625` okundu. Seçim listesinin elle yazıya izin verdiği **çıkarım** (dokümandaki `{{Name}} ({{Code}})` örneği videoda çalışmış).
- Önem: düşük.

### 2.12 `ImportFromXml`: silinen satırlar ve ilişkiler — `scriptte-veri-tabani`, `ayar-ekrani`

- "Silinen satırlar" bölümüne eklenecek: tabloda **Kademeli Eşle** ilişkisi varsa silme ilişkili kayıtlara da yayılır (1.2).
- Sorguda **Alt Sorgular** varsa alt kayıtlar da yazılır (1.3).
- Birincil anahtarı **Genel** sekmesinde seçilmemiş tabloya yazma hatası: "Primary key not found on table …". (`SDC:392-393` okundu)
- Önem: orta.

---

## 3. Dokümandaki yanlışlar

| # | Sayfa | Cümle | Doğrusu | Kanıt | Önem |
|---|---|---|---|---|---|
| 3.1 | `veritabani-sorgusu` → "Otomatik Ara her açılışta çalışmaz" | "Kriterinde formdaki bir alanı kullanan sorgu (çift süslü parantezle), o alan değiştiğinde yeniden çalışır." | Yalnızca **Otomatik Ara** işaretliyken böyledir; işaretsizken alan değişse de sorgu çalışmaz, kullanıcı **Ara**'ya basmalıdır. Ayrıca bu yeniden çalışma "hedef boşsa" koşuluna bakmaz: **Önce Temizle** işaretli değilse yeni kayıtlar eskilerin **yanına** eklenir (aynı `Id`'li olanlar dışında). Bağlı sorgularda **Önce Temizle** işaretlenmelidir. | `QC:392-443` okundu (izleme yalnız `autoSearch` dalında kurulur; izleyici doğrudan aramayı çağırır); `QC:464-493` okundu | yüksek |
| 3.2 | `scriptte-veri-tabani` → "Kayıtları scriptte dolaşma: `Get`" | "`Save` listedeki bütün kayıtları günceller." | `Save` yalnızca **değiştirilen**, **eklenen** ve **silinmek üzere işaretlenen** kayıtları yazar; dokunulmayan kayıtlar yazılmaz. | `SDC:402-441` okundu (`Added` / `Modified` → yaz; `Deleted` → sil); `DTP:196-204` okundu | düşük |
| 3.3 | `scriptte-veri-tabani` → "Ekleme mi, güncelleme mi?" | "(tablonun anahtarı sistemin ürettiği türden bir kimlikse; CodEase'te oluşturulan tablolarda böyledir)" | CodEase'te oluşturulan tabloda anahtar kendiliğinden gelmez ve her tipte alan anahtar seçilebilir; üretim yalnızca anahtar **Tekil Tanımlayıcı** seçilmişse olur. (`veritabanlari` sayfası bunu doğru yazıyor; iki sayfa çelişiyor.) Anahtar başka tipteyse ve boşsa kayıt boş anahtarla yazılmaya çalışılır (çıkarım; sonucu denenmedi). | `PD:2011-2015` (anahtar listesi bütün alanlar) okundu; `SDC:134-137` okundu | orta |
| 3.4 | `veritabanlari` → "İlişkiler" | "**Bire Karşılık Bir**" | Arayüzdeki yazım hatalı ve farklı: "**Bire Karşlılık Bir**". Sayfa arayüzdekini birebir verecekse düzeltilmeli; düzgün yazım korunacaksa bir not gerekir (çelişki 86'daki "Deviral" ile aynı durum). | `LOC:2528`, `PD:5379` okundu | düşük |
| 3.5 | `veritabani-sorgusu` → "Sütunları alanlarla eşleştirme" | "Sorgu penceresinde her alanın solundaki oka basınca iki kutu açılır" | Üç kutu: **Dil**, **Başlık**, **Eşlenen XPath** (2.7). Ekran görüntüsü eski bir sürümden olabilir. | `FD:1112-1155` okundu | düşük |

Okuyup **doğru** bulduğum, yeniden bulgu yazmadığım cümleler: beş sekme (`PD:1875-2441`), alan tipi adları (`PD:1905-1944`), hedef alanda yalnız aynı tipin listelenmesi (`PD:2256`), **Bire Karşılık Bir**'de karşılığı olmayan kaydın gelmemesi (`CE:72-76`), 100 kayıt sınırı (`PD:2574`), şema listesinin tarayıcıda bekletilmesi (`core/datastore.js:53-66`), aynı adlı şemanın Import'ta üzerine yazılması (`schemas.js:71-75`), **Görünür Metin Formatı / Değer Formatı** zorunluluğu (`FD:4587-4596, 4610-4619`), `Id` listede olmasa da anahtarın eklenmesi (`GDQ:403-415`), `Map`'in sütun eşlemesinden sonra çalışması (`CodEase/Data/DataTable.cs:253-270`).

---

## 4. Doğrulanamayanlar / canlıda denenmeli

| # | Konu | Neden açık | Nasıl denenir |
|---|---|---|---|
| 4.1 | **Çoka Karşılık Bir** ilişkide **Kademeli Eşle** seçiliyken alt kayıt silinince üst kaydın silinmesi | Kodda silme zinciri ilişki tipine bakmıyor (`SDC:228-283`); sonucu çalıştırarak görmedim. Veri kaybı uyarısı yazılacaksa kesinleşmeli. | Deneme şemasında iki tablo, alt → üst **Çoka Karşılık Bir** + **Kademeli Eşle**; `$Database.DeleteData` ile bir alt kaydı silip üst tabloya bakın. |
| 4.2 | **Yetkilendiren** ile **Arama Sonuçları** sayfalaması | Süzme kayıtlar okunduktan sonra yapılıyor (`GDQ:576-586`); sayfa başına 10'dan az kayıt görünebilir, toplam sayı tutmayabilir. | Yetkilendiren'li tabloda yetkisiz kayıtların çoğunlukta olduğu bir arama. |
| 4.3 | Harici şema: desteklenen veri tabanı türleri, **Bağlantı Adı**'nın sunucuda nerede tanımlandığı, **Ön Ek**'in harici tabloda nasıl kullanıldığı | Üç bağdaştırıcı klasörü var; harici bağlantının kaydı (`PVP:85-89`) okundu ama bağlantı adının hangi yapılandırma dosyasından çözüldüğü okunmadı. Dahili şemada tablo adı ön ek + ad; harici şemada ön ekin boş bırakılması gerekip gerekmediği denenmedi. | Kurum içi deneme sunucusunda ikinci bir veri tabanına bağlantı tanımlayıp harici şema açın. |
| 4.4 | **Hiyerarşi Sütunu**'nda kök düzey | Kök için kriter değeri boş gönderiliyor (`D:181, 492-494`); boş değerin "üstü boş olanlar" olarak mı yorumlandığı okunmadı. | **Ağaç Listesi** + kendi kendine bağlı tablo. |
| 4.5 | Kiracı ayarının (1.20) ekrandaki yeri ve Türkçe arayüzde nasıl göründüğü | Etiket çevrilmemiş; ekranın menüdeki adı aranmadı. | Sistem yöneticisi hesabıyla kiracı düzenleme ekranı. |
| 4.6 | **Yoksayılan Değerler**'e boş satır eklemenin boş alanla eşleşmesi | Karşılaştırma değerlerin tipine bağlı (`GDQ:269-276`); boş metin ile boş satırın eşit sayıldığı denenmedi. Ayrıca formda değeri boş olan kriterin zaten atlanıp atlanmadığı da belirsiz (`Q:178-198`: boş değerde ifade çözülmüyor). | Kriter değeri `{{Musteri/Id}}`, alan boşken liste. İki durumda (boş satır var / yok) deneyin. |
| 4.7 | **Tekrar XPath'i**'nin tam davranışı | Kod karmaşık (`Q:260-333`); **Koşul**'un çoğaltılan kriterler arasında nasıl taşındığı ve bloklarla birlikte kullanımı çalıştırılmadan yazılmamalı. | Çoklu seçimli bir alanla "seçilenlerden herhangi biri" süzgeci. |
| 4.8 | Var olan şemada **Ön Ek**'i ya da şema / tablo / alan **Ad**'ını değiştirmenin sonucu | Tablo adı değişimi `TableRename` olarak işleniyor (`SM:360-365`); ön ek değişiminin eski tabloyu bulup bulamadığı okunmadı. Ad kuralları (Türkçe karakter, boşluk) için kodda bir denetim **bulunamadı**; sayfadaki kural videoya dayanıyor. | Deneme şemasında ön eki değiştirip uygulayın; Türkçe karakterli alan adı deneyin. |
| 4.9 | Script sihirbazının elle yazılmış `MaxLength` / `Start` / `IgnoreIfEquals` değerlerini koruması | Sihirbazın sorguyu geri okuyan ve yeniden üreten kodu bu alanları taşımıyor görünüyor (`Q:440-499, 540-594`); sihirbazla yeniden düzenlenen sorguda kaybolabilirler. | Elle `MaxLength` ekleyip **Query**'ye tıklayın, **Tamam** deyin. |
| 4.10 | **Limitli Metin**'de **Boyut** boş bırakılırsa ne olduğu | Sayfa "zorunludur" diyor; tasarımcıda zorunluluk kuralı yok (`PD:1963`). Sunucuda boyut eksi ise "column size is not specified" hatası var (`AA:437-441`); boş kutunun 0 mı eksi mi gittiği okunmadı. | Boyutsuz Limitli Metin alanı ekleyip uygulayın. |
| 4.11 | Şema listesinde (Import) görünmeyen şemalar | Liste kullanıcının **okuma yetkisi olan** şemalarla sınırlı (`DataStore.cs:176-187`); şemaya yetki veren bir arayüz **bulunamadı**. | — (arayüzü yoksa sayfaya girmez) |
| 4.12 | **Import** düğmesinin Türkçe arayüzdeki yazısı | Kodda etiket "Import" (`schemas.js:46`), sözlükte "Import → İçeri Al" karşılığı var (`LOC:3144`); hangisinin göründüğü ekran görüntüsünden doğrulanmalı. Sayfa "Import" yazıyor. | Ekrana bakın. |
| 4.13 | Alt sorguda **Bire Karşılık Bir yada Sıfır** ilişkisinin yazmada çok satır gibi ele alınması | Okurken tek kayıt (`GDQ:621-624`), yazarken çok satır dalına düşüyor (`DR:323-328`); tutarsızlık olabilir. | Bu tipte ilişkiyle alt sorgulu `ImportFromXml`. |
| 4.14 | Oracle / PostgreSQL kurulumlarında alan tiplerinin karşılıkları (Noktalı Sayı hassasiyeti, Limitsiz Metin) | Yalnız SQL Server bağdaştırıcısı okundu. | — |

Kapsam dışı bırakılıp yalnızca not edilenler:

- **XML Veritabanı Sorgusu** (liste kaynağı ve bileşen): ayrı bir depoyu sorgular; **Depo** (kiracı deposu / süreç deposu), XQuery metni, **Parametreler** (Ad / Değer) ve **Hiyerarşi XPath'i** alanları var (`FD:1520-1591, 4701-4745, 5708-5810`). Ayrı tarama konusu.
- `$Database.Schema(ad)` ile scriptten şema tanımı değiştirme / silme (`DP:226-248`, `SchemaProxy.cs:29-54`): tablo silebildiği için sayfaya girmemesi önerilir.
- Organizasyon düzenleme ekranı HR tablolarını bu sorgu altyapısıyla yönetir (`OrganizationEditor.xml`); kullanıcı / organizasyon taramasının konusu.
