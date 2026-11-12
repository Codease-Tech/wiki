# Kod taraması: Süreç tasarımcısı

Tarih: 2026-11-12. Kapsam: süreç tasarımcısı (havuz, görev, aksiyon, rota, süreç düzeyi ayarlar, veri modeli paneli, versiyon işlemleri). Karşılaştırılan sayfalar: `dizinler-ve-surecler`, `veri-modeli`, `akis-tasarimi`, `kosullu-yonlendirme`, `gorev-ayarlari`, `yerellestirme`, `rol-scriptleri`. `calisma/celiskiler.md` içinde "yazıldı / eklendi / düzeltildi" denen maddeler yeniden bulgu yapılmadı. Bu dosya siteye girmez; hiçbir doküman sayfası değiştirilmedi.

Kısaltmalar (hepsi `../codEase-master/Src` altında):

| Kısaltma | Dosya |
|---|---|
| `PD.xml` | `CodEase.Workflow.Web/Forms/ProcessDesigner.xml` (Türkçe etiketler aynı dosyada 4552-5483) |
| `PDW` | `CodEase.Workflow.WebApp.Resources/js/codease/workflow/designer/processdesigner.widgets.js` |
| `SHP` | `.../workflow/designer/designer.shapes2.js` |
| `PW` | `.../workflow/ui/process.widgets.js` |
| `WIW` | `.../workflow/ui/workitem.widgets.js` |
| `FW` | `.../workflow/ui/folder.widgets.js` |
| `LOC` | `Localization.xml` (tasarımcı sözlüğünün Türkçesi 540-760) |
| `Logic/` | `CodEase.Workflow/Business/Server/Logic/` |
| `WI.cs`, `Instance.cs`, `PVM` | `Logic/WorkItem.cs`, `Logic/Instance.cs`, `Logic/ProcessVersionManager.cs` |
| `Rec/` | `CodEase/Calendar/Recurrence/` |

Kanıt işaretleri: **okundu** = satırı kendim açıp okudum; **çıkarım** = okuduklarımdan vardığım sonuç, satır doğrudan söylemiyor.

Tasarımcının ağacı (bulguların "nerede" sütunu buna göre yazıldı; okundu `PDW:1344-1349, 1535-1542, 1580-1587, 2496-2500, 2519-2521`):

- Süreç düzeyi: **Havuzlar**, **Ekranlar**, **Form Şablonları**, **Web Servisleri** (içinde hazır **Kütüphaneler**), **Diğer** → Veri Modeli, Veritabanları, Dış Xml Şemalar, Alan Adları, Yerelleştirme, İçerik Tipleri.
- Havuz düzeyi: akış şeması, **Roller**, **Formlar**, **Scriptler** → Açılış / Kapanış / Sonlandırma / Yürütme Scripti, **Diğer** → Değişkenler, Şablonlar.

---

## 1. Dokümanda hiç olmayan özellikler

### 1.1 Modül görevleri (kişiye atanmayan görev)  — önem: yüksek

- **Arayüzde nerede:** Göreve sol tık → özellik paneli → **Tip**: *Normal* / *Modül*. *Modül* seçilince **Rol**, **Talimatlar** ve **Boşta Kalma Süresi** kalkar, yerine **Modül Tipi** gelir: **Alt Akış**, **Web Servisi Sağlayıcı**, **Komut Otomasyonu**, **Olay**, **Olay Dinleyici**. Ayarı sağ tık → **Modül** penceresinde yapılır.
- **Ne yapar:** Modül görevi kimseye atanmaz; sistem tarafından işlenir ve görevin aksiyonlarından biriyle kendiliğinden ilerler. Modül görevinde Bilgilendirme, hatırlatıcılar, İzleyiciler, Form ve Yazdırma menüleri görünmez; İş Öncesi / İş Sonrası Script, Termin, Değerlendirme, Değişkenler görünür. Otomatik Seçim Scripti modül görevinde de modülden önce denenir.
- **Tuzak:** `gorev-ayarlari` yalnızca "Tipi Modül olan görevlerde Modül seçeneği çıkar" diyor; beş tipin hiçbiri anlatılmıyor. `akis-tasarimi` görevi "bir kişinin yaptığı adım" diye tanımlıyor.
- **Kanıt:** okundu `PD.xml:3320-3336, 3412-3446` (Tip, Modül Tipi), `PD.xml:5433-5439` (Türkçe adlar), `PDW:1833-1843, 1855-1902` (menü görünürlüğü), `WI.cs:814-887` (işleme sırası).
- **Nereye:** yeni sayfa önerisi `modul-gorevleri.md`; `akis-tasarimi` ve `gorev-ayarlari`'ndan bağlantı.

### 1.2 Modül Tipi: Alt Akış  — önem: yüksek

- **Nerede:** Modül görevi → sağ tık → **Modül**. Alanlar: **Havuz**, **Görev**, **Mod**, **XPath**, **Koşul**, **Satır No XPath'i**, **Eşleme Verisi XPath**.
- **Ne yapar:** Aynı süreçteki başka bir havuzun seçilen görevinden alt akış başlatır. **XPath** verideki satırları seçer (boşsa görevin kendi verisi, tek alt akış); her satır için bir alt akış açılır. **Koşul** satırları süzer (XPath'in köşeli parantez içine eklenir). Alt akış üst akışın verisinin o satırı üzerinde çalışır; hedef havuzun **Veri Kökü** satır elemanının adıyla aynı değilse satır, hedef havuzun kökü altına kopyalanarak verilir. Alt akış üst akışın dilini ve deneme durumunu devralır.
- **Mod seçenekleri:**
  - **Alt akışları yarat ve devam et:** Alt akışlar açılır, üst akış beklemeden ilerler.
  - **Alt akışları senkronize ederek devam et:** Görev yeniden çalıştığında (örneğin akış aynı göreve geri döndüğünde) hâlâ süren alt akışlarla satırlar karşılaştırılır; karşılığı süren satır için yenisi açılmaz, satırı artık bulunmayan alt akış sonlandırılır, üst akış beklemeden ilerler. Eşleşme **Satır No XPath'i** değeri ve varsa **Eşleme Verisi XPath** içeriğiyle yapılır (içerik değişmişse yeni alt akış açılır).
  - **Tüm alt akışları bekle:** Üst akış bu görevde bekler; bütün alt akışlar tamamlanınca ilerler.
- **Kısıtlar / tuzaklar:**
  - Üst akış her zaman görevin **ilk aksiyonuyla** ilerler; görevde hiç aksiyon yoksa hata verir ("No action defined for … subworkflow task").
  - **Satır No XPath'i** verildiyse her satırda dolu ve tekil olmalı; boşsa "Invalid Row Id value", yinelenirse "Row Id value already exists", yol bulunamazsa "Row Id xpath not found" hatası.
  - Seçime uyan satır yoksa alt akış açılmaz, görev yine ilk aksiyonla geçer.
- **Kanıt:** okundu `PD.xml:3866-3956`, `Logic/SubWorkflowHandler.cs:50-241`, `Instance.cs:415-423` (hepsi bitince üst görev uyanır). "Görev yeniden çalıştığında" yorumu **çıkarım** (`SubWorkflowHandler.cs:17-48` önceki aynı görevlerin alt akışlarına bakıyor).
- **Nereye:** `modul-gorevleri.md`.

### 1.3 Modül Tipi: Komut Otomasyonu  — önem: yüksek

- **Nerede:** Modül görevi → sağ tık → **Modül** → **Kod** kutusu.
- **Ne yapar:** Görev sırası geldiğinde scripti çalıştırır; kimseye atanmaz. Script `$WorkItem.SelectedAction` ile bir aksiyon seçerse görev o aksiyonla tamamlanır ve akış sürer. Seçmezse görev bekler; sonradan **Değerlendirme** takvimi (1.6) geldikçe script yeniden çalıştırılır. Script, görev scriptleriyle aynı nesneleri (`$Xml`, `$WorkItem`, `$Database` …) ve havuz değişkenlerini kullanır.
- **Tuzak:** Aksiyon seçmeyen ve Değerlendirme'si kapalı bir otomasyon görevi sonsuza kadar bekler (Termin konmadıysa).
- **Kanıt:** okundu `PD.xml:3959-3970`, `Logic/AutomationModuleHandler.cs:16-36`, `Logic/IModuleHandler.cs:47-76`, `Logic/Workers/WorkItemEvaluate.cs:70-91`. "Sonsuza kadar bekler" **çıkarım**.
- **Nereye:** `modul-gorevleri.md`; `kosullu-yonlendirme`'den "kişisiz adım" seçeneği olarak bağlantı.

### 1.4 Modül Tipi: Olay ve Olay Dinleyici  — önem: orta

- **Nerede:** Modül görevi → sağ tık → **Modül**. *Olay*: **Olay Adı**, **Olay Veri XPath'i**, **İşleme Script'i**. *Olay Dinleyici*: **Olay Adı**, **İşleme Script'i**.
- **Ne yapar:**
  - **Olay** görevi adı verilen olayı tetikler ve **Olay Veri XPath'i** ile seçilen veriyi dinleyenlere gönderir. Ardından **İşleme Script'i** boşsa ilk aksiyonla, doluysa scriptin seçtiği aksiyonla ilerler; scriptte `$Handlers` olayı işleyen görevlerin kimliklerini (metin dizisi) verir. Script aksiyon seçmezse hata: "Event trigger module must be select an action."
  - **Olay Dinleyici** görevi olayı bekler. Akışın ortasındaysa olay gelene kadar bekler; olay gelince **İşleme Script'i** boşsa ilk aksiyonla, doluysa scriptin seçtiği aksiyonla ilerler. Scriptte `$Input` olayla gelen veridir. **Başlangıç Noktası = Evet** olan Olay Dinleyici, olay her tetiklendiğinde **yeni bir akış başlatır**.
  - Olay adı listesi süreçteki diğer olay görevlerinde yazılmış adları önerir; yeni ad da yazılabilir. Dinleyiciler kiracı genelinde olay adına göre eşleşir, yani başka bir süreçteki olay da dinlenebilir.
- **Kanıt:** okundu `PD.xml:3973-4053` (alanlar ve açıklama metinleri; Türkçeleri `PD.xml` tr bölümü "Olay tamamlandıktan sonra…"), `Logic/EventModuleHandler.cs:28-63`, `Logic/EventListenerModuleHandler.cs:20-62`, `Logic/ProcessEventsManager.cs:76-145, 170-193`, `WI.cs:859-875`. "Başka süreçteki olay da dinlenebilir" **çıkarım** (kayıt kiracı + olay adıyla tutuluyor).
- **Nereye:** `modul-gorevleri.md`.

### 1.5 Modül Tipi: Web Servisi Sağlayıcı  — önem: düşük

- **Nerede:** Modül Tipi listesinde. **Modül** penceresi bu tipte **boştur** (ayar yok).
- **Ne yapar:** Görev sırası gelince ilk aksiyonla kendiliğinden ilerler. Dışarıya nasıl bir servis sunduğu doğrulanamadı (bkz. 4.4).
- **Kanıt:** okundu `PD.xml:3958` (boş içerik), `Logic/WebServiceProducerHandler.cs:15-29`.
- **Nereye:** `modul-gorevleri.md` içinde bir satır; ayrıntı canlıda denenmeden yazılmamalı.

### 1.6 Değerlendirme (takvimle çalışan script)  — önem: yüksek

`celiskiler.md` #65 "sayfaya girmedi" diyor; hâlâ hiçbir sayfada yok. `gorev-ayarlari` "bu sayfada anlatılmıyor" diye geçiyor.

- **Nerede:** Göreve sağ tık → **Değerlendirme**. İki bölüm: **Kod** (script) ve **Takvim**. Takvimde **Değerlendirme Etkin** → *Evet, belirlenen takvimde çalıştır.*; işaretlenince **Hemen Çalıştır** → *Evet, hemen çalıştır* (varsayılan işaretli) ve takvimin yazıldığı XML kutusu açılır. Etkinse görev kutusunun altındaki takvim simgesi koyulaşır.
- **Ne yapar — iki ayrı davranış:**
  - **Başlangıç görevinde** (Başlangıç Noktası = Evet): Takvim her geldiğinde sistem, kimse başlatmadan **yeni bir akış** açar ve scripti çalıştırır. Script bir aksiyon seçerse (`$WorkItem.SelectedAction = '…'`) akış o aksiyonla ilerler; seçmezse açılan akış **tümüyle geri alınır**, iz kalmaz. Zamanlanmış iş (her sabah rapor, periyodik eşitleme) böyle kurulur. Görevin İş Öncesi Script'i ve Otomatik Seçim Scriptleri önce çalışır; onlar aksiyon seçtiyse Değerlendirme scripti çalışmaz.
  - **Diğer görevlerde:** Takvim her geldiğinde o görevde **bekleyen her iş** için script ayrı ayrı çalışır. Script aksiyon seçerse iş o aksiyonla tamamlanır; seçmezse hiçbir şey değişmez, iş beklemeye devam eder. Modül görevinde önce modülün kendi scripti (1.3, 1.4) yeniden denenir.
- **Ne zaman devreye girer:** Takvim, versiyonda **Değişiklikleri Uygula** dendiğinde ve versiyon durumu değiştirildiğinde kurulur. Başlangıç görevi takvimi versiyon **Arşiv** olmadıkça çalışır; yani **Deneme Durumu'ndaki versiyonda da çalışır** (açılan akış deneme akışıdır). Diğer görevlerde arşivdeki versiyonun süren akışları varsa onlar için de çalışmaya devam eder.
- **Takvim XML biçimi:** Kök `<Schedule>`, içinde bir ya da birkaç `<Rule Type="…">`. Tasarımcı varsayılan olarak 12 saatte bir çalışan kuralı yazar:

  ```xml
  <Schedule Name="">
    <Rule Type="Hourly">
      <Duration>12:00:00</Duration>
    </Rule>
  </Schedule>
  ```

  | `Type` | Alt elemanlar | Anlamı |
  |---|---|---|
  | `Hourly` | `Duration` (`gün.saat:dk:sn`) | Yineleme aralığı. |
  | `Daily` | `Start`, `End` (`ss:dd:ss`), `Invert` (`True`/`False`) | Gün içinde **dışlanan** saat aralığı; `Invert` True ise aralığın dışı dışlanır. |
  | `Weekly` | `DayOfWeek` (yinelenebilir; `Monday` … `Sunday`) | **Dışlanan** haftanın günleri. |
  | `Monthly` | `Day` (yinelenebilir, sayı) | **Dışlanan** ayın günleri. |
  | `Yearly` | `Day`, `Month` | Yılın belirli günü. |
  | `Annual` | `Date` (yinelenebilir, `Description` özniteliği) | Tarih listesi. |
  | `Holiday` | — | Tatil günleri. |

  Bilinmeyen `Type` yazılırsa "Schedule type … not found." hatası.
- **Kısıtlar / tuzaklar:**
  - Aralık ne yazılırsa yazılsın iki çalışma arası **en az 10 dakikadır** (sunucu ayarı; varsayılan 10).
  - `Weekly`, `Monthly`, `Daily` kuralları "ne zaman çalışsın" değil "ne zaman **çalışmasın**" diye yazılır: yalnızca pazartesi çalışsın isteniyorsa diğer altı gün dışlanır. Eğitimdeki "pazartesi günleri çalıştır" anlatımı bu yüzden yanıltıcı olabilir.
  - **Hemen Çalıştır** işaretliyse ilk çalışma, değişiklik uygulandığı anda olur; işaretsizse takvimin ilk uygun zamanında.
  - Başlangıç görevinde scripti aksiyon seçmeyen bir Değerlendirme hiçbir iz bırakmaz; "çalışmıyor" sanılabilir. Çalışma kayıtları **Arkaplan İş Yöneticisi**'nde görülür (çıkarım: iş olarak kuyruğa atılıyor).
- **Kanıt:** okundu `PD.xml:3220-3285` (form), `PDW:1903-1908` (menü), `SHP:335` (simge), `CodEase.Workflow/TaskEvaluator.cs:13-89` (varsayılanlar, 12 saat), `Logic/ScheduledTaskManager.cs:91-123, 136-176` (kurulum, 10 dk sınırı), `Logic/TaskEvaluateAction.cs:47-93`, `Logic/Workers/TaskEvaluate.cs:60-110`, `Logic/Workers/WorkItemEvaluate.cs:61-112`, `WI.cs:520-530`, `PVM:453, 532-544, 703, 716` (ne zaman kurulur), `Rec/Schedule.cs:326-365`, `Rec/HourlyRule.cs:15-37`, `Rec/DailyRule.cs:20-27, 712-745`, `Rec/WeeklyRule.cs:8-10, 262-297`, `Rec/MonthlyRule.cs:8-11, 258-290`, `Rec/YearlyRule.cs:83-96`, `CodEase.Workflow/Business/Server/Configuration/ApplicationElement.cs:89-96`. Kuralların birlikte nasıl sonuç verdiği **denenmedi** (bkz. 4.1).
- **Nereye:** yeni sayfa `degerlendirme.md` ("Zamanlanmış işler"); `gorev-ayarlari` menü tablosundan bağlantı.

### 1.7 Havuz scriptleri: Açılış, Kapanış, Sonlandırma, Yürütme  — önem: yüksek

- **Nerede:** Havuza tıklayınca alttaki **Scriptler** başlığı. Dört kutu: **Açılış Scripti**, **Kapanış Scripti**, **Sonlandırma Scripti**, **Yürütme Scripti**. (`akis-tasarimi` "Scriptler" başlığının adını anıyor, içini anlatmıyor.)
- **Ne yapar:**

  | Script | Ne zaman çalışır |
  |---|---|
  | Açılış Scripti | Akış başlatılırken, başlangıç görevinin İş Öncesi Script'inden **önce**, bir kez. |
  | Kapanış Scripti | Akış olağan yoldan tamamlandığında (açık görev kalmadığında), bir kez. |
  | Sonlandırma Scripti | Akış sonlandırıldığında (iptal), Kapanış Scripti yerine. |
  | Yürütme Scripti | Her görev işlendikten sonra (İş Sonrası Script ve rota değerlendirmesinin ardından). |

  Hepsi akışın verisi üzerinde çalışır (`$Xml`, `$Instance`, `$Initiator`, `$Database`, `$Templates` …); `$WorkItem` bu scriptlerde yoktur.
- **Tuzak:** "Akış bittiğinde veri tabanına yaz / e-posta gönder" gibi işler için son görevin İş Sonrası Script'i yerine Kapanış Scripti uygundur: akış hangi görevde biterse bitsin çalışır. İptal edilen akışta Kapanış değil Sonlandırma çalışır.
- **Kanıt:** okundu `PDW:2486-2501`, `LOC:636-649` (Türkçe adlar), `Instance.cs:263-330, 371-413, 825-835`, `WI.cs:1230`, `Logic/Scripts/InstanceScriptContext.cs:29-55`. Yürütme Scripti'nin işlemin tam hangi anında (işlem sonunda toplu mu) çalıştığı **çıkarım** (`MarkForExecution`).
- **Nereye:** `is-oncesi-ve-is-sonrasi-script` sayfasına yeni bölüm ya da ayrı `havuz-scriptleri.md`; `islem-sirasi-ve-hatalar` sıralamasına eklenmeli.

### 1.8 Değişkenler (havuz) ve görevde "Varolan Değişkeni Değiştir"  — önem: yüksek

- **Nerede:** Havuz → **Diğer** → **Değişkenler** → **Yeni Değişken Ekle**: **Ad**, **Değer**, **Tip** (*Metin*, *Numara*, *Tarih*, *İkili*). Görevde: sağ tık → **Değişkenler** → **Varolan Değişkeni Değiştir**: **Değişken** (havuz değişkenlerinden seçilir) ve **Değer**.
- **Ne yapar:** Havuz değişkeni, havuzun bütün scriptlerinde `$Ad` olarak okunan sabit bir değerdir (liste satırında `$Ad = "değer"` diye gösterilir). Aynı değişkenler göreve açılan forma da gönderilir. Görevdeki **Varolan Değişkeni Değiştir**, o görevde değişkenin değerini ezer; böylece aynı form ya da script göreve göre farklı davranır (örnek: `$Asama` her görevde başka değer). Ezilen değer değişkenin tipine çevrilir.
- **Kendiliğinden gelen değişkenler:** `$Process` (süreç kimliği), `$FolderName`, `$FolderPath` (sürecin dizini ve üst dizinlerle yolu), `$Calendar_HoursInDay` (çalışma takvimine göre gündeki saat).
- **Tuzak:** Değişken sabittir; scriptte atanan değer bir sonraki göreve taşınmaz (akış boyunca saklanacak bilgi veri modeline yazılmalı).
- **Kanıt:** okundu `PD.xml:4056-4093, 4106-4168`, `PDW:1909-1913, 2519-2521`, `WI.cs:1289-1348, 1434`, `Logic/Scripts/WorkItemScriptContext.cs:28-55`. "Forma da gönderilir" okundu (`WI.cs:1434`), formda nasıl okunduğu bakılmadı. "Scriptte atanan değer taşınmaz" **çıkarım**.
- **Nereye:** yeni kısa sayfa `degiskenler.md` ya da `is-oncesi-ve-is-sonrasi-script`'e bölüm; `gorev-ayarlari` menü tablosundan bağlantı.

### 1.9 Şablon yazımı (e-posta ve yazdırma şablonları)  — önem: yüksek

`celiskiler.md` #13 "ertelendi" diyor; `gorev-ayarlari` yalnızca şablonların nerede seçildiğini anlatıyor.

- **Nerede:** Havuz → **Diğer** → **Şablonlar** → **Yeni Şablon Ekle**. Alanlar: **Ad**, **Konu**, **Tip** (*Standart* / *XSLT*), satır açılınca **İçerik**. *Standart* tipte içerik biçimli metin düzenleyicide, *XSLT* tipte XML düzenleyicide yazılır.
- **Ne yapar:**
  - **Standart:** İçerikte ve konuda `{{…}}` yer tutucuları kullanılır. `{{Alan/AltAlan}}` formdaki veriyi (havuzun Veri Kökü'ne göre yol) yazar. `{{ $Değişken }}` şu hazır değerleri verir:

    | Değişken | Değer |
    |---|---|
    | `$Recipients` | Alıcıların adları (virgülle). |
    | `$WorkItem.Caption`, `$WorkItem.Instructions`, `$WorkItem.Id`, `$WorkItem.DeadlineDate` | Görevin başlığı, talimatı, kimliği, termin tarihi. |
    | `$Instance.Number` | Akış numarası. |
    | `$AssignedTo` | Görevin atandığı kimlikler. |
    | `$DomainUrl`, `$DomainName`, `$LogoUrl`, `$ApplicationName` | Sitenin adresi, kiracı adı, logo adresi, uygulama adı. |
    | `$Id` | Görev kimliği. |

    Göreve bağlantı: `{{ $DomainUrl }}/app/?/workitem/{{ $WorkItem.Id }}`. Koşul ve biçim de yazılabilir: `{{ if $WorkItem.DeadlineDate then … {{ format($WorkItem.DeadlineDate) }} }}`.
  - **XSLT:** İçerik bir XSLT belgesidir; formun verisine uygulanır. Yukarıdaki değerler XSLT parametresi olarak gelir.
  - **Konu** her iki tipte de `{{…}}` ile yazılır.
  - Şablon bir bildirimde seçildiğinde e-postanın konusu şablonun **Konu**'su olur (bkz. 3.2).
  - Aynı şablon **Yazdırma Şablonları**'nda seçilirse görev ekranındaki yazıcı menüsünde kendi adıyla çıkar ve formun o anki verisiyle doldurulup yazdırılır. Yazdırmada `$WorkItem` gibi e-posta değişkenleri **yoktur**; yalnızca form verisi kullanılabilir.
  - Scriptten: `$Templates.Get('Ad')` içeriği, `$Templates.Subject('Ad', dugum)` konuyu, `$Templates.Format('Ad', dugum, secenekler)` doldurulmuş içeriği verir (kendi e-postanızı gönderirken).
- **Tuzaklar:**
  - Şablonlar **havuza** aittir; başka havuzun görevlerinde listede çıkmaz (bkz. 3.1).
  - İçeriği boş şablon seçilirse e-posta **hiç gönderilmez**.
  - Havuzda hiç şablon yoksa bildirim pencerelerinde **Şablon** alanı görünmez.
  - Şablon metinleri Yerelleştirme'de `Template` / `TemplateSubject` gruplarında çevrilir (bu `yerellestirme`'de var).
- **Kanıt:** okundu `PD.xml:4-80` (form), `PD.xml:130-164, 3512, 3567, 3624, 3836` (Şablon alanının koşulu), `Logic/ProcessingTransactionMessages.cs:34-79`, `Logic/MessageTemplateManager.cs:73-94`, `Logic/TemplateProcessorXml.cs:20-27`, `Logic/TemplateProcessorXslt.cs:23-39`, `Logic/Scripts/TemplatesProxy.cs:27-80`, `CodEase.Workflow.WebApp/Configuration.global/MessageTemplates.xml:53-76` (varsayılan şablondaki söz dizimi), `WIW:252-261` (yazdırma). "Yazdırmada e-posta değişkenleri yok" **çıkarım** (`data.format(template.content)` değişken geçirmiyor).
- **Nereye:** yeni sayfa `sablonlar.md`; `gorev-ayarlari`'ndan bağlantı.

### 1.10 Ekranlar, Süreç Paneli ve Ekran Sihirbazı (dashboard / rapor)  — önem: yüksek

- **Nerede:** Süreç düzeyinde **Ekranlar** başlığı → **Yeni Ekle**. Pencere: **Ad**, **Veri Kökü**, **Sıralama Numarası**, **Süreç Paneli mi ?** (*Evet, bu ekranı panel olarak süreç sayfasında göster.*), **Yönetici Paneli mi ?** (*Evet, bu paneli sadece süreç yöneticilerine görüntüle.*), **Anonim Ulaşılabilir mi ?** (Yönetici Paneli işaretliyken görünmez). Ekrana tıklayınca iki sekme: **Form** (form tasarımcısı) ve **Genel** (ekrandaki adlı bölümlerin **Bölüm Durumu**: Varsayılan / Etkin / Gizli / Kapalı). Sağ tık: **Düzenle**, **Script**, **XML**, **Sil**.
- **Ne yapar:** Ekran, bir akışa bağlı olmayan formdur; içinde sorgu, tablo, grafik bileşenleriyle rapor ya da pano kurulur.
  - **Süreç Paneli mi ?** işaretli ekran, sürecin bulunduğu **dizin sayfasında** başlangıç kutucuklarıyla birlikte gösterilir; birden çok panel varsa sekmeler halinde, **Sıralama Numarası** sırasıyla.
  - İşaretli olmayan ekran dizindeki **Raporlar** düğmesinin listesinde çıkar ve ayrı sayfada açılır.
  - **Yönetici Paneli** yalnızca süreçte yazma yetkisi olanlara görünür. Deneme Durumu'ndaki versiyonun ekranlarını da yalnızca onlar görür.
  - Ekranın verisi her açılışta boş oluşur; veri modelindeki varsayılan değerler (Başlatan Kişi … alanları) ekranı açan kullanıcıyla doldurulur.
- **Ekran Sihirbazı:** Süreç sayfasında havuz kutusuna sağ tık → **Ekran Oluştur**. Pencerede **Sütunlar** tablosu: **Sütun XPath'i** (zorunlu), **Formül** (*Yok* / *Toplam* / *Adet*; bölüm olmayan alanlarda), **Kullanım** (*Filtre* / *Sonuç* / *Her İkisi*), bölüm tipindeki alanlar için **Değer XPath'i** ve **Başlık XPath'i** (zorunlu). **Tamam** denince "*havuz adı* Dashboard" adında, **Süreç Paneli** işaretli bir ekran üretilir: üstte seçilen alanlarla filtre (metin, sayı, tarih alanlarında başlangıç-bitiş aralığı; seçim alanlarında çoklu seçim), altta havuzun akışlarını listeleyen sonuç tablosu (form numarası, tarih, durum, bekleyen görev ve atanan kişi sütunlarıyla).
- **Tuzak:** Dizin sayfasındaki panel listesi sunucuda 1 dakika önbellekte tutulur; yeni ekran hemen görünmeyebilir.
- **Kanıt:** okundu `PD.xml:2865-2982` (Form / Genel), `PD.xml:2983-3055` (özellikler), `PD.xml:3056-3214` (sihirbaz), `PD.xml` tr: "Süreç Paneli mi ?", "Yönetici Paneli mi ?", "Sıralama Numarası"; `LOC:656, 4979-4984`; `PDW:776-916` (sihirbazın ürettiği), `PDW:1597-1602` (havuz sağ tık), `PDW:2654-2703`; `Logic/FolderManager.cs:542-547, 571-633`; `.../workflow/api.js:488-492` (panel / rapor ayrımı); `FW:498-506, 684-700`. Sihirbazın ürettiği ekranın görünümü **çıkarım** (çalıştırılmadı).
- **Nereye:** yeni sayfa `ekranlar-ve-paneller.md`.

### 1.11 Form Şablonları  — önem: orta

- **Nerede:** Süreç düzeyinde **Form Şablonları** → **Yeni Ekle**: **Ad**, **Kök Eleman** (veri modelindeki modeller ve **Tipler** listelenir). Tıklayınca form tasarımcısı açılır. Sağ tık: **Düzenle**, **XML**, **Sil**.
- **Ne yapar:** Bir tip ya da model için bir kez tasarlanıp sürecin bütün formlarında ve ekranlarında yeniden kullanılan form parçası. Şablondaki adlı bölümler görevlerin **Form Bölümleri** listesinde de çıkar. **İçerik Tipleri** (1.13) şablon olarak bunlardan birini seçer.
- **Kanıt:** okundu `PD.xml:1325-1357`, `PDW:2712-2760`, `PD.xml:3778` (bölüm taraması şablonları da kapsıyor). Şablonun forma nasıl eklendiği (form tasarımcısındaki bileşenin adı) **bakılmadı** — form tasarımcısı taramasının konusu.
- **Nereye:** `form-tasarimi` ya da yeni `form-sablonlari.md`; `veri-modeli` → Tipler bölümünden bağlantı.

### 1.12 Web Servisleri (WSDL)  — önem: orta

`script-kutuphaneleri` yalnızca **Kütüphaneler**'i anlatıyor; aynı başlık altındaki dış web servisi tanımı yok.

- **Nerede:** Süreç düzeyinde **Web Servisleri** → **Yeni Ekle**: **Web Servisi URL**, **Web Servis Tipi** (tek seçenek: *WSDL*). Servise tıklayınca: **Keşfet** düğmesi, **URL**, **Deneme Modu URL (Kapatmak için boş bırakınız)**, bulunan sözleşmeler ve işlemler (girdi → çıktı parametreleriyle), her işlemde hazır çağrı örneği ve **Kopyala (Bu süreçte kullanım)** / **Kopyala (Diğerlerinde kullanım)** düğmeleri, en altta **Yapılandırma** kutusu. Sağ tık: **Düzenle**, **Sil**. **Kütüphaneler** kutusu silinemez ve düzenlenemez (her süreçte hazır gelir).
- **Ne yapar:** **Keşfet** servisin tanımını okur ve işlemlerini listeler. Scriptlerde `$Services.<Servis>.<Sözleşme>.<İşlem>({ parametre : değer }).then(function (result) { … })` ile çağrılır; **Kopyala** düğmeleri bu satırı parametre adlarıyla panoya koyar ("Diğerlerinde kullanım" başka süreçten çağırmak için `processVersionId` ekler). **Deneme Modu URL** doluysa Deneme Durumu'ndaki akışlar servisi bu adresten çağırır; canlı ve test uçlarını ayırmak için.
- **Kanıt:** okundu `PD.xml:165-216, 374-593, 4170-4200`, `PDW:2782-2825`, `PDW:1357-1366` (Kütüphaneler kendiliğinden eklenir), `CodEase.Framework/Scripting/Execution/WebServiceProxy.cs:161` (deneme adresi). **Yapılandırma** kutusuna ne yazıldığı **doğrulanamadı**.
- **Nereye:** `script-kutuphaneleri`'ne bölüm ya da yeni `web-servisleri.md`.

### 1.13 İçerik Tipleri  — önem: düşük

- **Nerede:** Süreç düzeyi **Diğer** → **İçerik Tipleri** → **Yeni İçerik Tipi Ekle**: **Ad**, **Başlık**, **Şablon** (Form Şablonları'ndan seçilir).
- **Ne yapar:** Doküman arşivi (Dizin Tipi **Doküman**) için belge türü tanımlar; versiyon uygulandığında kiracıya kaydedilir. Arşivde nasıl kullanıldığı bu taramanın dışında.
- **Kanıt:** okundu `PD.xml:4469-4525`, `PDW:2830-2835`, `PVM:542` (uygulamada kaydediliyor). Kullanımı **doğrulanamadı**.
- **Nereye:** doküman arşivi anlatılırken; şimdilik `dizinler-ve-surecler`'de bir cümle.

### 1.14 Alan Adları, Dış Xml Şemalar, Hedef Alan adı  — önem: düşük

- **Nerede:** Süreç düzeyi **Diğer** → **Alan Adları** (**Yeni Alanadı Ekle**: **Ön Ek**, **Alanadı URI**, **XML Şema Lokasyonu**) ve **Dış Xml Şemalar** (ham XML kutusu). Veri Modeli'nde üçüncü sekme **Diğer** → **Hedef Alan adı**.
- **Ne yapar:** Veri modelini bir XML ad alanına bağlamak ve dışarıdan hazır XML şeması kullanmak içindir. Tanımlanan her alan adı, veri modelinde eleman eklerken **Hedef Şema** listesinde üçüncü seçenek olarak çıkar (bkz. 2.3). **Hedef Alan adı** yazılınca Alan Adları listesine kendiliğinden bir satır eklenir.
- **Kanıt:** okundu `PD.xml:1372-1410, 1126-1140, 657`, `PD.xml:1207-1222` (alan adı eşitleme), `PDW:1539-1561`. Kullanım senaryosu **çıkarım**.
- **Nereye:** `veri-modeli` sonuna "ileri düzey" notu; ayrı sayfa gerekmez.

### 1.15 Aksiyon → Görünüm: İkon, Renk, Arka Plan Rengi, Onay Mesajı  — önem: yüksek

- **Nerede:** Aksiyona sağ tık → **Görünüm**. Alanlar: **İkon**, **Renk**, **Arka Plan Rengi**, **Onay Mesajı**. (Gizli aksiyonda bu menü çıkmaz.)
- **Ne yapar:** Görev ekranındaki aksiyon düğmesinin simgesini (seçilmezse onay işareti), yazı ve zemin rengini belirler; şemadaki aksiyon kutusu da aynı renkle çizilir (Red için kırmızı gibi). **Onay Mesajı**, düğmeye basınca çıkan onay sorusunun metnidir; boşsa standart "… aksiyonunu seçmek istediğinize emin misiniz" sorusu sorulur. Mesajda `{{…}}` ile form verisi ve `{{action}}` ile aksiyonun adı kullanılabilir.
- **Not:** Onay penceresi **her aksiyonda** çıkar (kapatılamaz); Onay Mesajı yalnızca metni değiştirir. Metin Yerelleştirme'de `ActionConfirmation` grubundadır (`yerellestirme` grubu anıyor ama alanın nerede olduğunu hiçbir sayfa söylemiyor).
- **Kanıt:** okundu `PD.xml:4417-4467`, `PDW:2042-2060, 2093-2099`, `WIW:430-457`, `LOC:608`.
- **Nereye:** `akis-tasarimi` → "Aksiyon ekleme".

### 1.16 Aksiyon → Kullanıcı Seçim Scripti  — önem: orta

- **Nerede:** Aksiyona sağ tık → **Kullanıcı Seçim Scripti** (gizli aksiyonda çıkmaz).
- **Ne yapar:** Kullanıcı onay penceresinde **Evet** dedikten sonra, form sunucuya gönderilmeden **tarayıcıda** çalışan form scriptidir. Script `false` dönerse aksiyon alınmaz; bir şey dönmezse ya da doğru dönerse aksiyon alınır. Göndermeden hemen önce son bir denetim ya da veriye son bir değer yazmak için kullanılır.
- **Karıştırılmaması gereken:** **Otomatik Seçim Scripti** sunucuda, görev oluşurken çalışır (`kosullu-yonlendirme`); **Kullanıcı Seçim Scripti** tarayıcıda, kullanıcı aksiyona basınca çalışır.
- **Kanıt:** okundu `PDW:2040, 2051-2056`, `LOC:604`, `WIW:199-212`, `WI.cs:1425`.
- **Nereye:** `akis-tasarimi` → "Aksiyon ekleme"; `form-scripti`'nden bağlantı.

### 1.17 Görev: Boşta Kalma Süresi  — önem: orta

- **Nerede:** Görev özellik paneli (yalnızca Tip = Normal). Seçenekler hatırlatıcılardaki süre listesiyle aynı: **Kapalı**, 30 Dakika, 1 Saat, 3 Saat, 1 Gün, 3 Gün ya da `gün.saat:dk:sn` biçiminde özel değer.
- **Ne yapar:** Kullanıcı görev formunu açıp bu süre boyunca hiçbir şey yapmazsa "Boşta kalma süresi aşıldı. — Görev formunuz kapatılacaktır. Ardından tekrar açıp kaldığınız yerden devam edebilirsiniz." uyarısı çıkar; **Tamam** denince form kapanır. Formdaki kilit bırakılır, o ana kadar girilen veri aynı tarayıcıda görev yeniden açıldığında geri gelir. Salt okunur açılan görevde çalışmaz.
- **Kanıt:** okundu `PD.xml:3402-3410`, `WI.cs:1517`, `WIW:26-41, 115-121`, `LOC:1276, 3156-3157, 3176-3177`. "Veri geri gelir" **çıkarım** (tarayıcı belleğine alınıyor; sayfa yenilenirse kaybolabilir).
- **Nereye:** `gorev-ayarlari` → yeni bölüm "Özellik panelindeki diğer ayarlar".

### 1.18 Görev: Veri Kilit XPath  — önem: düşük

- **Nerede:** Görev özellik paneli, her tipte.
- **Ne yapar:** Görevin verinin tamamı yerine yalnızca belirtilen bölümünü kilitleyip kaydetmesini sağlar; aynı akışta aynı anda açık birden çok görev (paralel kollar, alt akışlar) birbirinin verisini ezmesin diye. Boşsa bütün veri kilitlenir.
- **Kanıt:** okundu `PD.xml:3451-3457`, `WI.cs:134-147`, `Logic/FormDataLockInfo.cs:13-26`. Etkinin tamamı **çıkarım**; canlıda denenmeli (4.3).
- **Nereye:** `modul-gorevleri.md` (alt akışlarla birlikte) ya da `gorev-ayarlari`; denenmeden ayrıntı yazılmamalı.

### 1.19 Görev: Gecikmeli Çalıştırılsın mı ?  — önem: orta

- **Nerede:** Görev özellik paneli → *Evet, izole işlemek için gecikmeli çalıştır.*
- **Ne yapar:** İşaretliyse görev tamamlandığında ardından gelen işlemler (İş Sonrası Script, rota, sonraki görevin oluşması) her koşulda ayrı bir arka plan işi olarak yapılır; Deneme Durumu'nda ve aksiyonda **İşlemi Takip Et** işaretli olsa bile kullanıcı beklemez, hata ekrana düşmez. Uzun süren scripti olan görevlerde kullanıcının ekranı kilitlenmesin diye kullanılır.
- **Tuzak:** Denerken "throw ile değeri ekranda görme" yöntemi (`islem-sirasi-ve-hatalar`) bu görevde çalışmaz; hata Arkaplan İş Yöneticisi'nde görülür (çıkarım).
- **Kanıt:** okundu `PD.xml:3476-3487`, `WI.cs:1016-1038, 1051-1067`.
- **Nereye:** `islem-sirasi-ve-hatalar`.

### 1.20 Rota özellik paneli: Talimatlar  — önem: orta

- **Nerede:** Rotaya (oka) **sol** tık → sağ panel → **Talimatlar**.
- **Ne yapar:** Doluysa, bu rotadan gelinen görevin **Talimatlar** metni yerine bu metin kullanılır (iş listesinde, bildirim e-postasının konusunda ve gövdesinde). Aynı göreve farklı yollardan gelindiğinde farklı açıklama göstermek için: örneğin Red rotasında "Talebiniz reddedildi, düzeltip yeniden gönderin". `{{…}}` ile veri kullanılabilir (1.21). Yerelleştirme'de `Instructions` grubunda çevrilir.
- **Kanıt:** okundu `PD.xml:4094-4105`, `PDW:2241`, `WI.cs:1244-1266`, `CodEase.Workflow/ProcessDefinition.cs:181-185`.
- **Nereye:** `akis-tasarimi` → "Rota çizme".

### 1.21 Başlık ve Talimatlar'da veri kullanma (`{{…}}`)  — önem: yüksek

- **Nerede:** Görevin **Başlık** ve **Talimatlar** alanları, rotanın **Talimatlar** alanı.
- **Ne yapar:** Bu metinlerde `{{Alan/AltAlan}}` yazılırsa görev oluşurken formdaki değerle değiştirilir (yol havuzun Veri Kökü'ne göre). Örnek Başlık: `Masraf onayı – {{Talep/AdSoyad}}`. Böylece iş listesinde ve e-posta konusunda her iş ayırt edilir. Değerler akışın dilinde biçimlenir. Başlangıç görevinde başlık ve talimat, form gönderildikten sonra (İş Sonrası Script'in ardından) yeniden hesaplanır; yani kullanıcının girdiği değerler tamamlanan başlangıç görevinin başlığına yansır.
- **Not:** Görevde "süreç numaralandırma" ya da ayrı bir "başlık / özet alanı" ayarı **yoktur**; iş listesinde görünen başlık bu **Başlık** alanıdır, akış numarasını sistem verir (veri modelinde **Akış Numarası** varsayılan değeriyle forma alınabilir).
- **Kanıt:** okundu `WI.cs:292-310, 1171-1182, 1237-1257`. İş listesinde başlığın gösterildiği yer **bakılmadı**.
- **Nereye:** `akis-tasarimi` → "Görev ekleme"; `is-listeleri`'nden bağlantı.

### 1.22 Havuz: Varsayılan Form, sağ tık menüsü ve silme  — önem: orta

- **Nerede:** Süreç sayfasında havuz kutusu → **Düzenle** penceresi; havuzda en az bir form varsa **Varsayılan Form** alanı çıkar (oluştururken çıkmaz). Havuz sağ tık menüsü: **Ekran Oluştur** (1.10), **Sil**.
- **Ne yapar:** **Varsayılan Form**, görevde **Form** alanı *Varsayılan* bırakılmış bütün görevlerde açılan formdur; seçilmezse havuzun ilk formu. Varsayılan form silinirse kalan ilk form varsayılan olur. **Sil** şunu sorar: "Bu havuzu silmek istediğinize emin misiniz ? Tüm adımlar, roller ve formlar silinecektir."
- **Kanıt:** okundu `PD.xml:1501-1517`, `CodEase.Workflow/Pool.cs:263-265`, `WI.cs:1359`, `PDW:1597-1602, 2459-2460`, `LOC:676-677`.
- **Nereye:** `akis-tasarimi` → "Havuz oluşturma".

### 1.23 Şema araç çubuğu: Büyüt, Küçült, Ekrana Sığdır, Resmi Dışarı Al  — önem: düşük

- **Nerede:** Havuz açıkken araç çubuğu: **Yeni Görev Ekle**, **Büyüt**, **Küçült**, **Ekrana Sığdır**, **Resmi Dışarı Al**.
- **Ne yapar:** Şemayı yakınlaştırır / uzaklaştırır / pencereye sığdırır. **Resmi Dışarı Al** şemanın resmini (beyaz zeminli JPEG) yeni sekmede açar; belgeye ya da sunuma koymak için.
- **Kanıt:** okundu `PDW:1617-1663`, `LOC:2012-2017, 2760-2765`. Yeni sekmede açılmasının güncel tarayıcılarda çalıştığı **denenmedi**.
- **Nereye:** `akis-tasarimi`.

### 1.24 Başkası düzenlerken açma: kilit  — önem: orta

- **Nerede:** Tasarımcı araç çubuğunda kırmızı kilit ve yanında bir kullanıcı adı.
- **Ne yapar:** Bir versiyonu aynı anda yalnızca bir kişi düzenleyebilir. Başkası düzenlerken açarsanız kilidin yanında o kişinin adı görünür; tıklayınca "bu versiyon şu anda … tarafından düzenleniyor ve … tarihine kadar düzenlenemez" açıklaması çıkar; yaptığınız değişiklikler kaydedilmez. (`dizinler-ve-surecler` kilidi yalnızca **Aç** ile salt okunur açma için anlatıyor.)
- **Kanıt:** okundu `PDW:1368-1413, 2905-2928`, `.../workflow/dictionary.dict:221-225` (İngilizce metin; Türkçesi `LOC`'ta aranmadı).
- **Nereye:** `dizinler-ve-surecler` → "Düzenleme ve değişiklikleri uygulama".

### 1.25 Mağazada yayınlama: Yayınla  — önem: düşük

- **Nerede:** Versiyon düğmelerinde **Yayınla** (ipucu: "Bu versiyonu satışa çıkarmak üzere mağazada yayınla."). Yalnızca mağaza modülü kurulu ortamda, yeterli kiracı düzeyinde, düzenlenmeyen ve arşivde olmayan versiyonda görünür.
- **Ne yapar:** **Mağazaya Yükle** sayfasını açar; ürün bilgileri doldurulup **Yayınla** denince versiyon mağazaya gönderilir.
- **Süreç dışa / içe aktarma:** Tasarımcıda ya da süreç sayfasında ayrı bir **dışa aktar / içe al düğmesi yoktur**. Süreci taşımanın arayüzdeki yolu `dizinler-ve-surecler`'de yazılı olan `Ctrl` + **Aç** / **Düzenle** (Versiyon İçeriği) yoludur; diğer yol mağazadır.
- **Kanıt:** okundu `PW:574-588, 638-654`, `.../workflow/ui/view.publish.js:7-66`, `LOC:36-37, 1872-1873, 2116-2117`. Düzey eşiği (`level >= 50`) okundu; hangi kiracı düzeyine karşılık geldiği **doğrulanamadı**. Mağaza akışı denenmedi.
- **Nereye:** `dizinler-ve-surecler` → "Süreci başka bir ortama taşıma" altına not.

### 1.26 Script düzenleyici: Shortcuts düğmesi ve tuşlar  — önem: düşük

- **Nerede:** Herhangi bir script kutusu açıkken araç çubuğunda **Shortcuts** (çevrilmemiş) ve **Scripting Dokümantasyonu**.
- **Ne yapar:** **Shortcuts** şu listeyi gösterir: `F1` satır içi yardım, `Ctrl` + `Boşluk` otomatik tamamlama, `Alt` + `.` tanıma git, `Alt` + `,` geri dön. Sayfalarda yalnızca `Ctrl` + `Boşluk` geçiyor. **Scripting Dokümantasyonu** dış bir adresi açar (adresin hâlâ çalıştığı denenmedi; ağ kullanılmadı).
- **Kanıt:** okundu `PDW:2300-2323`, `LOC:748-749`.
- **Nereye:** `is-oncesi-ve-is-sonrasi-script`.

### 1.27 Ham XML düğmeleri (Veri Modeli, Form, Ekran, Form Şablonu)  — önem: düşük

- **Nerede:** **Veri Modeli**, bir **form**, bir **ekran** ya da bir **form şablonu** kutusuna sağ tık → **XML**.
- **Ne yapar:** O parçanın tanımını ham XML olarak açar; elle düzeltme ya da bir formu / modeli başka sürece kopyalama için. Sürecin tamamı için olan `Ctrl` + **Düzenle** yolunun parça düzeyindeki karşılığı.
- **Kanıt:** okundu `PDW:1314-1324, 2414-2417, 2583-2600, 2619-2627, 2679-2682, 2729-2732`, `PD.xml:596-600, 1279-1290`.
- **Nereye:** `veri-modeli` ve `form-tasarimi`'ne birer cümle.

### 1.28 Görev özellik panelinde Id  — önem: düşük

- **Nerede:** Görev özellik panelinin en üstünde **Id** (değiştirilemez).
- **Ne yapar:** Görevin kimliğini gösterir; scriptte ya da dış çağrıda görev kimliği gerektiğinde buradan kopyalanır.
- **Kanıt:** okundu `PD.xml:3288-3297`.
- **Nereye:** `akis-tasarimi` → "Görev ekleme".

---

## 2. Dokümanda var ama eksik anlatılmış

### 2.1 Görev özellik panelinin alanları (`akis-tasarimi` → Görev ekleme)  — önem: yüksek

Sayfada Ad, Başlık, Başlangıç Noktası, Gizli mi ?, Talimatlar ve (başka sayfada) Rol geçiyor. Panelin tamamı sırayla: **Id**, **Ad**, **Başlık**, **Tip** (Normal / Modül), **Başlangıç Noktası** (Evet / Hayır), [Normal ise] **Talimatlar**, **Rol**, **Boşta Kalma Süresi**; [Modül ise] **Modül Tipi**; **Veri Kilit XPath**; [Başlangıç Noktası = Evet ve Tip = Normal ise] **Gizli mi ?**; **Gecikmeli Çalıştırılsın mı ?**.

- Eksikler: Tip (1.1), Boşta Kalma Süresi (1.17), Veri Kilit XPath (1.18), Gecikmeli Çalıştırılsın mı ? (1.19), Id (1.28).
- **Gizli mi ?** kutusunun yalnızca başlangıç görevinde ve Normal tipte göründüğü yazılmamış; başka görevde aranırsa bulunmaz.
- "Görev: bir kişinin yaptığı adım" tanımı Modül görevlerini dışarıda bırakıyor.
- **Kanıt:** okundu `PD.xml:3286-3488`.

### 2.2 Aksiyon özellikleri (`akis-tasarimi` → Aksiyon ekleme; `kosullu-yonlendirme`)  — önem: orta

- **Yorum Kutusunu Göster ?** / **Yorum Gerekli mi ?** yalnızca adıyla geçiyor. Davranış: işaretliyse aksiyonun onay penceresinde bir yorum kutusu çıkar; **Yorum Gerekli mi ?** (yalnızca yorum kutusu işaretliyken görünür) işaretliyse boş yorumla **Evet** denemez, "Bu alan zorunludur" uyarısı çıkar. Yorum, akışın tarihçesinde o adımın kaydına yazılır (yorumun tarihçedeki görünümü bakılmadı). Red aksiyonunda gerekçe zorunlu kılmak için tipik kullanım.
- Her aksiyon, kullanıcıya bir **onay penceresi** (Evet / İptal) gösterir; sayfada bu adım hiç yok. Zorunlu alan denetimi onay penceresinden **önce** yapılır.
- `kosullu-yonlendirme` "gizli işaretlenince **Sıralama** ve **Doğrulama Grubu** kalkar" diyor; **Yorum Kutusunu Göster ?** / **Yorum Gerekli mi ?** alanları ile sağ tık menüsündeki **Görünüm** ve **Kullanıcı Seçim Scripti** de kalkar.
- Aksiyon sağ tık menüsünün tamamı: **Görünüm**, **Kullanıcı Seçim Scripti**, **Sil** ("…silmek istediğinize emin misiniz" sorar). Otomatik Seçim Scripti menüde değil, kutudaki simgededir (bu yazılı).
- **Kanıt:** okundu `PD.xml:4285-4402`, `PDW:2042-2060`, `WIW:443-527`, `WI.cs:999`.

### 2.3 Veri modeli: Hedef Şema → Kullan → Referans (`veri-modeli`)  — önem: orta

`celiskiler.md` #27: "Referans sayfada anlatılmadı" — hâlâ öyle.

- **Hedef Şema** *Standart Veri Tipleri* dışında bir şey seçilince **Kullan** satırı çıkar: **Tip** / **Referans**.
- **Referans** seçilince **Tip** alanının adı **Eleman Referansı** olur ve liste, Tipler sekmesindeki tipleri değil **Modeller** sekmesindeki kök elemanları gösterir. **Ad** alanı kalkar: eleman, başvurulan modelin adını ve yapısını aynen alır. Böylece bir model başka bir modelin içine gömülür; alt akışta hedef havuzun Veri Kökü'nü üst modelin içinde kullanmanın yolu budur (son cümle çıkarım, bkz. 1.2).
- **Tip** ile farkı: Tip'te elemana kendi adınızı verirsiniz ve yapıyı Tipler'den alırsınız; Referans'ta ad da yapı da başvurulan modelden gelir.
- **Hedef Şema** listesinde, **Alan Adları**'nda tanım varsa üçüncü seçenek olarak o ad alanları da çıkar (1.14).
- *Şu anki Şema* seçiliyken **Tip** / **Eleman Referansı** boş bırakılamaz ("Bu alan zorunludur.").
- **Kanıt:** okundu `PD.xml:627-781` (özellikle 662-692 Kullan, 695 etiket değişimi, 754-758 liste kaynakları, 769-781 Ad koşulu), `PD.xml:1225-1261` (tip / ref yazımı).

### 2.4 Veri modeli: Varsayılan Değer ayrıntıları (`veri-modeli`)  — önem: orta

- **Saat** tipinde ve **Bölüm** tipinde Varsayılan Değer alanı yoktur (liste öğesinin içindeki Saat hariç).
- **Tarih** ve **Tarih Saat**'te seçenekler **Hayır** / **Günün Tarihi**'dir (sayfa "Hayır"ı söylemiyor).
- **Liste öğesinin içindeki** (üst elemanlarından biri *Evet, birden fazla kopya kullan.* olan) Metin elemanında "Başlatan Kişi …" listesi **çıkmaz**; yerine düz metin kutusu gelir. Tekrarlayan satırlarda başlatan kişi bilgisi varsayılan olarak seçilemez.
- **Başlatan Kişi Sicil No / Departman / Pozisyon** değerleri kullanıcının organizasyon kaydından okunur; kayıt eksikse alan boş gelir. Kimse başlatmadan açılan akışta (1.6 Değerlendirme, 1.4 Olay) bütün "Başlatan Kişi …" alanları ve Akış Numarası boş gelir.
- Varsayılanlar veri **ilk oluşturulurken** bir kez yazılır; kullanıcı değiştirebilir. Ekranlarda (1.10) "Başlatan Kişi" ekranı açan kullanıcıdır.
- **En az tekrar** yalnızca **Liste Öğesi mi ?** = Evet iken görünür; liste öğesi olmaktan çıkarılan elemanda değer 1'e döner.
- **Kanıt:** okundu `PD.xml:782-939`, `PD.xml:1263-1273`, `Logic/Scripts/DefaultValueScriptContext.cs:25-84`, `Instance.cs:303-313`, `Logic/FolderManager.cs:585`. "Kayıt eksikse boş gelir" **çıkarım**.

### 2.5 Bildirim şablonu seçimi her bildirimde var (`gorev-ayarlari`)  — önem: orta

Sayfa şablon seçimini yalnızca **Bilgilendirme**'de anlatıyor. **İlk Hatırlatıcı**, **Tekrarlayan Hatırlatıcı**, **Termin** (Bildirim Mesajı Gönder işaretliyken) ve **İzleyiciler** (Bildirim Mesajı Gönder işaretliyken) pencerelerinde de **Şablon** alanı vardır; her biri için ayrı şablon seçilebilir. Alan yalnızca ilgili ayar açıkken ve havuzda en az bir şablon varken görünür.

- **Kanıt:** okundu `PD.xml:154-164, 3504-3537, 3538-3547, 3548-3595, 3596-3649`.

### 2.6 Termin: Modül görevlerinde ve bildirim kutusu (`gorev-ayarlari`)  — önem: düşük

- **Termin** menüsü Modül görevlerinde de vardır (bekleyen Olay Dinleyici ya da "Tüm alt akışları bekle" görevine zaman aşımı koymak için kullanılabilir — kullanım çıkarım).
- **Bildirim Mesajı Gönder** kutusu yalnızca **Süre** Kapalı değilken ve görev Normal tipteyken görünür.
- **Kanıt:** okundu `PD.xml:3548-3595`, `PDW:1877-1882`, `WI.cs:832-835`.

### 2.7 Form penceresi: Kopya Edilecek Görev (`gorev-ayarlari` → Form bölümleri)  — önem: orta

Sayfa "bölüm ayarlarını başka bir görevden devralma" diyor; alanın adı ve davranışı yok.

- Alanın adı **Kopya Edilecek Görev**; listede havuzun diğer Normal görevleri çıkar.
- Seçim **tek seferlik kopyadır**: seçilen görevin bölüm durumları o an bu göreve kopyalanır ve alan kendiliğinden yeniden *Seçiniz*'e döner. Kaynak görevde sonradan yapılan değişiklik bu göreve **yansımaz**; "devralma" sözcüğü kalıcı bağ izlenimi veriyor.
- **Form** alanının ilk seçeneği **Varsayılan**'dır (havuzun Varsayılan Form'u, 1.22). Form değiştirilince bölüm listesi o formun bölümlerine göre yeniden kurulur; aynı adlı bölümlerin durumu korunur, formda artık bulunmayan bölümler listeden düşer. Form Şablonları'ndaki adlı bölümler de listelenir.
- **Kanıt:** okundu `PD.xml:3650-3750`, `PD.xml:3751-3825`.

### 2.8 Havuz penceresi (`akis-tasarimi` → Havuz oluşturma)  — önem: düşük

- **Anonim Ulaşılabilir mi ?** kutusu, **Yönetimle İlgili mi ?** işaretliyken **gizlenir** (ikisi birlikte seçilemez).
- **Dokümantasyon Adresi** ve **Destek Adresi** görev ekranına gönderilir; kullanıcıya nerede gösterildiği bakılmadı ("isteğe bağlı bağlantılar" yeterli değil, bkz. 4.9).
- Havuz ilk kez oluşturulurken, veri modeli boşsa kök model havuz adından harf / rakam dışındaki karakterler atılarak türetilir (boşluk ve noktalama düşer; Türkçe harflerin düşüp düşmediği tarayıcıya bağlı — denenmedi). Veri modelinde zaten model varsa ve **Veri Kökü** boş bırakıldıysa ilk havuz ilk modele bağlanır.
- Düzenlemede **Varsayılan Form** (1.22).
- **Kanıt:** okundu `PD.xml:1491-1575`, `PDW:1758-1806`, `WI.cs:1515-1516`.

### 2.9 Yeni Süreç Versiyonu penceresi ve denetim sonucu (`dizinler-ve-surecler`)  — önem: orta

- **Yeni Süreç Versiyonu** da **Kopyala** gibi **Versiyon No** ve **Açıklama** sorar; ikisi de zorunludur, numara geçerli biçimde ve benzersiz olmalıdır. Sayfa bunu yalnızca Kopyala için yazıyor.
- "Önce bir denetim çalışır; hata bulunursa versiyon aktif yapılamaz" cümlesinin ekrandaki karşılığı: denetim **Değişiklikleri Uygula**'da ve **durum değiştirirken** çalışır; bir şey bulursa pencere açılır, bulgular **Hata (n)**, **Uyarı (n)**, **Bilgi (n)** düğmeleriyle süzülür (Bilgi başlangıçta gizlidir). Hata varsa **Tamam** düğmesi çıkmaz, işlem yapılamaz; yalnızca uyarı ve bilgi varsa **Tamam** ile devam edilir. Denetimin baktığı şey sürecin veri tabanı şemalarında yapılacak değişikliklerdir (`veritabanlari` sayfasındaki kayıt güncelleme / silme sayıları bu pencerededir).
- Arşivdeki versiyonda **Düzenle** de onay sorar ("arşivlenmiş bir versiyonu değiştirmek üzeresiniz" anlamında; Türkçe metin `LOC`'ta aranmadı).
- **Aç**, **Düzenle**, **Kopyala** düğmeleri süreç geliştirme düzeyi olmayan kiracıda hiç görünmez.
- **Kanıt:** okundu `PW:43-112, 262-303, 312-345, 369-399, 474-476, 487-493, 591-616`, `PVM:561-570`, `Logic/ProcessVersionPublisher.cs:25-80`. "Denetimin baktığı şey" **çıkarım** (yalnızca şema ve kaynak denetimi görüldü).

### 2.10 Otomatik kayıt (`dizinler-ve-surecler` → Düzenleme)  — önem: düşük

"Her değişiklik kendiliğinden kaydedilir" doğru; ayrıntı: kayıt son değişiklikten **1 saniye sonra** yapılır, o sırada **Kapat** düğmesi dönen simgeyle **Kaydet** yazar, bitince yeniden **Kapat** olur. Kayıt başarısız olursa düğme kırmızıya döner; **Kapat**'a basıldığında bekleyen değişiklik önce kaydedilir, hata olursa mesaj gösterilir. Kırmızı düğme görülürse tasarımcı kapatılmamalı.

- **Kanıt:** okundu `PDW:1368-1378, 1416-1509`.

### 2.11 Yerelleştirme: rota talimatı ve panel adı (`yerellestirme`)  — önem: düşük

- `Instructions` grubu rotaların **Talimatlar**'ını da içerir (1.20).
- **Süreç Paneli** işaretli ekranların adı `DashboardName` grubunda çevrilir (`celiskiler.md` #81 bu grubu bilerek dışarıda bıraktı; Ekranlar sayfası yazılırsa eklenmeli).
- **Kanıt:** okundu `CodEase.Workflow/ProcessDefinition.cs:181-185, 205`.

### 2.12 Otomatik Seçim Scripti modül ve zamanlanmış görevlerde (`kosullu-yonlendirme`)  — önem: düşük

Sayfa yalnızca kullanıcı görevini anlatıyor. Aynı sıra Modül görevinde de geçerli (İş Öncesi → Otomatik Seçim → modül) ve Değerlendirme ile açılan başlangıç görevinde Otomatik Seçim bir aksiyon seçtiyse Değerlendirme scripti hiç çalışmaz.

- **Kanıt:** okundu `WI.cs:814-830, 846-857`, `Logic/Workers/TaskEvaluate.cs:80-96`.

---

## 3. Dokümandaki yanlışlar

### 3.1 Şablonlar ve Roller süreçte değil havuzda tanımlanır

- **Sayfa:** `gorev-ayarlari` → Yazdırma ve → Görev kime atanır.
- **Cümleler:** "Şablonlar süreç sayfasının altındaki **Diğer → Şablonlar** bölümünde tanımlanır." / "Süreç sayfasının altındaki **Roller** bölümünde **+** düğmesine basın".
- **Doğrusu:** Tasarımcıda iki ayrı **Diğer** başlığı vardır. Süreç düzeyindeki **Diğer**'de Veri Modeli, Veritabanları, Dış Xml Şemalar, Alan Adları, Yerelleştirme, İçerik Tipleri bulunur; **Şablonlar** burada değildir. Şablonlar (ve Değişkenler), **havuza** tıklayınca şemanın altında açılan **Diğer** başlığındadır; Roller de aynı yerde, havuzun altındadır. Şablon ve rol **yalnızca tanımlandığı havuzun** görevlerinde seçilebilir; ikinci havuzda yeniden tanımlanmaları gerekir. `veri-modeli` ve `yerellestirme`'deki "Diğer başlığının altındaki …" cümleleri süreç düzeyindeki Diğer'i kastediyor ve doğru; iki sayfa yan yana okununca Şablonlar yanlış yerde aranır.
- **Kanıt:** okundu `PDW:1535-1542` (süreç Diğer), `PDW:2510-2522` (havuz Diğer), `PDW:1580-1587` (Roller havuzun çocuğu), `PD.xml:147, 3394, 3523-3530` (şablon ve rol listeleri havuzun içinden okunuyor), `CodEase.Workflow/Pool.cs:254`.

### 3.2 Konu önekleri (`R:`, `RR:`, `D:`, `W:`) özel şablonda yok

- **Sayfa:** `gorev-ayarlari` → Hatırlatıcılar, Termin, İzleyiciler.
- **Cümleler:** "İkinci hatırlatmanın konusu `R:`, sonrakilerin konusu `RR:` ile başlar." / "(konu `D:` ile başlar)" / "(konu `W:` ile başlar)".
- **Doğrusu:** Bu önekler ve "önek + Talimatlar" biçimindeki konu yalnızca **Varsayılan Şablon** kullanılırken geçerlidir. Bildirimde havuzun bir şablonu seçildiyse konu, o şablonun **Konu** alanına yazdığınız metindir; önek eklenmez. Cümleler koşulsuz yazıldığı için özel şablon kullanan biri öneki boşuna arar.
- **Kanıt:** okundu `Logic/ProcessingTransactionMessages.cs:71-72`. Öneklerin kendisi bu taramada yeniden doğrulanmadı (önceki doğrulamaya dayanıyor).

### 3.3 "Görev: bir kişinin yaptığı adım"

- **Sayfa:** `akis-tasarimi` giriş; `gorev-ayarlari` giriş ("görevin kime atanacağını …").
- **Doğrusu:** Yalnızca **Tip = Normal** görevler kişiye atanır. **Modül** görevleri (alt akış, komut otomasyonu, olay) kimseye atanmadan sistemce işlenir (1.1). Tanım "çoğunlukla bir kişinin yaptığı adım; kişisiz çalışan görevler için bkz. Modül görevleri" biçiminde düzeltilmeli. Küçük ama kavramı kuran cümle.
- **Kanıt:** okundu `WI.cs:837-880`, `PD.xml:3320-3336`.

Karşılaştırılan yedi sayfada bunların dışında koda aykırı cümle görmedim; görev menüsü, süre seçenekleri, form bölümü durumları, rol sihirbazı seçenekleri, veri tipi adları ve havuz penceresi etiketleri `PD.xml` ile uyuşuyor.

---

## 4. Doğrulanamayanlar / canlıda denenmeli

1. **Takvim kurallarının birlikte davranışı (1.6).** `Hourly` aralığı ile `Weekly` / `Daily` dışlama kurallarının aynı takvimde nasıl birleştiği (dışlanan güne denk gelen çalışma atlanır mı, ertesi uygun zamana mı kayar), `Monthly` → `Day` değerinin 1'den mi 0'dan mı başladığı, `Yearly`, `Annual`, `Holiday` kurallarının bir zamanlamada ne anlama geldiği okunmadı. Öneri: 10 dakikalık `Hourly` + iki günü dışlayan `Weekly` ile deneme.
2. **Değerlendirme takviminin Deneme Durumu'nda çalışması (1.6).** Kod başlangıç görevinde "arşiv değilse çalışır" diyor; denemede gerçekten akış açıp açmadığı ve açılan akışın kime göründüğü denenmeli. Eğitmenin istemeden zamanlanmış iş bırakma riski var.
3. **Veri Kilit XPath (1.18).** Paralel iki görevde aynı verinin farklı bölümleri düzenlenirken gerçekten çakışmayı önlediği, yanlış yol yazılınca ne olduğu.
4. **Web Servisi Sağlayıcı (1.5).** Sürecin dışarıdan bir servis olarak çağrılmasını sağlayıp sağlamadığı, adresi, parametreleri. Kodda sunucu tarafında süreç servisleri var (`CodEase.Workflow/Business/Server/Services/ProcessService.cs:213`) ama bu modülle bağı okunmadı.
5. **Metin elemanında sabit varsayılan değer (2.4).** **Varsayılan Değer** listesine listede olmayan bir metin yazılıp yazılamadığı. Alan, süre alanıyla aynı türde bir liste; süre alanı özel değer kabul ediyor ama bu alanın kabul edip etmediği koddan kesinleşmedi.
6. **Yeni Süreç Versiyonu boş mu (2.9).** Sayfa "boş bir versiyon açar" diyor; yeni versiyonun gerçekten boş mu yoksa son versiyonun kopyası mı olduğu okunmadı.
7. **Ekran Sihirbazı'nın ürettiği ekran (1.10)** ve panelin dizin sayfasındaki görünümü; **Raporlar** düğmesinin Türkçe etiketi `LOC:3956`'da "Raporlar" görünüyor ama düğmenin yeri ekranda doğrulanmadı.
8. **Aksiyon yorumunun tarihçede nasıl göründüğü (2.2)**; yorum kutusundaki biçimlendirme.
9. **Dokümantasyon Adresi / Destek Adresi (2.8)** görev ekranında nerede, hangi adla çıkıyor.
10. **Alt Akış modları (1.2).** Üç modun canlı davranışı, özellikle "senkronize" modunda sonlandırılan alt akışların kullanıcıya nasıl göründüğü; üst ve alt akışın aynı veriyi paylaşmasının formdaki sonucu.
11. **Olay adında veri kullanımı (1.4).** Kod olay adını da `{{…}}` ile biçimlendiriyor (`Logic/EventModuleHandler.cs:33`, `Logic/EventListenerModuleHandler.cs:26`); akışa özel olay adı (`Onay-{{Id}}`) kurulabildiği denenmeli. Dinleyicide `;` ile birden çok olay beklenebiliyor (`WI.cs:864-865`).
12. **Mağazada yayınlama (1.25).** Düğmenin hangi kurulumlarda göründüğü; müşteri ortamlarında mağaza modülü var mı.
13. **Resmi Dışarı Al (1.23).** Güncel tarayıcılarda yeni sekmenin açılıp açılmadığı (veri adresli pencere açmayı tarayıcılar engelleyebiliyor).
14. **İçerik Tipleri (1.13)** ve **Yapılandırma** kutusu (1.12): ne yazıldığı, nerede kullanıldığı.
15. **Yürütme Scripti'nin tam anı (1.7).** Her görevden sonra mı, işlemin sonunda bir kez mi (bir aksiyon birkaç görevi birden geçtiğinde).
16. **Görev şemadaki renk ve simgeler.** Modül görevinin şemada Normal görevden farklı çizilip çizilmediği okunmadı.
17. **"Süreç numaralandırma" ve "başlık / özet alanı" (1.21).** Tasarımcıda böyle bir ayar bulunamadı; akış numarasının biçimini değiştiren bir kiracı ayarı olup olmadığı bu taramanın dışında.
18. **Veritabanları** (şema, tablo, alan, ilişki, İlk Veri, Veri sekmesi) `PD.xml:1767-2864`'te tanımlı; `veritabanlari` sayfası bu taramanın sayfa listesinde olmadığı için karşılaştırılmadı. Göze çarpanlar: tablo alanında **Diller** (çok dilli alan; yalnızca Limitli / Limitsiz Metin tiplerinde), **Yetkilendiren**, **Güncelleme Kuralı**, şemada **Kaynak Yeri** (Dahili / Harici) ve **Bağlantı Adı** — `celiskiler.md` bunları "eğitimde anlatılmadı" diye açık bırakmış.
