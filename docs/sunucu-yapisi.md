# Sunucu yapısı ve sorun giderme

> **Taslak.** Biçim ve içerik onayı bekliyor. Bu sayfa sistemi kuran ve yöneten kişi içindir.

Kurulum adımları: [Sunucu kurulumu](/sunucu-kurulumu). Bu sayfa kurulan parçaların ne olduğunu, yapılandırmanın nerede durduğunu ve bir şey çalışmadığında nereye bakılacağını anlatır.

## Bileşenler

| Bileşen | Ne yapar | Nasıl çalışır |
|---|---|---|
| Web uygulaması | Kullanıcıların tarayıcıdan kullandığı uygulama. | IIS sitesi (`Web` klasörü). |
| Static | Betik, stil ve resim dosyalarını sunar. | Ana sitenin altında uygulama ya da ayrı IIS sitesi (`Static` klasörü). |
| Agent | Arka plan işleri: akışları ilerletme, e-posta gönderme, zamanlanmış işler. | Windows servisi (**CodEase Agent**). |
| SQL Server | Sistem tabloları ve kiracıların tabloları. | Ayrı kurulur. |
| BaseX | Form verileri (XML). | Windows servisi; Java ile çalışır, 1984 numaralı portu dinler. |
| Redis | Önbellek. | Windows servisi. |

Web uygulaması ile Agent birbiriyle doğrudan konuşmaz; ikisi de aynı yapılandırma dosyalarını okur ve aynı veri tabanına, BaseX'e ve Redis'e bağlanır.

## Yapılandırma dosyaları

Asıl ayarlar tek yerdedir: `Web\Configuration` klasörü. Agent'ın kendi dosyası (`CodEase.Workflow.Agent.exe.config`) ve sitenin `web.config`'i bu klasördeki dosyalara işaret eder; bir ayarı burada değiştirdiğinizde ikisi için de değişmiş olur.

| Dosya | İçeriği |
|---|---|
| `workflow.config` | Uygulama: alan adı, SSL, Static adresi, e-posta, veri depoları, giriş yöntemleri. |
| `connectionStrings.config` | Veri tabanı bağlantıları. |
| `machinekey.config` | Şifreleme anahtarı. Web ve Agent için aynı olmalıdır. |
| `nlog.config` | Web uygulamasının günlük ayarları. (Agent'ınki kendi yanındaki `nlog.config`'tir.) |
| `MessageTemplates.xml` | E-posta şablonları. |

Değişiklikten sonra **CodEase Agent** servisini yeniden başlatın; `web.config` ya da uygulama havuzu yenilenmeden web tarafı da yeni ayarı görmeyebilir.

Adında `global` geçen dosyalar şablondur; güncelleme onları yeniler, sizin dosyalarınıza dokunmaz. Güncellemeden sonra şablonla karşılaştırıp yeni ayarları kendi dosyanıza aktarın.

## Uygulama ve kiracılar

`workflow.config`'teki her `<add name=…>` bir **uygulamadır**; adı ana alan adıdır. Bir uygulamanın altında istenildiği kadar **kiracı** (tenant) bulunur; her kiracı bir alt alan adıdır ve kendi kullanıcıları, süreçleri ve tabloları vardır.

Aynı kurulumda birden çok uygulama tanımlanabilir (ayrı alan adlarıyla); her biri ayrı bir kurulum gibi davranır. Buna çoğunlukla gerek olmaz.

Kiracı iki yolla açılır: komut satırından (`CodEase.Workflow.Agent.exe -r`) ya da web üzerindeki kayıt sayfasından.

## Veri depoları

`connectionStrings.config`'te iki tür bağlantı vardır:

- **`global`**: sistem tabloları. Bütün kiracılar için ortaktır. Süreç tasarlayanlar bu tablolara erişemez.
- **`repo1`** (ve ekleyeceğiniz diğerleri): kiracıların kendi tabloları; organizasyon tabloları ve süreçlerde tanımlanan şemalar.

`workflow.config`'teki `<dataRepositories>` bölümüne birden çok bağlantı ekleyebilirsiniz:

```xml
<dataRepositories>
  <add name="repo1" />
  <add name="repo2" />
</dataRepositories>
```

Burası bir **havuzdur**; her kiracıya bir veri tabanı anlamına gelmez. Yeni bir kiracı açılırken sistem havuzdaki bağlantılardan birini seçer ve o kiracının bütün tabloları bundan sonra orada durur. Böylece kiracı sayısı arttıkça yük birden çok veri tabanına, hatta birden çok sunucuya dağıtılabilir.

Kiracıların tabloları aynı veri tabanında birbirine karışmaz: tablo adının başına kiracının adı ve şemanın ön eki gelir.

Aynı düzen BaseX için de geçerlidir: `<xmlRepositories>` bölümüne birden çok BaseX sunucusu eklenebilir.

## Bileşenler başka sunucudaysa

- **BaseX**: `workflow.config` → `<xmlRepositories>` içindeki `uri` değerinde `localhost` yerine sunucunun adresini yazın. Port 1984'tür.
- **Redis**: `web.config` ve Agent'ın `.config` dosyasındaki `appSettings` bölümüne `RedisConnection` anahtarını ekleyin. Anahtar yoksa `localhost` kullanılır.
- **SQL Server**: bağlantıdaki **Data Source**.

## Çalışma kullanıcısı

Windows'ta her program bir kullanıcı adına çalışır. `Integrated Security=SSPI` bağlantısı, programı çalıştıran kullanıcıyla veri tabanına gider:

| Program | Hangi kullanıcıyla çalışır |
|---|---|
| Agent servisi | **Services** → **Log On**'da yazan kullanıcı. |
| Web uygulaması | Uygulama havuzunun **Identity**'si. |
| Komut satırından `-c` ile çalıştırılan Agent | Komut satırını açan kullanıcı, yani siz. |

Bu yüzden komut satırından sorunsuz çalışan Agent, servis olarak başlamayabilir: sizin veri tabanına ve dosyalara yetkiniz vardır, servis kullanıcısının yoktur. Servis kullanıcısıyla denemek için komut satırını o kullanıcı adına (**Run as**) açın.

## Günlükler

Günlük dosyaları kurulum klasöründeki `_logs_` klasörüne yazılır; her düzey ayrı dosyadadır ve dosyalar günlük olarak arşivlenir.

| Dosya | Kaynağı |
|---|---|
| `web.Error.txt`, `web.Fatal.txt`, `web.Warn.txt`, `web.Info.txt` | Web uygulaması |
| `agent.Error.txt`, `agent.Fatal.txt`, … | Agent |

Kullanıcının ekranında görülen bir hatanın ayrıntısı `web.Error.txt`'tedir. Arka planda işlenen adımların hataları ayrıca uygulamadaki **Arkaplan İş Yöneticisi**'nde görünür.

## Sorun giderme

| Belirti | Bakılacak yer |
|---|---|
| **CodEase Agent** servisi başlamıyor. | Servis hiç ayağa kalkamadıysa günlüğe de yazamaz. Servisi durdurup komut satırından `CodEase.Workflow.Agent.exe -c` ile çalıştırın; hata ekrana yazılır. |
| `-c` ile çalışıyor, servis olarak çalışmıyor. | Servis kullanıcısının veri tabanına (**db_owner**) ve `C:\CodEase` klasörüne yetkisi. |
| Agent, Redis'e bağlanamadığını söylüyor. | **Redis** servisi durmuş; başlatın. |
| Lisans dosyasını koyduktan sonra servis başlamıyor. | Servis kullanıcısının `license.xml`'i silme yetkisi yok. |
| İşler **Arkaplan İş Yöneticisi**'nde bekliyor. | İşin hata iletisi: lisans yüklenmemiş ya da e-posta ayarı eksik olabilir. |
| Kiracı adresi açılmıyor. | Alt alan adı bu sunucuya yönlenmiş mi (`ping demo.sirket.com`); IIS sitesinin **Host name**'i boş mu. |
| Sayfa açılıyor ama biçimsiz, düğmeler çalışmıyor. | `staticUrl` yanlış ya da Static uygulaması kurulmamış. Tarayıcıda `http://demo.sirket.com/Static/` yoluna ulaşılabildiğini denetleyin. |
| Kiracı oluştururken ad kabul edilmiyor. | Ad ayrılmış adlardan biri: [Sunucu kurulumu → İlk kiracıyı oluşturun](/sunucu-kurulumu#_10-ilk-kiracıyı-olusturun). |
| Kiracıda süreç tasarlanamıyor. | Kiracının düzeyi süreç geliştirmeye izin vermiyor olabilir; CodEase desteğine danışın. |
| E-posta gitmiyor. | `workflow.config` → `<messaging>`; ardından Agent'ı yeniden başlatın. |

## Agent komutları

| Komut | Ne yapar |
|---|---|
| `CodEase.Workflow.Agent.exe -i` | Windows servisi olarak kurar. |
| `… -u` | Servisi kaldırır. |
| `… -c` | Servis olmadan, komut satırında çalıştırır; çıktıyı ekrana yazar. `Ctrl` + `C` ile durur. |
| `… -r` | Yeni kiracı oluşturur. |

---

**Kaynak:** CodEase Sunucu Kurulum 1, 37:30–39:30 ve 44:00–48:00; CodEase Sunucu Kurulum 2, 07:30–19:00, 43:00–47:00 ve 57:00–62:30. Videoda eksik ya da belirsiz kalan noktalar ürün davranışına göre tamamlandı.
