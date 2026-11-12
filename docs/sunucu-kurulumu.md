# Sunucu kurulumu

> **Taslak.** Biçim ve içerik onayı bekliyor. Bu sayfa sistemi kuran kişi içindir.

Bu sayfa CodEase'i tek bir Windows sunucusuna baştan sona kurar: dosyalar, IIS, veri tabanı, arka plan servisleri, ilk kiracı (tenant) ve lisans. Bileşenlerin ne işe yaradığı ve yapılandırma dosyalarının ayrıntısı için: [Sunucu yapısı ve sorun giderme](/sunucu-yapisi).

Örneklerde alan adı `sirket.com`, kurulum klasörü `C:\CodEase`, ilk kiracı `demo` kabul edilmiştir; kendi değerlerinizi yazın.

## Kurulumdan önce

Sunucuda bulunması gerekenler:

| Gereken | Not |
|---|---|
| IIS ve ASP.NET (.NET Framework 4.8) | Web uygulaması için. |
| SQL Server | Express sürümü de olur. Veri tabanı **oluşturma yetkiniz** olmalı; yoksa kurulum yarıda kalır. |
| Java Runtime (64 bit) | BaseX için. Sunucunun internet erişimi yoksa çevrimdışı kurulum dosyasını önceden indirin. |
| CodEase kurulum paketi | İçinde `Web`, `Static`, `Tools` klasörleri ve Agent programı vardır. |
| Lisans dosyası (`license.xml`) | Alan adınıza göre üretilir. |

Kurumdan istenecekler:

- **Alan adı yönlendirmesi.** Her kiracı bir alt alan adıdır (`demo.sirket.com`). `*.sirket.com` adreslerinin tümü bu sunucuya yönlenmelidir; yalnızca tek bir alt alan adı yönlendirilirse yalnızca o kiracı çalışır.
- **E-posta sunucusu bilgileri**: adres, port, kullanıcı, parola, gönderen adresi.
- SSL kullanılacaksa sertifika.

## 1. Dosyaları yerleştirin

Paketi `C:\CodEase\Binaries` altına açın. Veri dosyaları için `C:\CodEase\Data\SQL` ve `C:\CodEase\Data\BaseX` klasörlerini oluşturun.

## 2. Yapılandırma şablonlarını etkinleştirin

Paketteki yapılandırma dosyaları adlarında `global` sözcüğüyle gelir. Bunun nedeni güncellemedir: yeni sürümü eskisinin üzerine kopyaladığınızda `global` adlı şablonlar yenilenir, sizin düzenlediğiniz dosyalara dokunulmaz. İlk kurulumda şablonların adından `global`'i kaldırın:

| Şablon | Yeni adı |
|---|---|
| `Web\Web.Global.config` | `Web\web.config` |
| `Web\Configuration.global\` (klasör) | `Web\Configuration\` |
| `Static\Web.Global.App.config` | `Static\web.config` |
| `Static\configuration.global\` (klasör) | `Static\configuration\` |
| `CodEase.Workflow.Agent.exe.global.config` | `CodEase.Workflow.Agent.exe.config` |
| `nlog.global.config` | `nlog.config` |

`Static` klasöründe iki şablon vardır. Static'i bu sayfadaki gibi ana sitenin **altında bir uygulama** olarak kuracaksanız `Web.Global.App.config`'i, **ayrı bir IIS sitesi** yapacaksanız `Web.Global.Site.config`'i `web.config` yapın.

Güncellemelerde şablonla kendi dosyanızı karşılaştırıp yeni gelen ayarları elle aktarırsınız.

## 3. Uygulama ayarları: `workflow.config`

`Web\Configuration\workflow.config` dosyasını bir metin düzenleyicide açın ve `<add name=…>` satırını düzenleyin:

```xml
<add name="sirket.com"
     connectionName="global"
     useSSL="false"
     staticUrl="{0}.sirket.com/Static/"
     systemAdmin="destek@sirket.com">
```

| Ayar | Anlamı |
|---|---|
| `name` | Ana alan adı. Kiracılar bunun alt alan adı olur: `demo.sirket.com`. |
| `connectionName` | Sistem tablolarının bulunduğu veri tabanı bağlantısının adı. Değiştirmeyin. |
| `useSSL` | Sertifika yoksa `false`. |
| `staticUrl` | Betik, stil ve resim dosyalarının adresi. Şablonda yoktur, siz eklersiniz. `{0}` yerine, o an istekte bulunan kiracının adı gelir. |
| `systemAdmin` | Sistem yöneticisinin e-posta adresi. |

`staticUrl`'de `{0}` kullanılmasının nedeni: ana alan adı (`www.sirket.com`) çoğunlukla başka bir yere yönlenir; kiracı adresleri ise bu sunucuya gelir. Her kiracı kendi adresi üzerinden `/Static/` yoluna ulaşır.

Aynı dosyadaki `<messaging>` bölümü e-posta ayarlarıdır:

```xml
<messaging default="direct">
  <add name="direct" fromAddress="bildirim@sirket.com" fromDisplayName="CodEase"
       host="posta.sirket.com" port="587" sslEnabled="true" user="…" password="…" />
</messaging>
```

Bilgiler henüz elinizde değilse boş bırakıp kuruluma devam edebilirsiniz; sistem çalışır ama e-posta gönderemez.

## 4. IIS: site ve Static uygulaması

1. **IIS Yöneticisi**'nde **Default Web Site**'ı silin.
2. **Sites** → **Add Website**: site adı `codease`, **Physical path** `C:\CodEase\Binaries\Web`. **Host name**'i boş bırakın; böylece sunucunun 80 numaralı portuna gelen bütün istekler, hangi kiracı adıyla gelirse gelsin, bu siteye düşer. Aynı adla bir uygulama havuzu da oluşur.
3. `codease` sitesine sağ tıklayıp **Add Application**: **Alias** `Static`, **Physical path** `C:\CodEase\Binaries\Static`. Uygulama havuzu olarak ana siteninkinden **farklı** bir havuz seçin (örneğin `DefaultAppPool`); gerektiğinde birini diğerini etkilemeden yeniden başlatabilirsiniz.

## 5. Makine anahtarı

Web uygulaması ve Agent, oturum ve davet bağlantılarını aynı anahtarla şifreler; ikisi de `Web\Configuration\machinekey.config` dosyasını okur. Şablonda anahtarlar boştur.

1. IIS Yöneticisi'nde sunucu düğümünü seçin, **Machine Key**'i açın, sağdaki **Generate Keys**'e basın.
2. Üretilen **Validation key** ve **Decryption key** değerlerini `machinekey.config` içindeki `validationKey` ve `decryptionKey` alanlarına yapıştırıp kaydedin.
3. IIS'teki ekranı **kaydetmeden** kapatın (**Cancel**); anahtar yalnızca dosyada dursun.

## 6. Veri tabanı ve çalışma kullanıcısı

**Veri tabanı.** SQL Server Management Studio'da boş bir veri tabanı oluşturun (örnek: `CODEASE`); dosya yollarını `C:\CodEase\Data\SQL` yapın. Tabloları siz oluşturmazsınız; sistem ilk çalıştığında kendisi oluşturur.

**Kullanıcı.** Web uygulaması ve Agent veri tabanına bir kullanıcıyla bağlanır. Bağlantı bilgisine parola yazmamak için önerilen yol, ikisini de aynı Windows kullanıcısıyla çalıştırmaktır:

1. **Computer Management** → **Local Users and Groups** → **Users** → **New User**: `codease`. **User must change password at next logon**'ı kaldırın, **Password never expires**'ı işaretleyin.
2. SQL Server'da **Security** → **Logins** → **New Login**: bu Windows kullanıcısını seçin. **User Mapping**'de `CODEASE` veri tabanını işaretleyip **db_owner** rolünü verin.
3. Bu kullanıcıya `C:\CodEase` klasöründe değiştirme yetkisi verin (günlük dosyaları ve lisans dosyası için gerekir).

**Bağlantılar.** `Web\Configuration\connectionStrings.config`:

```xml
<connectionStrings>
  <add name="global" connectionString="Integrated Security=SSPI;…;Initial Catalog=CODEASE;Data Source=SUNUCU\SQLEXPRESS" />
  <add name="repo1"  connectionString="Integrated Security=SSPI;…;Initial Catalog=CODEASE;Data Source=SUNUCU\SQLEXPRESS" />
</connectionStrings>
```

- **Data Source**: SQL Server örneğinin adı (Management Studio'da bağlandığınız ad).
- **Initial Catalog**: veri tabanının adı.
- `Integrated Security=SSPI`: "uygulama hangi Windows kullanıcısıyla çalışıyorsa onunla bağlan" demektir; kullanıcı adı ve parola yazılmaz.
- `global` sistem tablolarının, `repo1` kiracıların kendi tablolarının bağlantısıdır. İkisi aynı veri tabanını gösterebilir; ayırmak isterseniz iki veri tabanı oluşturun. Ayrıntı: [Sunucu yapısı → Veri depoları](/sunucu-yapisi#veri-depoları).

## 7. Servisler: Agent, Redis, BaseX

Komutları **yönetici olarak açılmış** bir komut satırında çalıştırın; yoksa servis kurulumu anlaşılmaz bir hatayla durur.

**Agent** (arka plan işlerini yürüten servis):

```
cd C:\CodEase\Binaries
CodEase.Workflow.Agent.exe -i
```

Servis **CodEase Agent** adıyla kurulur. Henüz başlatmayın.

**Redis:**

```
cd C:\CodEase\Binaries\Tools\Redis
redis-server.exe --service-install redis.windows.conf
```

**BaseX** (form verilerinin tutulduğu depo). Java kurulu olmalıdır. Paketteki `Tools\BaseX` klasöründe:

```
nssm.exe install Basex java -cp C:\CodEase\Binaries\Tools\BaseX\BaseX.jar -Xmx512m org.basex.BaseXServer
nssm.exe set Basex AppDirectory C:\CodEase\Binaries\Tools\BaseX
```

`nssm install` yalnız başına yazılırsa aynı ayarları soran bir pencere açılır. BaseX'in verisini nereye yazacağı, klasöründeki `.basex` dosyasında `DBPATH` satırındadır; `C:\CodEase\Data\BaseX` yapın. Dosya yoksa BaseX'i bir kez çalıştırıp kapatın, kendisi oluşturur.

Üç servisin de **Services** listesinde göründüğünü denetleyin; **Redis** ve **Basex** servislerini başlatın.

Redis ve BaseX aynı sunucudaysa bağlantı ayarı gerekmez. Başka bir sunucudaysalar: [Sunucu yapısı → Bileşenler başka sunucudaysa](/sunucu-yapisi#bilesenler-baska-sunucudaysa).

## 8. Servisleri ve siteyi çalışma kullanıcısına bağlayın

- **Services** → **CodEase Agent** → **Properties** → **Log On**: **This account** → `codease` ve parolası. (Kurulumda **Network Service** gelir.)
- **IIS Yöneticisi** → **Application Pools** → `codease` → **Advanced Settings** → **Process Model** → **Identity** → **Custom account** → `codease` ve parolası.

## 9. İlk çalıştırma

Agent'ı önce servis olarak değil, komut satırından çalıştırın; bir sorun varsa ekranda görürsünüz:

```
CodEase.Workflow.Agent.exe -c
```

Bu ilk çalıştırma veri tabanında sistem tablolarını oluşturur. Lisans henüz yüklenmediği için lisans bulunamadığına dair bir uyarı görmeniz olağandır. Tabloların oluştuğunu Management Studio'da görünce `Ctrl` + `C` ile durdurun.

Redis'e bağlanamadığını söylerse Redis servisi başlatılmamıştır.

## 10. İlk kiracıyı oluşturun

```
CodEase.Workflow.Agent.exe -r
```

Sırayla sorar:

| Soru | Yanıt |
|---|---|
| Application name | `workflow.config`'teki `name` (`sirket.com`). |
| Domain name | Kiracının adı (`demo`). Adresi `demo.sirket.com` olur. |
| Administrator Email Address | İlk yöneticinin e-posta adresi; bu adresle giriş yapılır. |
| Password | İlk yöneticinin parolası. |

Kiracı oluşurken insan kaynakları (organizasyon) tabloları kurulur ve yönetici kullanıcı açılır.

Bazı adlar kiracı adı olarak **kullanılamaz**: `www`, `codease`, `static`, `img`, `my`, `mail`, `blog`, `docs`, `support` ve benzerleri. Bunlardan birini kullanmanız gerekiyorsa `workflow.config`'teki `<add name=…>` satırına `reservedDomains=""` ekleyin.

## 11. Servisi başlatın ve giriş yapın

**Services**'ten **CodEase Agent**'ı başlatın. Tarayıcıda `http://demo.sirket.com` adresini açın ve yönetici e-postası ile parolasıyla giriş yapın.

İlk açılışta bir kez hata sayfası görürseniz sayfayı yenileyin.

## 12. Lisansı yükleyin

`license.xml` dosyasını `C:\CodEase\Binaries\Web\Configuration` klasörüne kopyalayın ve **CodEase Agent** servisini yeniden başlatın. Servis açılırken dosyayı içeri alır ve **siler**; dosyanın klasörden kaybolması yüklendiğini gösterir.

Servis başlamıyorsa neden çoğunlukla yetkidir: dosyayı siz kopyaladığınız için çalışma kullanıcısının (`codease`) onu silme yetkisi yoktur. Dosyada ya da klasörde bu kullanıcıya değiştirme yetkisi verin.

Lisans yokken arka plan işleri (örneğin e-posta gönderimi) **Arkaplan İş Yöneticisi**'nde lisans hatasıyla bekler.

## 13. Kurulumu sınayın

1. **Sistem Yönetimi**'nde organizasyona bir şirket, bir departman, bir pozisyon ve bir kullanıcı ekleyin.
2. İşin tamamlananlara düştüğünü görün. Bekliyorsa **Arkaplan İş Yöneticisi**'nde hatasına bakın.
3. E-posta ayarları yapılmışsa kullanıcıya davet e-postası gider; kullanıcı bağlantıya tıklayıp parolasını belirler.

Bir şey çalışmıyorsa: [Sunucu yapısı ve sorun giderme](/sunucu-yapisi#sorun-giderme).

---

**Kaynak:** CodEase Sunucu Kurulum 1 ve 2. Videoda eksik ya da belirsiz kalan noktalar ürün davranışına göre tamamlandı.
