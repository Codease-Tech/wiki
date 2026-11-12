# Script olanakları: kod taraması (2026-11-12)

Kapsam: süreç tasarlayanın yazdığı scriptler. Kod tabanı `../codEase-master/Src` ile `docs/` altındaki sekiz sayfa (is-oncesi-ve-is-sonrasi-script, rol-scriptleri, script-kutuphaneleri, form-scripti, scriptte-veri-tabani, islem-sirasi-ve-hatalar, kosullu-yonlendirme, etikette-hesaplama) karşılaştırıldı. `calisma/celiskiler.md`'de "yazıldı / eklendi" denenler yeniden bulgu olarak yazılmadı. Doküman sayfalarına dokunulmadı. Bu dosya siteye girmez.

**Kanıt kısaltmaları**

| Kısaltma | Yol |
|---|---|
| `FX/` | `Src/CodEase.Framework/Scripting/Execution/` |
| `WS/` | `Src/CodEase.Workflow/Business/Server/Logic/Scripts/` |
| `WL/` | `Src/CodEase.Workflow/Business/Server/Logic/` |
| `JS/` | `Src/CodEase.WebApp.Resources/js/codease/forms/` |
| `WJS/` | `Src/CodEase.Workflow.WebApp.Resources/js/codease/workflow/` |
| `LOC` | `Src/Localization.xml` |
| `PD.xml` | `Src/CodEase.Workflow.Web/Forms/ProcessDesigner.xml` |

**Kanıt düzeyi**

- **okundu**: satırı kendim açıp okudum.
- **imza**: yalnızca işlevin imzasını (ad, parametreler, dönüş tipi) okudum; gövdeyi okumadım. Davranış sütunu boşsa bu yüzdendir.
- **çıkarım**: koddan doğrudan görülmüyor, okunanlardan sonuç çıkardım. Sayfaya girmeden önce canlıda denenmeli.

"Dok." sütunu: **var** = sekiz sayfadan birinde anlatılıyor, **ad** = yalnızca adı geçiyor, **yok** = geçmiyor.

---

## 1. Script yerleri × nesneler

### 1.1 Scriptin yazılabildiği yerler

Sunucuda çalışanlar (akış tarafı):

| # | Yer (arayüzdeki ad) | Nerede yazılır | Ne zaman çalışır | Sonuç nasıl kullanılır | Dok. | Kanıt |
|---|---|---|---|---|---|---|
| S1 | İş Öncesi Script | Görev | Görev oluşurken | Sonuç kullanılmaz | var | `WL/WorkItem.cs:496-506` okundu; ad `LOC:577+` okundu |
| S2 | İş Sonrası Script | Görev | Görev tamamlanınca | Sonuç kullanılmaz | var | `WL/WorkItem.cs:508-518` okundu |
| S3 | Rol Scripti | Rol | Görev atanırken | Kimlik / dizi / id metni | var | `WS/WorkItemRoleScriptContext.cs:19-53` okundu |
| S4 | Doğrulama Kuralı (rota) | Rota | Aksiyondan sonra, her rota için | Doğru / yanlış (bkz. 3. bölüm, tuzak) | var | `WS/RouteScriptContext.cs:16-48` okundu |
| S5 | Otomatik Seçim Scripti | Aksiyon | İş Öncesi'nden sonra, rolden önce | Doğru sayılan her değer aksiyonu seçer | var | `WS/ActionRuleScriptContext.cs:17-29` okundu |
| S6 | Değerlendirme | Görev | Zamanlanmış olarak, görev beklerken | Script `$WorkItem.SelectedAction` atarsa görev o aksiyonla tamamlanır; atamazsa yapılan her şey geri alınır | **yok** (çelişki 65: bilerek ertelendi) | `WL/WorkItem.cs:520-530`, `WL/Workers/WorkItemEvaluate.cs:69-106` okundu |
| S7 | **Açılış Scripti** | Havuz (süreç ekranında **Scriptler**) | Akış başlarken, başlangıç görevinin İş Öncesi Script'inden **önce** | Sonuç kullanılmaz | **yok** | `WL/Instance.cs:263-273, 831-835` okundu; ad `LOC:577+` (Open Script → Açılış Scripti) okundu; `WJS/designer/processdesigner.widgets.js:2497-2500` okundu |
| S8 | **Kapanış Scripti** | Havuz | Akış normal yoldan tamamlanınca | — | **yok** | `WL/Instance.cs:275-287, 408-410` okundu |
| S9 | **Sonlandırma Scripti** | Havuz | Akış sonlandırılınca (terminate) | — | **yok** | `WL/Instance.cs:289-301, 404` okundu |
| S10 | **Yürütme Scripti** | Havuz | Bir görev işlendikten sonra; aynı işlem içinde akış başına **bir kez** | — | **yok** | `WL/Instance.cs:315-330`, `WL/WorkItem.cs:1230`, `WL/ProcessingTransactionInstances.cs:76-84` okundu |
| S11 | Kütüphane fonksiyonu gövdesi | Web Servisleri → Kütüphaneler | Çağrıldığında | Son ifadenin değeri | var | `WL/../Services/WebServiceOperationExtension.cs:19-113` okundu |
| S12 | **Modül görevi: Otomasyon → Script** | Görev tipi Modül / Automation | Görev işlenirken ve her değerlendirmede (ilk çağrının tam anı okunmadı) | Script aksiyon seçmezse görev bekler | **yok** | `WL/AutomationModuleHandler.cs:16-36` okundu; `PD.xml:3959-3968` okundu |
| S13 | **Modül görevi: Event → Handle Script** | Görev tipi Modül / Event | Olay tetiklendikten sonra | Boşsa ilk aksiyon seçilir; doluysa script aksiyon seçmek zorunda. Ek değişken `$Handlers` (olayı karşılayan görevlerin id dizisi) | **yok** | `WL/EventModuleHandler.cs:46-63` okundu; `PD.xml:4007-4017` okundu |
| S14 | **Modül görevi: EventListener → Handle Script** | Görev tipi Modül / EventListener | Dinlenen olay geldiğinde | Boşsa ilk aksiyon. Ek değişken `$Input` (olayın verisi, `$Xml` gibi kullanılır) | **yok** | `WL/EventListenerModuleHandler.cs:34-63` okundu; `PD.xml:4038-4049` okundu |

S7–S10 için arayüz adları yerelleştirme dosyasından okundu; ekranda görülmedi (canlıda bakılmalı).

Tarayıcıda çalışanlar (form tarafı):

| # | Yer | Ek değişkenler | Sonuç | Dok. | Kanıt |
|---|---|---|---|---|---|
| C1 | Form scripti (Formlar → Script) | `$Form` (bkz. 2.20) | kullanılmaz | var (`$Form` yok) | `JS/contents/root.js:154-168` okundu |
| C2 | Dinamik kural: Doğrulama Kuralı | — | doğruysa hata gösterilir | var (başka sayfa) | `JS/rules.js:175-188` okundu |
| C3 | Dinamik kural: Biçimlendirme Kuralı | — | doğruysa kural uygulanır | var (başka sayfa) | `JS/rules.js:296-312` okundu |
| C4 | Satır Script (tablo / tekrarlayan içerik) | `$NewChild` | — | var (başka sayfa) | `JS/contents/iteratingcontent.js:191, 439-441` okundu |
| C5 | Satır Script (Veritabanı Sorgusu bileşeni) | `$NewChild`, **`$Row`** (sorgudan gelen kayıt) | — | **yok** (`$Row`) | `JS/contents/querycontent.js:360, 495-502` okundu |
| C6 | Arama Script (Veritabanı Sorgusu bileşeni) | **`$Query`**: `AddColumn(sütun, xpath, formül)`, `AddCriteria(sütun, değer, karşılaştırma)` | `false` dönerse arama yapılmaz | **yok** | `JS/contents/querycontent.js:361, 577-596` okundu |
| C7 | **Kullanıcı Seçim Scripti** (aksiyon) | — | Kullanıcı aksiyona bastığında tarayıcıda çalışır; `false` (ya da yanlış sayılan bir değer) dönerse aksiyon **alınmaz**; hiçbir şey dönmezse alınır | **yok** | `WJS/ui/workitem.widgets.js:199-212` okundu; ad `LOC:577+` (User Select Script → Kullanıcı Seçim Scripti); `WJS/designer/processdesigner.widgets.js:2040` okundu |
| C8 | Veri kaynağı: Script (açılır liste vb.) | `$Parent` | Dizi döner; her eleman bir seçenek | **yok** (bu sekiz sayfada) | `JS/data.js:1065-1095` okundu |
| C9 | Düğme bileşeni: Handle Script | `$e` (tıklama olayı) | — | **yok** | `JS/contents/controls/button.js:16, 42-54` okundu |
| C10 | Html bileşeni içindeki `<script>` | `$Html` (bileşenin ekrandaki öğesi) | — | **yok** | `JS/contents/controls/Html.js:47-54, 119` okundu |
| C11 | Özel bileşen: Initialize Script | `$Container`, `$Disabled` | — | **yok** | `JS/contents/controls/widget.js:16-30` okundu |

### 1.2 Hangi nesne nerede var

✔ = var, — = yok, (boş) = var ama içi boş / sahte.

| Nesne | S1 S2 S6 S12–14 (görev scriptleri) | S3 S4 S5 (rol, rota, otomatik seçim) | S7–S10 (havuz scriptleri) | S11 kütüphane: görev scriptinden çağrılınca | S11 kütüphane: formdan çağrılınca | C1–C11 (tarayıcı) |
|---|---|---|---|---|---|---|
| `$Xml` | ✔ | ✔ | ✔ | ✔ (çağıranınki) | (boş: `<root/>`) | ✔ (tarayıcı sürümü) |
| `$WorkItem` | ✔ | ✔ | — | ✔ | (sahte: Id sıfır) | — |
| `$Instance` | ✔ | ✔ | ✔ | ✔ | — | — |
| `$Initiator` | ✔ | ✔ | ✔ | ✔ | — | — |
| `$Membership` | ✔ | ✔ | ✔ | ✔ | ✔ | — |
| `$Database` | ✔ | ✔ | ✔ | ✔ | ✔ | — |
| `$Services` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (tarayıcı sürümü, gerçek Promise) |
| `$Localization` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| `$Messages` | ✔ | ✔ | ✔ | ✔ | ✔ | — |
| `$Calendar` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (yeni süreçlerde; eskilerde adı `$Calendar2`) |
| `$Files`, `$Documents`, `$Rest`, `$Crypto`, `$Delegation`, `$Domain`, `$ActivityStream`, `$XmlRepository`, `$Market` | ✔ | ✔ | ✔ | ✔ | ✔ | — |
| `$Templates` | ✔ | ✔ | ✔ | ✔ | — | — |
| `$HttpClient` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (tarayıcı sürümü) |
| `$Cache`, `$SAP`, `DateTimeOffset`, `Promise`, `NewId()`, `Wait()` | ✔ | ✔ | ✔ | ✔ | ✔ | — (`DateTimeOffset` tarayıcıda ayrı bir sınıf olarak var; okunmadı) |
| `Script` (`Script.NewId()`, `Script.Isolated()`) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (yalnız `NewId`) |
| `console` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (tarayıcının kendi konsolu) |
| `$TestMode`, `$Priority`, `$Culture` | ✔ | ✔ | ✔ | ✔ | — | — |
| `$Process` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Süreç **Değişkenler**'i (`$<Ad>`), `$FolderName`, `$FolderPath`, `$Calendar_HoursInDay` | ✔ | ✔ | — | ✔ | — | ✔ |
| `$Request` | — | — | — | — | ✔ | — |
| `$Complete` | — | — | — | — | — | ✔ |
| `alert`, `window`, `document`, jQuery | — | — | — | — | — | ✔ |

Kanıt (hepsi okundu): motor düzeyi nesneler `FX/ScriptContext.cs:23-50`; süreç düzeyi `WS/WorkflowScriptContext.cs:30-64`; akış düzeyi `WS/InstanceScriptContext.cs:29-57`; görev düzeyi ve değişkenler `WS/WorkItemScriptContext.cs:39-58`, `WL/WorkItem.cs:1289-1350`; kütüphanenin formdan çağrılması `WS/WebServicesScriptContext.cs:28-46`; kütüphanenin görev scriptinden çağrılması `WS/WebServicesProxy.cs:161-189`; tarayıcı `JS/scripting/script.js:37-71`.

Notlar:

- `$Variables` diye bir nesne **yok**. Süreçte tanımlı her değişken kendi adıyla gelir: adı `Limit` olan değişken scriptte `$Limit`'tir. Görev, değişkenin değerini kendi **Değişkenler** penceresinden ezebilir (`WL/WorkItem.cs:1293-1313` okundu). Aynı değişkenler form tarafındaki scriptlerde de vardır (`WL/WorkItem.cs:1434`, `JS/scripting/script.js:59-62` okundu).
- Eski sürümde oluşturulmuş süreçlerde (tanım sürümü 4'ten küçük) sunucuda hem `$Calendar` (doğrudan değer döner) hem `$Calendar2` (Promise döner) vardır; yeni süreçlerde yalnız `$Calendar` vardır ve Promise döner (`WS/WorkflowScriptContext.cs:40-48` okundu).
- `$File`, `$Files`'ın eski adıdır; ikisi de çalışır (`WS/WorkflowScriptContext.cs:59-61` okundu).
- Sunucuda ayrıca `WebClient` adında bir tür açık; kod notu "eskidi, `$HttpClient` kullanın" diyor (`FX/ScriptContext.cs:32-34` okundu). Sayfaya alınması önerilmez.

---

## 2. Nesne nesne üye listesi

### 2.1 `$Xml` (ve `SelectAll` / `SelectSingle` içindeki `this`)

Sunucu: `FX/XmlProxy.cs` (tamamı okundu). Tarayıcı: `JS/scripting/xmlproxy.js` (tamamı okundu). Yol verilmeyen çağrılar elemanın kendisi üzerinde çalışır.

| Üye | Davranış ve tuzak | Sunucu | Tarayıcı | Dok. | Kanıt |
|---|---|---|---|---|---|
| `Evaluate(yol?)` → metin | Değeri metin olarak verir. | ✔ | ✔ | var | `XmlProxy.cs:210-214` |
| `EvaluateNumber(yol?)` → sayı | Boş alanda ne döndüğü (0 mı, NaN mı) **doğrulanamadı**. | ✔ | ✔ | var | `:216-220` |
| `EvaluateBoolean(yol?)` → doğru/yanlış | XPath koşulu değerlendirmek için: `$Xml.EvaluateBoolean('Amount > 500')`. | ✔ | ✔ | yok | `:232-236` |
| `EvaluateDateTime(yol?)` → tarih nesnesi ya da `null` | Alan boşsa / tarih değilse `null`. Dönen nesne için bkz. 2.17. | ✔ | ✔ | yok | `:222-228` |
| `Count(yol?)` → tam sayı | Yol verilmezse: silindi işaretli olmayan alt elemanların sayısı. | ✔ | ✔ | var | `:177-197` |
| `Sum(yol?)` → sayı | Aynı; yol verilmezse alt elemanların toplamı. Sayı olmayan değer varsa sonucun ne olduğu **doğrulanamadı**. | ✔ | ✔ | var | `:199-208` |
| `IsEmpty(yol?)` | Değer boş metinse doğru. Olmayan yolda da doğru (çıkarım: olmayan yol boş metin verir). | ✔ | ✔ | var | `:262-268` |
| `Equals(yol, değer)` / `Equals(değer)` | Alanın **metin** değerini verilen değerle karşılaştırır. Tuzak: sayı ile karşılaştırma yanlış döner (`Equals('Adet', 5)` yanlış; `'5'` yazın). | ✔ | ✔ | yok | `:238-260` |
| `HasNode(yol)` | Yola uyan eleman varsa doğru. | ✔ | — | var | `:920-926` |
| `SelectSingle(yol, fn?)` → eleman ya da `null` | Fonksiyon verilirse bulunan elemanla çağrılır (`this` ve ilk parametre). Bulunamazsa `null`; ardından `.Evaluate()` çağırmak hata verir. | ✔ | ✔ | var (`null` tuzağı yok) | `:896-918` |
| `SelectAll(yol, fn?)` → dizi | Fonksiyon bir değer döndürürse dizide eleman yerine o değer yer alır (`map` gibi kullanılabilir). Fonksiyona `(eleman, sıra)` geçer. | ✔ | ✔ | var (dönüş değeri yok) | `:872-894` |
| `SetValue(yol, değer)` / `SetValue(değer)` | Yola uyan **bütün** elemanlara yazar. `null` / `undefined` boş metin olarak yazılır. Yalnız basit değer kabul eder (metin, sayı, doğru/yanlış, tarih, kimlik); nesne ya da dizi verilirse hata: "Invalid value type … Only primitive types accepted". Kimlik (`$Initiator`) doğrudan verilebilir. | ✔ | ✔ | var (çoklu yazma ve tip tuzağı yok) | `:621-646`, `FX/ScriptingNavigatorExtensions.cs:12-38` |
| `SetDefaultValue(yol, değer)` / `SetDefaultValue(değer)` → dizi | Yalnız boş olanlara yazar. | ✔ | ✔ | var | `:648-679` |
| `AppendChild(yol, fn?)` → yeni eleman | Veri modeline göre alt elemanlarıyla birlikte oluşturur; fonksiyon yeni elemanla çağrılır (`this`). Dönen elemana `SetValue` ile yazılır. | ✔ | ✔ | var (dönüş ve `fn` yok) | `:714-739` |
| `Remove(yol?)` → silinenlerin dizisi | Yol verilmezse elemanın kendisini siler. | ✔ | ✔ | var | `:764-784` |
| `Clone(fn?)` → kopya | Elemanın bağımsız bir kopyasını verir (form verisine eklenmez). | ✔ | ✔ | yok | `:741-762` |
| `Copy(kaynakYol, hedef)` | Kaynak elemanın içeriğini hedefe (yol ya da eleman) kopyalar. Kaynak ya da hedef bulunamazsa hata. | ✔ | ✔ | yok | `:467-504` |
| `Sync(yol, elemanDizisi, anahtarFn?, silinenler?)` → dizi | Yoldaki satırları verilen diziyle eşitler: eşleşen güncellenir, olmayan eklenir, fazlası silinir. | ✔ | ✔ | yok | `:786-847` |
| `CommitDeletes()` | "Silindi" işaretli bütün alt elemanları gerçekten kaldırır. (Formda silinen satır veride işaretli kalır; bkz. çelişki 115.) | ✔ | ✔ | yok | `:506-510` |
| `GetAttribute(ad)` → metin | | ✔ | ✔ | yok | `:701-705` |
| `SetAttribute(ad, değer)`, `SetAttributeNS(ns, ad, değer)` | | ✔ | ✔ | yok | `:681-699` |
| `EnsureAttribute(ad, değer)` | | ✔ | — | yok | `:604-608` |
| `RemoveAttribute(ad)` | | ✔ | ✔ | yok | `:610-619` |
| `LocalName()` → metin | Elemanın adı. | ✔ | — | yok | `:85-89` |
| `OuterXml(xml?)`, `InnerXml(xml?)` → metin | Parametresiz okur, parametreyle değiştirir. | ✔ | ✔ | yok | `:512-532` |
| `Parse(xmlMetni)` → eleman | Metinden bağımsız bir XML elemanı üretir. Bozuk XML hata verir. | ✔ | ✔ | yok | `:97-121` |
| `Escape(metin)` → metin | XML'e güvenle konabilecek biçime çevirir. | ✔ | — | yok | `:123-127` |
| `Format(şablon, seçenekler?)` → metin | `{{…}}` ifadeli bir şablonu bu elemana göre doldurur (etiketlerdeki sözdizimi). Seçenekler: `Culture` ve şablonda `$ad` ile okunacak ek değerler. | ✔ | ✔ | yok | `:270-287`, `FX/ScriptRoot.cs:270-293` |
| `FormatAll(yol, ayırıcı, şablon, seçenekler?)` → metin | Yola uyan her eleman için şablonu doldurup ayırıcıyla birleştirir. | ✔ | — | yok | `:289-293` |
| `Transform(xslt, parametreler?)` → metin | XSLT 1.0, 2.0 ve 3.0 uygular. | ✔ | ✔ | yok | `:413-465` |
| `Assert(yol, mesaj, ayrıntıYol?)` | Koşul yanlışsa mesajla hata fırlatır (`throw` kısayolu). | ✔ | ✔ | yok | `:160-175` |
| `Validate(fn)` | Yalnız `Parse` ile üretilmiş elemanlarda; şemaya uymayan her yer için `fn(düzey, mesaj)` çağrılır. `$Xml` üzerinde çağrılırsa hata verir. | ✔ | — | yok | `:137-158` |
| `LookupNamespaceURI`, `LookupPrefix`, `AddNamespace`, `RemoveNamespace` | Ad alanlı XML (web servis yanıtı) ile çalışırken. | ✔ | ✔ | yok | `:932-968` |
| `Save(xquery?, hedefYol?)`, `Load(xquery, parametreler?, koleksiyon?)` | XML deposuna yazma / depodan okuma. Bkz. 2.16. | ✔ | — | yok | `:974-1043` |
| `Trigger()` | Sunucuda hiçbir şey yapmaz (tarayıcı scriptleriyle uyum için var). Tarayıcıda değişiklik olayını tetikler. | ✔ (boş) | ✔ | yok | `:129-133`; `xmlproxy.js:170-172` |
| `Insert(yol, xml)`, `DeleteSelf()` | Eskimiş diye işaretli; `AppendChild` / `Remove()` kullanılmalı. | ✔ | `DeleteSelf` | yok | `:534-582, 707-712` |
| `Bind(yol, fn)`, `Live(yol, fn)` | Yalnız tarayıcı. | — | ✔ | var | `xmlproxy.js:174-197` |
| `GetParent()` → eleman | **Yalnız tarayıcı.** Sunucu scriptinde yoktur; üst elemana `SelectSingle('..')` ile çıkılır. | — | ✔ | yok | `xmlproxy.js:82-87` |
| `AppendChildXml(xml, öncekiEleman?)` → eleman | Yalnız tarayıcı. | — | ✔ | yok | `xmlproxy.js:218-223` |

Tarayıcı ile sunucu arasındaki farklar (aynı script iki yerde aynı çalışmayabilir):

- Tarayıcıda `Remove` tek eleman sildiğinde dizi değil eleman döndürür (`xmlproxy.js:147-152` okundu).
- Tarayıcıda `Assert`'in ayrıntı yolu ters koşulla eklenmiş: ayrıntı yolu **verilmediğinde** eklemeye çalışır (`xmlproxy.js:229-241` okundu). Sayfada `Assert`'in üçüncü parametresi anlatılmamalı.

### 2.2 `$WorkItem`

`WS/WorkItemProxy.cs` (tamamı okundu). "Yazılabilir" özelliklere atama yalnız görev henüz tamamlanmamışken yapılabilir; tamamlanmış görevde (örnek: `$WorkItem.Previous`) atama "erişim engellendi" hatası verir (`:33-37`).

| Üye | Davranış ve tuzak | Dok. | Kanıt |
|---|---|---|---|
| `Id` → metin | Görevin kimliği. | yok | `:39-43` |
| `TaskId` → metin | Şemadaki görev tanımının kimliği. | yok | `:50-54` |
| `Name` → metin | Görevin adı. | yok | `:195-202` |
| `Caption` → metin, **yazılabilir** | İş listesinde görünen başlık; scriptten değiştirilebilir. | yok | `:204-217` |
| `Instructions` → metin, **yazılabilir** | Talimatlar; scriptten değiştirilebilir. | yok | `:219-232` |
| `State` → metin | Görevin durumu. | yok | `:234-238` |
| `Start`, `End` → tarih nesnesi | `End` görev bitmediyse `null`. | yok | `:73-92` |
| `SelectedAction` → metin, **yazılabilir** | Seçilen aksiyonun **Ad**'ı; seçilmediyse `null`. Atama yapılabilir (Değerlendirme ve modül scriptlerinde aksiyon seçmek için). Olmayan ad hata verir: "Specified action … not found for task …". | var (yazılabildiği yok) | `:108-137` |
| `CompletedBy` → kimlik ya da `null` | Otomatik geçilen görevde `null`. | var (`null` yok) | `:61-71` |
| `AssignedTo` → kimlik dizisi | Görevin atandığı kimlikler. | yok | `:267-277` |
| `Previous` → görev ya da `null` | Başlangıç görevinde `null`. | var | `:253-263` |
| `Instance` → akış | `$Instance` ile aynı türden nesne; başka bir görevin akışına ulaşmak için. | yok | `:96-106` |
| `Data` → `$Xml` türünden eleman | O görevin form verisi (`$WorkItem.Previous.Data` gibi). | yok | `:240-249` |
| `IsDeadlined` → doğru/yanlış | Termin dolduysa doğru. | yok | `:139-143` |
| `DeadlineDate` → tarih nesnesi ya da `null`, **yazılabilir** | Termin tarihini scriptten belirleme / kaldırma (`null`). | yok | `:145-168` |
| `NextReminder` → tarih nesnesi ya da `null`, **yazılabilir** | Sonraki hatırlatma zamanı. | yok | `:170-193` |
| `ChildInstances` → akış dizisi | Bu görevden başlatılan alt akışlar. | yok | `:615-622` |
| `Get(id)` → görev | Kimliği verilen görev. Geçersiz kimlik ya da bulunamayan görev hata verir. | yok | `:280-293` |
| `Search(filtre)` → görev dizisi | Filtre alanları: `number` (akış no), `state`, `start: {begin, end}`, `end: {begin, end}`, `assignedTo`, `caption`. Sonuç sınırı ve yetki davranışı okunmadı. | yok | `:624-654` |
| `Process(aksiyon?, async?, tamamlayan?)` → sonraki görev id'lerinin dizisi | Görevi scriptten tamamlar. Aksiyon verilmez ve seçili de değilse hata. `async` doğru verilmezse aynı işlem içinde hemen işlenir. | yok | `:295-309` |
| `ProcessWorkItem(id, aksiyon, async?, tamamlayan?)` | Başka bir görevi kimliğiyle tamamlar. | yok | `:311-317` |
| `Forward(hedefKimlik, şimdikiKimlik?)` → görev | Görevi başka kimliğe(lere) **devreder**. Hedef geçersizse hata. | yok | `:326-338` |
| `Delegate(...)` | `Forward`'ın eski adı. | yok | `:319-324` |
| `Terminate(sonlandıran?)` | Görevi sonlandırır. | yok | `:340-358` |
| `Initiate(veri, süreç?, seçenekler?)` → yeni akışın başlangıç görevi | **Başka süreç (ya da aynı süreçten yeni akış) başlatır.** `veri`: XML metni ya da `$Xml` türünden eleman (başka tip hata). `süreç`: verilmezse aynı süreç. Seçenekler: `task` (başlangıç görevi), `initiator`, `culture`, `testMode`, `parent`, `version`, `async`, `debug`. Varsayılanlar: başlatan = bu görevi tamamlayan, dil ve deneme durumu = bu akışınki; yeni akış bu görevin alt akışı olur. Başlangıç noktası bulunamazsa ya da birden çok bulunursa hata. `süreç` parametresinin ad mı kimlik mi kabul ettiği **doğrulanamadı**. | yok | `:360-534` |
| `Trigger(olayAdı, veri?, debug?)` → başlatılan görev id'leri | Süreç olayı tetikler (Event / EventListener modül görevleriyle birlikte kullanılır). `veri` verilmezse bu görevin form verisi gider. | yok | `:536-613` |

### 2.3 `$Instance`

`WS/InstanceProxy.cs` (tamamı okundu). Dokümanda yalnız "numarası, başlatanı" diye anılıyor; hiçbir üyenin adı yazılmamış.

| Üye | Davranış | Dok. | Kanıt |
|---|---|---|---|
| `Id` → metin | Akışın kimliği. | yok | `:29-33` |
| `Number` → tam sayı | Akış numarası (kullanıcının gördüğü). | ad | `:35-39` |
| `TestMode` → doğru/yanlış | Deneme Durumu'nda başlatıldıysa doğru. Aynı bilgi `$TestMode` olarak da var. | yok | `:41-45` |
| `Start`, `End` → tarih nesnesi | `End` bitmemiş akışta `null`. | yok | `:47-66` |
| `State` → metin | Akışın durumu. | yok | `:68-72` |
| `Priority` → tam sayı, **yazılabilir** | Akışın önceliği. Değerlerin anlamı okunmadı. | yok | `:74-79` |
| `Initiator` → kimlik ya da `null` | `$Initiator` ile aynı. | ad | `:81-101` |
| `InitiatorWorkItem` → görev | Akışın başlangıç görevi. | yok | `:105-115` |
| `ParentWorkItem` → görev ya da `null` | Alt akışsa, onu başlatan görev. | yok | `:119-129` |
| `ProcessId` → metin | Sürecin kimliği. | yok | `:131-135` |
| `Culture` → metin, **yazılabilir** | Akışın dili (örnek: `tr`). Değiştirilirse sonraki form ve e-postalar o dilde olur (çıkarım; çelişki 79 ile birlikte). | yok | `:137-145` |
| `WorkItems` → nesne | Akışın bütün görevleri; hem kimlikle (`WorkItems['<id>']` → görev) hem görev adıyla (`WorkItems['Yönetici Onayı']` → o adlı görevlerin **dizisi**) okunur. | yok | `:167-182` |
| `Terminate(sonlandıran?)` | Akışı sonlandırır. Akış etkin değilse "erişim engellendi" hatası. | yok | `:147-165` |

### 2.4 `$Initiator` ve kimlik nesneleri

`FX/IdentityProxy.cs:73-83` okundu. `Id`, `Name`, `Type`, `Domain`: dördü de dokümanda **var**. Eksik olan tek şey `Type`'ın alabildiği değerler: `User`, `Group`, `Position`, `OrganizationUnit` (`Src/CodEase/Security/IdentityType.cs` okundu). Başlatanı olmayan akışta (çıkarım: sistemin ya da anonim kullanıcının başlattığı) `$Initiator` `null`'dır (`WS/InstanceScriptContext.cs:38-39` okundu).

### 2.5 `$Membership`

`FX/MembershipProxy.cs` (tamamı okundu), `WS/MembershipProxy.cs` (tamamı okundu). Kimlik bekleyen her parametre kimlik nesnesi ya da kimlik numarası (metin) kabul eder; numara biçiminde olmayan metin hata verir: "… is a invalid identity identifier" (`FX/IdentityProxy.cs:90-120` okundu).

| Üye | Davranış ve tuzak | Dok. | Kanıt |
|---|---|---|---|
| `Get(id)` → kimlik ya da `null` | Boş değer verilirse `null`. | var | `:31-35` |
| `GetProperty(kimlik, özellik)` → değer ya da `null` | Hazır adlara ek olarak `Id`, `DateFormat` da var. Bulunamayan özellikte `null`. | var (`DateFormat` yok) | `:37-56`; `Src/CodEase.Framework/Data/Repository/Server/Organization/UsersContext.cs:402-411` |
| `FindManager(kimlik, pozisyon?)` → dizi ya da `null` | Kimlik boşsa `null` (dizi değil). Pozisyon verilip bulunamazsa hata. | var (`null` yok) | `:58-87` |
| `Join(girdi)` → dizi | | var | `:220-228` |
| `Administrator` → kimlik | Sistem yöneticisi kimliği (özellik, işlev değil). | yok | `:22-29` |
| `GetEmployeesOfManager(yönetici)` → dizi | Bir yöneticiye bağlı çalışanlar. Geçersiz parametre hata verir. | yok | `:89-100` |
| `FindPosition(pozisyon, departman?, yön?)` → dizi | Pozisyonu adıyla, numarasıyla ya da kimliğiyle arar. `departman`: numara, yol ya da kimlik. `yön`: `'Up'` (varsayılan) ya da `'Down'`; verilen departmandan yukarı ya da aşağı doğru arar. Departman yolu bulunamazsa hata. | yok | `:102-160` |
| `GetChilds(üst)` → dizi | Bir kimliğin altındakiler (örnek: departmanın alt departman / pozisyonları). Tam kapsamı okunmadı. | yok | `:162-170` |
| `FindIdentity(yol, tür?)` → kimlik ya da `null` | Yol ile kimlik bulur; `tür`: `'User'` (varsayılan), `'Group'`, `'Position'`, `'OrganizationUnit'`. Yolun biçimi okunmadı. | yok | `:172-181` |
| `UpdateUser(kimlik, bilgi)` | Kullanıcının oturum bilgilerini günceller (`bilgi.password` dahil). Yönetim işi; sayfaya alınıp alınmayacağı sorulmalı. | yok | `:250-267` |
| `AssociateLogonId(...)` | Eskimiş; `UpdateUser` kullanılmalı. | yok | `:230-248` |
| `SendLogonRegistrationEMail(kimlik)` | Kullanıcıya kayıt / davet e-postası gönderir. E-postası yoksa sessizce hiçbir şey yapmaz. | yok | `WS/MembershipProxy.cs:24-57` |

### 2.6 `$Database`

`FX/DatabaseProxy.cs` (tamamı okundu), sorgu ayrıştırma `FX/QueryParser.cs` (tamamı okundu).

| Üye | Davranış ve tuzak | Dok. | Kanıt |
|---|---|---|---|
| `Get(sorgu)` → tablo nesnesi | | var | `:49-68` |
| `ImportFromXml(sorgu)` → tablo nesnesi | Yazar ve kaydeder. | var | `:205-214` |
| `ExportToXml(sorgu)` → tablo nesnesi | | var | `:216-224` |
| `Empty(sorgu)` → boş tablo nesnesi | Tablonun sütunlarını taşıyan, satırsız bir liste; `Add` + `Save` ile kayıt eklemek için. Yalnız `{ TargetSchema, TargetTable }` verilerek de çağrılabilir. | yok | `:70-88` |
| `GetData(şema, tablo, sütun, değer)` → tablo nesnesi | Tek koşullu kısa okuma (sütun = değer); sorgu nesnesi yazmadan. Bütün sütunlar gelir (çıkarım). | yok | `:90-112` |
| `AddData(şema, tablo, değerler)` → satır | Tek kayıt ekler ve **hemen kaydeder**. `değerler`: `{ Sütun: değer }` nesnesi (sütun adında büyük-küçük harf önemsiz; tanımayan ad sessizce atlanır) ya da `this` = satır olan bir fonksiyon. | yok | `:114-140`; `FX/DataTableProxy.cs:228-261` |
| `EnsureData(şema, tablo, sütun, değer, değerler, ilkDeğerler)` → satır ya da dizi | "Varsa güncelle, yoksa ekle": sütun = değer koşuluna uyan kayıt(lar)a `değerler` yazılır; hiç yoksa yeni kayıt eklenir ve ona hem `değerler` hem `ilkDeğerler` yazılır. Hemen kaydeder. | yok | `:142-171` |
| `DeleteData(şema, tablo, sütun, değer)` → silinen kayıt sayısı | Koşula uyan bütün kayıtları siler. | yok | `:173-203` |
| `Schema(ad)` | Şema tanımını değiştirmek için (tasarımcının kendi kullandığı işlev). Sayfaya alınması önerilmez. | yok | `:226-248`; `FX/SchemaProxy.cs` |

Kısa işlevlerin (`GetData`, `AddData`, `EnsureData`, `DeleteData`) hepsinin başa bir parametre daha alan (hedef veri deposu) ikinci biçimi var (`:96, 120, 148, 179`).

**Ham SQL yok.** `$Database` üzerinde SQL metni çalıştıran bir işlev bulunmuyor (dosyanın tamamı okundu).

#### Sorgu nesnesinin alanları

Alan adlarında büyük-küçük harf önemsizdir (`QueryParser.cs:22-30, 248-283` okundu). Dokümanda yalnız `Parameters.TargetSchema`, `Parameters.TargetTable`, `XPath`, `Columns[].Name`, `Columns[].Properties.XPath` ve `Map` geçiyor.

| Alan | Anlamı | Dok. | Kanıt |
|---|---|---|---|
| `Parameters.TargetSchema`, `Parameters.TargetTable` | Şema ve tablo. | var | `QueryParser.cs:256-259`; `DatabaseProxy.cs:101-103` |
| `Parameters.TargetDataStore` | Başka bir veri deposu (Harici şema). Bulunamazsa hata: "Unable to find target data store …". | yok | `DatabaseProxy.cs:25-47` |
| `Parameters.IncludeAllColumns` | `true` ise listelenmeyen sütunlar da gelir. | yok | `QueryParser.cs:286-287` |
| `Columns: [{ Name, Formula, Properties }]` | `Formula`: `None`, `Count`, `CountDistinct`, `Sum`, `SumDistinct`, `Avg`, `AvgDistinct`, `Min`, `Max`. `Name` zorunlu. | `Formula` yok | `QueryParser.cs:10-47`; `Src/CodEase/Data/Aggregation.cs` |
| `Where: { Condition, Criteria: [...], Blocks: [...] }` | Koşullar. `Condition`: `And` / `Or`. `Blocks` iç içe parantez grupları. | yok | `QueryParser.cs:190-211` |
| `Criteria[]: { Name, Value, Comparison, Condition, Formula, Properties }` | `Comparison`: `Equals`, `LessThan`, `GreaterThan`, `LessThanOrEqualTo`, `GreaterThanOrEqualTo`, `Different`, `Like`, `In`, `NotIn`. `Properties.IgnoreIfEquals`: değer buna eşitse koşul yok sayılır. `Name` zorunlu. | yok | `QueryParser.cs:111-156`; `Src/CodEase/ComparisonOperator.cs` |
| `Order: [{ Name, Type }]` | Sıralama. `Type`: `Ascending` / `Descending`. | yok | `QueryParser.cs:64-109`; `Src/CodEase/SortOrder.cs` |
| `MaxLength` | En çok kaç kayıt (Top). | yok | `QueryParser.cs:276-279`; `Src/CodEase.Framework/Data/Repository/Server/GetDataQueryContext.cs:343` |
| `Start` | Kaçıncı kayıttan başlanacağı (sayfalama). | yok | `QueryParser.cs:280-283`; `GetDataQueryContext.cs:342` |
| `SubQueries: [sorgu, ...]` | Alt sorgular. Davranışı okunmadı. | yok | `QueryParser.cs:223-236, 260-263` |
| `Name` | Sorgunun adı. | yok | `QueryParser.cs:264-267` |
| `XPath` | `ImportFromXml` / `ExportToXml` için satırların yolu. | var | `QueryParser.cs:272-275` |
| `Map: function (eleman) { ... }` | Özel eşleştirme. | var | `FX/DataTableProxy.cs:395-406` |
| `Node` | `$Xml` yerine başka bir eleman üzerinde çalışmak için (`SelectAll` içinde `Node: this`). | yok | `FX/DataTableProxy.cs:377-386` |
| `ColumnsXPath` | Sütunların okunacağı / yazılacağı alt yol. Davranışı okunmadı. | yok | `FX/DataTableProxy.cs:391-394` |

Birleştirme (join) için ayrı bir alan yok; ilişkili tablonun sütunu noktalı adla yazılıyor (`Lookup.Code`; çelişki 120). Bunun `Columns` içindeki tam kuralı bu taramada okunmadı: **doğrulanamadı**.

#### Tablo nesnesi (`Get`, `Empty`, `ImportFromXml`, `ExportToXml`, `GetData` sonucu)

`FX/DataTableProxy.cs` (tamamı okundu).

| Üye | Davranış ve tuzak | Dok. | Kanıt |
|---|---|---|---|
| `Each(fn)` → tablo nesnesi | `fn(satır, sıra)`; `this` = satır. Zincirlenebilir. | var | `:129-134` |
| `Save()` → tablo nesnesi | | var | `:196-204` |
| `Map(fn)` → dizi | `Each` gibi ama fonksiyonun döndürdüklerini dizi olarak verir. | yok | `:136-154` |
| `Rows()` → satır dizisi | İşlevdir, parantezle çağrılır. | yok | `:188-194` |
| `RowCount()` → tam sayı | Kayıt sayısı (işlev). "Kayıt var mı" denetimi için. | yok | `:182-186` |
| `Columns` → sütun adları dizisi | Özellik (parantezsiz). | yok | `:470-477` |
| `Add(değerler)` → satır | Listeye yeni kayıt ekler (kaydetmez; `Save` gerekir). | yok | `:263-271` |
| `CreateNew(değerler, fn?)` → tablo nesnesi | `Add` gibi; zincirlenebilir. | yok | `:358-369` |
| `Ensure(satır, değerler?, ilkDeğerler?)` → satır | Satır verilirse günceller, verilmezse ekler. | yok | `:302-322` |
| `EnsureData(değerler, ilkDeğerler, satırFn?)` → tablo nesnesi | Listedeki (ya da `satırFn`'in `true` döndürdüğü) kayıtları günceller; hiçbiri yoksa ekler. | yok | `:324-356` |
| `DeleteAll()` → tablo nesnesi | Listedeki bütün kayıtları silinecek diye işaretler (`Save` ile silinir). | yok | `:217-226` |
| `ToDictionary(sütunlar, ayırıcı?)` → sözlük | Kayıtları bir ya da birkaç sütunun değerine göre anahtarlar: `var d = tablo.ToDictionary('Kod'); d['A12']`. Anahtara tek kayıt uyarsa satır, birden çok uyarsa dizi, uymazsa `null`. Sözlükte `Keys`, `Table`, `Ensure(anahtar, değerler, ilkDeğerler)` var. **Tuzak:** nokta içermeyen anahtarların başındaki sıfırlar atılır (`'007'` ile `'7'` aynı anahtardır). Olmayan sütun adı hata verir. | yok | `:156-172`; `FX/DataTableMapProxy.cs:13-147` |
| `Execute(fn)` → tablo nesnesi | `fn`'i `this` = tablo ile çağırır (zincir içinde). | yok | `:174-180` |
| `ImportFromXml(seçenekler)`, `ExportToXml(seçenekler)` | Var olan liste üzerinde aynı işlemler; `ImportFromXml` burada **kaydetmez**. | yok | `:428-468` |

#### Satır (`Each` içindeki `this`)

| Üye | Davranış ve tuzak | Dok. | Kanıt |
|---|---|---|---|
| `satır.SütunAdı` (okuma / atama) | Okurken: benzersiz kimlik sütunları metin, ondalık sayılar sayı, tarih sütunları **tarih nesnesi** (bkz. 2.17; JavaScript `Date` değil) gelir. Atarken: `null` ve boş metin kaydı boş (NULL) yapar; sütun tipine çevrilemeyen değer hata verir: "… value is invalid for column …". Sorguda olmayan sütun adı `undefined` verir, atama sessizce kaybolur (çıkarım). | var (tip dönüşümleri yok) | `DataTableProxy.cs:47-114` |
| `Delete()` | Kaydı silinecek diye işaretler; `tablo.Save()` ile silinir. | yok | `FX/DataRowProxy.cs:64-69` |
| `ImportFromXml(eleman, fn?)`, `ExportToXml(eleman)` | Tek kaydı bir elemandan doldurur / bir elemana yazar. | yok | `DataRowProxy.cs:71-102` |
| `Column(ad)`, `Column(ad, değer)` | Eskimiş; `satır.Ad` kullanılmalı. | yok | `DataRowProxy.cs:50-62` |

#### İşlem (transaction) davranışı

- Bir aksiyonun tetiklediği bütün scriptler tek işlem içinde çalışır; hata olursa tabloya yazılanlar geri alınır. Dokümanda **var** (`islem-sirasi-ve-hatalar`). Kanıt: `WL/ProcessingTransactionScope.cs:31` okundu.
- **`Script.Isolated(function () { ... })`**: içindeki veri tabanı işlemleri ayrı bir işlemde yapılır ve fonksiyon biter bitmez **kalıcı olur**; script sonradan hata verse de geri alınmaz (örnek kullanım: hata günlüğü tablosuna yazmak, sıra numarası almak). Dokümanda **yok**. Kanıt: `FX/ScriptRoot.cs:75-84` okundu. Canlıda denenmeli.
- Okuma, başka işlemlerin henüz kesinleşmemiş kayıtlarını da görebilir (`WL/ProcessingTransactionScope.cs:31`: okuma düzeyi "ReadUncommitted", okundu). Kullanıcıya etkisi çıkarım; sayfaya girmesi gerekmeyebilir.
- `Get` sorgusu scriptte satır düzeyi yetki (Yetkilendiren) uygulanmadan çalışır: çıkarım (`DatabaseProxy.cs:61`: sorgu kullanıcı bilgisi verilmeden çağrılıyor). Canlıda denenmeli.

### 2.7 `$Services`

`WS/WebServicesProxy.cs` (tamamı okundu), `FX/WebServiceProxy.cs` (tamamı okundu), `FX/PromiseProxy.cs` (tamamı okundu), tarayıcı `JS/scripting/webservice.js` (tamamı okundu).

Çağrı biçimi her zaman `$Services.<Servis>.<Sözleşme>.<İşlem>(girdi, başlıklar?, seçenekler?)`. Üç tür servis var: `WSDL` (SOAP), `REST`, `JS` (kütüphane; `$Services.Libraries.<Kütüphane>.<fonksiyon>`) (`Src/CodEase/Web/Services/WebServiceType.cs` okundu).

| Konu | Davranış ve tuzak | Dok. | Kanıt |
|---|---|---|---|
| Kütüphane çağrısı, `.then` / doğrudan değer | | var | — |
| **Sunucuda Promise aslında beklemez** | Görev scriptinde çağrı yapıldığı anda sonuç hazırdır; `.then(fn)` içindeki fonksiyon **hemen**, çağrının olduğu satırda çalışır. Yani `.then` içinde bir değişkene atanan değer, sonraki satırda kullanılabilir. Dokümandaki `SelectAll` + `.then` örneği bu yüzden çalışır. | yok | `WebServiceProxy.cs:130-135, 176-183`; `PromiseProxy.cs:71-95` |
| **Tarayıcıda Promise gerçektir** | Form scriptinden yapılan çağrı sunucuya gider; sonuç sonradan gelir. `.then` içindeki kod, alttaki satırlardan **sonra** çalışır. Kural scriptinde sonucu beklemek gerekiyorsa `$Complete` kullanılır (bkz. 2.20). | yok | `webservice.js:201-212`; `script.js:33, 97-101` |
| Promise üyeleri (sunucu) | `then(fn)` (zincirlenebilir), `done(fn)`, `catch(fn)`. `new Promise(function (resolve, reject) { ... })` yazılabilir. **`Promise.all`, `Promise.resolve`, `finally` yok** (sunucudaki `Promise` standart JavaScript Promise'i değil). | yok | `PromiseProxy.cs:38-56, 89-107`; `FX/ScriptContext.cs:38` |
| Geri çağırma (callback) biçimi | İkinci ya da üçüncü parametre fonksiyon olabilir: `…fn({ … }, function (sonuç) { … })`. Eski süreçlerde çağrı, bu fonksiyonun döndürdüğü değeri (yoksa sonucu) döndürür. | yok | `WebServiceProxy.cs:137-172, 183` |
| Seçenekler (üçüncü parametre) | `{ url: '…', callback: fn }`. `url`, servisin adresini o çağrı için değiştirir. | yok | `WebServiceProxy.cs:156-167` |
| Deneme Durumu'nda adres | Deneme Durumu'nda başlatılmış akışta çağrı servisin **Test URL**'ine gider. | yok | `WebServiceProxy.cs:161` |
| Başka sürecin kütüphanesini çağırma | Başlıklarda `processVersionId` verilirse fonksiyon o sürecin tanımından çalıştırılır. Parametrenin tam anlamı (versiyon kimliği mi, süreç kimliği mi) **doğrulanamadı**; kodda ikisi de deneniyor. | yok | `WebServicesProxy.cs:52-80, 94-154` |
| Olmayan fonksiyon | Kütüphanede olmayan ad çağrılırsa hata: "… function was not found." Olmayan **kütüphane** adı ise aynı hatayı çağrı anında verir (çıkarım). | yok | `WebServicesProxy.cs:156-159, 195-225` |
| Eksik parametre | Çağrıda verilmeyen parametre gövdede `undefined` olur; hata vermez. | yok | `WebServiceOperationExtension.cs:49-88` |
| Sonuç döndürmeyen fonksiyon | Sonuç `null` olur. | yok | `WebServiceOperationExtension.cs:91-112`; `WebServicesProxy.cs:167-188` |
| Fonksiyon gövdesindeki değişkenler | Çağrı bitince fonksiyonun tanımladığı üst düzey değişkenler silinir, çağıranın değişkenleri geri yüklenir. Fonksiyon çağıranın değişkenlerini **okuyabilir**; değiştirdiği değerin geri alınıp alınmadığı canlıda denenmeli. | yok | `WebServicesProxy.cs:163-186`; `FX/ScriptContext.cs:52-79` |
| **Formdan çağrılan kütüphane fonksiyonu** | Gövde sunucuda çalışır ama akışa bağlı değildir: `$Xml` boş bir köktür (form verisi **gelmez**; gereken değerler parametre olarak verilmelidir), `$Instance` / `$Initiator` / `$Templates` yoktur, `$WorkItem` sahtedir. Buna karşılık `$Request` vardır: `$Request.User` (çağıran kullanıcı, kimlik), `$Request.IPAddress`, `$Request.UrlReferrer`, `$Request.Language`. Tarih biçimli metin parametreler gövdeye tarih nesnesi olarak, XML metni parametreler eleman olarak gelir. | **yok** (sayfa "nereden çağrılırsa çağrılsın" diyor; bkz. 3. bölüm) | `WS/WebServicesScriptContext.cs:28-46`; `WS/WebRequestDataProxy.cs:26-65`; `WebServiceOperationExtension.cs:58-85, 115-134` |
| SOAP / REST servis çağrısı | Girdi nesne ya da XML olabilir; XML girdide yanıt `$Xml` türünden eleman, nesne girdide nesne olarak döner. SOAP'ta yanıt her zaman eleman. Hata: yeni süreçlerde `.catch(fn)` ile yakalanır (fırlatılmaz); eski süreçlerde hata fırlatılır. | yok | `WebServiceProxy.cs:186-259` |
| Kimlik doğrulama | Servis çağrılarında süreçte / alanda tanımlı kimlik bilgileri kullanılır (script içinde verilmez). Ayrıntısı okunmadı. | yok | `WebServicesProxy.cs:25, 88` |

Web servis tanımlama ekranı (WSDL içe alma, REST tanımı) bu taramanın dışında.

### 2.8 `$Localization`

`WS/LocalizationProxy.cs` (tamamı okundu). Bu sekiz sayfada **yok** (çelişki dosyası "sayfaya girmedi" diyor).

- Kullanım: `$Localization.<ÇeviriTürü>.<Anahtar>` → akışın dilindeki metin. Çeviri türü, yerelleştirme tablosundaki tür adıdır (`Label`, `Literal`, `Custom`, …) (`:51-65`).
- Anahtar: girdinin **Key**'i; Key boşsa özgün metnin harf ve rakam dışındaki her şeyi atılmış, küçük harfe çevrilmiş hali (`'Onay Bekliyor'` → `onaybekliyor`). Okurken yazılan ad da aynı biçimde sadeleştirilir; büyük-küçük harf ve boşluk fark etmez (`:88-91, 122-133`).
- Tuzaklar: olmayan çeviri türü ve olmayan anahtar **hata verir** (boş metin dönmez) (`:64, 127-130`). Akışın dili süreçte tanımlı değilse metinler süreçteki özgün halinden okunur (`:75-83, 109-117`).
- Türkçe karakterli özgün metinlerde anahtar, Türkçe harfler atılarak oluşur (`'Müşteri'` → `mteri`): çıkarım (`:90` yalnız `a-z`, `A-Z`, `0-9` bırakıyor). Canlıda denenmeli; doğruysa "özel satırlara Key verin" diye yazılmalı.

### 2.9 `console`

`FX/ProxyConsole.cs` (tamamı okundu), `FX/ScriptContext.cs:42-47` okundu. `log`, `info`, `warn`, `error` dokümanda **var**.

- Nesne ve dizi yazdırılınca JSON metni olarak, tablo nesnesi ve `$Xml` elemanı da JSON olarak görünür (`ProxyConsole.cs:27-40` okundu). Dok.: yok.
- `console.debug(…)`, `console.group(başlık)` / `console.groupEnd()` de çalışır: çıkarım (konsol, betik motorunun hazır konsol nesnesi; grup çağrıları günlüğe aktarılıyor, `ProxyConsole.cs:70-78` okundu). Canlıda denenmeli.
- Sistem de konsola kendiliğinden satır yazar: `$Database.Get` her çağrıda "Executing query" + sorgu ve "Query returned N rows", `Save` "Saving data table …", servis çağrısı "Invoking web service on …", `$WorkItem.Initiate` başlatılan süreci ve veriyi yazar (`FX/DatabaseProxy.cs:59-65`, `FX/DataTableProxy.cs:199`, `FX/WebServiceProxy.cs:226-231`, `WS/WorkItemProxy.cs:494-497` okundu). Hata ayıklama bölümüne değer. Dok.: yok.

### 2.10 `$Messages` (e-posta)

`WS/MessagesProxy.cs:16-76` okundu; `WS/MessageProxy.cs:19-110, 150-195, 240-262, 376-460` okundu, kalanı imza. Dokümanda yalnız **adı** geçiyor.

| Üye | Davranış ve tuzak | Kanıt |
|---|---|---|
| `$Messages.New(kime?, konu?, gövde?)` → ileti | İletiyi oluşturur; göndermez. | `MessagesProxy.cs:28-37` okundu |
| `$Messages.Send(ileti)` ya da `ileti.Send()` → ileti kimliği | Hiç alıcı yoksa hata: "No recipient found for the message with the subject of …". İleti, scriptin çalıştığı göreve bağlanır. | `MessagesProxy.cs:39-67`; `MessageProxy.cs:510-514` okundu |
| `$Messages.Abort(id)` | Gönderilmeyi bekleyen iletiyi iptal eder. | `MessagesProxy.cs:69-75` okundu |
| `ileti.To(alıcı)`, `ileti.CC(alıcı)`, `ileti.BCC(alıcı)` → ileti (zincirlenir) | Alıcı: e-posta adresi (metin), kimlik, kimlik numarası ya da bunların dizisi. Kimlik pozisyon / grup / departmansa içindeki **kullanıcılara açılır** ve e-posta adresleri kullanılır. Verilen kimliklerin hiçbirinin e-postası yoksa hata: "Specified identities not eligible: […]". | `MessageProxy.cs:48-108, 295-317` okundu |
| `ileti.Subject`, `ileti.Body`, `ileti.From`, `ileti.ReplyTo`, `ileti.Priority` | Yazılabilir özellikler. Gövdenin HTML mi düz metin mi olduğu okunmadı. | `:169-262` kısmen okundu |
| `ileti.SendAfter`, `ileti.SendBefore`, `ileti.DeleteAfter` | Tarih nesnesi; ileri tarihli gönderim, son gönderim zamanı, silinme zamanı. | `:195-202`; `MessagesProxy.cs:59-64` okundu |
| `ileti.AttachFile(dosya)` | Dosya nesnesi, dosya kimliği, doküman ya da doküman kimliği (dokümanın bütün dosyaları eklenir). Bulunamazsa hata. | `:377-441` okundu |
| `ileti.Attach(ad, mimeTipi, base64İçerik)`, `ileti.AttachString(ad, mimeTipi, metin)` | İçeriği doğrudan vererek ek. | imza `:329-375` |
| `ileti.SetHeader(ad, değer)`, `GetHeader(ad)`, `GetHeaders()`, `ToXml()` | | imza `:458-520` |
| `ileti.Id`, `InReplyTo`, `References`, `RelatedId`, `Date`, `Signature`, `ToList`, `CCList`, `BCCList`, `Attachments` | Okuma özellikleri. Ek nesnesi: `Id`, `Name`, `MimeType`, `Data`, `SaveToFile()`, `Delete()`. | imza `:110-327, 623-745` |
| `$Messages.CreateEML(ileti)`, `ParseEML(eml)`, `ParseXML(xml)`, `GetEMLSignatureHash(...)`, `AddEMLSignature(...)` | EML dosyası üretme / okuma, imzalama. | imza `MessagesProxy.cs:77-185` |

Şablonla e-posta için bkz. `$Templates` (2.15). Script hata verip işlem geri alındığında gönderilmiş iletinin de geri alınıp alınmadığı **doğrulanamadı** (bkz. 4. bölüm).

### 2.11 `$Calendar` (tarih ve çalışma takvimi)

Eski süreçler: `WS/CalendarProxy.cs:13-48, 86-125, 130-232` okundu. Yeni süreçler: `WS/Calendar2Proxy.cs:28-62, 166-205` okundu, kalanı imza. Tarayıcı: `JS/scripting/calendar2.js` (yalnız işlev adları okundu). Dok.: **yok**.

İki sürümün işlevleri aynıdır; fark dönüş biçimindedir: **yeni süreçlerde her işlev Promise döndürür** (sonuç `.then(function (d) { … })` ile ya da son parametre olarak verilen fonksiyonla alınır), eski süreçlerde doğrudan değer döner. Sunucuda Promise beklemediği için `.then` hemen çalışır (2.7).

| İşlev | Davranış |
|---|---|
| `Add(tarih, saat)` | Tarihe **çalışma takvimine göre** saat ekler (mesai dışı ve tatil atlanır). |
| `AddDays(tarih, gün)`, `AddMonths(tarih, ay)`, `AddYears(tarih, yıl)` | Aynı, gün / ay / yıl ile. `AddDays`'in "gün"ü 24 saat olarak mı iş günü olarak mı saydığı **doğrulanamadı**. |
| `AddTimeSpan(tarih, 'g.ss:dd:sn')` | Süre metniyle ekleme (termin alanındaki biçim). |
| `Subtract(başlangıç, bitiş)` → saat | İki tarih arasındaki **çalışma saati** sayısı. |
| `GetHoursInDay(tarih)` → saat | O günün mesai süresi. Aynı bilgi bugün için `$Calendar_HoursInDay` değişkeninde var. |
| `GetToday(saatDilimi?)` | Şimdiki zaman. Eski sürümde ayrıca `Today` özelliği. |
| `GetDateTime(göreliTarih, başlangıç?)` | Göreli tarih ifadesini takvimdeki ilk uygun zamana çevirir. İfadenin sözdizimi okunmadı. |
| `ChangeTimeZone(tarih, '+03:00')`, `GetTimeZone(tarih)` | |
| `GetCalendar(ad)` | Adı verilen başka bir takvim; bulunamazsa `null`. |
| `GetStandardCalendar()`, `GetWeekEndCalendar()` (eski sürümde özellik: `StandardCalendar`, `WeekEndCalendar`) | Kesintisiz takvim; yalnız hafta sonunu atlayan takvim. |
| `GetBusinessHours()` → `{ start, end, daysOfWeek }`, `GetCalendarNames()` | Yalnız yeni sürümde. |

Tarayıcıda hafta sonu takviminin adı farklı yazılıyor: `GetWeekendCalendar()` (küçük "e"); sunucuda `GetWeekEndCalendar()` (`JS/scripting/calendar2.js:110`, `WS/Calendar2Proxy.cs:230-231` okundu).

Varsayılan olarak alanın `Default` adlı takvimi kullanılır (`WS/WorkflowScriptContext.cs:42-47` okundu).

### 2.12 `$Files` (dosya ve ek işlemleri)

`WS/FilesProxy.cs:60-135, 160-232` okundu, kalanı imza. Dok.: **yok**. Dosya kimliği bekleyen işlevler geçersiz kimlikte hata verir.

| İşlev | Davranış |
|---|---|
| `Get(id)` → dosya ya da `null` | Dosya nesnesi: `Id`, `Name`, `MimeType`, `Size`, `Hash`, `OwnerId`, `CreateDate` (`WS/FileInfoProxy.cs:26-48` okundu). |
| `GetString(id, kodSayfası?)`, `GetBase64(id)` | İçeriği metin / base64 olarak okur. |
| `AddString(metin, ad, kodSayfası?)`, `AddBase64(içerik, ad, mimeTipi)` → dosya | Yeni dosya oluşturur. |
| `AddPDF(html, ad, seçenekler?)` → dosya | **HTML'den PDF üretir.** Seçeneklerin adları okunmadı. |
| `AddFile(id)`, `Copy(id)` → dosya | Dosyanın kopyası. |
| `Delete(id)`, `Replace(id, yeniId)` | |
| `Merge(ad, idDizisi, dosyalarıSil?)` → dosya | Dosyaları birleştirir (PDF birleştirme olduğu çıkarım; gövde okunmadı). |
| `Zip(ad, idDizisi, ayırıcı?)` → dosya, `UnZip(id, ayırıcı?)` → dizi | |
| `Hash(id, algoritma)` → metin | |
| `Upload(id, seçenekler)`, `Download(ad, mimeTipi, seçenekler)` → dosya, `GetDir(seçenekler)` → dizi | **Uzak sunucuya dosya gönderme / oradan alma / klasör listeleme.** Seçenekler: `Protocol` (`HTTP`, `HTTPS`, `FTP`, `FTPS`, `SFTP`, `SCP`, `IMAP`, `IMAPS`, `IMAPXOAUTH2`, `WEBDAV`), `RemoteHost`, `RemotePath`, `UserName`, `Password`, `Port`, `Stateful`. Hata: "Upload failed." / "Download failed." / "GetDir failed." (`FX/FileTransferOptionsParser.cs:9-50`, `Src/CodEase.Framework/IO/FileTransfer/FileTransferOptions.cs` okundu). |
| `ToBase64(metin, kodSayfası?)`, `FromBase64(içerik, kodSayfası?, bomSil?)` | Metin ↔ base64. |

Formdaki dosya yükleme bileşeninin veride ne tuttuğu (dosya kimliği mi) bu taramada okunmadı; "formdaki eki scriptte okuma" örneği yazmadan önce doğrulanmalı.

### 2.13 `$Documents`

`WS/DocumentsProxy.cs`, `WS/DocumentProxy.cs`: yalnız **imza**. Dok.: yok.

- `$Documents.New(başlık?, içerikTipi?)`, `NewVersion(dalId, başlık?, sürümNo?)`, `Get(id)`, `GetLastVersion(dalId)` → doküman.
- Doküman: `Id`, `Title` (yazılabilir), `Description` (yazılabilir), `BranchId`, `Version`, `State`, `CreatedBy`, `CreatedAt`, `IsReadonly`, `ContentType`, `Profile`, `Acl`, `Files` (içinde `$Files` ile aynı işlevler: `AddString`, `AddPDF`, `AddBase64`, `AddFile`, `Get`, `GetString`, `GetBase64`, `Delete`, `Copy`, `Upload`, `Download`, `Replace`, `Merge`, `GetDir`), `AddProfile(girdi)`, `Save()`, `Delete(gerçektenSil?)`, `Publish(klasörYolu?)`, `Unpublish(klasörYolu?)`, `Archive()`, `SetSecurityProfile(ad)`.

Doküman yönetimi ayrı bir konu; bu sayfalara girmesi beklenmez, başvuru sayfasında adı geçmeli.

### 2.14 `$Rest` ve `$HttpClient` (doğrudan HTTP istekleri)

`FX/RestProxy.cs` (tamamı okundu), `FX/HttpClientProxy.cs` (tamamı okundu). Dok.: **yok**. Süreçte servis tanımlamadan dış sisteme istek atmanın yolu.

`$Rest.Create(adres, servis?, kapsamlar?, kimlik?)` → istemci. `servis` verilirse alanda tanımlı bağlantı (OAuth) ile kimlik doğrulanır.

| İstemci | Davranış |
|---|---|
| `Url` (yazılabilir), `IsAuthenticated` | |
| `Authenticate(kullanıcı, parola)` | Temel (Basic) kimlik doğrulama. |
| `Authenticate(servis, kapsam, kimlik)`, `EnsureAuthenticated(servis, kapsam, kimlik)` | Tanımlı bağlantıyla doğrulama; ikincisi başarısızsa hata: "Client is not authenticated." |
| `Request(kaynak?, gövde?)` → istek | Gövde verilirse yöntem POST olur; nesne JSON, XML metni / eleman XML olarak gider. |

| İstek | Davranış |
|---|---|
| `Method` (yazılabilir: `GET`, `POST`, …), `Timeout` (yazılabilir, milisaniye) | |
| `AddQueryParameter(ad, değer)`, `AddHeader(ad, değer)`, `AddUrlParameter(ad, değer)`, `AddParameter(ad, değer, tür?)` | Hepsi isteği geri döndürür (zincirlenir). `AddHeader` ve `AddUrlParameter` boş değerde hata verir. |
| `AddObject(nesne)` (JSON gövde), `AddXml(xml, ns?)`, `AddFile(parametre, dosyaAdı, mimeTipi, base64İçerik)` | Yöntemi POST yapar. |
| `Get()`, `Post()`, `Put()`, `Delete()`, `Patch()` → yanıt | Beklenmeyen durum kodunda **hata fırlatır**: "Unexpected response received. (kod) içerik". Kabul edilenler: `Get` / `Put` / `Patch` için 200 ve 204; `Post` / `Delete` için 200, 202, 204. **201 (Created) dönen bir POST hata sayılır**; böyle servislerde `Execute()` kullanılmalı. |
| `Execute()` → yanıt | Durum kodunu denetlemez. |
| `ExecuteString()`, `ExecuteJson()`, `ExecuteXml(bağlam?)` | Çalıştırır, 200 / 204 dışında hata verir, içeriği metin / nesne / eleman olarak döndürür. |

Yanıt: `Content` (metin), `RawBytes` (base64), `ContentType`, `StatusCode` (**metin**, örnek `'OK'`, `'NotFound'`; sayı değil), `Verify()`, `ToJson()`, `ToXml(bağlam?)`.

`$HttpClient.DownloadString(seçenekler)`, `$HttpClient.UploadString(seçenekler)` → metin. Seçenekler: `Address`, `QueryString`, `Data`, `Headers`. Ağ hatası script hatası olur. Tarayıcıda aynı adla var ama ikinci parametre olarak geri çağırma fonksiyonu alır ve istek sunucu üzerinden yapılır (`JS/scripting/httpclient.js:13-30` okundu).

### 2.15 `$Templates`

`WS/TemplatesProxy.cs` (tamamı okundu). Dok.: yok. Havuzda tanımlı **Şablonlar**'ı scriptte kullanma:

- `$Templates.Get(ad)` → şablonun içeriği; yoksa `null`.
- `$Templates.Subject(ad, eleman?, seçenekler?)` → şablonun konusu; eleman verilirse `{{…}}` ifadeleri doldurulur.
- `$Templates.Format(ad, eleman, seçenekler?)` → şablonun elemana göre doldurulmuş hali (akışın dilinde; `seçenekler.Culture` ile değiştirilebilir). Olmayan şablonda boş metin.

`$Messages` ile birlikte: `$Messages.New(kime, $Templates.Subject('Ad', $Xml), $Templates.Format('Ad', $Xml)).Send()`. Bu satır yalnız okunan imzalara dayanıyor; çalıştırılmadı.

### 2.16 Diğer nesneler (hepsi dok.: yok)

| Nesne | Üyeler | Kanıt |
|---|---|---|
| `$Cache` | `Set(anahtar, nesne, süre?)`, `Get(anahtar)`, `Remove(anahtar)` (anahtarda `*` joker), `Push(anahtar, öğeAnahtarı, nesne, süre?)`, `Pop(anahtar, öğeAnahtarı)`. Süre `'ss:dd:sn'` biçiminde. Yalnız **nesne** saklanır (düz metin / sayı değil). İşlem geri alınsa da önbellek geri alınmaz (çıkarım). | `FX/CacheProxy.cs` tamamı okundu |
| `$Delegation` | `Add(kimden, kime, başlangıç, bitiş)` → vekâlet kimliği (`kimden` kullanıcı olmalı; `kime` kullanıcı ya da pozisyon; tarihler zorunlu, tarih nesnesi), `Search(etkin?)` → dizi (`Id`, `Start`, `End`, `From`, `To`), `Delete(id)`, `RefreshAliases(kimlikler)`. | `WS/DelegationProxy.cs:32-71` okundu, kalanı imza; `WS/DelegationInfoProxy.cs` imza |
| `$Domain` | `Url`, `LogoUrl`, `Themes`, `Properties`, `Credentials`, `Schedules` (son üçü `$Xml` türünden), `HasProcess(süreç, görev?)` → süreç kimliği ya da boş metin, `GetSecurityProfiles()`, `HasPermission(kimlik, profil, izinler)`, **`Lock(anahtar, fn, zamanAşımıMs?, uygulamaGeneli?)`** → doğru/yanlış (aynı anda çalışan iki akışın aynı işi yapmasını önlemek için kilit; kilit alınamazsa yanlış döner ve `fn` çalışmaz: çıkarım), `RebuildRepository(...)`. | `WS/DomainProxy.cs:128-200` okundu, kalanı imza |
| `$ActivityStream` | `Post(etkinlik, görevId?)` → kimlik. Akışın etkinlik akışına (yorum / tarihçe) kayıt düşer. Etkinlik nesnesinin alanları okunmadı. | `WS/ActivityStreamProxy.cs:230-262` okundu |
| `$Crypto` | `Hash(içerik, algoritma?, kodSayfası?)`, `Encrypt(anahtar, iv, metin)`, `Decrypt(anahtar, iv, metin)`, `Sign(anahtar, metin, algoritma?)`, `Verify(veri, standart?)` (sonuç: `SignedContent`, `Validity`, `Signatures[]`), `MergeSignatures`, `AttachContentToSignature`, `DetachContentFromSignature`, `Base64ToUrl`, `Base64ToHex`; e-imza paketleme: `GetSignedAttributesPlain`, `Package`, `UpgradeToArchive`. | `FX/CryptoProxy.cs`, `WS/CryptoProxy.cs` imza |
| `$XmlRepository` | `Query(xquery, parametreler?)` → metin dizisi, `QueryXml(xquery, parametreler?)` → eleman dizisi, `Save(yol, veri)`, `Delete(yol)`. XML deposunda (akışların form verisinin de durduğu yer) XQuery çalıştırır. | `FX/XmlRepositoryProxy.cs` tamamı okundu |
| `$SAP` | `Connect(parametreler)`, `Get(fonksiyon, filtre?, tablo?)` → tablo nesnesi, `Empty(fonksiyon, tablo)` → tablo nesnesi (`Add` + `Save` SAP fonksiyonunu çağırır), `Info(fonksiyon)`. SAP bağlantı bileşeni kurulu sunucularda. | `FX/SAPProxy.cs:251-390` okundu |
| `$Market` | `ValidateLicense`, `GetLicenseLimits`, `CreateProduct`, `StartSubscription`, `ValidateSubscription`, `GetSubscription`, `GenerateLicense`. Ürünün kendi market süreçleri için; müşteri dokümanına girmesi beklenmez. | `WS/MarketProxy.cs` imza |
| `NewId()` (ve `Script.NewId()`) | Yeni benzersiz kimlik (metin). `Id` alanı doldurmak için. | `FX/ScriptContext.cs:36, 81-84`; `FX/ScriptRoot.cs:69-73` okundu |
| `Wait(ms)` | Scripti verilen süre kadar bekletir (varsayılan 1000 ms). | `FX/ScriptContext.cs:37, 86-89` okundu |
| `$TestMode` | Akış Deneme Durumu'nda başlatıldıysa `true`. Scriptte "denemede dış servisi çağırma" gibi dallanma için. | `WS/InstanceScriptContext.cs:35` okundu |
| `$Priority`, `$Culture`, `$Process` | Akışın önceliği (sayı), dili (metin), sürecin kimliği (metin). | `WS/InstanceScriptContext.cs:36, 42`; `WS/WorkflowScriptContext.cs:37` okundu |
| `$FolderName`, `$FolderPath` | Sürecin bulunduğu dizinin adı ve üst dizinlerle birlikte yolu (`Üst\Alt`). | `WL/WorkItem.cs:1319-1347` okundu |
| `$Calendar_HoursInDay` | Bugünün mesai süresi (saat). | `WL/WorkItem.cs:1315` okundu |

### 2.17 Tarih nesnesi (`DateTimeOffset`)

`FX/DateTimeOffsetProxy.cs` (tamamı okundu). `$Xml.EvaluateDateTime`, `$WorkItem.Start`, tablo satırlarındaki tarih sütunları ve `$Calendar` işlevleri JavaScript'in `Date`'ini değil **bu nesneyi** döndürür. Dok.: **yok**.

| Üye | Davranış ve tuzak |
|---|---|
| `DateTimeOffset.now` | Şimdi. (`DateTimeOffset.Now` eskimiş.) |
| `DateTimeOffset.parse(metin, biçim?)`, `DateTimeOffset.parseWithCulture(metin, kültür?)` | Metinden tarih. Çözülemezse hata. |
| `new DateTimeOffset(yıl, ay, gün)`, `new DateTimeOffset(yıl, ay, gün, saat, dk, sn, ms)` | **Ay 1–12'dir** (`Date`'teki gibi 0–11 değil). Geçersiz tarih hata verir. |
| `new DateTimeOffset(tarihNesnesi ya da milisaniye, dakikaFarkı?)` | |
| `getFullYear()`, `getMonth()`, `getDate()`, `getDay()`, `getHours()`, `getMinutes()`, `getSeconds()`, `getMiliseconds()` | **`getMonth()` 1–12 döner** (`Date`'te 0–11). `getMiliseconds` tek "l" ile yazılır. |
| `getTime()` | Milisaniye cinsinden zaman; **saniyeye yuvarlanmış** (son üç hane hep 000). |
| `valueOf()` | Karşılaştırma (`<`, `>`) için sayı verir; iki tarih nesnesi doğrudan karşılaştırılabilir. Çıkarma (`a - b`) milisaniye **vermez** (birimi farklı); fark için `getTime()` ya da `$Calendar.Subtract` kullanılmalı. |
| `getTimezoneOffset()`, `toLocalDate()` | |
| `toString(biçim?, kültür?)` | Biçim .NET tarih biçimidir (`'dd.MM.yyyy HH:mm'`); kültür verilmezse dilden bağımsız yazılır. |
| `toISOString()`, `toJSON()` | ISO biçimi; `SetValue` ile tarih alanına yazmaya uygun. |
| `toDate()` | JavaScript `Date`'ine çevirir. |

`SetValue` hem bu nesneyi hem JavaScript `Date`'ini kabul eder (`FX/ScriptingNavigatorExtensions.cs:18-33` okundu).

### 2.18 Script motoru

| Konu | Bulgu | Düzey | Kanıt |
|---|---|---|---|
| Hangi motor | Sunucu scriptleri .NET üzerinde çalışan bir JavaScript yorumlayıcısında (Jurassic, 3.0.0) çalışır; tarayıcı ya da Node.js değildir. | okundu | `FX/ScriptContext.cs:25-28`; `Lib/Jurassic/Jurassic.dll` sürüm bilgisi |
| Hangi dil özellikleri | Kütüphane dosyasındaki adlardan: `let` / `const`, şablon metinleri (`` `…${x}` ``), `for…of`, `Map`, `Set`, `Symbol`, `startsWith` / `includes` / `find` / `Object.assign` gibi ES2015 işlevleri **var görünüyor**. **Ok fonksiyonu (`=>`), `async` / `await`, üreteç (`function*`), yayma (`...`) ve parçalama (destructuring) için hiçbir iz yok**; desteklenmiyor olmalı. `class` belirsiz. Kod tabanındaki testlerin hiçbiri bu sözdizimlerini kullanmıyor; scriptlerin hepsi `var` + `function` ile yazılmış. | **çıkarım** | `Lib/Jurassic/Jurassic.dll` içindeki ad taraması; `Src/CodEase.UnitTests/Scripting`, `Src/CodEase.Workflow.UnitTests` araması |
| `Promise` | Sunucuda `Promise` adı ürünün kendi nesnesiyle **değiştirilmiş** (bkz. 2.7): `then`, `done`, `catch` var; beklemez. | okundu | `FX/ScriptContext.cs:38`; `FX/PromiseProxy.cs` |
| Tarayıcı scriptleri | Kullanıcının tarayıcısında çalışır; tarayıcı ne destekliyorsa o (ok fonksiyonu, `async` dahil). Aynı kod sunucu scriptine kopyalanırsa çalışmayabilir. | okundu / çıkarım | `JS/scripting/script.js:71` |
| Üst düzey `return` (sunucu) | Script olduğu gibi, bir fonksiyona sarılmadan değerlendirilir; sonuç **son ifadenin değeridir**. Bu yüzden üst düzeyde `return` yazmak sözdizimi hatası olmalı (JavaScript kuralı). Sarılmadığı okundu; hatanın kendisi denenmedi. | okundu + çıkarım | `FX/ScriptContext.cs:130-158` (özellikle 149) |
| Üst düzey `return` (tarayıcı) | Script bir fonksiyonun gövdesi olarak çalıştırılır; sonuç `return` ile verilir. | okundu | `JS/scripting/script.js:71, 97-101` |
| Sonuç dönüşümü | Sonuç `null` / `undefined` ise "sonuç yok"; tarih ve kimlik nesneleri kendi değerlerine, diziler düz diziye çevrilir. | okundu | `FX/ScriptRoot.cs:91-151` |
| Sayı ve tarih biçimi | Sunucu scriptleri dilden bağımsız kültürde çalışır: sayılar noktayla, `toString()` çıktıları dil ayarından bağımsızdır. | okundu | `FX/ScriptContext.cs:134-140` |
| Zaman aşımı | Script için süre sınırı ayarı **bulunamadı**; motor oluşturulurken süre ya da adım sınırı verilmiyor. Sonsuz döngü işi kilitler: çıkarım. | okundu (yokluk) | `FX/ScriptContext.cs:23-50`; `Src` genelinde arama |
| Bellek sınırı | Ayar **bulunamadı**. | okundu (yokluk) | aynı |
| **Değişkenler scriptler arasında yaşar** | Bir işlemde (bir aksiyonun tetiklediği bütün adımlar) tek motor kullanılır. Üst düzeyde `var x` ile tanımlanan değişken ve `function` tanımları, aynı işlemde **sonra çalışan** scriptlerde de görünür olmalı (İş Sonrası Script'te tanımlanan değişken rota kuralında, sonraki görevin İş Öncesi Script'inde). Ad çakışmasına ve "tanımsız olması gerekirken dolu" hatalarına yol açabilir; `let` / `const` ile aynı adı ikinci kez tanımlamak hata verebilir. | **çıkarım** (tek motor okundu; kalıcılık denenmedi) | `WL/ProcessingTransactionScope.cs:272-290`; `FX/ScriptContext.cs:142-149` |
| .NET türlerine erişim | Motor .NET türlerini açmaya izinli kurulmuş; açık bırakılan tek tür `WebClient`. | okundu | `FX/ScriptContext.cs:25-33` |

### 2.19 Hata davranışı (yer yer)

| Yer | Hata olunca | Dok. | Kanıt |
|---|---|---|---|
| S1–S5, S7–S10, S12–S14 | Hepsi aynı işlem içinde; biri hata verirse işlemin tamamı geri alınır. Anında işlemede kullanıcıya, arka planda işe düşer. | var | `WL/WorkItem.cs:1009-1045` okundu |
| Hata iletisi | Script hatası, JavaScript hata metni ve **satır numarası** ile sarılır. Satır numarasının kullanıcıya gösterilip gösterilmediği okunmadı. | yok | `FX/ScriptContext.cs:160-163`; `Src/CodEase/Scripting/ScriptingException.cs:26-30` okundu |
| S4 rota kuralı | Hata dışında, **sonuç tipi yanlışsa da hata** verir (bkz. 3. bölüm). | yok | `WS/RouteScriptContext.cs:24-44` okundu |
| S3 rol | Sonuç kimliğe çevrilemezse hata: "… is a invalid identity identifier. Only Identity, Identity[], string values are accepted." Boş dizi / `null` → kimse yok → "No participant…". | kısmen | `FX/IdentityProxy.cs:122-166`; `WS/WorkItemRoleScriptContext.cs:37-44` okundu |
| S6 Değerlendirme | Script aksiyon seçmezse hata sayılmaz; o çalıştırmada yapılan her şey **geri alınır** (form verisine yazılanlar dahil) ve bir sonraki zamana kadar beklenir. | yok | `WL/Workers/WorkItemEvaluate.cs:93-106` okundu |
| S13 Event modülü | Handle Script yazılmış ama aksiyon seçmemişse hata: "Event trigger module must be select an action." | yok | `WL/EventModuleHandler.cs:61-62` okundu |
| S11 kütüphane (görev scriptinden) | Fonksiyondaki hata çağıran scriptin hatasıdır; işlem geri alınır. | yok | `WS/WebServicesProxy.cs:161-189` okundu (yakalama yok) |
| Servis çağrısı | Yeni süreçlerde dış servis hatası **fırlatılmaz**; `.catch(fn)` yazılmadıysa sessizce geçilir ve `.then` çalışmaz (çıkarım: reddedilmiş Promise döner). Eski süreçlerde hata fırlatılır. | yok | `FX/WebServiceProxy.cs:251-259` okundu |
| C1–C11 tarayıcı | Hata tarayıcıda oluşur; sunucuda hiçbir şey geri alınmaz (henüz bir şey kaydedilmemiştir). Kullanıcıya nasıl gösterildiği okunmadı. | yok | `JS/scripting/script.js:97` okundu (yakalama yok) |
| İçindeki `try / catch` | Sunucu scriptinde `try { … } catch (e) { … }` yazılabilir; nesnelerin fırlattığı hataların çoğu yakalanabilir JavaScript hatasıdır. Hangi hataların yakalanamadığı denenmedi. | yok | çıkarım (`JavaScriptException` kullanılan yerler: örnek `FX/RestProxy.cs:454`) |

### 2.20 Tarayıcıya özgü nesneler

| Nesne | Davranış | Dok. | Kanıt |
|---|---|---|---|
| `$Complete(sonuç)` | Scriptin metninde `$Complete` geçiyorsa script "bekleyen" sayılır: ekranda yükleniyor penceresi açılır ve script `$Complete(…)` çağırana kadar sonuç beklenir; `return` değeri **yok sayılır**. Sunucudan değer bekleyen kurallarda (kütüphane çağrısının sonucuna göre doğrulama) kullanılır. **Tuzak:** `$Complete` hiç çağrılmazsa pencere kapanmaz. Yorum satırında geçmesi bile scripti bekleyen yapar. | yok | `JS/scripting/script.js:33, 87, 97-101, 115-132` okundu |
| `$Form` (yalnız form scripti) | `$Form.element` (formun ekrandaki öğesi), `$Form.rebuild()` / `$Form.refresh()` (formu yeniden çizer), `$Form.readonly` (form salt okunur ya da yazdırma kipindeyse doğru), `$Form.exports`. | yok | `JS/contents/root.js:159-167` okundu |
| `$Services`, `$HttpClient`, `$Localization`, `$Calendar` | Tarayıcı sürümleri; hepsi sunucuya gidip gelir, sonuç sonradan gelir. | yok | `JS/scripting/script.js:44-57` okundu |
| `Script.NewId()` | Yeni benzersiz kimlik. | yok | `JS/scripting/script.js:150-152` okundu |

---

## 3. Dokümandaki yanlışlar ve düzeltilmesi gerekenler

| # | Sayfa, satır | Cümle | Doğrusu | Kanıt |
|---|---|---|---|---|
| Y1 | `is-oncesi-ve-is-sonrasi-script.md:38` (ve çelişki 59) | "Kök adıyla başlayan yol scriptin hata vermesine yol açabilir." | Görev scriptlerinde (İş Öncesi, İş Sonrası, rol, rota kuralı, Otomatik Seçim, Değerlendirme) bu denetim **çalışmıyor**: kök adıyla başlayan yol hata vermez, yalnızca hiçbir alanla eşleşmez (`SetValue` sessizce bir şey yapmaz, `Evaluate` boş döner). "Root element name is detected in the xpath." hatası yalnız havuzun Açılış / Kapanış / Sonlandırma / Yürütme scriptlerinde verilir. Önceki doğrulama denetimin var olduğunu görmüş, hangi scriptlerde açık olduğunu görmemiş. Öneri: "hata verebilir" yerine "hiçbir şey yazılmaz / boş okunur" yazılmalı. | `WS/InstanceScriptContext.cs:13-25, 61-76` (denetim bayrağı yalnız 13-19'daki kurucuda açılıyor); `WS/WorkItemScriptContext.cs:13-15` (öbür kurucuyu kullanıyor); `WL/Instance.cs:269, 281, 295, 323` (denetimli kurucuyu yalnız havuz scriptleri kullanıyor). Hepsi okundu; canlıda denenmedi |
| Y2 | `script-kutuphaneleri.md:64` | "Fonksiyonları … form tarafındaki scriptlerden çağırabilirsiniz. Nereden çağrılırsa çağrılsın gövde sunucuda çalışır." | Gövdenin sunucuda çalıştığı doğru; ama cümle `:40`'taki "o scriptin nesnelerini aynen kullanabilir" ile birlikte okununca yanıltıyor. Formdan çağrıldığında fonksiyon form verisini **göremez** (`$Xml` boştur), `$Instance` ve `$Initiator` yoktur; sonuç da tarayıcıda sonradan gelir (gerçek Promise). Gereken her değer parametre olarak verilmelidir. | `WS/WebServicesScriptContext.cs:28-46`; `JS/scripting/webservice.js:201-212` okundu |
| Y3 | `script-kutuphaneleri.md:48` | "Çağrı her zaman şu biçimdedir: … `.then(function (result) { … })`" | "Her zaman" değil: aynı sayfa eski süreçlerde `.then` yazılmadığını söylüyor; ayrıca her iki sürümde de sonuç ikinci parametre olarak verilen fonksiyonla alınabilir (`fn({ … }, function (result) { … })`). | `FX/WebServiceProxy.cs:137-183` okundu |
| Y4 | `islem-sirasi-ve-hatalar.md:51` | "Geri alınamayan tek şey dış sistemlere yapılmış çağrılardır" | "Tek" değil. `Script.Isolated(…)` içindeki veri tabanı işlemleri bilerek geri alınmaz (okundu). Ayrıca `$Cache`'e yazılanlar, `$Files.Upload` ile uzak sunucuya gönderilen dosyalar, `$SAP` kayıtları ve `$Rest` / `$HttpClient` istekleri de geri alınmaz (çıkarım: bunlar veri tabanı işleminin dışında). `$Messages.Send` ile gönderilen e-postanın durumu **doğrulanamadı**. | `FX/ScriptRoot.cs:75-84` okundu; kalanı çıkarım |
| Y5 | `is-oncesi-ve-is-sonrasi-script.md:141-152` | "Scriptte kullanılabilen başlıca nesneler" tablosu | Yanlış değil ama eksik ve bir satırı yanıltıcı: `$Instance` için "numarası, başlatanı" yazıyor, üye adları (`Number`, `Initiator`) yok. Tabloda olmayan ve sık gereken nesneler: `$Calendar`, `$Files`, `$Rest`, `$Templates`, `$Localization`, `$TestMode`, süreç değişkenleri (`$<Ad>`), `DateTimeOffset`, `NewId()`. | 1.2 ve 2. bölüm |
| Y6 | `scriptte-veri-tabani.md:5` | "Bu sayfa üç işlevi anlatır." (ve `is-oncesi…:154`) | Yanlış değil; ama sayfa `$Database`'in tamamı sanılabilir. Sorgu yazmadan tek kayıt ekleme / güncelleme / silme işlevleri (`AddData`, `EnsureData`, `DeleteData`, `GetData`), `Empty`, tablo nesnesinin `Add` / `RowCount` / `Rows` / `Map` / `ToDictionary` / `DeleteAll` işlevleri ve satırın `Delete()` işlevi hiç geçmiyor. | 2.6 |
| Y7 | `scriptte-veri-tabani.md:81` | "`Save` listedeki bütün kayıtları günceller." | Eksik: `Save` yalnız güncellemez; `Add` ile eklenenleri **ekler**, `Delete()` / `DeleteAll()` ile işaretlenenleri **siler**. Değişmeyen kayıtların yeniden yazılıp yazılmadığı okunmadı. | `FX/DataTableProxy.cs:196-226, 263-271`; `FX/DataRowProxy.cs:64-69` okundu |
| Y8 | `kosullu-yonlendirme.md:24` ve `islem-sirasi-ve-hatalar.md:25` | "Kuralı doğru dönen rota izlenir, yanlış dönen izlenmez." / "son satırdaki ifadenin değeri sonuçtur" | Rota kuralının sonucu yalnız şunlardan biri olabilir: doğru/yanlış; `'true'` / `'false'` metni; **tam sayı** (0 = yanlış). Başka her şey **hata verir** ("Unknown route result."): ondalıklı sayı (örnek: kuralın son satırı `$Xml.Sum('…')` ise), nesne, dizi, kimlik. `'true'` / `'false'` dışındaki metin de hata verir. Otomatik Seçim Scripti ise bunun tersine her "doğru sayılan" değeri kabul eder (boş olmayan metin, sıfırdan farklı sayı, nesne). İki yer aynı kuralla çalışmıyor; sayfa ikisini aynı satırda anlatıyor. Öneri: "rota kuralı karşılaştırma ile bitmeli (`>= 500`)" uyarısı. | `WS/RouteScriptContext.cs:24-44`; `WS/ActionRuleScriptContext.cs:23-25` okundu |
| Y9 | `form-scripti.md:15` | "Script içinde form verisini `$Xml` ile okuyabilir ve değiştirebilirsiniz." | Doğru ama tek nesne `$Xml` sanılıyor. Form scriptinde `$Form`, `$Services`, `$HttpClient`, `$Localization`, `$Calendar`, süreç değişkenleri ve `$Complete` de vardır (2.20). | `JS/scripting/script.js:44-69`; `JS/contents/root.js:159-167` okundu |
| Y10 | `islem-sirasi-ve-hatalar.md:7-18` | "Scriptler hangi sırayla çalışır" listesi | Liste doğru ama havuzun dört scripti ve Kullanıcı Seçim Scripti yok. Tam sıra (akış başlarken): Açılış Scripti → başlangıç görevinin İş Öncesi Script'i. Aksiyonda: (tarayıcıda) Kullanıcı Seçim Scripti → İş Sonrası → rota kuralları → sonraki görevin İş Öncesi'si → Otomatik Seçim → rol → en sonda Yürütme Scripti; akış bittiyse Kapanış Scripti. | 1.1'deki S7–S10, C7 kanıtları |
| Y11 | `rol-scriptleri.md:69` | "`$Membership.FindManager(kimlik)` → Verilen kimliğin yöneticileri (dizi)." | Kimlik boşsa (örnek: formdaki alan boş, `$Membership.Get('')` → `null`) dizi değil **`null`** döner; ardından `.push(…)` çağıran script (sayfadaki örnek biçimi) hata verir. Küçük bir tuzak notu yeter. | `FX/MembershipProxy.cs:58-87` okundu |

Yanlış bulunmayan, koda uyan sayfa bölümleri (yeniden doğrulandı): `$Initiator`'ın dört özelliği; rol sonucunun kabul ettiği biçimler ve "karışık dizi" uyarısı (`FX/ScriptRoot.cs:125-148`, `FX/IdentityProxy.cs:122-166` okundu); boş rol → başlatan; `console` düzeyleri; `Bind` / `Live`; `Map`'in `this` ve parametresi; kütüphane parametrelerinin `$ad` ile okunması; form tarafında `return`, akış tarafında son ifade. `etikette-hesaplama.md` script değil ifade sayfası; bu taramanın alanında karşılaştırılacak bir şey çıkmadı (ifade işlevleri `core/literal.js`'te, okunmadı).

---

## 4. Doğrulanamayanlar / canlıda denenmeli

Önem sırasıyla.

1. **Y1**: görev scriptinde kök adıyla başlayan yol gerçekten hata vermiyor mu? (`$Xml.SetValue('ExpenseRequest/Employee/Id', 'x')` İş Öncesi Script'te; beklenen: hata yok, değer yazılmaz.)
2. **Dil özellikleri**: sunucu scriptinde sırayla denenmeli: `let`, `const`, `` `şablon ${x}` ``, `for (var a of dizi)`, `(x) => x`, `class`, varsayılan parametre, `...`, parçalama, `async`. Sonuç başvuru sayfasının "hangi JavaScript" bölümünü belirler.
3. **Üst düzey `return`** sunucu scriptinde ne hata veriyor (metni)? Rol scriptinde `return identities;` yazıp denemek yeter (çelişki 54 ile aynı açık soru).
4. **Değişkenlerin scriptler arasında yaşaması** (2.18): İş Sonrası Script'te `var deneme = 5;`, aynı aksiyonun rota kuralında `deneme === 5`. Doğruysa sayfaya uyarı gerekir.
5. **Rota kuralında ondalıklı sayı / metin sonucu** (Y8): son satırı `$Xml.Sum('…')` olan kural "Unknown route result." veriyor mu?
6. **`$Messages.Send` geri alınıyor mu?** Script e-posta gönderdikten sonra `throw` edilirse e-posta gidiyor mu?
7. **`Script.Isolated`**: içinde `$Database.AddData(...)`, dışında `throw`; kayıt kalıyor mu?
8. **`$Localization` anahtarı**: Türkçe karakterli özgün metinde anahtar nasıl oluşuyor; boş çeviride hata mı veriyor (çelişki dosyasındaki not)?
9. **Yeni süreçlerde servis hatası**: `.catch` yazılmadan başarısız olan servis çağrısı sessizce mi geçiliyor?
10. **`$Xml.EvaluateNumber`** boş alanda ve sayı olmayan değerde ne döndürüyor (0 / NaN)? `Sum` sayı olmayan satır varken ne döndürüyor?
11. **`$Database.Get` ve Yetkilendiren**: satır düzeyi yetki tanımlı tabloda script bütün kayıtları görüyor mu?
12. **`$WorkItem.Initiate`'in `süreç` parametresi**: süreç adı mı, kimliği mi, dizin yolu mu kabul ediyor (`WL/StartInfoBuilder.cs` okunmadı)? `$Domain.HasProcess` ile aynı kural.
13. **Havuz scriptlerinin arayüzdeki yeri ve adları** (Açılış / Kapanış / Sonlandırma / Yürütme Scripti; Kullanıcı Seçim Scripti): adlar yerelleştirme dosyasından; ekranda görülmedi.
14. **Değerlendirme** takviminin yazımı (çelişki 65'te de açık).
15. **`$Calendar.AddDays`**: "gün" iş günü mü, 24 saat mi? `Add(tarih, 8)` mesai dışına taşınca ne veriyor?
16. **`console.debug` / `console.group`** tarayıcı konsolunda ve Log sekmesinde nasıl görünüyor?
17. **Zaman aşımı**: sonsuz döngülü script anında işlemede kullanıcıyı, arka planda işi ne kadar tutuyor; iş kendiliğinden düşüyor mu? (Kodda sınır bulunamadı; web isteğinin ve arka plan işinin kendi süre sınırı olabilir, okunmadı.)
18. **Formdaki dosya bileşeni** veride ne tutuyor; `$Files.Get(…)` ile nasıl okunuyor?
19. **`$Files.AddPDF`** seçenek adları (kâğıt boyutu, kenar boşluğu vb.; dönüştürücü okunmadı).
20. Sorguda **ilişkili tablo sütunu** (`Lookup.Code`) ve **`SubQueries`** sözdizimi: sihirbazın ürettiği sorgudan örnek alınmalı.

### Bu taramada okunmayanlar

- İmza düzeyinde kalanlar: `WS/MessageProxy.cs`'in yarısı, `WS/Calendar2Proxy.cs`'in çoğu, `WS/DocumentProxy.cs`, `WS/DocumentsProxy.cs`, `WS/DocumentFilesProxy.cs`, `WS/DelegationInfoProxy.cs`, `WS/MarketProxy.cs`, `WS/CryptoProxy.cs`, `FX/CryptoProxy.cs`, `FX/JsonToXmlHelper.cs`, `JS/scripting/calendar2.js`.
- Hiç okunmayanlar: düzenleyicinin ipucu tanımları (`JS/scripting/types/*.json`: cache, calendar, database, datetimeoffset, files, membership, messages, rest, sap, xml, xmlrepository). Bunlar düzenleyicide `Ctrl` + `Boşluk` ile görünen listelerin ve büyük olasılıkla "Scripting Dokümantasyonu" bağlantısının kaynağı; başvuru sayfası yazılırken parametre açıklamaları için bakılmalı. Tarayıcıdaki `DateTimeOffset` sınıfı (`core/datetimeoffset.js`) ve etiket ifadeleri (`core/literal.js`) de okunmadı.
