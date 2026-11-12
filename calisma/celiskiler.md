# Video ile kod tabanı arasındaki farklar

Videoda yanlış, eksik ya da belirsiz anlatılıp kod tabanından (`../codEase-master/Src`) düzeltilen noktalar. Sayfada yalnızca doğru davranış yazar; ayrıntı ve kanıt buradadır. Bu dosya siteye girmez.

Kısaltmalar: `PD.xml` = `CodEase.Workflow.Web/Forms/ProcessDesigner.xml`, `WI.cs` = `CodEase.Workflow/Business/Server/Logic/WorkItem.cs`, `LOC` = `Localization.xml`.

## Eğitim 2 – Fatih → `docs/gorev-ayarlari.md`

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 1 | "Rol" görev özellikleri arasında sayılıyor | Rol sağ tık menüsünde değil, sağdaki özellik panelinde | `PD.xml:3382-3401` | düzeltildi |
| 2 | Bilgilendirme: atanan kişiye e-posta gider | Doğru; ama başlangıç görevinde gönderilmez, vekile de gider, şablon seçilebilir | `WI.cs:1801-1802` (asistan doğruladı), `WI.cs:1717` | tamamlandı |
| 3 | İlk hatırlatıcı: "bir kere gidecekti diye hatırlıyorum" (05:47) | Bir kez gider; süre seçenekleri ve özel `gün.saat:dk:sn` biçimi var | `Workers/WorkItemReminder.cs:65-99` (asistan doğruladı), `PD.xml:81-117` | doğrulandı |
| 4 | Tekrarlayan hatırlatıcı: "her gün gider" | İlk hatırlatıcıdan sonra başlar; ilk hatırlatıcı Kapalı ise hiç çalışmaz; en az 30 dk | `WI.cs:785-788`, `WorkItemReminder.cs:69-88` (asistan doğruladı) | düzeltildi |
| 5 | Termin: süre dolunca seçilen aksiyon alınır | Doğru; "Birşey Yapma" seçeneği ve termin e-postası anlatılmamış | `PD.xml:3548-3595`, `WI.cs:540-597, 1884-1916` | tamamlandı |
| 6 | İzleyici: "aksiyon alındığında görmek istiyorum" | Görev atandığında Takip Edilenler listesine düşer, salt okunur; e-posta ayrı kutuya bağlı | `WI.cs:792-804, 1847-1857` | düzeltildi |
| 7 | Rol türleri: "Script, Kimlik, Yönetici bul, Veri" | Arayüzde "Kod" yazar (Script değil); Yönetici Bul'un Veri / Önceki Adım alt seçenekleri var | `PD.xml:1577-1732`, `LOC:2340` | düzeltildi |
| 8 | Rol verilmezse ne olur: anlatılmamış | Süreci başlatana atanır; rol kimseyi bulamazsa hata | `Scripts/WorkItemRoleScriptContext.cs:46-49` (asistan doğruladı), `WI.cs:776-781` | eklendi |
| 9 | Deneme: "süreci kim başlatmışsa bütün görevler ona gelir" | Bir önceki adımı tamamlayana, yoksa başlatana gider (pratikte denemeyi yapan); roller yine çalıştırılır | `WI.cs:642-711, 748-763` | düzeltildi |
| 10 | Form bölümü "Etkin": "her türlü değiştirilebilir" | Düzenlenebilir açılır ama bölümün kendi kuralları yine uygulanır | `forms/widgets.js:447-463`, `rules.js:363-387` | düzeltildi |
| 11 | Form bölümü "Kapalı": sorgu düğmesi kayboluyor | Videoda görülüyor (14:23); kodda düğmenin kaldırıldığı ayrıca doğrulanmadı | — | yalnızca videoya dayanıyor |
| 12 | Yazdırma: "bütün sayfayı gösteriyor" | Yalnızca form yazdırılır; PDF tarayıcının kendi özelliği | `ui/workitem.widgets.js:228-250, 310-348` | düzeltildi |
| 13 | Şablonlar: "biraz karışık, sonra değiniriz" | Sayfada yalnızca ne işe yaradığı yazıldı; şablon yazımı (Standart / XSLT) ayrı sayfa konusu | `PD.xml:4-80` | ertelendi |
| 14 | Sil: göreve bağlı aksiyonları da siler | Doğru; başka görevlerden gelen oklar da silinir | `PDW.js:1920-1973` | tamamlandı |

"asistan doğruladı" yazan satırların kod satırını asistan kendisi açıp okudu; diğerleri alt ajanın raporuna dayanıyor.

## Eğitim 1 – Fatih ve Eğitim 4 – Fatih → yedi sayfa

Ek kısaltmalar: `PVM` = `CodEase.Workflow/Business/Server/Logic/ProcessVersionManager.cs`, `SIB` = `.../Logic/StartInfoBuilder.cs`, `PW` = `CodEase.Workflow.WebApp.Resources/js/codease/workflow/ui/process.widgets.js`, `FW` = `.../ui/folder.widgets.js`, `FD` = `CodEase.Workflow.Web/Forms/FormDesigner.xml`, `JS` = `CodEase.WebApp.Resources/js/codease/forms/`.

### `docs/dizinler-ve-surecler.md`

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 15 | Dizin düğmesi "Yetkililer" | Arayüzde **Yetkiler**; Erişim Kontrol Listesi açar (Okuma / Tümü, İzin Ver / Engelle) | ekran E1F 10:10; `FW:424-469`, `System.xml:4-125` | düzeltildi |
| 16 | Yeni dizin yalnızca ad sorar | Dizin Tipi de sorulur (Uygulama / Doküman) | `FW:75-124` | eklendi |
| 17 | Sil: "bulunduğum dizini siliyor" | Dolu dizin de silinir; alt dizinler, süreçler, versiyonlar ve akışlar birlikte gider | `FolderManager.cs:455-468`, `Database.cs:488-523` | uyarı eklendi |
| 18 | Deneme Durumu: "yalnızca sistem yöneticilerine göster" | Süreçte yazma yetkisi olanlar görür; yönetici denetimi kodda kapatılmış | `SIB:123-139` (asistan doğruladı) | düzeltildi |
| 19 | Arşiv elle yapılır ("1.0.0'ın artık yeri yok, arşive al") | Bir versiyon Aktif yapılınca önceki aktif kendiliğinden arşivlenir; iki aktif olamaz; önce denetim çalışır | `PVM:680-706` (asistan doğruladı) | düzeltildi |
| 20 | "Kapat dedim … değişiklikleri uygula … artık kaydetmiş oldum" | Değişiklikler zaten kendiliğinden taslağa kaydedilir; Uygula taslağı versiyona işler; Geri Al atar | `PVM:333-373, 425-472` | düzeltildi |
| 21 | Aktif versiyonu düzenleme: anlatılmamış | Düzenle'ye basınca versiyon aktiflikten çıkar; Uygula / Geri Al sonrası Deneme Durumu'nda kalır | `PVM:319, 429, 470` (asistan doğruladı) | uyarı eklendi |
| 22 | Kopyala: versiyon no 1.0.1 önerildi (ekran 14:10) | Güncel kod en büyük versiyonun ilk hanesini artırır (1.0.0 → 2.0.0) | `PW:510-514`, `api.js:361-369` (asistan doğruladı) | sayfada "önerilir, değiştirebilirsiniz" yazıldı; **video ile kod farklı** |
| 23 | Versiyon Sil | Aktif olsa da, akışı sürse de siler; akışlar ve görevler de gider | `PVM:587-618` | uyarı eklendi |
| 24 | Aç: "yukarıda görüyorsunuz, salt okunur" | Bant yok; araç çubuğunda kırmızı kilit, tıklayınca açıklama | `PDW:1380-1396`; ekran E1F 12:50 | düzeltildi |

### `docs/veri-modeli.md`

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 25 | "Türkçe karakter kullanılırsa hata veriyor diye hatırlıyorum" | Doğru; kural: İngilizce harf, rakam, `_ . -`; rakam, noktalama ya da `xml` ile başlayamaz. Hata metni Türkçe karakterden söz etmez | `PD.xml:617` (asistan doğruladı), `PD.xml:4615` | tamamlandı |
| 26 | Tipler: bölüm, metin, numara, tarih saat, tarih, saat, ikili değer | Doğru | `PD.xml:627-940` | doğrulandı |
| 27 | Varsayılan Değer, "hedef şemayı şimdilik geçelim" | Varsayılan Değer seçenekleri ve Hedef Şema / Kullan (Tip, Referans) eklendi; **Referans** sayfada anlatılmadı | `PD.xml:627-940` | kısmen eklendi |
| 28 | Seçim listesi için `Id` ve `Name` gerekir | Adlar önemsiz; sıra ve tip belirler (ilk Metin/Numara = değer, sonraki Metin = yazı) | `JS/contents/designer.js:1134-1171` (asistan doğruladı) | düzeltildi |
| 29 | "En az tekrar sayısı": sıfır ya da bir | Yeni akış o kadar boş satırla başlar; en çok sınırı yok; alt sınırın altına silmeyi engellediği **doğrulanamadı** | `complextype.js:151-176` | sayfada yalnızca "en az kaç tane olacağı" yazıldı |
| 30 | Tip değiştirme (Metin → Bölüm) | Bölüm başka tipe çevrilirse alt elemanlar silinir | `PD.xml:1225-1261` | uyarı eklendi |
| 31 | "XML ve [anlaşılmadı] seçenek var" | Düğmeler **XML** ve **Copy** (çevrilmemiş); Deneme Durumu'nda ve Önizleme'de görünür | `JS/contents/root.js:31-67`; ekran E1F 63:20 | düzeltildi |

### `docs/akis-tasarimi.md`

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 32 | Havuz penceresindeki onay kutuları geçildi | Yönetimle İlgili mi ? / Anonim Ulaşılabilir mi ? / adresler açıklandı | `PD.xml:1491-1575`, `SIB:256-267` | eklendi |
| 33 | "Rota yoksa akış orada sonlanır" | Doğru; açık başka görev varsa akış onlar bitince tamamlanır | `WI.cs:1222-1227`, `Instance.cs:332-350` | tamamlandı |
| 34 | Doğrulama Kuralı false ise "süreç burada biter" | Her rota ayrı değerlendirilir; birden çok doğru rota aynı anda açılır; hepsi yanlışsa biter. Boş kural = doğru, sonuçsuz script = yanlış | `RouteScriptContext.cs:16-48` (asistan doğruladı), `WI.cs:725-745, 1192-1218` | tamamlandı |
| 35 | `$xml.count` diye söyleniyor | `$Xml.Count`; büyük-küçük harf önemli; yol Veri Kökü'nden başlar | `XmlProxy.cs:188-197` (asistan doğruladı); ekran E4F 29:15 | düzeltildi |
| 36 | Düzenleyici ifadeyi hatalı gösteriyor, "sanırım bug" (30:00) | Kural çalıştı (31:30–32:30); düzenleyicideki işaretin nedeni araştırılmadı | — | sayfaya girmedi |
| 37 | Kendine dönen rota: "süreç tekrar kendisine dönecek, kaldığı yerden devam edecek" | Görev tamamlanır ve yeniden açılır; İş Sonrası + İş Öncesi Script yeniden çalışır, rol yeniden hesaplanır, bildirim yeniden gider, süreler sıfırlanır | `WI.cs:776-835, 1161-1273` | düzeltildi |
| 38 | `work item.selected action` | `$WorkItem.SelectedAction`; aksiyonun **Ad**'ını verir | `WorkItemProxy.cs:108-119` (asistan doğruladı) | düzeltildi |
| 39 | Başlangıç kutucuğu ne zaman görünür: anlatılmamış | Havuzda form yoksa ya da görev Gizli ise görünmez; Başlangıç Noktası ayarı | `FW:550-553`, `FolderManager.cs:647` | eklendi |
| 40 | Aksiyonların formun üstünde düğme olduğu | Videoda görülüyor (E1F 33:30, E4F 37:42); kodda ayrıca okunmadı | ekran | yalnızca videoya dayanıyor |

### `docs/form-tasarimi.md`, `docs/acilir-liste.md`

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 41 | Otomatik Oluştur "alanları alt alta ekliyor" | Formda bileşen varsa hepsini siler (onay sorar); `Id` adlı elemanları atlar; liste ve tabloyu kendisi kurar | `JS/contents/designer.js:321-464` | uyarı eklendi |
| 42 | Sütun düzenleri: "tek, %50, %33, %25…" | On iki hazır düzen; sütun başına 12'lik ızgarada Genişlik ve Duyarlı Tasarım | `rowcontent.designer.js:42-104`, `FD:3205-3559` | tamamlandı |
| 43 | Etiket alanın özelliği gibi anlatılıyor | Etiket alanı saran satıra (ya da tablo sütununa) aittir | `designer.js:891-910`, `FD:2761-2768` | düzeltildi |
| 44 | Bileşen adı "Radyo Buton" | Kodda başlık "Radyo Büton"; ekranda (E1F 39:05) okunaklı değil | `LOC` | **açık**: sayfalarda "Radyo Buton" yazıldı, arayüzden bakılmalı |
| 45 | Açılır liste için "Seçiniz" satırı eklenmeli | Gerekli değil: **Otomatik Değer Seç** kapatılabilir. Açıkken ilk seçenek kendiliğinden seçilip veriye yazılır | `JS/contents/controls/dropdown.js:55-97` (asistan doğruladı) | iki yol da yazıldı |
| 46 | Veri kaynakları: sabit liste ve veri tabanı sorgusu | Yedi tür | `JS/datasources.designer.js:31-39`; ekran E1F 59:05 | tamamlandı |

### `docs/tablo-duzeninde-icerik.md`, `docs/zorunlu-alanlar.md`

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 47 | Tümünü Sil: "sadece ilk başta olanı geri çevirebiliyor" | Önceden var olan satırlar soluklaşır, tek tek Geri Al ile döner; o oturumda eklenenler hemen gider | `tablecontent.js:28-41`, `iteratingcontent.js:367-384` | düzeltildi |
| 48 | İzin alanına `0` yazılır | Boş ya da `1` = izinli, `0` = kapalı, diğer = XPath koşulu | `iteratingcontent.js:242-271` (asistan doğruladı) | tamamlandı |
| 49 | Sütun eklemek için "Yeni Ekle" | Tabloda düğme **Yeni Sütun Ekle** | `tablecontent.designer.js:28-40` | düzeltildi |
| 50 | Uyarı: "Bu form geçersizdir" | Videodaki pencere "Geçersiz Form"; güncel kodda başlık "Eksik veya Hatalı Bilgi" | ekran E4F 37:42; `workitem.widgets.js:531-549` | **video ile kod farklı**; sayfada iki bilgi de var, görsel eski metni gösteriyor |
| 51 | Boş alan = değer girilmemiş | `0` değeri de boş sayılır | `JS/contents/controls/databoundcontrol.js:62-74` (asistan doğruladı) | uyarı eklendi |
| 52 | Tek grup adı | Noktalı virgülle birden çok grup; aksiyon tarafında boşluk kırpılmıyor | `JS/rules.js:140, 687` | eklendi |
| 53 | Dinamik kurallarda boş grup "her zaman" (ipucu metni) | Koda göre boş gruplu kural yalnızca Doğrulama Grubu boş aksiyonlarda çalışıyor olabilir | `rules.js:57-75` | **doğrulanmadı**, sayfaya girmedi; canlıda denenmeli |

## Eğitim 1 – Veysel → `rol-scriptleri`, `is-oncesi-ve-is-sonrasi-script`, `etikette-hesaplama`; eski sayfalara ekler

Bu video Eğitim 1 – Fatih ile aynı akışı (veri modeli → havuz → form) masraf örneğiyle anlatır; ortak kısımlar yeniden yazılmadı, yalnızca yeni bilgiler eklendi.

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 54 | Rol scripti `return identities` ile biter (anlatım, 27:10) | Ekranda son satır `identities;` (27:28). Sonuç son ifadenin değeridir; üst düzey `return`'ün kabul edildiği **doğrulanamadı** | `ScriptRoot.cs:91-151`; ekran | sayfada son-ifade biçimi yazıldı |
| 55 | "Departman seçersen altındaki pozisyonlara atar, hangisi tamamlarsa tamamlanır" | Doğru; alt departmanlar dahil, tek görev | `MembershipProvider.cs:132-193` (ajan: çıkarım) | yazıldı |
| 56 | `find manager` ikinci parametre pozisyon | `$Membership.FindManager(kimlik, pozisyon?)`, dizi döner | `MembershipProxy.cs:58-87`; `PD.xml:1697-1729` (asistan doğruladı) | yazıldı |
| 57 | `$Initiator` üzerinde "ID, name var" | Yalnızca Id, Name, Type, Domain; e-posta ve sicil `GetProperty` ile | `IdentityProxy.cs:73-83` | tamamlandı |
| 58 | `GetProperty` users tablosundan okur, ilişkiyle employee'ye geçer | Doğru; hazır adlar da var (`EMailAddress`, `RegistryNumber`…). Tablo / ilişki anlatımı sayfaya girmedi (iç yapı) | `MembershipProxy.cs:37-56` (asistan doğruladı), `UsersContext.cs:400-417` | yazıldı |
| 59 | XPath'te kök adını "yazmaya gerek yok" | Yazılırsa script hata verebilir ("Root element name is detected in the xpath."); denetim kodda geçici diye işaretli | `InstanceScriptContext.cs:63-76` (asistan doğruladı) | "yazmayın" diye yazıldı |
| 60 | `SetValue` olmayan alanda ne yapar: anlatılmamış | Sessizce hiçbir şey yapmaz | `XmlProxy.cs:621-679` | uyarı eklendi |
| 61 | Termin "1 saniye sonra OK ile tamamla" | Biçim geçerli (`00:00:01`); gerçek gecikme yaklaşık bir dakika, çalışma takvimine bağlı | `PD.xml:81-116`, `WorkItemManager.cs:554-568` | `gorev-ayarlari`'na eklendi |
| 62 | Deneme Durumu'nda tarihçe gerçek atananı gösterir | Doğru (ajan: sunucu kodundan çıkarım). Eski sayfadaki "görmek için Aktif yapmanız gerekir" cümlesi yanlıştı | `WI.cs:642-711` (asistan 690-711'i okudu) | `gorev-ayarlari` düzeltildi |
| 63 | — | `gorev-ayarlari`'ndaki "Deneme Durumu: yalnızca yöneticiler" satırı #18 ile çelişiyordu | `SIB:123-139` | düzeltildi |
| 64 | Etikette `{{sum(Expense/Amount)}}` | Doğru; XPath, Geçerli Konum'a göre; ipuçlarında çalışmaz. `iif`, `format` işlevlerinin parametreleri okunmadı | `core/literal.js:1-420` | yazıldı; ayrıntı ertelendi |
| 65 | Değerlendirme: "10 dakikada bir, pazartesi günleri çalıştır" | Takvim XML olarak yazılır; script aksiyonu `$WorkItem.SelectedAction` ile seçerse görev ilerler. Haftalık kuralın gün alanları tam okunmadı | `PD.xml:3220-3285`, `TaskEvaluator.cs` | **sayfaya girmedi**; eğitmen de "cepte kalsın" diyor |
| 66 | Talimatlar e-postanın gövdesinde | Doğru (varsayılan şablonda); başlangıç kutucuğunda da görünür | `Localization.xml:5321-5333`, `folder.widgets.js:518-525` | yazıldı |

### Sayfaya girmeyenler (Eğitim 1 ve 4 – Fatih)

- **Sol menüdeki iş listeleri (E1F 06:30–09:00):** `docs/is-listeleri.md` olarak yazıldı. Eğitmen "Tüm Bekleyenler, Gelenler ile aynı" diyor; kodda fark var (`WorklistQueryBuilder.cs:102-141`). "Taşınan görev Gelenler'den çıkar" bilgisi ajanın `TagManager.cs:247-271` okumasından **çıkarım**; taşıma düğmesinin arayüzdeki adı ve davranışı canlıda denenmeli. "Önemli"nin nasıl işaretlendiği videoda da kodda da bakılmadı.
- **Veritabanı Sorgusu ve İş Sonrası Script ile kayıt (E4F 15:30–23:20):** Hedef XPath / Öğe XPath'i / Eşlenen XPath, Önce Temizle. Konunun başı Eğitim 3'te; o video elde yok. Kod notları ajan raporunda (L maddesi) vardı, sayfa Eğitim 3 ya da veri tabanı videoları işlenince yazılacak.
- **Giriş (E1F 00:00–05:00):** BPM/ERP tanıtımı; ürün belgesine girmedi.

## Eğitim 8 – Fatih → `script-kutuphaneleri`; `is-oncesi-ve-is-sonrasi-script`, `acilir-liste`, `tablo-duzeninde-icerik`, `form-tasarimi` sayfalarına ekler

Kırpma `1058:514:14:118`. Yalnızca ilk 51 dakika konuşma; sonrası sessiz çalışma.

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 67 | Kütüphane fonksiyonu sonucu doğrudan değişkene alınıyor (`var id = $Services.Libraries.String.getTaskOwnerId({...})`) | Sürecin sürümüne göre değişir: yeni süreçlerde çağrı Promise döndürür (`.then`), eskilerde doğrudan değer. Hangi sürümden itibaren olduğu alt-asistan raporuna dayanıyor (tanım sürümü ≥ 4) | `WebServiceProxy.cs:173-183` (asistan doğruladı: `SupportPromiseReturn`) | yazıldı; iki biçim de sayfada → SORULAR 17 |
| 68 | Parametre gövdede nasıl okunur — videoda net söylenmiyor | Başına `$` konarak (`$taskOwner`); sonuç gövdenin son ifadesi | `WebServiceOperationExtension.cs:87-91`, `ScriptContext.cs:145` (asistan doğruladı) | yazıldı |
| 69 | Fonksiyon görev scriptindeki `$Xml` vb. nesneleri kullanabilir mi — videoda yok | Görev scriptinden çağrıldığında aynı script ortamında çalışır; nesneler görünür | `WebServicesProxy.cs:161-185` (asistan doğruladı) | yazıldı |
| 70 | `$Xml.SelectAll(yol, function(){ this… })` | Doğru; `this` o anki eleman, fonksiyona `(eleman, sıra)` da geçer | `XmlProxy.cs:873-894` (asistan doğruladı) | yazıldı |
| 71 | `throw` ile değer ekranda görülür | Yalnızca Deneme Durumu'nda ya da aksiyonda "İşlemi Takip Et" işaretliyse ekrana düşer; her şey geri alınır, görev açık kalır | `WorkItem.cs` ~1010-1040 (asistan doğruladı) | yazıldı (koşul eklendi) |
| 72 | `console.log` | Çıktı, tetikleyen kullanıcının tarayıcı konsoluna gider | alt-asistan raporu | yazıldı |
| 73 | Excel'den yapıştırınca seçim alanında yazı kalıyor, Id boş | Seçim Listesi'nde yalnızca "Yeni Eklemeye İzin Ver" işaretliyse yazı korunur | alt-asistan raporu | yazıldı |
| 74 | Excel İçeri Al / Dışarı Aktar | Veri sekmesi → "Excel İçeri/Dışarı Alma"; içeri alma yapıştırma penceresiyle, sütunlar sıraya göre eşleşir | alt-asistan raporu + ekran (E8F 03:00–08:00) | yazıldı |
| 75 | Müşteriye göre proje listesi: Kriter değeri `{{Musteri/Id}}` | Doğru; yol listenin bağlı olduğu konuma göre, alan değişince liste yenilenir | alt-asistan raporu | yazıldı |
| 76 | Koşullu İçerik | Kurallar → Koşul; XPath, bileşenin konumuna göre | alt-asistan raporu | yazıldı |

Sayfaya girmeyenler (Eğitim 8): `$Database.ImportFromXml` ile tablo satırlarını veri tabanına yazma (42:45 karesi; veri tabanı sayfasına ertelendi), eşleştirme algoritması (Levenshtein, CodEase'e ait değil), 51. dakikadan sonrası (sessiz).

## Eğitim 2 – Fatih (17:07–20:00) → `yerellestirme`

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 77 | Dil eklenince çeviri tablosu geliyor | Tablo dil satırındaki "Detaylar" ile açılır | `localizationeditor.js:26,49` (alt-asistan) + ekran 19:46 (Düzenle/Detaylar görünüyor) | yazıldı |
| 78 | Boş çeviri kutuları kırmızı (zorunlu izlenimi) | Yalnızca biçimlendirme (kırmızı arka plan); boş kaydedilir, boş çeviri dosyaya yazılmaz, çalışırken özgün metin görünür | `localizationeditor.js:80-86`, `Language.cs:49-53` (asistan doğruladı) | yazıldı |
| 79 | Çalışırken hangi dil — videoda yok | Akış başlatılırken başlatanın dili akışa yazılır; form ve e-postalar akışın dilinde | `WorkItem.cs:1505`, `Instance.cs:759`, `ProcessingTransactionMessages.cs:38-75` (asistan doğruladı) | yazıldı → SORULAR 9c |
| 80 | Metin değişince çeviri — videoda yok | Satırlar özgün metne göre eşleşir; değişen metnin çevirisi silinir | `localizationeditor.js:236-285` (asistan doğruladı) | yazıldı |
| 81 | "Elle eklediğiniz metinler, sabit listeler burada görünür" | Doğru; tür listesi geniş (TaskName, ActionName, Label, Literal, Template…); süreç adı yok | `ProcessDefinition.cs:179-292` (alt-asistan) | yazıldı; az kullanılan türler (Html, Xsl, XPath, Variable, DashboardName) sayfaya alınmadı |

Sayfaya girmeyenler: `$Localization` nesnesi (script; çevirisi boş anahtarda hata veriyor — ayrıntılı, eğitimde yok), dil eşleşmesinde `tr-TR` → `tr` düşüşü, Custom satır ekleme.

## Bereket – Script Eğitimi – Veysel → `veritabani-sorgusu`, `dinamik-kurallar`, `form-scripti`, `scriptte-veri-tabani`, `kosullu-yonlendirme`, `islem-sirasi-ve-hatalar`; eski sayfalara ekler

Müşteri ortamında çekilmiş (adres çubuğunda müşteri alan adı, sol menüde müşteri dizinleri, tarihçede kişi adları). Tam ekran 1920x1040; uygulama alanı y=72'den başlar. Yalnızca tasarım ekranları kullanıldı; sorgu penceresinde şema/tablo adı bulanıklaştırıldı. Dökümde iki mola sonrası konuşma kayıptı; `ek1-dk.txt` (67–81 dk) ve `ek2-dk.txt` (114–124 dk) ayrı döküldü.

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 82 | Hedef XPath verilmezse bileşenin bağlı olduğu yer hedef olur | Hedef XPath bileşenin içinde durduğu elemana göre çözülür (Bağlı XPath'e göre değil); boşsa o eleman | `querycontent.js:376` (alt-asistan) | yazıldı ("içinde durduğu yere göre") |
| 83 | Otomatik Ara: hedefte eleman yoksa ya da hepsi sistemin eklediğiyse çalışır | Doğru: `count = 0` ya da `count = count[@State='Default']` | `querycontent.js:428-438` (asistan doğruladı) | yazıldı |
| 84 | Eşlenen XPath boşsa aynı adlı alana yazar; bulunamazsa hata vermez | Doğru | `querycontent.js:190-212` (alt-asistan) | yazıldı |
| 85 | "Koşullu İçerik yalnızca koşulundaki XPath'i dinler, Biçimlendirme Kuralı her değişiklikte çalışır; o yüzden pahalı" | İkisi de her veri değişikliğinden 100 ms sonra aynı geçişte yeniden hesaplanır | `root.js:133-147` (asistan doğruladı), `conditionalcontent.js:8-25` (alt-asistan) | performans iddiası sayfaya alınmadı; seçim ölçütü işleve göre yazıldı → SORULAR 9d |
| 86 | Seçenek adı "Devral" | Arayüzde "Deviral" | Localization.xml:4343 + ekran 41:20 | sayfada arayüzdeki gibi "Deviral" → SORULAR 9e |
| 87 | Dinamik Doğrulama Kuralı true dönerse hata | Doğru. Grup adı boş kural, grubu olan aksiyonda çalışmıyor görünüyor (ipucu tersini söylüyor) | `rules.js:57-74,182-186` (alt-asistan) | yazıldı ("boş bırakmayın"); SORULAR 6 zaten açık |
| 88 | `console.info/error/warning` | `console.warn` (warning değil). `console.log` tarayıcıya debug düzeyinde düşer. Çıktı yalnızca eşzamanlı işlemede tarayıcıya gelir; arka planda işin Log sekmesine | `ProxyConsole.cs:42-58`, `ProcessingTransactionScope.cs:274-289` (alt-asistan) | yazıldı; Eğitim 8 metni düzeltildi |
| 89 | `bind` / `live` | `$Xml.Bind` / `$Xml.Live` (büyük harfle); `this` bağlanılan eleman | `xmlproxy.js:174-197` (alt-asistan) | yazıldı |
| 90 | ImportFromXml: önce update, olmazsa insert; Id yoksa üretir | Doğru; üretim yalnızca GUID anahtarda | `SaveDataContext.cs:134-137,464-468` (asistan doğruladı: update→insert) | yazıldı |
| 91 | Özel eşleştirme: map fonksiyonu, this = satır, parametre = XML elemanı; sütun eşleştirmesini ezer | Doğru; `Map` sorgunun en üst düzeyinde | `query.js:486-487`, `DataTableProxy.cs:402-405` (asistan doğruladı) | yazıldı |
| 92 | Otomatik Seçim Scripti: iş öncesinden sonra, rolden önce, sırayla; true dönen aksiyonla tamamlanır; iş öncesi ve sonrası çalışır | Doğru; `Sıralama`ya göre, boş script atlanır | `WorkItem.cs:814-832,889-894` (asistan doğruladı) | yazıldı |
| 93 | Aksiyon gizlenince — videoda yok | Gizli aksiyonda Sıralama ve Doğrulama Grubu alanları panelden kalkar | `PD.xml:4331-4388` (alt-asistan) | uyarı olarak yazıldı |
| 94 | Aktifte asenkron, denemede ve İşlemi Takip Et'te senkron | Doğru | `WorkItem.cs:1016-1036` (asistan doğruladı) | yazıldı |
| 95 | "Görev hata state'ine geçer" | Hataya geçen arka plan işidir; görev tamamlanmış ama işlenmemiş kalır. Ekran adı "Arkaplan İş Yöneticisi" | `Worker.cs:73-79`, `JobManager.xml:950-955` (alt-asistan) | yazıldı |
| 96 | Ctrl + Düzenle / Aç ile süreç XML'i | Doğru (Shift de olur); pencere "Versiyon İçeriği"; kayıttan sonra Değişiklikleri Uygula gerekir | `process.widgets.js:640-654`, `ProcessVersionManager.cs:332-372` (alt-asistan) | yazıldı; ortamlar arası taşıma denenmedi → SORULAR 9f |
| 97 | "Test modda görev hep başlatana düşer" | Önceki doğrulama: süreçte yazma yetkisi olanların listesinde görünür (çelişki tablosu, Eğitim 2) | — | yeni sayfalara alınmadı; `gorev-ayarlari` değişmedi |

Sayfaya girmeyenler: Satır Script / Arama Script / hiyerarşi ayarları (eğitmen "ihtiyaç olunca" dedi), form scriptiyle stil ekleme, `$Database` diğer işlevleri, `substr`/`substring` JavaScript anlatımı, tarihçe ekran görüntüsü (kişi adları ve müşteri menüsü var).

## Bereket – Veritabanı Eğitimi – Veysel → `veritabanlari`; `rol-scriptleri`, `acilir-liste`, `veri-modeli`, `tablo-duzeninde-icerik` sayfalarına ekler

Müşteri ortamı (Bereket – Script ile aynı önlemler). 16:00–23:30 arası müşteri verisi üzerine konuşma; kullanılmadı. 74:00–76:00'da sunucu masaüstü ve iç makine adları görünüyor; kullanılmadı.

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 98 | Tabloda alan/tablo/şema silmek gerçekte silmez | Doğru; tasarımcı hep "birleştirme açık" kaydeder, silme yalnızca birleştirme kapalıyken | `SchemaManager.cs:224-240`, `ProcessVersionPublisher.cs:97` (asistan doğruladı) | yazıldı |
| 99 | İki süreç aynı şemayı kullanıyorsa eski kopya yeni tanımı ezer | Doğru: aynı adlı ilişki silinip süreçtekiyle değiştirilir; alan adı/tipi/boyutu süreçtekine çekilir; her uygulamada süreçteki bütün şemalar işlenir | `SchemaManager.cs:509-530,546-551`, `ProcessVersionPublisher.cs:64-97` (asistan doğruladı) | yazıldı (uyarı bölümü) |
| 100 | Öneri: işin bitince şemayı süreçten sil | Riski kaldırır; bedeli: sorgu pencerelerinde şema/tablo listeleri yalnızca süreçteki şemalardan dolar. Seçenek: yeniden Import (kopyayı günceller) | `schemas.js:71-76`, `FormDesigner.xml:1410,1444` (alt-asistan) | üç yol birlikte yazıldı → SORULAR 9h |
| 101 | Kayıt eklemede pencere çıkmaz; güncelleme/silmede sayı gösterir | Doğru: `n RowUpdate`, `n RowDelete` Uyarı sekmesinde | `SchemaManager.cs:442-464` (alt-asistan) + ekran 159:00 (BSV) | yazıldı |
| 102 | "Her tabloda Id var, sistem üretir" izlenimi | Tabloya kendiliğinden alan gelmez; birincil anahtar Genel sekmesinden seçilir; yalnız Tekil Tanımlayıcı anahtar boşsa üretilir | `SchemaManager.cs:318-332` (alt-asistan) | yazıldı (Id ekleyin önerisiyle) |
| 103 | "Pozisyon derken Positions tablosundaki Id değil, OrganizationUnitPositions Id'si" | Positions.Id de kimlik olarak tanınıyor; atama anında üyesi olan departman-pozisyon satırlarına açılıyor | `MembershipProvider.cs:163-169` (alt-asistan) | sayfaya tablo ayrıntısı alınmadı; pozisyon "belirli departmandaki pozisyon" diye tanımlandı |
| 104 | Pozisyona/gruba atanan görev üzerinde bekler | Doğru; iş listesi kullanıcının o anki üyeliklerine göre sorgulanır, 2 dk önbellek | `WorklistQueryBuilder.cs:88-91`, `MembershipProvider.cs:347-361` (alt-asistan) | yazıldı |
| 105 | Görünür Metin / Değer Formatı çift süslü parantezle | Doğru; ikisi de zorunlu | `FormDesigner.xml:4598-4622`, `data.js:413-414` (alt-asistan) + ekran 71:00 | yazıldı |
| 106 | Birden çok kaynak birleştirilir | Doğru, tanım sırasıyla; aynı değerli öğe tekilleşir | `data.js:160-190,303-319` (alt-asistan) | yazıldı |
| 107 | Kriterde `NULL` | Doğru; Eşit/Benzer → boş, Farklı → dolu; diğer karşılaştırmalar hata | `AbstractAdapter.cs:406-428` (alt-asistan) | yazıldı |
| 108 | Mevcut versiyonda modele alan eklenirse eski akışlarda bileşen kırmızı: "This field has invalid xpath" | Doğru; metin sabit İngilizce, ipucu olarak. Akışlar versiyonun güncel tanımını okur | `widgets.js:310,825`, `Instance.cs:66-77` (alt-asistan) | yazıldı |
| 109 | Hata ayrıntısı sunucuda `logs` altında web error / web fatal | Varsayılan yapılandırmada klasör `_logs_`, dosyalar `web.Error.txt`, `web.Fatal.txt` | `Configuration.global/nlog.config` (alt-asistan) | yazılmadı; sunucu kurulum sayfalarına ertelendi |
| 110 | Kriter değerindeki yol, bileşenin bağlı olduğu elemanın bir üstüne göre | Önceki doğrulamayla aynı (çelişki 75) | — | `acilir-liste` zaten böyle |

Sayfaya girmeyenler: Yetkilendiren (satır düzeyi yetki), Güncelleme Kuralı (Aksiyon Alma / Kademeli Eşle), Alt Sorgular, Seçim Eşlemeleri, Hiyerarşi Sütunu, çok dilli alanlar, Harici şema — eğitimde anlatılmadı; Atılay videosunda geçerse eklenecek. Eğitmenin veri modeli gruplaması ve çift yönlü bağlama anlatımı (00:00–04:00, 56:00–58:00) eski sayfalarda var.

## CodEase Eğitim – Atılay, Veri Tabanı (22.04.2022) → `ayar-ekrani`; `tablo-duzeninde-icerik`, `scriptte-veri-tabani` sayfalarına ekler

Şirket içi eğitim ortamı (Zoom kaydı, 1280x720; ekran payı küçük). Sol menüde kişi adlı klasörler ve sağda katılımcı adı var: yalnızca tasarımcı/form alanı kırpıldı. 00:00–05:00 bir katılımcının sorununu giderme (adı bir harf farklı iki şema: yanlış şemaya bakılıyordu); sayfaya alınmadı.

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 111 | `Global` şemasında `Lookups` / `LookupData` tabloları "ortak alan" | Ürünle gelmiyor; kodda bu tabloları tanımlayan ya da özel işleyen bir şey yok. O ortamda açılmış | arama sonucu (alt-asistan) | "ürünle hazır gelmez" diye yazıldı → SORULAR 9j |
| 112 | Id kolonu listeden çıkarılınca da yinelenen kayıt oluşmadı; eğitmen nedenini bulamadı | Birincil anahtar listede yoksa sorguya kendiliğinden eklenir; kolon adıyla satırdaki `Id`'den okunur; önce güncelle, yoksa ekle | `GetDataQueryContext.cs:403-415` (asistan doğruladı), `SaveDataContext.cs:435-448` (alt-asistan) | `scriptte-veri-tabani` zaten böyle yazıyor |
| 113 | Satır scriptinde "new child" | Değişken `$NewChild`; yalnız bileşenin kendi eklediği satırlarda çalışır, sorgudan gelenlerde çalışmaz | `iteratingcontent.js:436-441` (asistan doğruladı), `querycontent.js:157-178` (alt-asistan) | yazıldı (`$NewChild`) |
| 114 | Lookup modelde tutulup sorgu kolonu getirmeyince alan boşaldı | Doğru: sorgu yeni elemanı şemadan tam oluşturur, yalnız getirdiği kolonları doldurur; boş alan geri yazılır | `querycontent.js:157-215` (alt-asistan) | "Sık yapılan hatalar"a yazıldı; sayfa `Map` yolunu öneriyor |
| 115 | Silme anlatılmadı | Formda silinen (tablodan okunmuş) satır `State="Deleted"` kalır; ImportFromXml kaydı siler | `DataRow.cs:392-398` (asistan doğruladı), `tablecontent.js:12-41` (alt-asistan) | yazıldı (video dışı ek) |
| 116 | Yeni grubun `Id`'si | Kayıtta üretilen kimlik XML'e geri yazılmaz; aynı kayıtta eklenen tiplerin `Parent`'ı boş kalır. Tablo `Satır No XPath'i` doluysa yeni satıra formda kimlik verilir | `iteratingcontent.js:431-434` (asistan doğruladı), `SaveDataContext.cs:128-141` (alt-asistan) | yazıldı (video dışı ek); **çalıştırılarak denenmedi** → SORULAR 9k |
| 117 | "Kulakçık": satırın altında açılan alan | Arayüzde adı yok; ok düğmesinin ipucu "Genişlet". Tasarımda ok hep görünür, çalışırken yalnız alan doluysa | `tablecontent.js:213-226` (asistan doğruladı) | "satırın altında ayrıntı alanı" diye yazıldı |
| 118 | `//ExpenseType` daha yavaş ve denetimsiz | Standart XPath; çalışır | `DataTable.cs:274-290` (alt-asistan) | yazıldı |
| 119 | `../../Id` ve `ancestor::ExpenseGroup/Id` | İkisi de çalışır; kolon yolu eşlenen elemana göre | `DataRow.cs:278-296` (alt-asistan) | yazıldı |
| 120 | Kriterde `Lookup.Code`, değerde `{{Id}}` | Doğru; `{{…}}` bileşenin bağlı olduğu düğüme göre (satır içi alanda satır) | `Expression.cs:16-57`, `querycontent.js:535` (alt-asistan; bağlam çıkarım) | yazıldı |
| 121 | Form açıkken model değişirse form görmez | Dolaylı kanıt (örnek veri bir kez üretilip saklanıyor) | `designer.js:166-179` (alt-asistan) | videodaki gibi yazıldı |
| 122 | Rotasız aksiyon akışı bitirir; aynı göreve dönen aksiyon formu yeniden açar | Doğru (başka açık iş yoksa) | `WorkItem.cs:1188-1227` (alt-asistan) | yazıldı |

Düzeltme: `Satır No XPath'i` tablonun **Veri** sekmesinde (`FormDesigner.xml:1631-1640`, `IteratingContent.Data`), `Satır Script` **Diğer** sekmesinde.

## CodEase Sunucu Kurulum 1 ve 2 → `sunucu-kurulumu`, `sunucu-yapisi`

Bir müşteri sunucusunda çekilmiş: ekranda ve konuşmada müşteri alan adı, sunucu adı, kişi adları, parolalar ve yazılan e-postalar var. **Görüntü kullanılmadı**; sayfada alan adı `sirket.com`, kiracı `demo`, kullanıcı `codease` diye yer tutucu yazıldı; parola yazılmadı. Kurulum 2'de 19:30–22:30 özel konuşma, 53:00–56:30 lisans üretimi (iç araç) ve sohbet, 66:00–70:00 e-posta yazdırma (döküm 68:00'den sonra yinelemeye girmiş; yeniden dökülmedi, içerik yok). Kurulum 1'de 48:30–49:30 yeniden döküldü (`ek1.txt`), kayıp anlatım yok.

| # | Videoda | Kodda | Kanıt | Durum |
|---|---|---|---|---|
| 123 | Şablon adları "web global config", "configuration.global", agent "…exe.global", "nlog.global" | `Web.Global.config`, `Configuration.global\`, `CodEase.Workflow.Agent.exe.global.config`, `nlog.global.config`; Static'te `Web.Global.Site.config` / `Web.Global.App.config` ve `configuration.global\` | `codease.proj:201-218,254-277,343-353` (alt-asistan) | yazıldı |
| 124 | workflow.config: "name", "use SSL", "Static URL (U'su büyük)", "sistem admin" | Öznitelikler camelCase: `name`, `useSSL`, `staticUrl`, `systemAdmin`, `connectionName`; `staticUrl` şablonda yok | `Configuration.global/workflow.config:3` (asistan doğruladı), `ApplicationElement.cs:29,152,158` (alt-asistan) | koddaki yazımla yazıldı |
| 125 | `{0}` yerine istek yapan tenant gelir | Doğru; `http` ile başlamıyorsa şema `useSSL`'e göre eklenir | `Application.cs:642-669` (alt-asistan) | yazıldı |
| 126 | Günlükler "logs" klasöründe | `_logs_`; `web.<Düzey>.txt`, `agent.<Düzey>.txt`, günlük arşiv | nlog şablonları (alt-asistan) | yazıldı (çelişki 109 da burada kapandı) |
| 127 | BaseX ayrıca indirilip kuruldu, nssm ayrıca kopyalandı, pencereyle servis yapıldı | Derleme betiği pakete `Tools\BaseX` (8.5.3, `nssm.exe` dahil) koyuyor; kurulum aracı `nssm install Basex java -cp …BaseX.jar -Xmx512m org.basex.BaseXServer` çalıştırıyor | `codease.proj:454-479`, `ConfigurationContext.cs:18-47` (asistan doğruladı) | paket içindeki BaseX + komut satırı yazıldı → SORULAR 9m |
| 128 | Redis komutu videoda arandı | `redis-server.exe --service-install redis.windows.conf` | `ConfigurationContext.cs:57` (asistan doğruladı) | yazıldı |
| 129 | Agent `-i`, `-c`, `-r`; `-r` uygulama adı, domain, e-posta, parola sorar | Doğru; ayrıca `-u`, `-rf`, `-ds`, `-enc`, `-dec`, `-license` | `Program.cs:24-108,188-259` (asistan doğruladı) | `-i -u -c -r` yazıldı; diğerleri yazılmadı → SORULAR 9m |
| 130 | Servis adı "CodEase" | Görünen ad **CodEase Agent**, hesap NetworkService | `ProjectInstaller*.cs` (alt-asistan) | yazıldı |
| 131 | Ayrılmış tenant adları; `reservedDomains=""` ile kaldırılır | Doğru; varsayılan liste www, codease, static, img, my, mail, blog, schemas, serverstat, internal, private, developer(s), docs, faq, support | `ApplicationElement.cs:176` (asistan doğruladı) | yazıldı |
| 132 | Tenant düzeyi veri tabanında elle 5 → 10 yapıldı | Standard=5, Developer=10; süreç geliştirme Developer ve üstü. `domainDefaultLevel` ayarı var (varsayılan Standard) | `DomainLevel.cs`, `ProcessManager.cs:141`, `ApplicationElement.cs:74` (asistan doğruladı) | tabloyu elle değiştirme **yazılmadı**; sorun gidermede "desteğe danışın" → SORULAR 9n |
| 133 | Lisans dosyası Web\Configuration'a konur, servis açılışta "yutar" | Doğru: `license.xml` içe alınır ve silinir | `LicenseManager.cs:43-53` (asistan doğruladı) | yazıldı |
| 134 | İki bağlantı da aynı veri tabanına verildi | Şablonda iki ayrı veri tabanı (`DB`, `DB_REPO`); ikisi de olur | `connectionStrings.config` (asistan doğruladı) | ikisi de yazıldı |
| 135 | Yeni tenant için "tablo sayısı en az olan" veri deposu seçilir | Seçim kuralı kodda **bulunamadı** (aranmadı denecek kadar kısa bakıldı) | — | "sistem birini seçer" diye yazıldı |
| 136 | Tablolar ilk çalıştırmada oluşur | Doğru: `CreateTables/Upgrade/CreateIndices` | `Database.cs:106-119` (alt-asistan) | yazıldı |
| 137 | E-posta yokken davet bağlantısı veri tabanındaki ileti tablosundan alındı | — | ekran (SK2 64:00) | **yazılmadı** (sistem tablosuna elle bakma) → SORULAR 9n |
| 138 | Makine anahtarı IIS'te üretilip dosyaya yapıştırılır | Doğru; dosya biçimi `validationKey/decryptionKey`, Web ve Agent aynı dosyayı okur | `machinekey.config` (asistan doğruladı), `app.config:10` (alt-asistan) | yazıldı |

Videoda olmayan ama kodda görülen: `CodEase.Configuration.exe install|configure|upgrade` kurulum aracı (şablon kopyalama, makine anahtarı, Redis/BaseX servisleri, IIS). Alt-asistan araçta üç olası hata gördü (Agent servisini `6KareAgent` adıyla araması dahil); çalıştırılmadı. Sayfaya alınmadı → SORULAR 9m.

## Sayfaya girmeyenler (Eğitim 2 – Fatih)

- **Yerelleştirme (17:07–20:00):** yazıldı (`docs/yerellestirme.md`, çelişki 77–81). Eski not: Kodda dil listesinin tanımı bulunamadı; hangi dillerin sunulduğu videodaki ekrandan alınabilir.
- **Formda bölümün yerini değiştirme (01:20–02:03):** kes / yapıştır ile; form tasarımı sayfasına gider.
- **13:50–15:25:** eğitmen bir alanın neden kızardığını çözemiyor, "sonradan bakarız" diyor. Dokümana girmedi.
