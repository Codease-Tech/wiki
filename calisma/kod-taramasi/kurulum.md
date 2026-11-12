# Kod taraması: kurulum, yapılandırma, işletim

Tarih: 2026-11-12. Karşılaştırılan sayfalar: `docs/sunucu-kurulumu.md`, `docs/sunucu-yapisi.md`. Önceki doğrulamalar: `calisma/celiskiler.md` madde 123–138, `SORULAR.md` 9m–9p.

Yöntem: yalnızca dosya okundu; hiçbir şey derlenmedi, çalıştırılmadı, değiştirilmedi. Gizli değerler (parola, anahtar, bağlantı dizesi, alan adı, e-posta adresi) bu rapora yazılmadı; yalnızca ayar adları var.

Kanıt yolları `codEase-master/` köküne göredir. Kısaltmalar:

- `CT/` = `Src/CodEase.Workflow.ConfigurationTool/`
- `AG/` = `Src/CodEase.Workflow.Agent/`
- `WF/` = `Src/CodEase.Workflow/Business/Server/`
- `WEB/` = `Src/CodEase.Workflow.Web/`
- `APP/` = `Src/CodEase.Workflow.WebApp/`
- `FW/` = `Src/CodEase.Framework/`
- `CORE/` = `Src/CodEase/`
- `LDAP/` = `Src/CodEase.Web.OpenAuth.Ldap/`

Her bulguda **(okundu)** = satırı kendim açıp okudum; **(çıkarım)** = okunan satırlardan vardığım sonuç, çalıştırılarak sınanmadı.

---

## 1. Dokümanda hiç olmayan konular

### 1.1 Önkoşulların kodda görülen kesin değerleri — önem: yüksek

| Önkoşul | Kodda görülen | Kanıt |
|---|---|---|
| .NET Framework | Bütün projeler `v4.8`; `web.config` `compilation targetFramework="4.8"`, `httpRuntime targetFramework="4.8"`; Agent `supportedRuntime ... v4.8` | `Src/*/*.csproj` `TargetFrameworkVersion` satırları; `APP/Web.Global.Release.config:64,70`; `AG/app.config:22` (okundu) |
| Static (ayrı site şablonu) | `targetFramework="4.5.1"` yazıyor (4.8 kurulu sunucuda çalışır) | `Src/CodEase.WebApp.Static/Web.Global.Site.Release.config:21` (okundu) |
| IIS boru hattı | Bütünleşik (Integrated) kip varsayılıyor: ayarlar `system.webServer/modules` altında, `runAllManagedModulesForAllRequests="true"` | `APP/Web.Global.Release.config:140-146` (okundu; "Integrated şart" çıkarım) |
| IIS özelliği: WebSocket | Anlık bildirimler WebSocket ile; `IsWebSocketRequest` değilse hiçbir şey yapılmıyor | `WEB/NotifyHandler.cs:23-30`, `WEB/UserSocketContext.cs:163-211` (okundu). "IIS'te **WebSocket Protocol** özelliği kurulmalı" çıkarım |
| IIS özelliği: Windows Authentication | Yalnızca LDAP sitesinin `winauth` klasörü için (tek oturum açma) | `LDAP/winauth/web.config:5-8` (okundu) |
| IIS özelliği: Request Filtering, Static Content, HTTP Errors | `web.config` bu bölümleri kullanıyor | `APP/Web.Global.Release.config:147-165` (okundu) |
| WCF | `system.serviceModel` + `aspNetCompatibilityEnabled`; `.asmx` uçları da var. "HTTP Activation" özelliğinin gerekip gerekmediği **kodda yok** | `APP/Web.Global.Release.config:110-136` (okundu) |
| SQL Server sürümü | Kesin sürüm **kodda yok**. Kullanılan özellikler: `datetimeoffset`, `xml` sütunları, `ROW_NUMBER()`, `sys.dm_db_index_physical_stats` → en az SQL Server 2008 (çıkarım). Uyumluluk düzeyi ayarı yok | `CORE/Data/Access/Adapters/MSSQL/SqlDataAdapter.cs:51-52,182-199`; `WF/Plugins/Maintenance.cs:29-35` (okundu) |
| Bağlantı dizesi | Şablonda `MultipleActiveResultSets` anahtarı var (MARS); değiştirilirken korunmalı | `APP/Configuration.global/connectionStrings.config:2-3` (anahtar adları okundu) |
| Java | Kesin sürüm **kodda yok**. Paketteki BaseX `8.5.3`, `Build-Jdk: 1.7.0_79` → Java 7 ve üstü (çıkarım). 64 bit şartı kodda yok; kurulum aracı yalnızca `PATH`'te `java.exe` arıyor | `Tools/BaseX/BaseX.jar` → `META-INF/MANIFEST.MF`; `Tools/BaseX/lib/basex-api-8.5.3.jar`; `CT/App/ConfigurationContext.cs:24-34` (okundu) |
| BaseX belleği | Servis komutunda `-Xmx512m` sabit | `CT/App/ConfigurationContext.cs:37` (okundu) |
| Redis | Paketteki `redis-server.exe` içinde sürüm dizgisi `3.0.503` (Windows portu); port `6379` | `Tools/Redis/redis-server.exe` (dizgi taraması), `Tools/Redis/redis.windows.conf:41` (okundu) |
| Redis istemcisi | `StackExchange.Redis`; bağlantıya her zaman `allowAdmin=true` ekleniyor | `FW/Cache.cs:25` (okundu) |
| PDF üretimi | `wkhtmltopdf.exe` (win32) Web `bin` ve Agent klasörüne kopyalanıyor; ayrı kurulum gerekmiyor | `codease.proj:74,98,304-306,355-357`; `WF/Logic/PdfConverter.cs:234-237` (okundu) |
| Ses dökümü (AI) | Whisper modeli ve `runtimes\win-x64` paketle geliyor → 64 bit uygulama havuzu (çıkarım) | `codease.proj:308-319` (okundu) |

Nereye: `sunucu-kurulumu` → "Kurulumdan önce" tablosu. SORULAR 9o'daki "resmi liste var mı" sorusu için: kodda resmi liste yok, yukarıdaki tablo koddan çıkarılabilen her şey.

### 1.2 SSL / HTTPS kurulumu — önem: yüksek

- **`useSSL`** (varsayılan `false`): `true` iken kiracı adresine güvensiz gelen **GET** istekleri `https://<kiracı>.<uygulama>` adresine yönlendirilir; GET olmayan istek `SSL connection is required.` hatası alır. Yönlendirme yalnızca kiracı tanınmışsa yapılır. — `WEB/WebModule.cs:135-148` (okundu)
- **`forceSSL`** (varsayılan `false`): yönlendirme **yapmaz**, yalnızca üretilen bütün adresleri (`staticUrl`, kiracı adresi, e-postalardaki bağlantılar) `https` yapar. SSL'in IIS'ten önce bir yük dengeleyicide/ters vekilde sonlandığı kurulum için uygun görünüyor (istek sunucuya `http` gelir, `useSSL` sonsuz yönlendirmeye düşer). — `WF/Application.cs:653`, `WF/Domain.cs:225`, `WEB/UrlHandler.cs:180,204` (okundu; "ters vekil için" çıkarım)
- `staticUrl` `http` ile başlamıyorsa şema `useSSL || forceSSL`'e göre eklenir, port silinir. — `WF/Application.cs:649-658` (okundu)
- **Oturum çerezi:** şablonda etkin satır `requireSSL` içermiyor; hemen altında yorum satırı olarak `requireSSL="true" cookieSameSite="None"` içeren ikinci bir `<forms>` satırı hazır duruyor. HTTPS kurulumunda bu satırlar yer değiştirilmeli. — `APP/Web.Global.Release.config:67-68` (okundu; "değiştirilmeli" çıkarım)
- **Dil çerezi `cultPref`** her zaman `Secure` ve `SameSite=None` gönderiliyor; düz HTTP kurulumda tarayıcı bu çerezi kabul etmez (dil tercihi çerezle taşınamaz). — `CORE/Web/LanguagePreference.cs:116-119` (okundu; sonuç çıkarım)
- `app/Web.config` içinde yorum satırı olarak hazır bir HTTP→HTTPS yönlendirme kuralı var. — `APP/app/Web.config:3-9` (okundu)
- `www.<uygulama>` adresleri (`GetWebUrl`) her zaman `http` üretilir. — `WEB/UrlHandler.cs:191-200` (okundu)
- IIS'e 443 bağlaması ve sertifika atama **elle** yapılır; kurulum aracında 443 satırı yorumda. — `CT/App/Util.cs:180-188` (okundu)
- Joker sertifika gerekir (`*.<uygulama>`): her kiracı ayrı alt alan adı. (çıkarım; `WF/Domain.cs:213-216`)
- `trustedCertificatesPath` (varsayılan `TrustedCertificates`, `Web\Configuration` altı): e-imza/zaman damgası için kök sertifikaların klasörü. `timestampServerUrl / User / Password`: zaman damgası sunucusu. — `WF/Configuration/ApplicationElement.cs:170-174,227-243`, `WF/Domain.cs:134-142` (okundu)

Nereye: `sunucu-kurulumu`'na yeni bölüm "SSL ile kurulum" ya da ayrı sayfa `ssl-kurulumu`.

### 1.3 Sürüm yükseltme — önem: yüksek

- **Şema yükseltmesi otomatiktir.** Her veri tabanı nesnesi açılışta sırayla `CreateTables` → `Upgrade` → `CreateIndices` çalıştırır; `DbVersion` tablosundaki sürümden büyük kayıtlı yükseltmeler tek işlem içinde uygulanır. İlk kurulumda (sürüm yok) yükseltmeler atlanır, yalnızca son sürüm numarası yazılır. — `CORE/Data/Access/Database.cs:105-122,195-241` (okundu)
- Sistem veri tabanında 36 kayıtlı yükseltme var. — `WF/Logic/Core/Database.cs:615-650` (okundu)
- Yükseltmeyi **ilk açılan süreç** yapar: Agent (`-c`, `-r` ya da servis) ya da web uygulamasının ilk isteği. — `WF/Application.cs:54,65-66`; `AG/Agent.cs:59-64`; `WEB/UrlHandler.cs:76-78` (okundu)
- Sistem tablolarının öneki `w`, veri deposu kayıt tablolarının öneki `r`. — `WF/Logic/Core/Database.cs:17-18`; `WF/Application.cs:66` (okundu)
- **Dosyalar:** derleme paketi `web.config`'i ve `Configuration` klasörünü dışarıda bırakır, `Web.Global.config` ile `Configuration.global\` şablonlarını yeniler. Yani üzerine kopyalamak kullanıcının ayarlarını ezmez; yeni ayarlar şablondan elle aktarılır. — `codease.proj:203-214,262-277,347-353` (okundu)
- **Dikkat:** `Web\Configuration\System\*.xml` (sistem süreçleri), `MessageTemplates.xml`, `AI\PromptTemplates.xml` ve `codEase.xml.schema.config` da `Configuration` klasöründedir; üzerine kopyalama bunları **yenilemez**. Yeni sürümdeki sistem süreçleri/şablonlar için `Configuration.global\` altındakiler elle `Configuration\` altına alınmalı. — `APP/Configuration.global/` içeriği; `WF/Application.cs:681-687`; `WF/Logic/SystemFolder.cs:19-43` (okundu; "elle alınmalı" çıkarım)
- **Lisans:** doğrulamada ürünün ana ve alt sürüm numarası lisans özellikleriyle karşılaştırılıyor (`Major Version`, `Minor Version`). Lisans dosyasında bu özellikler varsa, sürüm numarası değişen bir yükseltmeden sonra lisans geçersiz olur; yeni lisans gerekir. — `WF/Logic/LicenseManager.cs:110,125-129`; `CORE/Security/License/License.cs:247-288` (okundu; sonuç çıkarım)
- Önerilen sıra (çıkarım): Agent servisini durdur → uygulama havuzlarını durdur → yedek al (1.4) → dosyaları kopyala → şablon farklarını aktar → Agent'ı `-c` ile bir kez çalıştırıp şema yükseltmesini ve hataları ekranda gör → servisi ve havuzları başlat.
- Kurulum aracının `upgrade` komutu bu işi **yapmaz** (bkz. 4).

Nereye: yeni sayfa `surum-yukseltme` (SORULAR 9o "güncelleme adımları videolarda yok").

### 1.4 Yedekleme: neyin yedeği alınmalı — önem: yüksek

| Ne | Nerede | Kanıt |
|---|---|---|
| Sistem veri tabanı (`global` bağlantısı) | Süreçler, sürümler, akışlar, işler, **dosya ekleri** (`Files` tablosu, `Data` ikili sütunu), **form verisinin asıl kopyası** (`FormData.Graph`, XML sütunu), belgeler, kiracı kayıtları, **lisans** (`Licenses` tablosu), iş kuyruğu | `WF/Logic/Core/Database.cs:128-135,137-160,193-205,455-458` (okundu) |
| Veri deposu veri tabanları (`<dataRepositories>` altındaki her bağlantı) | Kiracıların organizasyon tabloları ve süreç şemalarının tabloları | `FW/Data/Repository/Server/DataStore.cs:24` (okundu) |
| Arşiv veri tabanları (`<dataArchives>` tanımlıysa) | Taşınmış dosya ve belgeler | `WF/Logic/ArchiveManager.cs:22-33,229-250` (okundu) |
| BaseX verisi | `.basex` → `DBPATH` klasörü. Form verisinin sorgulanabilir kopyası; bozulan koleksiyon SQL'deki kayıtlardan yeniden kurulabiliyor | `Tools/BaseX/.basex`; `WF/Logic/XmlRepositoryManager.cs:110-165`; `WF/Logic/Workers/FormDataXmlDatabase.cs:33-58` (okundu; "yeniden kurulabilir, yine de yedeklenmeli" çıkarım) |
| Tam metin dizini (Lucene) | `%ProgramData%\CodEase\FullText\<kiracı kimliği>` — kurulum klasörünün **dışında** | `WF/Logic/FullTextManager.cs:36,62,100` (okundu) |
| Web servis sertifikaları | `%ProgramData%\CodEase\WSCertificates` | `WF/Services/ProcessService.cs:131-140` (okundu) |
| Yapılandırma | `Web\web.config`, `Web\Configuration\` (tamamı), `Static\web.config`, `Static\configuration\`, `CodEase.Workflow.Agent.exe.config`, `nlog.config`, LDAP sitesi kullanılıyorsa onun `web.config`'i | 1.3'teki kanıtlar |
| **Makine anahtarı** | `Web\Configuration\machinekey.config`. Kaybolursa bekleyen davet/doğrulama bağlantıları ve oturumlar geçersiz olur (çıkarım) | `AG/app.config:10`; `APP/Web.Global.Release.config:54` (okundu) |
| Lisans | Dosya içe alınınca **silinir**; kopya veri tabanındadır. Özgün `license.xml` ayrıca saklanmalı | `WF/Logic/LicenseManager.cs:43-53` (okundu) |
| Süreç tanımı yedekleri | `processBackupPath` ayarlanmışsa (bkz. 1.12) | `WF/Logic/ProcessVersionManager.cs:480-510` (okundu) |
| Redis | Yedeklenecek bir şey yok: şablonda kalıcılık kapalı (`save ""`, `appendonly no`) | `Tools/Redis/redis.windows.conf:140,522` (okundu) |

Not: dosya ekleri SQL Server'da tutulduğu için veri tabanı hızlı büyür; Express sürümünün veri tabanı boyut sınırı burada belirleyici olur (genel bilgi, koddan değil).

Nereye: yeni sayfa `yedekleme` ya da `sunucu-yapisi`'na bölüm.

### 1.5 Korumasız kiracılar kendiliğinden silinir (`domainExpirationDays`) — önem: çok yüksek

- Agent, **korumalı olmayan** ve son erişimi `domainExpirationDays` günden (varsayılan **365**) eski kiracıları "siliniyor" durumuna alıp silme işi (`Workflow.Domain.Delete`) kuyruğa koyar. — `WF/Logic/DomainManager.cs:318-329,368-377`; `WF/Logic/Core/DomainDatabase.cs` (`ListExpiredDomains`, `Protected = false` ölçütü); `WF/Configuration/ApplicationElement.cs:80-87` (okundu)
- `Agent.exe -r` ile açılan kiracı **korumalıdır** (`isProtected = true`). — `AG/Program.cs:247` (okundu)
- Web kayıt sayfasından açılan kiracı **korumasızdır** (`isProtected = false`). — `WEB/Pages/RegisterCallback.cs:97,115` (okundu)
- Son erişim, bir kullanıcı oturumu açıldıkça güncellenir. — `WF/Application.cs:784` (okundu)
- Kodda kiracıyı sonradan korumalı yapan bir komut ya da ekran görmedim (bakılan: `DomainManager.cs`, `Program.cs`, `WEB/RPC/Domain.cs`). **Doğrulanamadı.**

Nereye: `sunucu-yapisi` → "Uygulama ve kiracılar"a uyarı kutusu; `sunucu-kurulumu` §10'a "üretim kiracılarını `-r` ile açın".

### 1.6 Kiracı düzeyi ve `domainDefaultLevel` — önem: yüksek (SORULAR 9n'nin yanıtı)

- Düzeyler: `OEM`=3, `Standard`=5, `Developer`=10, `Publisher`=50, `Enterprise`=100. — `Src/CodEase.Workflow/Business/DomainLevel.cs` (okundu)
- Yeni kiracının düzeyi, hem `-r` hem web kaydında `domainDefaultLevel` ayarından gelir (varsayılan `Standard`). — `WF/Application.cs:325,345`; `WF/Configuration/ApplicationElement.cs:74-78` (okundu)
- `Developer` altı kiracıda süreç oluşturma `Invalid domain level.` hatasıyla reddedilir. — `WF/Logic/ProcessManager.cs:141-142` (okundu)
- `Publisher` altı kiracı Market'e ürün yayımlayamaz. — `WF/Logic/MarketManager.cs:270` (okundu)
- `Standard` üstü kiracılarda hata raporu e-postası sistem yöneticisine değil **kiracı yöneticisine** gider. — `WF/Application.cs:1107-1111` (okundu)
- Lisans, her düzeydeki kiracı sayısını ayrı ayrı sınırlar (`Developer Domain Count` vb.); `Developer` kiracı açmak için lisansın buna izin vermesi gerekir. — `WF/Logic/LicenseManager.cs:123-134` (okundu)
- **Var olan kiracının düzeyini değiştiren bir komut ya da ekran kodda yok** (aranan: `SetLevel/UpdateLevel/ChangeLevel`, `.Level` kullanımları). Düzey yalnızca oluşturulurken yazılıyor.
- Sonuç (çıkarım): 9n-(a) için doğru yol, **ilk kiracıyı açmadan önce** `workflow.config`'teki `<add name=…>` satırına `domainDefaultLevel="Developer"` yazmaktır; videodaki elle tablo güncellemesine gerek kalmaz. Değer adı enum adıyla aynı yazılmalı. Denenmedi.

Nereye: `sunucu-kurulumu` §3 tablosuna satır + §10'dan önce not; `sunucu-yapisi` sorun gidermedeki "desteğe danışın" satırı buna göre değişir.

### 1.7 Web'den kiracı kaydının işleyişi — önem: orta

- Kayıt sayfası `www.<uygulama>/register` adresindedir; `www` özel "web" alanıdır. — `WEB/UrlHandler.cs:170-176`; `WEB/Pages/Register.cs:53-57`; `APP/Web.Global.Release.config:88-90` (okundu)
- Kayıt e-posta doğrulaması ister: `Registration` şablonuyla bağlantı gönderilir, kiracı bağlantıya tıklanınca oluşur. E-posta ayarı çalışmıyorsa web kaydı tamamlanamaz. Seçenek olarak dış giriş sağlayıcısıyla kayıt da var. — `WEB/RPC/Login.cs:101-135`; `WEB/Pages/RegisterCallback.cs:86-124` (okundu)
- Kiracı adı süzülür: küçük harfe çevrilir, yalnızca harf/rakam/`-` kalır, en çok 20 karakter. — `WEB/UrlHandler.cs:228-248` (okundu)
- Tanınmayan bir alt alan adına gelen istek `http://www.<uygulama>/trynow?domain=…` adresine, kiracısız (çıplak alan adı) istek `http://www.<uygulama>` adresine yönlendirilir. `www` bu sunucuya gelmiyorsa kullanıcı kurumun başka sitesine düşer. — `WEB/Pages/Content.cs:16-28` (okundu)
- Web kaydını kapatan bir ayar görmedim (bakılan: `ApplicationElement.cs` öznitelikleri, `Register.cs`, `RPC/Login.cs`). **Doğrulanamadı.** `www.<uygulama>` bu sunucuya yönlenirse ağdaki herkes kiracı açabilir (çıkarım).

Nereye: `sunucu-yapisi` → "Uygulama ve kiracılar".

### 1.8 Kimlik doğrulama: LDAP / Active Directory ve dış sağlayıcılar — önem: yüksek

**Genel düzen.** Giriş yöntemleri `workflow.config` → `<loginServices>` altında `clientType` ile tanımlanır. Bir yöntem ancak `enabled="true"` **ve** `clientId` doluysa giriş ekranında görünür. — `WF/Application.cs:864-890` (okundu)

`<loginServices><add …>` öznitelikleri (`FW/Security/OpenAuth/Configuration/ClientConfiguration.cs:10-147`, okundu):

| Öznitelik | Anlamı | Varsayılan |
|---|---|---|
| `clientType` | Sağlayıcı türü (zorunlu, anahtar) | — |
| `clientAssembly` | Sağlayıcı sınıfı başka derlemedeyse adı | boş |
| `displayName` | Giriş ekranında görünen ad | — |
| `enabled` | Açık/kapalı | `true` |
| `clientId`, `clientSecret`, `clientPublic` | Sağlayıcıdaki uygulama kimliği / gizli anahtarı / açık anahtarı | boş |
| `scope` | İstenen izinler | boş |
| `baseUri` | Sağlayıcının kök adresi; `$DomainUrl` kiracı adresiyle değişir | boş |
| `redirectUri` | Dönüş adresi; `$DomainUrl` desteklenir | boş |
| `accessCodeUri`, `tokenUri`, `userInfoUri` | OAuth uç adresleri (boşsa sağlayıcı varsayılanı) | boş |
| `autoRegister` | Tanınmayan kullanıcı ilk girişte otomatik açılsın | `false` |
| `autoRegisterToGroup` | Otomatik açılan kullanıcının ekleneceği grup | boş |
| `serviceAccountId`, `serviceAccountKey` | Servis hesabı (bazı sağlayıcılar) | boş |

Hazır sağlayıcı sınıfları: `Organization` (yerleşik e-posta/parola), `Ldap`, `Office365`, `Google`, `WindowsLive`, `PingID`, `Salesforce`, `Securify`, `GitHub`, `Facebook`, `Linkedin`, `Twitter`, `Yandex`, `Vk`, `MailRu`, `Odnoklassniki`, `Instagram`, `Foursquare`. — `FW/Security/OpenAuth/Client/Impl/` (dosya adları okundu; hangilerinin güncel çalıştığı **doğrulanamadı**)

Kiracı düzeyinde geçersiz kılma: kiracının kendi ayarlarında (`Logins`) aynı `clientType` için tanım varsa uygulama ayarının üzerine yazılır. — `WF/Application.cs:870-882` (okundu)

**LDAP / Active Directory.** Ayrı bir IIS sitesidir (`OpenAuth.Ldap\Web`); CodEase'e OAuth sağlayıcısı gibi davranır.

1. Paketteki `OpenAuth.Ldap\Web` klasörü için ayrı bir IIS sitesi açılır; `Web.Global.config` → `web.config`. — `codease.proj:411-436` (okundu)
2. Sitenin `appSettings` anahtarları (`LDAP/Web.global.release.config:12-26`; `LDAP/App_Code/Ldap.cs:17-28`; `LDAP/global.asax.cs:17-52`, okundu):

| Anahtar | Anlamı |
|---|---|
| `ldapServer` | LDAP sunucu adresi (`LDAP://sunucu:port/` biçimi) |
| `ldapRoot` | Dizin kökü (`DC=…` biçimi); `ldapServer`'ın sonuna eklenir |
| `ldapDefaultDomain` | Kullanıcı adı `ALAN\kullanıcı` biçiminde değilse öne eklenecek alan |
| `ldapAuthType` | `System.DirectoryServices.AuthenticationTypes` değeri; çözümlenemezse `None` olur |
| `loginTitle` | Giriş sayfası başlığı; boşsa sunucu adı |
| `ClientId`, `ClientSecret` | CodEase'in bu siteye kendini tanıtacağı kimlik; boşsa ikisi de sabit bir varsayılan alır |
| `keepSession`, `rememberForDays`, `loginPage`, `storeType` | İsteğe bağlı: oturumu tut, "beni hatırla" süresi, özel giriş sayfası, anahtar deposu türü (şablonda yorum içinde) |

3. `workflow.config`'te `clientType="Ldap"` satırına `baseUri` (LDAP sitesinin adresi) ve `clientId` / `clientSecret` (yukarıdakiyle aynı) yazılır. İstemci `baseUri + /oauth/auth`, `/oauth/token`, `/oauth/userinfo` adreslerini kullanır. Şablonda bu satırda `clientId` **boştur**, yani LDAP girişi görünmez. — `FW/Security/OpenAuth/Client/Impl/Ldap.cs:11-25`; `APP/Configuration.global/workflow.config:15` (okundu)
4. Kullanıcı `samAccountName` ile aranır; `cn/displayName`, `givenname`, `sn`, `mail` alınır. — `LDAP/App_Code/Ldap.cs:29-33,63` (okundu)
5. Tek oturum açma: sitenin `winauth` klasöründe Windows kimlik doğrulaması açık, anonim kapalı; oturum açmış Windows kullanıcısı parolasız geçer. IIS'te **Windows Authentication** özelliği gerekir. — `LDAP/winauth/web.config:5-8`; `LDAP/winauth/default.aspx:17-37` (okundu)
6. LDAP sitesinin günlük dosyası yanlış adla yazılıyor: `_logs_\agent.<Düzey>.txt` (kendi klasöründe). — `LDAP/Web.global.release.config:31` (okundu)
7. Bağlantıyı sınamak için pakette değil ama depoda `Tools/Ldap/ldp.exe` var.

Nereye: yeni sayfa `kimlik-dogrulama` (kurulum ve yönetim grubu).

### 1.9 Lisans: neyi sınırlar, geçersizken ne olur — önem: yüksek

- Lisans sistem veri tabanında (`Licenses` tablosu) **uygulama adıyla** saklanır ve aranır. `workflow.config`'teki `name` değişirse lisans bulunamaz. — `WF/Logic/LicenseManager.cs:33-41,114` (okundu)
- Doğrulananlar: imza (ürün sertifikasıyla), `Major Version`, `Minor Version`, `Application`, düzey başına kiracı sayısı (`Enterprise / Publisher / Developer / Standard / OEM Domain Count`). Lisansta `Machine Id` özelliği varsa sunucunun Windows makine kimliği de karşılaştırılır (lisans o sunucuya bağlanır). — `WF/Logic/LicenseManager.cs:125-135`; `CORE/Security/License/License.cs:198-288,310-328` (okundu)
- Lisanstaki her özelliğin karşılığı olmalı; adında `Count` geçenlerde "şimdiki ≤ lisanstaki" aranır, diğerlerinde eşitlik. `Extend` işaretli özellik aşılırsa lisans kendini genişletip yeniden kaydeder. — `License.cs:247-305` (okundu)
- **Süre:** `ExpiresAt` imzanın parçası, ama `Validate` süresi dolmuş lisansı **reddetmiyor**; `IsExpired` yalnızca otomatik genişletmeyi engelliyor. Bu kod tabanında süre dolunca çalışmayı durduran bir denetim görmedim. — `License.cs:137-140,291` (okundu; "durmuyor" çıkarım — ürün sahibine sorulmalı)
- **Geçersiz/eksik lisansın etkisi:** web arayüzü açılır, giriş yapılır. Duranlar: iş adımı işleme (`Workflow.WorkItem.Process`), adım değerlendirme (`Workflow.WorkItem.Evaluate`), zamanlanmış görevler (`Workflow.ScheduledTask`). Bu işler `Invalid application license.` iletisiyle hata verir. E-posta gönderimi (`Workflow.Message.Send`) lisansa **bakmaz**. — `WF/Logic/Workers/WorkItemProcess.cs:34-39`, `WorkItemEvaluate.cs:41-43`, `ScheduledTask.cs:44-46`, `WF/Logic/ScheduledTaskManager.cs:140-144`; `MessageSend.cs` içinde lisans denetimi yok (okundu)
- Açılışta günlüğe `Application license not found` (Error) ve `Application has invalid license. Please check your license configuration.` (Fatal) yazılır. — `LicenseManager.cs:119`; `WF/Application.cs:98-101` (okundu)
- **Yenileme:** yeni `license.xml` aynı yolla yüklenir; aynı uygulama adındaki kaydın üzerine yazar. İki yol var: dosyayı `Web\Configuration`'a bırakmak (açılışta içe alınır ve silinir) ya da `Agent.exe -license` (dosya yolunu sorar, silmez). — `LicenseManager.cs:43-72`; `AG/Program.cs:295-311` (okundu)
- Lisans dosyasını **ilk açılan süreç** içe alır: Agent olmak zorunda değil, web uygulamasının ilk isteği de alır (o zaman silme yetkisi uygulama havuzu kullanıcısında aranır). — `WF/Application.cs:96` (okundu)
- Hata ayıklama (DEBUG) derlemesinde lisans denetimi her zaman geçer. — `LicenseManager.cs:103-104` (okundu)

Nereye: yeni sayfa `lisans` ya da `sunucu-yapisi`'na bölüm.

### 1.10 Agent'ın belgelenmemiş komut satırı anahtarları — önem: orta (SORULAR 9m)

`AG/Program.cs:16-112` (okundu):

| Anahtar | Ne yapar | Not |
|---|---|---|
| `-i [ad]` | Servisi kurar. İkinci parametre verilirse görünen ad o olur; servis adı boşluksuz hâlidir | Varsayılan görünen ad `CodEase Agent`, servis adı `CodEaseAgent` (`Program.cs:14,29-32`; `ProjectInstaller.cs:18-19`). Aynı sunucuya ikinci Agent kurmak için |
| `-u [ad]` | Servisi kaldırır | Özel adla kurulduysa aynı ad verilmeli |
| `-c` | Konsolda çalıştırır | Konsola `Trace` düzeyinde yazar (`AG/nlog.global.config:16`) |
| `-r` | Kiracı açar (korumalı) | bkz. 2.11 |
| `-rf` | `-r` ile aynı sorular; kiracı **zaten varsa** hata vermez, verilen e-posta/parolayla o kiracıya yeni bir yönetici kullanıcı ekler | `WF/Application.cs:377-388`. Yönetici parolası kaybolduğunda kurtarma yolu olabilir (çıkarım, denenmedi) |
| `-ds` | Adlandırılmış veri deposu kaydeder: "Store name" (adı `PS_` ile başlamalı) ve isteğe bağlı bir süreç tanım dosyası sorar; dosyadaki şemaları o depoya kurar | `Program.cs:261-293`; `WF/Application.cs:425-475`. Boş dosya adı verilirse `definition != null` denetimi boş dizgiyi yakalamaz, dosya açma hatası verir (çıkarım) |
| `-enc` | Agent'ın yapılandırmasındaki `connectionStrings` ve `workflow` bölümlerini `RsaProtectedConfigurationProvider` ile şifreler | `Program.cs:119-130`. Bu bölümler `Web\Configuration\` dosyalarına bağlı olduğu için o dosyalar şifrelenir; web uygulaması da aynı dosyaları okur, uygulama havuzu kullanıcısının makine RSA anahtar deposuna erişimi gerekir (çıkarım, denenmedi). Başarılı olsa da çıkış kodu `-1` döner, ekrana bir şey yazmaz |
| `-dec` | Şifreyi çözer | `Program.cs:132-143` |
| `-license` | "License file name" sorar, lisansı içe alır | `Program.cs:295-311` |
| (parametresiz) | Servis olarak çalışır | `Program.cs:316-327` |

`/i /u /r /rf /ds` yazımları da kabul edilir. Tanınmayan anahtar: `Invalid argument.`

Nereye: `sunucu-yapisi` → "Agent komutları" tablosu.

### 1.11 Agent hangi işleri, hangi sıklıkta çalıştırır — önem: orta

- Havuz **1 dakikada bir** kuyruğu yoklar; web uygulaması yeni iş koyunca Redis üzerinden "uyan" işareti gönderir, beklemeden başlar. — `AG/Agent.cs:47`; `CORE/Workers/WorkerPool.cs:237-257`; `WF/Application.cs:132-156` (okundu)
- Eşzamanlı iş sayısı varsayılan olarak **işlemci çekirdeği sayısı**. — `WorkerPool.cs:22-26` (okundu)
- 5 dakikadır yoklama yapılamadıysa günlüğe `Fetch did not run since … minutes` uyarısı düşer. — `WorkerPool.cs:156-163` (okundu)

İşler (`WF/Logic/JobManager.cs:76-234`, okundu):

| İş adı | Ne yapar | Yeniden deneme | Kayıt saklama |
|---|---|---|---|
| `Workflow.WorkItem.Process` | Akış adımını işler | 20 kez, 10 dk arayla, sonra Hata | 6 ay |
| `Workflow.WorkItem.Evaluate` | Adım değerlendirme | 20 kez, 10 dk, sonra İptal | 6 ay |
| `Workflow.Task.Evaluate` | Görev değerlendirme | — | 6 ay |
| `Workflow.WorkItem.Deadline` | Süre aşımı | 20 kez, 10 dk, sonra İptal | 6 ay |
| `Workflow.WorkItem.Reminder` | Hatırlatma | — | 2 ay |
| `Workflow.ScheduledTask` | Zamanlanmış görev | — | 3 ay |
| `Workflow.Message.Send` | E-posta gönderimi | 10 kez, sonra İptal (uyarı yok) | 3 ay |
| `Workflow.FormData.XmlDatabase`, `Workflow.Instance.XmlDatabase` | Veriyi BaseX'e yazar | 10 kez | 2 gün |
| `Workflow.FormData.XmlDatabaseRemover` | BaseX'ten siler | 10 kez | 2 gün |
| `Workflow.Document.FullText`, `Workflow.WorkItem.FullText`, `Workflow.FullText.Remover` | Tam metin dizini | 10–20 kez | 2 gün |
| `Workflow.Domain.Delete` | Süresi dolan korumasız kiracıyı siler (1.5) | — | — |
| `Workflow.Domain.Upgrade` | Kiracıdaki Market ürünlerini günceller | — | 6 ay |

Zaman aşımları: süreç işleri 1 saat, BaseX ve Lucene işleri 10 dakika. — `JobManager.cs:17-20` (okundu)

Bakım işleri ve sıklıkları (`JobManager.cs:39-47`, okundu): zaman aşımına uğrayan işleri iptal 4 saatte bir, eski iş kayıtlarını silme 8 saatte bir, tam metin bakımı 4 saatte bir, BaseX kayıt bakımı saatte bir, kiracı bakımı 12 saatte bir, etkinlik bakımı 24 saatte bir. Ayrıca boşta kalınca: SQL Server'da parçalanması %30'u geçen tabloların dizinlerini yeniden kurar (günde en çok bir kez) ve bozuk BaseX koleksiyonlarını onarır. — `WF/Application.cs:1208-1226`; `WF/Logic/Core/Database.cs:656-689`; `WF/Plugins/Maintenance.cs:29-35` (okundu)

**İş ayarlarını değiştirme.** `workflow.config`'te yorum içinde hazır bir `<workers>` bölümü var: `name`, `priority`, `deleteAfter`, `retryDuration`, `maxRetry`, `maxRetryResult`, `errorResult`, `alertError`, `alertAbort`, ayrıca `timeout`, `alertToSystemAdmin`. — `APP/Configuration.global/workflow.config:37-43`; `CORE/Workers/Configuration/WorkerConfigurationElement.cs:12-97`; `JobManager.cs:241-271` (okundu)

**Havuz ayarı (`workerPool` bölümü, Agent'ın `.config` dosyası).** Bölüm tanımlı ama şablonda içeriği yok; eklenebilecek öznitelikler: `maxThread` (varsayılan -1 = çekirdek sayısı), `maintenanceTasksEnabled` (true), `scheduledTasksEnabled` (true), `enabledWorkers`, `disabledWorkers`, `enabledGroups`, `disabledGroup` listeleri. Birden çok Agent çalıştırıp işleri paylaştırmak için. — `AG/app.config:7`; `CORE/Workers/Configuration/PoolConfigurationSection.cs:12-64` (okundu; kullanım amacı çıkarım)

Nereye: `sunucu-yapisi` → Agent için yeni bölüm.

### 1.12 `workflow.config` → `<add name=…>` satırının bütün öznitelikleri — önem: yüksek

`WF/Configuration/ApplicationElement.cs:16-267` (okundu). Sayfada yalnızca beşi var (`name`, `connectionName`, `useSSL`, `staticUrl`, `systemAdmin`).

| Öznitelik | Anlamı | Varsayılan |
|---|---|---|
| `name` | Uygulamanın ana alan adı | — |
| `title` | Uygulama başlığı | ürün adı |
| `connectionName` | Sistem tablolarının bağlantı adı | — |
| `staticUrl` | Static adresi; `{0}` = kiracı adı | **üreticinin kendi Static adresi** (bkz. 2.8) |
| `marketUrl` | Market adresi | üreticinin Market adresi |
| `systemAdmin` | Hata/uyarı raporlarının gittiği adres | **üreticinin destek adresi** (bkz. 1.20) |
| `useSSL` | HTTPS'e yönlendir | `false` |
| `forceSSL` | Yönlendirmeden adresleri HTTPS üret | `false` |
| `domainDefaultLevel` | Yeni kiracının düzeyi | `Standard` |
| `domainExpirationDays` | Korumasız kiracının silinme süresi (gün) | `365` |
| `reservedDomains` | Kiracı adı olamayacak adlar, virgülle | 16 adlık liste (çelişki 131) |
| `scheduledTaskLimitMinutes` | Zamanlanmış görev süre sınırı (dk) | `10` |
| `pdfConversionTimeout` | PDF dönüştürme bekleme süresi (sn) | `15` |
| `enforceSingleSession` | Kullanıcı başına tek oturum | `false` |
| `fullTextTimeout` | Tam metin zaman aşımı | `00:01:00` — tanımlı, kodda kullanıldığı yer **bulunamadı** |
| `messageTemplateFile` | E-posta şablon dosyası (`Configuration` altı) | `MessageTemplates.xml` |
| `promptTemplateFile` | AI istem şablonları | `AI\PromptTemplates.xml` |
| `systemFolderPath` | Sistem süreçlerinin klasörü (`Configuration` altı) | `system` |
| `trustedCertificatesPath` | Güvenilen kök sertifikalar klasörü | `TrustedCertificates` |
| `processBackupPath` | Doluysa, kaydedilen her süreç sürümünün XML'i buraya yazılır (`<kiracı kimliği>\<süreç kimliği>\`; sürüm başına son 5 dosya tutulur). Göreli yol `Web` klasörüne göredir | boş (kapalı) |
| `sendFeedback` | Hata geri bildirimini üreticiye gönder | `false` |
| `timestampServerUrl`, `timestampServerUser`, `timestampServerPassword` | Zaman damgası sunucusu | boş |

Alt bölümler: `messaging` (2.1), `dataRepositories`, `dataArchives` (1.17), `xmlRepositories` (2.10), `loginServices` (1.8), `fileServices`, `calendarServices`, `aiServices` (1.22), `workers` (1.11).

Kanıt (kullanım yerleri): `processBackupPath` → `WF/Logic/ProcessVersionManager.cs:480-510`; `pdfConversionTimeout` birimi → `WF/Logic/PdfConverter.cs:119-136`; `scheduledTaskLimitMinutes` → `WF/Logic/ScheduledTaskManager.cs:151`; `enforceSingleSession` → `WEB/SessionHandler.cs:209`.

Nereye: `sunucu-yapisi` → yeni bölüm "workflow.config başvurusu".

### 1.13 `appSettings` anahtarları ve ortam değişkenleri — önem: orta

Şablon `web.config`'te ve Agent `.config`'inde `appSettings` bölümü **yok**; gerekirse eklenir.

| Anahtar | Nerede | Anlamı | Yokken |
|---|---|---|---|
| `RedisConnection` | Web ve Agent | Redis bağlantısı (bkz. 2.9) | `localhost` |
| `TokenServers` | Web | API anahtarı olmadan `token` servisinden belirteç isteyebilecek IP'ler, `;` ile | yalnızca yerel makine |
| `AuthorizedOrigins` | Static | Yükleyicinin kabul edeceği kaynak adresler, `;` ya da `,` ile | varsayılan denetim |

Kanıt: `FW/Cache.cs:39-60`; `WEB/RestServices.cs:49-59`; `FW/Web/Loader/Rpc/Loader.cs:26-36` (okundu)

**Ortam değişkeniyle bağlantı:** `CONN_<bağlantı adı>` ortam değişkeni varsa bağlantı dizesi dosyadan değil oradan alınır; `CONN_<ad>_PROVIDER` sağlayıcı adını verir. Parolayı dosyaya yazmamanın ikinci yolu. — `CORE/Data/Access/Database.cs:56-71` (okundu)

Nereye: `sunucu-yapisi` → "Yapılandırma dosyaları".

### 1.14 SQL Server dışındaki veri tabanları ve şema adı — önem: düşük/orta

- Veri erişim katmanında üç bağdaştırıcı var: SQL Server, Oracle, PostgreSQL. Sağlayıcı, bağlantı satırındaki `providerName` ile seçilir; yoksa SQL Server. `web.config` ve Agent `.config` şablonlarında PostgreSQL (Npgsql) sağlayıcı kaydı hazır. — `CORE/Data/Access/Database.cs:27-29,70-71`; `APP/Web.Global.Release.config:36-46`; `AG/app.config:44-54` (okundu)
- Bağlantı dizesine `Default Schema` anahtarı yazılırsa tablolar o şemada açılır. — `Database.cs:78-86` (okundu)
- Oracle/PostgreSQL ile kurulumun desteklenip desteklenmediği **doğrulanamadı** (kullanıcıya sorulmalı).

### 1.15 Kurulum klasörü dışına yazılan yerler ve gereken yetkiler — önem: yüksek

Sayfa çalışma kullanıcısına yalnızca `C:\CodEase` için yetki verdiriyor. Kod ayrıca şuralara yazıyor:

- `%ProgramData%\CodEase\FullText\` — tam metin dizini (web ve Agent). — `WF/Logic/FullTextManager.cs:36` (okundu)
- `%ProgramData%\CodEase\WSCertificates\` — web servis sertifikaları. — `WF/Services/ProcessService.cs:131-140` (okundu)
- Kullanıcının geçici klasörü (`%TEMP%`) — PDF dönüştürme ve belge dizinleme ara dosyaları. — `WF/Logic/PdfConverter.cs:199`; `WF/Logic/Workers/DocumentFullText.cs:41` (okundu)

Çalışma kullanıcısının (`codease`) bu klasörlerde oluşturma/yazma yetkisi yoksa tam metin arama ve PDF üretimi hata verir (çıkarım).

Nereye: `sunucu-kurulumu` §6 "Kullanıcı" adım 3; `sunucu-yapisi` → "Çalışma kullanıcısı".

### 1.16 Dosya yükleme sınırı ve zaman aşımı — önem: orta

- `maxRequestLength="50000"` (KB) ve `maxAllowedContentLength="30000000"` (bayt). Küçük olan geçerli: yaklaşık **28 MB**. Daha büyük ek için ikisi birlikte yükseltilmeli. — `APP/Web.Global.Release.config:70,163` (okundu; "küçük olan geçerli" genel IIS bilgisi)
- İstek zaman aşımı `executionTimeout="600"` saniye. — aynı dosya `:70`
- `customErrors mode="On"`: ayrıntılı hata kullanıcıya gösterilmez (günlüğe yazılır). — `:56`
- `configuration` ve `content` yolları web'den erişime kapalı. — `:176-190`
- `X-Frame-Options: SAMEORIGIN` başlığı: uygulama başka sitenin çerçevesine gömülemez. — `:150-154`

Nereye: `sunucu-yapisi` → yeni bölüm "web.config'te bilinmesi gerekenler".

### 1.17 Veri arşivleme (`<dataArchives>`) — önem: düşük/orta

`workflow.config`'e `<dataArchives><add name="…" archiveBefore="tarih" /></dataArchives>` eklenirse, Agent bakım sırasında o tarihten eski dosya ve belgeleri sistem veri tabanından `name` adlı bağlantıdaki arşiv veri tabanına taşır. — `WF/Configuration/ApplicationElement.cs:107-114`; `FW/Data/Repository/Server/Configuration/ConnectionElement.cs:21-40`; `WF/Logic/ArchiveManager.cs:22-33,229-250` (okundu). Ayrıntılı davranış (geri okuma, hangi belgeler) incelenmedi.

### 1.18 Hata raporları kime gider (`systemAdmin`, `sendFeedback`) — önem: yüksek (gizlilik)

- Web'de yakalanmamış her hata (istek adresi, kullanıcı adı, istemci IP'si ve hata dökümüyle) ve "sistem yöneticisine bildir" işaretli iş hataları `systemAdmin` adresine e-postalanır. Yayın derlemesinde her yeni kiracı kaydı da bu adrese bildirilir. — `WEB/WebModule.cs:193-214`; `WF/Application.cs:362-365,1070-1141`; `WF/Logic/JobManager.cs:471,485` (okundu)
- `systemAdmin` özniteliği satırdan **silinirse** varsayılan, üreticinin destek adresidir: hata raporları kurum dışına gider. Şablonda öznitelik boş dizgiyle duruyor. — `WF/Configuration/ApplicationElement.cs:152`; `APP/Configuration.global/workflow.config:3` (okundu)
- `sendFeedback="true"` yapılırsa raporlar ayrıca üreticinin geri bildirim servisine gönderilir; varsayılan `false`. — `WF/Application.cs:1146-1157`; `ApplicationElement.cs:212` (okundu)
- Kurulum aracı da `sysadmin` için aynı üretici adresini varsayılan öneriyor. — `CT/App/ApplicationConfiguration.cs:62` (okundu)

Nereye: `sunucu-kurulumu` §3 tablosunda `systemAdmin` satırı.

### 1.19 Sık görülecek sabit hata iletileri — önem: orta

| İleti (kodda sabit) | Anlamı | Kanıt (okundu) |
|---|---|---|
| `'{0}' named application configuration not found.` | `workflow.config`'te o adla uygulama yok | `WF/Application.cs:45` |
| `'{0}' named connection is not found.` | `connectionStrings.config`'te o adla bağlantı yok (`connectionName` ya da `<dataRepositories>` adı yanlış) | `CORE/Data/Access/Database.cs:64` |
| `No adapter found for {0}` | `providerName` desteklenmeyen bir sağlayıcı | `Database.cs:45` |
| `No connection available. Define an data repository connection.` | `<dataRepositories>` boş | `FW/Data/Repository/Server/Configuration/ConnectionElementCollection.cs:40` |
| `No xml repository connection available. Define an xml repository connection.` | `<xmlRepositories>` boş | `FW/Data/XmlRepository/Configuration/ProviderElementCollection.cs:41` |
| `Message service not found.` / `There is no available messaging service is defined.` | `<messaging>`'de etkin servis yok ya da `default` adı tutmuyor | `WF/Configuration/MessageServiceElementCollection.cs:81`; `WF/Logic/Workers/MessageSend.cs:187-188` |
| `Exception occured while sending e-mail` | SMTP reddetti; ayrıntı aynı günlük satırında | `MessageSend.cs:160-163` |
| `Application license not found` / `Application has invalid license. …` / `Invalid application license.` | bkz. 1.9 | 1.9'daki kanıtlar |
| `Invalid domain level.` | Kiracı düzeyi süreç geliştirmeye yetmiyor (1.6) | `WF/Logic/ProcessManager.cs:142` |
| `SSL connection is required.` | `useSSL` açıkken HTTP üzerinden GET dışı istek | `WEB/WebModule.cs:146` |
| `Invalid domain name. Please choose different domain name.` | `-r`: ad ayrılmış adlardan | `AG/Program.cs:233` |
| `Exception occured while domain registry.` | `-r`: kiracı oluşturulamadı (ad zaten kayıtlıysa da bu çıkar); ayrıntı Agent günlüğünde | `AG/Program.cs:251-254`; `WF/Application.cs:379-380,420` |
| `Custom store names must be prefixed with 'PS_'.` | `-ds`: depo adı kuralı | `WF/Application.cs:429-430` |
| `Invalid API key for … token server` | Belirteç isteyen IP `TokenServers`'ta yok | `WEB/RestServices.cs:56-59` |
| `Fetch did not run since … minutes.` | Agent kuyruğu yoklayamıyor (takılı iş) | `CORE/Workers/WorkerPool.cs:156-163` |
| `Unhandled exception occured. RequestUrl: …, CurrentUser: …` | Web'de yakalanmamış hata (`web.Fatal.txt`) | `WEB/WebModule.cs:193` |
| `Cannot spawn external process.` | PDF dönüştürücü süresinde bitmedi (`pdfConversionTimeout`) | `WF/Logic/PdfConverter.cs:132-136` |

Nereye: `sunucu-yapisi` → "Sorun giderme"ye ikinci tablo "Günlükte görülen iletiler".

### 1.20 Dosya, takvim ve yapay zekâ servisleri — önem: düşük/orta

- `<fileServices>`: şablonda `Desktop` ve `Webcam` açık; `GoogleDrive`, `OneDrive`, `Office365` yorumda. `<calendarServices>`: `Delegation` açık; `Office365`, `Google` yorumda. Bir servis, bağlı olduğu giriş sağlayıcısı tanımlı değilse listelenmez. — `APP/Configuration.global/workflow.config:17-32`; `WF/Application.cs:942-966` (okundu)
- Servis satırı öznitelikleri: `clientType`, `clientAssembly`, `displayName`, `enabled` (true), `baseUri`, `logonProvider`, `scopes`, `apiKey`. — `FW/Data/Services/Configuration/ServiceConfiguration.cs:21-77` (öznitelik adları için satırlar okundu; `logonProvider`/`scopes`/`apiKey` yazımı sabit adlardan — **yazımı doğrulanmalı**)
- `<aiServices whisperModelPath="…">`: ses dökümü modeli (`Configuration` klasörüne göre); altında `OpenAI` ve `DeepSeek` satırları, `apiKey` boş. Kiracı kendi anahtarını kiracı ayarlarında verebilir. — `workflow.config:33-36`; `WF/Application.cs:968-1000`; `WF/Configuration/AIServices.cs:12` (okundu)

### 1.21 Redis ve BaseX'in paketle gelen ayarları — önem: orta

- **Redis:** port 6379; kalıcılık kapalı (`save ""`, `appendonly no`); `requirepass` ve `bind` etkin satır olarak yok → parolasız ve bütün ağ arayüzlerinde dinler. Güvenlik duvarında 6379 dışarıya kapatılmalı (çıkarım). — `Tools/Redis/redis.windows.conf:41,140,522` (okundu)
- **BaseX `.basex`:** paketle gelir (sayfadaki "dosya yoksa bir kez çalıştırın" adımına gerek olmayabilir). İçinde `DBPATH`, `REPOPATH` (ikisi de göreli bir klasör), `LOGPATH`, `PORT`/`SERVERPORT` (1984), `TIMEOUT`, `KEEPALIVE`, `PARALLEL`, `LOG` var. `DBPATH` değiştirilirken `REPOPATH` da düşünülmeli. — `Tools/BaseX/.basex` (okundu)
- **BaseX kimlik bilgisi:** `workflow.config` şablonundaki `xmlRepositories` → `uri` içinde BaseX'in fabrika çıkışı yönetici kullanıcı adı ve parolası yazılı. BaseX başka sunucudaysa ya da 1984 portu ağa açıksa parola değiştirilip `uri` güncellenmeli (çıkarım). — `APP/Configuration.global/workflow.config:8`; `FW/Data/XmlRepository/BaseX/BaseXProvider.cs:35-50` (okundu)

### 1.22 `Doc/` ve `Tools/` klasörlerinde kuruluma dair ne var — önem: bilgi

- `Doc/`: kurulum belgesi **yok**. Tasarım çizimleri (`.twd`), özellik listesi (`codease features.xlsx`), kayıt akışına dair kısa tasarım notu (`registration.txt`).
- `Tools/BaseX` (8.5.3 + `nssm.exe` + `.basex`), `Tools/Redis` (3.0.503 + `redis.windows.conf` + `redis-cli.exe`), `Tools/Lucene` (dizin inceleme aracı): üçü de derleme çıktısındaki `Tools` klasörüne kopyalanır. — `codease.proj:454-479` (okundu)
- `Tools/Ldap/ldp.exe` (LDAP bağlantı sınama), `Tools/Streams` (indirilen dosyalardaki "engelli" işaretini kaldırma betiği): pakete **kopyalanmaz**.
- `Tools/update_server.py`, `build_studio_ui.py`, `generate_ui.py`: kurulumla ilgisiz (AI stüdyo arayüzü).
- Kurulum aracı `CodEase.Configuration.exe` derleme çıktısının köküne yazılır. — `codease.proj:438-446` (okundu)

---

## 2. Dokümanda var ama eksik

### 2.1 E-posta ayarı: `useDomainName` ve varsayılanlar — önem: çok yüksek

`sunucu-kurulumu` §3'teki `<messaging>` örneğinde olmayan öznitelikler ve varsayılanlar (`WF/Configuration/MessageServiceElement.cs:15-93`, okundu):

| Öznitelik | Varsayılan | Not |
|---|---|---|
| `name` | zorunlu | `<messaging default="…">` ile eşleşmeli |
| `enabled` | `true` | |
| `host` | zorunlu | |
| `port` | `25` | Sayfadaki 587 şablondan geliyor |
| `sslEnabled` | `false` | |
| `user`, `password` | boş | `user` boşsa kimlik bilgisi gönderilmez |
| `fromAddress` | zorunlu | |
| `fromDisplayName` | boş | |
| **`useDomainName`** | **`true`** | Açıkken gönderen adresinin `@` öncesi **kiracı adıyla değiştirilir** ve görünen ad kiracı adı olur (`bildirim@…` → `demo@…`) |

- `useDomainName` kanıtı: `WF/Configuration2/MessageService.cs:34-49` (okundu). Çoğu kurumsal SMTP sunucusu yalnızca kimliği doğrulanan adresten gönderime izin verir; bu ayar `false` yapılmazsa e-postalar reddedilebilir (çıkarım). Sayfaya `useDomainName="false"` notu eklenmeli.
- `default` içine `;` ile birden çok servis adı yazılabilir; sırayla denenir. — `WF/Configuration/MessageServiceElementCollection.cs:30-62`; `MessageSend.cs:190-195` (okundu)
- Kiracı kendi SMTP ayarını tanımlamışsa uygulama ayarı yerine o kullanılır. — `MessageServiceElementCollection.cs:66-78` (okundu)
- Gönderim Agent'ın `Workflow.Message.Send` işidir; 10 denemeden sonra iptal olur ve uyarı üretmez. — `JobManager.cs:153-164` (okundu)
- **Gelen e-posta / e-postayla aksiyon:** sunucu düzeyinde bir gelen kutusu ayarı **kodda yok**. IMAP yalnızca süreç betiklerindeki dosya aktarımında bir protokol seçeneği olarak var. — `FW/IO/FileTransfer/FileTransferOptions.cs:38-55`; `WF/Logic/Scripts/FilesProxy.cs:186,203` (okundu)
- E-posta şablonları: `ActivityNotification`, `DeadlineWithAction`, `DeadlineWithoutAction`, `FirstNotification`, `FirstReminder`, `ForgetPassword`, `ProcessingError`, `Registration`, `RepeatingReminder`, `UserRegistration`, `WatcherNotification`. — `APP/Configuration.global/MessageTemplates.xml` (ad taraması)

### 2.2 Yeni kiracı hangi veri tabanına düşer (çelişki 135'in yanıtı) — önem: yüksek

- Kural: `<dataRepositories>` altındaki bağlantılardan, üzerinde **en az veri deposu kaydı (yani en az kiracı) bulunan** seçilir. Videodaki "tablo sayısı en az olan" değil; sayılan şey veri deposu sayısı. Eşitlikte ilk sıradaki kalır. — `FW/Data/Repository/Server/Application.cs:123-162` (okundu)
- `workflow.config`'ten çıkarılmış bir bağlantı sayıma katılmaz; yeni eklenen ve henüz kiracısı olmayan bağlantı sıfır sayılır, yani **yeni eklenen veri tabanı ilk seçilir**. — aynı dosya `:127-143` (okundu)
- Kiracı adı ve seçilen bağlantı sistem veri tabanındaki `DataStores` kaydına yazılır; sonradan taşınmaz. — `FW/Data/Repository/Server/DataStoreManager.cs:78-90`; `FW/Data/Repository/Server/Core/Database.cs:14-20` (okundu)
- BaseX için kural farklı: `<xmlRepositories>` içinden **rastgele** biri seçilir. — `WF/Application.cs:343`; `FW/Data/XmlRepository/Configuration/ProviderElementCollection.cs:26-42` (okundu)
- `-ds` ile açılan adlandırılmış depolarda (`PS_…`) bağlantı verilmezse aynı "en az depo" kuralı, ön eki zaten kullanan bağlantılar elenerek uygulanır. — `Application.cs:164-202` (okundu)

Nereye: `sunucu-yapisi` → "Veri depoları" ("sistem birini seçer" cümlesi).

### 2.3 Ayrılmış adlar ve `-r`'de ad denetimi — önem: orta

- `-r` kiracı adını **süzmez**: büyük harf, boşluk, uzunluk denetimi yok; ayrılmış ad karşılaştırması büyük/küçük harfe duyarlı tam eşleşme. Web kaydındaki kural (küçük harf, harf/rakam/`-`, en çok 20) burada uygulanmıyor. Sayfaya "adı küçük harf, rakam ve tire ile, en çok 20 karakter yazın" eklenmeli. — `AG/Program.cs:211-215,231`; `WF/Application.cs:300-317`; `WEB/UrlHandler.cs:228-248` (okundu; öneri çıkarım)
- `reservedDomains=""` bütün listeyi kaldırır; `www` web kaydında ayrıca sabit olarak reddedilir ama `-r`'de reddedilmez. `www` adında kiracı açılırsa kayıt/"web" alanıyla çakışır. — `WF/Application.cs:47-50`; `WEB/Pages/RegisterCallback.cs:18-19`; `WEB/UrlHandler.cs:170-176` (okundu; çakışma çıkarım)
- Yalnızca bir adı serbest bırakmak için liste o ad çıkarılarak yeniden yazılabilir (virgülle). — `Application.cs:49` (okundu)

### 2.4 Lisans yükleme adımı — önem: orta

Sayfa yalnız "Agent'ı yeniden başlatın" diyor. Eksikler: web uygulaması da ilk istekte dosyayı içe alıp siler; `Agent.exe -license` seçeneği var; lisans uygulama adına bağlı; özgün dosya saklanmalı. Ayrıntı ve kanıt: 1.9.

### 2.5 Günlükler — önem: orta

- En düşük düzey şablonda `Info`; dosyalar `web.Info.txt`, `web.Warn.txt`, `web.Error.txt`, `web.Fatal.txt` (düzey düşürülürse `Debug`, `Trace` de oluşur). — `APP/Configuration.global/nlog.config:4,12` (okundu)
- Arşiv: `_logs_\archives\web.<Düzey>.<n>.txt`, günde bir, **en çok 31 dosya**. — aynı dosya `:6-9`
- Satır biçimi: tarih | düzey | günlükçü adı | iş parçacığı | ileti | hata dökümü. Günlükçü adları sorun ararken işe yarar: `Application`, `Web`, `Agent`, `WorkerPool`, `DataRepository`, `Workflow.FullText`, `Document`, `Delegation`, `Folder`, `Event`, `Market`. — `nlog.config:5`; `WF/Application.cs:216,231,246,261,276,291`; `WEB/WebModule.cs:32`; `AG/Agent.cs:31`; `CORE/Workers/WorkerPool.cs:48` (okundu)
- Agent konsolda (`-c`) `Trace` düzeyinde, dosyaya `Info` düzeyinde yazar. — `AG/nlog.global.config:15-16` (okundu)
- Static ayrı site olarak kurulduysa `static.<Düzey>.txt` yazar; arşiv adı yanlışlıkla `web.` ile başlıyor (web arşivleriyle karışır). Static "uygulama" olarak kurulduysa kendi günlüğü yok. — `Src/CodEase.WebApp.Static/configuration.global/nlog.config:4,6`; `Web.Global.App.Release.config` (nlog bölümü yok) (okundu)
- Kurulum aracı `configuration.<düzey>.txt` yazar (çalıştırıldığı klasörün `_logs_`'una). — `CT/Program.cs:41` (okundu)
- Veri erişim izlemesi için Agent `.config`'inde yorum içinde hazır bir `system.diagnostics` bölümü var (`_logs_\data.warn.txt`). — `AG/app.config:55-74` (okundu)
- İş (job) günlükleri veri tabanındadır (`JobLog` tablosu); **Arkaplan İş Yöneticisi** bunu gösterir. — `WF/Logic/Core/Database.cs:426`; `WF/Logic/JobManager.cs:376` (okundu)

### 2.6 Paket düzeni ve klasörlerin birbirine bağımlılığı — önem: yüksek

- Agent, uygulamayı `<Agent'ın bulunduğu klasör>\Web` yoluyla başlatır (kodda sabit). Agent programı `Web` klasörünün **bir üstünde** durmak zorunda. — `AG/Agent.cs:45,63-64`; `AG/Program.cs:148,170-171` (okundu)
- Static, kaynakları kendi klasörünün **yanındaki** klasörlerden okur: `Custom.Resources`, `CodEase.WebApp.Resources`, `CodEase.Market.WebApp.Resources`, `CodEase.Workflow.WebApp.Resources`, ayrıca `Web\mumza\js`. Sayfadaki paket içeriği ("`Web`, `Static`, `Tools` ve Agent") bu klasörleri saymıyor; biri eksikse sayfalar biçimsiz açılır. — `Src/CodEase.WebApp.Static/configuration.global/resources.config:3-7`; `codease.proj:222-241,288-293,402-407` (okundu; belirti çıkarım)
- Derleme çıktısının düzeni: `CodEase\` (Agent, `Web`, `Static`, kaynak klasörleri, `_logs_`), `Tools\`, `OpenAuth.Ldap\Web\`, `Market\Web\`, `CodEase.Configuration.exe`. Yani derleme çıktısında `Tools`, Agent'ın klasörünün **içinde değil yanında**. Sayfadaki `C:\CodEase\Binaries\Tools\…` yolları müşteriye giden paketin nasıl düzenlendiğine bağlı. — `codease.proj:14,22,33,199-204,254-256,343-345,417-419,444,456-470` (okundu) → bkz. 5
- Günlük klasörü `_logs_` Agent'ın klasöründe; web onu `Web\..\_logs_` diye bulur. — `nlog` şablonları (okundu)

### 2.7 Agent servisinin adı ve başlangıç türü — önem: düşük

Görünen ad `CodEase Agent`, **servis adı `CodEaseAgent`** (`sc`, `net start` ve betikler bunu ister). Başlangıç türü Otomatik (Gecikmeli). Açıklama: "Manages the CodEase processes". — `AG/Program.cs:14`; `AG/ProjectInstaller.cs:18-19`; `AG/ProjectInstaller.Designer.cs:36,42-44` (okundu)

### 2.8 `staticUrl` unutulursa ne olur — önem: yüksek

Şablonda `staticUrl` yok ve varsayılanı **üreticinin kendi Static sunucusunun adresi**. Öznitelik eklenmezse sayfalar betik ve stilleri o dış adresten yüklemeye çalışır: internet erişimi olmayan sunucuda sayfa biçimsiz açılır, erişim varsa kurum dışından kod yüklenir. Sayfa "siz eklersiniz" diyor ama unutmanın sonucunu söylemiyor. — `WF/Configuration/ApplicationElement.cs:29-33`; `APP/Configuration.global/workflow.config:3` (okundu; sonuç çıkarım)

### 2.9 `RedisConnection` biçimi ve Redis'in rolü — önem: orta

- Değer `StackExchange.Redis` bağlantı dizesidir (`sunucu:port,seçenek=değer,…`). Kod buna her zaman `allowAdmin=true` ekler. Değer `,` ile başlarsa başına `localhost` konur (yalnızca seçenek vermek için). CodEase'e özel ek seçenek: `timeoutRetryCount=<sayı>` (zaman aşımında yeniden deneme). — `FW/Cache.cs:25,39-60,297-310` (okundu)
- Redis yalnızca önbellek değil: web → Agent "yeni iş var" işareti ve masaüstü bildirimleri Redis yayın/abonelik kanalıyla taşınır; bakım kilidi de Redis anahtarıdır. Redis yokken uygulama **başlamaz** (bağlantı uygulama açılışında kurulur). `sunucu-yapisi`'ndeki "Web ile Agent birbiriyle doğrudan konuşmaz" doğru ama "Redis üzerinden haberleşir" eklenmeli. — `WF/Application.cs:60-63,132-178,1212` (okundu; "başlamaz" çıkarım)
- Web ve Agent aynı Redis'e bağlanmalı; farklıysa işler ancak 1 dakikalık yoklamayla başlar (çıkarım).

### 2.10 BaseX'in rolü ve `uri` biçimi — önem: orta

- `<xmlRepositories><add>` öznitelikleri: `name`, `type` (sağlayıcı sınıfı), `uri` — üçü de zorunlu. — `FW/Data/XmlRepository/Configuration/ProviderElement.cs:7-33` (okundu)
- `uri` biçimi `şema://kullanıcı:parola@sunucu:port/`; şema kısmı yalnızca biçim için, bağlantı BaseX'in kendi protokolüyle `sunucu:port`'a kurulur. Sorgu dizgesinde `supportPartition` verilirse bölümleme desteği açılır. — `FW/Data/XmlRepository/BaseX/BaseXProvider.cs:31-61` (okundu; "şema yalnızca biçim" çıkarım)
- Form verisinin asıl kopyası SQL'dedir; BaseX'e Agent işi kopyalar (bkz. 3.3 ve 1.4).

### 2.11 `-r` komutunun davranışları — önem: orta

- "Application name" yanlış yazılırsa komut diğer soruları da sorar ve **hiçbir ileti vermeden** biter (çıkış kodu -1). — `AG/Program.cs:156-185,229,258` (okundu)
- Uygulama başlatılamazsa ekrana yalnız `Exception occured while creating application …` yazılır; hata ayrıntısı ekrana **yazılmaz** (hata nesnesi biçim parametresi olarak veriliyor, biçim dizgesinde yeri yok). Ayrıntı için `_logs_\agent.Error.txt`'e bakılmalı. — `AG/Program.cs:174-177` (okundu)
- Açılan yönetici kullanıcının dili sabit `en`. — `AG/Program.cs:196,243` (okundu)
- Parola ekranda açık yazılır (`Console.ReadLine`). — `AG/Program.cs:223-227` (okundu)
- Kiracı korumalı açılır (1.5); düzeyi `domainDefaultLevel`'dan gelir (1.6).
- Kiracı açılırken "Edit Users" sistem süreci otomatik başlatılıp gizli aksiyonla tamamlanır (sayfadaki "organizasyon tabloları kurulur"un karşılığı). — `WF/Application.cs:395-410` (okundu)
- `-r` de veri tabanı tablolarını oluşturur (uygulamayı başlattığı için); §9'daki `-c` adımı atlanmış olsa bile çalışır (çıkarım).

### 2.12 Static'in iki şablonu arasındaki fark — önem: düşük

- `Web.Global.App.config` (ana sitenin altında uygulama): ana sitenin modüllerini (`LanguagePreference`, `UrlRoutingModule`, `WebModule`, `DynamicServices`) kaldırır; `nlog` bölümü yok; yeniden yazma kuralları `~/r/…` biçiminde. — `Src/CodEase.WebApp.Static/Web.Global.App.Release.config:11-30` (okundu)
- `Web.Global.Site.config` (ayrı site): kendi `rewriter`, `nlog` bölümleri, `X-Frame-Options`, kimlik doğrulama kapalı. — `Web.Global.Site.Release.config:4-56` (okundu)
- İkisinde de durağan içerik önbelleği 7 gün; web sitesinde 3 gün. Güncellemeden sonra kullanıcıların tarayıcı önbelleği eski betikleri tutabilir (çıkarım). — `…App…:28`, `…Site…:54`, `APP/Web.Global.Release.config:148`

### 2.13 "Yapılandırma dosyaları" tablosunda olmayan dosyalar — önem: düşük/orta

| Dosya | İçeriği | Kanıt |
|---|---|---|
| `Web\Configuration\codEase.xml.schema.config` | XML şema ad alanı → dosya eşlemeleri; değiştirilmez | `APP/Configuration.global/codEase.xml.schema.config` |
| `Web\Configuration\System\*.xml` | Sistem süreçleri: `JobManager`, `WorkItemManager`, `OrganizationEditor`, `EditDomain`. Klasör izlenir, değişiklik yeniden başlatmadan alınır | `WF/Logic/SystemFolder.cs:19-43` |
| `Web\Configuration\AI\PromptTemplates.xml`, `AI\Whisper\` | AI istem şablonları, ses dökümü modeli | `ApplicationElement.cs:140`; `codease.proj:308-319` |
| `Web\Configuration\TrustedCertificates\` | Güvenilen kök sertifikalar (varsa) | `ApplicationElement.cs:170` |
| `Web\Configuration\license.xml` | Yalnızca yükleme anında | 1.9 |
| `Static\configuration\resources.config` | Static'in okuyacağı kaynak klasörleri | 2.6 |
| `Static\configuration\nlog.config` | Static günlük ayarı (ayrı site kipinde) | 2.5 |
| `Web\app\Web.config`, `Web\oauth\Web.config` | Alt klasör yetki/modül ayarları; şablon değil, paketle doğrudan gelir, güncellemede **yenilenir** | `codease.proj:267-273` |

`machinekey.config`'te anahtarların yanında `validation="SHA1"`, `decryption="AES"` sabit gelir. — `APP/Configuration.global/machinekey.config:4-5` (okundu)

### 2.14 Sorun giderme tablosuna eklenebilecek satırlar — önem: orta

| Belirti | Neden / bakılacak yer | Kanıt |
|---|---|---|
| Yanlış yazılan kiracı adresi kurumun `www` sitesine gidiyor | Tanınmayan kiracı `www.<uygulama>/trynow`'a yönlendirilir | 1.7 |
| Süreç oluştururken `Invalid domain level.` | Kiracı düzeyi `Standard` | 1.6 |
| E-posta SMTP'de reddediliyor, gönderen `demo@…` görünüyor | `useDomainName` açık | 2.1 |
| HTTPS açıldıktan sonra form gönderimleri `SSL connection is required.` veriyor | İstek sunucuya HTTP geliyor (vekil arkasında `useSSL` yerine `forceSSL`) | 1.2 |
| Akışlar ilerlemiyor ama e-posta gidiyor | Lisans | 1.9 |
| Tam metin arama boş / PDF üretilemiyor | `%ProgramData%\CodEase` ve `%TEMP%` yetkisi | 1.15 |
| Büyük ek yüklenemiyor | Yaklaşık 28 MB sınırı | 1.16 |
| `-r` hiçbir şey demeden bitiyor | Application name yanlış | 2.11 |
| Bildirimler anında gelmiyor | IIS WebSocket özelliği | 1.1 |
| Sayfa biçimsiz | Mevcut satıra ek: `staticUrl` hiç yazılmamış (2.8) ya da Static'in yanındaki kaynak klasörleri eksik (2.6) | |

### 2.15 `systemAdmin` ve `connectionName` açıklamaları — önem: orta

- `systemAdmin` sayfada "sistem yöneticisinin e-posta adresi" diye geçiyor; kodda işlevi "hata ve uyarı raporlarının gönderildiği adres". Silinirse üreticiye gider (1.18).
- `connectionName` için "değiştirmeyin" deniyor; kesin kural: değer `connectionStrings.config`'teki bir `name` ile aynı olmalı, yoksa `'…' named connection is not found.` — `CORE/Data/Access/Database.cs:61-64` (okundu)

### 2.16 Birden çok uygulama tanımı — önem: düşük

Sayfa "aynı kurulumda birden çok uygulama tanımlanabilir" diyor. Ek bilgi: Agent açılışta `workflow.config`'teki **bütün** uygulamaları başlatır; biri başlatılamazsa Agent hiç başlamaz. Lisans uygulama adı başına ayrıdır. Kurulum aracı yalnızca ilk uygulamayı (`add[1]`) düzenler. — `AG/Agent.cs:53-76`; `WF/Logic/LicenseManager.cs:114`; `CT/App/ApplicationConfiguration.cs:13` (okundu)

---

## 3. Dokümandaki yanlışlar

### 3.1 Tablo adının başına kiracının adı gelmez

- **Sayfa:** `sunucu-yapisi.md`, "Veri depoları".
- **Cümle:** "Kiracıların tabloları aynı veri tabanında birbirine karışmaz: tablo adının başına kiracının adı ve şemanın ön eki gelir."
- **Doğrusu:** Tablo adı = `r` + kiracının veri deposuna atanmış **rastgele 1–3 harflik ön ek** + şemanın ön eki + tablo adı. Kiracının adı tablo adında geçmez; hangi ön ekin hangi kiracıya ait olduğu sistem veri tabanındaki `DataStores` kaydında (ad, ön ek, bağlantı) tutulur. Ön ek aynı bağlantıdaki diğer depolarınkiyle çakışmayacak biçimde üretilir. "Karışmaz" kısmı doğru.
- **Kanıt:** `WF/Application.cs:66` (uygulama ön eki `r`); `FW/Data/Repository/Server/DataStore.cs:24` (uygulama ön eki + depo ön eki); `FW/Data/Repository/Server/Application.cs:82-121,148-161` (rastgele ön ek üretimi); `FW/Data/Repository/Server/DatabaseContext.cs:38-41` (şema ön eki + tablo adı); `FW/Data/Repository/Server/Core/Database.cs:14-20` (okundu)

### 3.2 Lisans yokken e-posta gönderimi beklemez

- **Sayfa:** `sunucu-kurulumu.md`, §12.
- **Cümle:** "Lisans yokken arka plan işleri (örneğin e-posta gönderimi) **Arkaplan İş Yöneticisi**'nde lisans hatasıyla bekler."
- **Doğrusu:** Lisans denetimi yalnızca akış adımı işleme, adım değerlendirme ve zamanlanmış görev işlerinde var. E-posta gönderim işi lisansa bakmaz. Örnek "akış adımlarının işlenmesi" olmalı. Aynı düzeltme `sunucu-yapisi` sorun giderme tablosundaki "lisans yüklenmemiş ya da e-posta ayarı eksik olabilir" satırını da ilgilendirir (ikisi ayrı işlerde görülür).
- **Kanıt:** `WF/Logic/Workers/WorkItemProcess.cs:34-39`; `WorkItemEvaluate.cs:41-43`; `ScheduledTask.cs:44-46`; `WF/Logic/ScheduledTaskManager.cs:140-144`; `WF/Logic/Workers/MessageSend.cs:170-197` (denetim yok) (okundu)

### 3.3 BaseX form verisinin tek/asıl deposu değil (yanıltıcı)

- **Sayfa:** `sunucu-kurulumu.md` §7 ("BaseX (form verilerinin tutulduğu depo)") ve `sunucu-yapisi.md` Bileşenler tablosu ("BaseX | Form verileri (XML)").
- **Doğrusu:** Form verisi önce SQL Server'daki sistem veri tabanına (`FormData` tablosu, XML sütunu) yazılır; Agent'ın `Workflow.FormData.XmlDatabase` işi bunu BaseX'e **kopyalar**. BaseX, verinin sorgulanabilir kopyasıdır; bozulan koleksiyon SQL'deki kayıtlardan yeniden kurulur. Önerilen ifade: "BaseX: form verilerinin sorgulanabilir kopyası (asıl kayıt SQL Server'dadır)".
- **Kanıt:** `WF/Logic/Core/Database.cs:128-135`; `WF/Logic/Workers/FormDataXmlDatabase.cs:33-58`; `WF/Logic/XmlRepositoryManager.cs:110-165` (okundu; "asıl kopya SQL" bu üç yerden çıkarım — BaseX'ten okunan başka veri olup olmadığı ayrıca incelenmedi)

Bunların dışında iki sayfadaki diğer somut bilgileri (şablon adları, makine anahtarı, `-i/-u/-c/-r`, Network Service, lisans dosyasının yeri ve silinmesi, `RedisConnection` varsayılanı, 1984 portu, `_logs_` dosya adları, ayrılmış adlar) kodla karşılaştırdım; çelişki görmedim.

---

## 4. Kurulum aracı değerlendirmesi (`CodEase.Configuration.exe`)

### Ne yapıyor

Genel: yönetici olarak çalışmayı şart koşar (`This command requires elevated permissions.`); `-verbose` konsola ayrıntı yazar; günlük `_logs_/configuration.<düzey>.txt`. Bütün yollar **çalıştırıldığı klasöre göre** ve derleme çıktısı düzenine göre sabittir (`CodEase\Web`, `CodEase\Static`, `Tools\BaseX`, `tools\redis`, `OpenAuth.Ldap\Web`). — `CT/Program.cs:31-58`; `CT/App/ConfigurationContext.cs:201-204` (okundu)

| Komut | Adımlar | Kanıt (okundu) |
|---|---|---|
| `install` | (1) Şablonları kopyala (aşağıda). (2) `configure`'u parametresiz çalıştır. Kullanım metninde **yazmıyor** | `CT/Program.cs:64-71,94-105`; `CT/App/InstallContext.cs:28-49` |
| `configure [anahtar] [değer]` | (1) Şablonları kopyala. (2) Var olan değerleri oku. (3) Parametresizse her ayarı sırayla sor; `anahtar` verilirse yalnız onu sor; `anahtar değer` verilirse sormadan ata. (4) Doğrula. (5) **Bütün** ayarlar için güncelleme adımını çalıştır. (6) XML dosyalarını kaydet | `CT/App/ConfigurationContext.cs:110-129` |
| `upgrade` | (1) Şablonları kopyala. (2) `6KareAgent` ve `Redis` servislerini durdur. (3) `CodEase\Web` ve `CodEase\Static` yollarındaki sitelerin havuzlarını yeniden başlat. (4) `Redis` ve `6KareAgent`'ı başlat (yoksa atla). Şema ya da dosya yükseltmesi **yapmaz** | `CT/App/UpgradeContext.cs:28-52` |

Şablon kopyalama: `*.global` klasörlerini ve `*.Global.config` dosyalarını bulur, adı küçük harfe çevirip `.global`'i atarak hedef **yoksa** kopyalar. — `CT/App/InstallContext.cs:87-116`

Sorulan ayarlar (anahtar → yazıldığı yer):

| Anahtar | Açıklama | Varsayılan |
|---|---|---|
| `basex` | BaseX servisini kur (`nssm install Basex java -cp …BaseX.jar -Xmx512m org.basex.BaseXServer`, ardından `AppDirectory`) | Evet |
| `redis` | Redis servisini kur (`redis-server.exe --service-install redis.windows.conf`) | Evet |
| `agent` | Agent servisini kur (`CodEase.Workflow.Agent.exe -i`) | Evet |
| `app name` | `workflow.config` → `name` (zorunlu) | — |
| `app title` | `title` | — |
| `app static` | Static alt alan adı → `staticUrl` | `static` |
| `app useSSL` | `useSSL` | Hayır |
| `app sysadmin` | `systemAdmin` | üreticinin destek adresi |
| `app sysdbconnection` | `connectionStrings.config` → `global` (zorunlu) | — |
| `app userdbconnection` | `connectionStrings.config` → `repo1` (zorunlu) | — |
| `app smtp host / fromaddress / user / password / port / ssl` | `<messaging>` ilk satırı | port 587, ssl Evet |
| `iis install` | IIS'i yapılandır | Evet |
| `iis multitenant` | Çok kiracılı kurulum (bağlamada ana makine adı boş) | Hayır |
| `iis subdomains` | Çok kiracılı değilse alt alan adları, virgülle (zorunlu) | — |
| `ldap install / subdomain / server / root / domain` | LDAP sitesi ve ayarları | Hayır |

Kanıt: `CT/App/ConfigurationContext.cs:18-98`; `ApplicationConfiguration.cs:7-91`; `SMTPConfiguration.cs:11-61`; `IISConfiguration.cs:15-59`; `LDAPConfiguration.cs:11-54` (okundu)

IIS adımı: `CodEase\Web` için uygulama adıyla bir site ve havuz, `CodEase\Static` için `<static>.<uygulama>` adıyla **ayrı** bir site ve havuz açar/yeniden adlandırır; bağlamaları **silip** 80 portuna yeniden yazar; her ana makine adını `hosts` dosyasına `127.0.0.1` olarak ekler; havuzları durdurup başlatır. — `CT/App/IISConfiguration.cs:71-131`; `CT/App/Util.cs:148-195,237-294` (okundu)

Varsaydığı önkoşullar: IIS kurulu (`W3SVC` servisi yoksa IIS adımını atlar), `java.exe` `PATH`'te, derleme çıktısı düzeni, veri tabanları ve bağlantı dizeleri elde hazır. Veri tabanı oluşturmaz, çalışma kullanıcısı açmaz, servis hesabını değiştirmez, lisans yüklemez, kiracı açmaz. — `IISConfiguration.cs:65-68`; `ConfigurationContext.cs:24-34` (okundu)

### Hatalar

**H1 — Agent servisini yanlış adla arıyor (`6KareAgent`).** Gerçek servis adı `CodEaseAgent`.
- Kanıt: `CT/App/ConfigurationContext.cs:70`; `CT/App/UpgradeContext.cs:36,41` ↔ `AG/Program.cs:14`, `AG/ProjectInstaller.cs:19` (okundu)
- Sonuç 1 (çıkarım): `install`/`configure`'da Agent kurulumu seçilince araç `Agent.exe -i`'yi çalıştırır, sonra `6KareAgent`'ı başlatmaya çalışır ve `Service 6KareAgent not installed.` hatasıyla **çöker** (`ServiceConfigurationProperty.cs:24-30` → `Util.cs:95-96`). Bu, uygulama/IIS/LDAP ayarlarının güncellenmesinden ve XML dosyalarının kaydedilmesinden **önce** olur (özellik sırası: basex, redis, agent, app, iis, ldap; kayıt `ConfigurationContext.cs:120-125`). Yani varsayılan yanıtlarla araç BaseX, Redis ve Agent servislerini kurar, hiçbir ayarı yazmadan durur.
- Sonuç 2 (çıkarım): araç Agent'ı her zaman "kurulu değil" görür.
- Sonuç 3 (okundu): `upgrade` Agent'ı ne durdurur ne başlatır; eski Agent çalışmaya devam eder.

**H2 — `staticUrl` şeması ters.** `useSSL` doğruysa `http`, yanlışsa `https` yazıyor.
- Kanıt: `CT/App/ApplicationConfiguration.cs:44` (okundu)
- Ek 1 (okundu + çıkarım): Bu güncelleme adımı değer değişmese de **her `configure` çalıştırmasında** işler (`ConfigurationProperty.cs:228-230`); tek bir ayarı değiştirmek için bile çalıştırılsa var olan `staticUrl`'in üzerine yazar. Sayfadaki `{0}.sirket.com/Static/` biçimini tanımaz (okurken `://` arıyor, `ApplicationConfiguration.cs:37`), yerine `<şema>://.<uygulama>` gibi bozuk bir değer yazar.
- Ek 2 (okundu + çıkarım): Şablonda `staticUrl` özniteliği yok; araç var olmayan özniteliği **ekleyemez**, yalnızca uyarı yazar (`ConfigurationContext.cs:185-199`). Yani temiz kurulumda `staticUrl` hiç yazılmaz ve üreticinin dış adresi geçerli kalır (2.8).

**H3 — SMTP sunucusu yolu yanlış.** `host` için XPath `applications/messaging/add[1]/@host`; doğrusu diğer SMTP alanlarındaki gibi `applications/add[1]/messaging/add[1]/@host`. Araç SMTP sunucusunu ne okuyabilir ne yazabilir (yalnızca uyarı).
- Kanıt: `CT/App/SMTPConfiguration.cs:16` ↔ `:24,33,41,50,60`; `APP/Configuration.global/workflow.config:10-12` (okundu)

**H4 — Makine anahtarı hiç üretilmiyor.** Anahtar üretimi "dosya yoksa" koşuluna bağlı; ama bir adım önce şablon kopyalama, içi **boş anahtarlı** `machinekey.config`'i zaten kopyalamış oluyor.
- Kanıt: `CT/App/ConfigurationContext.cs:112,133-146`; `CT/App/InstallContext.cs:89-101`; şablonda anahtarların boş olduğu doğrulandı (değer okunmadan, yalnız boş/dolu denetimi) (okundu; sonuç çıkarım)

**H5 — Static'in `web.config`'i oluşmuyor.** `Web.Global.Site.config` → `web.site.config`, `Web.Global.App.config` → `web.app.config` adıyla kopyalanıyor; `web.config` adında dosya çıkmıyor. Aracın açtığı ayrı Static sitesi yapılandırmasız kalır.
- Kanıt: `CT/App/InstallContext.cs:103-115`; `codease.proj:208-214` (okundu; sonuç çıkarım)

**H6 — LDAP ayarları yazılamıyor.** XPath `configuration/appSettings/add[@name='…']/@value`; kök öğe zaten `configuration` olduğu için yol bir düzey fazla, ayrıca öznitelik `name` değil `key`. Araç ayrıca `workflow.config`'teki `Ldap` giriş satırına `baseUri`/`clientId` yazmıyor.
- Kanıt: `CT/App/LDAPConfiguration.cs:33,43,52`; `LDAP/Web.global.release.config:12-19`; `CT/App/ConfigurationContext.cs:178-183` (okundu)

**H7 — Java yoksa BaseX sorusu geçilemiyor.** Doğrulama yanıt "Hayır" olsa da `java.exe` arıyor; bulunamazsa soru sonsuza dek yinelenir.
- Kanıt: `CT/App/ConfigurationContext.cs:24-34`; `CT/App/ConfigurationProperty.cs:181-196` (okundu; "sonsuz yineleme" çıkarım)

**H8 — Var olan kurulumu bozabilecek yan etkiler.** Her `configure` çalıştırması, sorulmayan ayarlar için de güncelleme adımını işletir: IIS sitesinin bağlamalarını silip yeniden yazar, siteyi ve havuzu uygulama adıyla yeniden adlandırır, ayrı bir Static sitesi açar, `hosts` dosyasını yeniden yazar, LDAP kurulumu "Hayır" ise o yoldaki siteyi siler. Elle kurulmuş (Static'i alt uygulama olan, ana makine adı boş) bir sistemde çalıştırılması yapıyı değiştirir.
- Kanıt: `CT/App/ConfigurationGroup.cs:45-51`; `IISConfiguration.cs:71-131`; `Util.cs:148-195,256-294`; `LDAPConfiguration.cs:72-75` (okundu; sonuç çıkarım)

**H9 — Küçük sorunlar (okundu):**
- Dış komutların yalnızca **negatif** çıkış kodu hata sayılıyor; çıktı yönlendirilip okunmadan bekleniyor (çok çıktıda takılabilir). — `Util.cs:296-320`
- SSL bağlaması (443) yorum satırı; `useSSL` Evet dense de IIS'e HTTPS eklenmez. — `Util.cs:188`
- Zorunlu alanlarda geçersiz ama boş olmayan değer kabul ediliyor (doğrulama sonucu eziliyor). — `ConfigurationProperty.cs:181-196`
- Hatalar yakalanmıyor; araç yığın dökümüyle kapanır. — `Program.cs:64-89`

### Sonuç

Araç bu hâliyle **önerilemez** (çıkarım; çalıştırılmadı). Varsayılan yanıtlarla H1 yüzünden hiçbir ayarı yazmadan durur; Agent kurulumu atlansa bile makine anahtarı (H4), `staticUrl` (H2), SMTP sunucusu (H3) ve Static `web.config`'i (H5) eksik kalır; kurduğu düzen (ayrı Static sitesi, ana makine adına bağlı bağlamalar, `hosts` kayıtları) sayfadaki ve videodaki düzenle aynı değildir; var olan kuruluma karşı çalıştırılması zarar verebilir (H8). `6KareAgent` adı aracın ürünün eski adından kaldığını ve Agent'la birlikte güncellenmediğini düşündürüyor.

Sayfa için öneri: elle kurulum anlatımı kalsın; araçtan söz edilecekse "kullanmayın" notuyla. Araçtan alınabilecek doğru bilgi yalnızca BaseX ve Redis servis komutları (zaten sayfada).

---

## 5. Doğrulanamayanlar / kullanıcıya sorulmalı

1. **Müşteriye giden paketin düzeni.** Derleme çıktısında `Tools`, `OpenAuth.Ldap` ve `CodEase.Configuration.exe`, Agent'ın klasörünün yanında duruyor (2.6); sayfa `Tools`'u `Binaries` içinde gösteriyor. Paket elle mi yeniden düzenleniyor? Kaynak klasörleri (`CodEase.WebApp.Resources` vb.) pakette `Static`'in yanında mı? (9m ile birlikte)
2. **Lisans süresi.** Kodda süresi dolan lisansı reddeden denetim görmedim (1.9). Süre gerçekten zorlanmıyor mu, yoksa lisans üretim tarafında başka bir yolla mı (ör. süreli yeniden üretim) yönetiliyor? Lisans dosyalarında `Machine Id`, `Major/Minor Version` özellikleri konuyor mu?
3. **Korumasız kiracıların silinmesi (1.5).** Kurum içi kurulumlarda web kaydı kullanılıyor mu? Kiracıyı sonradan korumalı yapmanın desteklenen bir yolu var mı? `domainExpirationDays` için önerilen değer?
4. **Web kaydını kapatma (1.7).** Kurum içi kurulumda `www.<uygulama>/register` nasıl kapatılıyor (yalnızca `www`'yi yönlendirmeyerek mi)?
5. **`domainDefaultLevel="Developer"` (1.6, 9n).** Kod bunu destekliyor; kurulumlarda bu mu öneriliyor? Var olan kiracının düzeyini değiştirmenin desteklenen yolu (kodda yok)?
6. **SQL Server en düşük sürümü, Java sürümü ve 64 bit şartı, Windows Server sürümü, gereken IIS özelliklerinin resmi listesi** (özellikle WCF HTTP Activation ve WebSocket). Kodda yalnızca 1.1'deki ipuçları var.
7. **Oracle / PostgreSQL** ile kurulum destekleniyor mu (1.14)?
8. **`-enc` / `-dec`** müşteri kurulumlarında kullanılıyor mu; web uygulamasının şifreli dosyaları okuması için ek adım (anahtar deposu yetkisi) gerekiyor mu? Denenmedi (1.10).
9. **`-rf` ile yönetici kurtarma** (1.10): aynı e-postayla var olan kullanıcıda ne olur? Denenmedi.
10. **HTTPS kurulumunda `<forms>` satırının değiştirilmesi** (1.2) gerçekten gerekli mi, yoksa `useSSL` yeterli mi? Ters vekil arkasında `forceSSL` kullanımı doğru yorum mu?
11. **`useDomainName` (2.1).** Kurumsal SMTP ile kurulumlarda `false` mı yapılıyor? Videoda e-posta ayarı yapılırken bu öznitelik görünmüyor.
12. **`systemAdmin` (1.18).** Müşteri kurulumlarında kimin adresi yazılıyor? Şablondaki boş değerle rapor gönderimi hata verir mi (denenmedi)?
13. **BaseX yönetici parolası (1.21).** Kurulumlarda değiştiriliyor mu? `.basex`'teki `DBPATH` taşınınca `REPOPATH` da taşınmalı mı?
14. **Redis'in parolasız ve bütün arayüzlerde dinlemesi (1.21).** Kurulumlarda `bind`/`requirepass` ayarlanıyor mu?
15. **`fullTextTimeout`** özniteliği tanımlı ama kullanıldığı yer bulunamadı (1.12).
16. **Giriş sağlayıcılarından hangileri güncel ve destekleniyor** (1.8)? Kodda 18 sınıf var; çoğu tüketici servisleri.
17. **Servis satırı öznitelik yazımları** (`logonProvider`, `scopes`, `apiKey`; 1.20) sabit adlardan okundu, tek tek örnekle doğrulanmadı.
18. **Kurulum aracının akıbeti (9m).** Bulgulara göre güncel değil; kaldırılacak mı, düzeltilecek mi?
19. **Türkçe Windows'ta Agent.** İş havuzu, süreçler arası işaret nesnesine `Everyone` adıyla izin veriyor (`CORE/Workers/WorkerPool.cs:310-316`); bu ad yerelleştirilmiş Windows'ta çözülemeyebilir. Türkçe Windows Server'da sorun yaşandı mı? (çıkarım, sınanmadı)
