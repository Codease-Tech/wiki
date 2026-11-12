# Rol scriptleri

> **Taslak.** Biçim ve içerik onayı bekliyor.

Bir görevin kime atanacağını rol belirler; rolün arkasında her zaman bir **Rol Scripti** vardır. Çoğu durumda scripti **Rol Sihirbazı** sizin yerinize yazar. Bu sayfa sihirbazın ürettiği scriptleri ve sihirbazın yetmediği yerde kendi scriptinizi yazmayı anlatır.

Rol tanımlamanın ve göreve bağlamanın adımları: [Görev ayarları → Görev kime atanır: Rol](/gorev-ayarlari#gorev-kime-atanır-rol).

## Sihirbaz ne yazar

**Rol Seçimi**'nde yaptığınız seçim **Rol Scripti** kutusuna şu satırı yazar:

| Rol Seçimi | Yazılan script | Görev kime gider |
|---|---|---|
| Kimlik | `$Membership.Get('…');` | Seçtiğiniz kullanıcı, pozisyon, grup ya da departman. |
| Veri | `$Membership.Get( $Xml.Evaluate('…') );` | **Veri Alanı**'na yazdığınız form alanındaki kişi. |
| Yönetici Bul → Önceki Adım | `$Membership.FindManager( $WorkItem.Previous.CompletedBy );` | Bir önceki görevi tamamlayan kişinin yöneticisi. |
| Yönetici Bul → Veri | `$Membership.FindManager( $Xml.Evaluate('…') );` | Form alanındaki kişinin yöneticisi. |
| Kod | (boş) | Scripti kendiniz yazarsınız. |

Sihirbazın yazdığı satırı elle değiştirebilirsiniz; atamayı belirleyen her zaman kutudaki scripttir.

## Boş rol: süreci başlatan kişi

Scripti boş bırakılan rol, süreci başlatan kişiyi gösterir. Rolü **Yok** olan görev de aynı kişiye gider.

Başlangıç görevine rol vermek zorunlu değildir. Yine de `Owner` gibi boş bir rol tanımlayıp bağlamak, şemaya ve tarihçeye bakan kişinin görevin sahibini anlamasını kolaylaştırır.

## Görev kime atanabilir: dört kimlik türü

Rol scriptinden beklenen bir ya da birkaç **kimliktir**. Dört tür kimlik vardır:

| Kimlik | Görevi kim görür |
|---|---|
| Kişi | Yalnızca o kullanıcı. |
| Pozisyon | Belirli bir departmandaki belirli bir pozisyonda (örnek: Satış departmanındaki Uzman) bulunan herkes. |
| Departman | O departmanın ve alt departmanlarının bütün pozisyonlarındaki herkes. |
| Grup | Grubun üyeleri. |

Pozisyona ya da gruba atanan görev kişilerin değil, **pozisyonun ya da grubun üzerinde** bekler. Kullanıcı sonradan o pozisyona getirilir ya da gruba eklenirse görevi iş listesinde görür; pozisyondan ya da gruptan çıkarılırsa görmez (değişikliğin listeye yansıması birkaç dakika sürebilir). Bu yüzden biri işten ayrılıp yerine başkası geldiğinde süreçte hiçbir şey değiştirmeniz gerekmez; yeni kişiye pozisyonunu vermek yeterlidir.

- **Önce pozisyona atamayı düşünün.** Kişiye atanan görev kişi değiştiğinde ortada kalır.
- Organizasyon yapısı pozisyonla tarif edilemeyen durumlar için **grup** kullanın: onay verecek kişiler tek bir departman ya da pozisyonda değilse onları bir grupta toplayıp göreve grubu atayın.
- Rol birden çok kimlik döndürebilir ve türler karışık olabilir: bir kişi ile bir pozisyon aynı anda.

Departmana atamada kimlerin göreceği **atama anında** belirlenir: departmana sonradan eklenen bir pozisyon, önceden oluşmuş görevi almaz.

Kimlikler **HR** şemasının tablolarında tutulur (kişiler `Persons`, `Employee` ve `Users` tablolarında aynı `Id` ile; departman-pozisyon eşleşmeleri `OrganizationUnitPositions`, gruplar `Groups` tablosunda). Rol scriptlerinde bu tablolarla doğrudan uğraşmanız gerekmez; `$Membership` işlevleri aynı işi yapar. Tabloları sorgularda kullanmak için: [Veritabanları](/veritabanlari).

## Departmana atama

**Kimlik** seçeneğinde bir departman seçerseniz görev, o departmanın (alt departmanları dahil) bütün pozisyonlarındaki kişilerin listesine düşer. Görev tektir: içlerinden biri tamamladığında herkes için tamamlanmış olur.

## Kendi scriptinizi yazma

Rol scripti JavaScript'tir. Scriptin **son satırındaki ifadenin değeri** rolün sonucudur. Şunlardan biri olabilir:

- tek bir kimlik,
- kimliklerden oluşan bir dizi,
- bir kimlik numarası (id) ya da virgülle veya noktalı virgülle ayrılmış birkaç kimlik numarası.

Kullanabileceğiniz başlıca nesneler:

| Nesne | Ne verir |
|---|---|
| `$Initiator` | Süreci başlatan kişi. |
| `$WorkItem.Previous.CompletedBy` | Bir önceki görevi tamamlayan kişi. |
| `$Membership.Get(id)` | Numarası verilen kimlik. |
| `$Membership.FindManager(kimlik)` | Verilen kimliğin yöneticileri (dizi). |
| `$Membership.Join([…])` | Birkaç kimliği ya da diziyi birleştirir, yinelenenleri atar. |
| `$Xml.Evaluate(xpath)` | Formdaki bir alanın değeri. |

Büyük-küçük harf önemlidir. Script alanında `Ctrl` + `Boşluk` kullanılabilir nesneleri ve üyelerini listeler.

### Yönetici neden dizi döner

Bir kullanıcının birden çok pozisyonu, her pozisyonun da ayrı bir yöneticisi olabilir. Bu yüzden `$Membership.FindManager` tek kişi değil dizi verir. Yalnızca belirli bir pozisyondaki yöneticiyi istiyorsanız pozisyonu ikinci parametre olarak verin: `$Membership.FindManager(kimlik, pozisyon)`.

### Örnek: başlatan kişi ve yöneticisi birlikte

Ödeme tamamlandığında hem talep sahibine hem yöneticisine giden bir bilgilendirme görevi için:

```js
var identities = $Membership.FindManager($Initiator);

identities.push($Initiator);

identities;
```

İlk satır başlatanın yöneticilerini bulur, ikinci satır listeye başlatanın kendisini ekler, son satır listeyi rolün sonucu olarak verir.

Burada `$WorkItem.Previous.CompletedBy` kullanmak yanlış olurdu: bu görevden bir önceki adımı muhasebe tamamlamıştır. Akışın neresinde olursanız olun süreci başlatanı `$Initiator` verir.

## Sık yapılan hatalar

- **Başlangıç görevinde `$WorkItem.Previous`:** Başlangıç görevinin öncesi yoktur; script hata verir. Başlangıç görevinde `$Initiator` kullanın.
- **Kimseyi bulamayan rol:** Script boş sonuç verirse (formdaki alan boş, kişinin yöneticisi tanımlı değil) görev atanamaz ve akış hata verir. Boş rolün aksine, sonuç vermeyen script süreci başlatana dönmez.
- **Karışık dizi:** Dizinin içinde kimlik nesneleri ile kimlik numaralarını karıştırmayın; ya hep nesne ya hep numara olsun.

## Rolü deneme

Süreç **Deneme Durumu**'ndayken görevler rol ne derse desin size gelir, ama rol yine çalıştırılır. Akışın **tarihçesinde** görevin gerçekte kime atanacağı yazar; rolün doğru kişiyi bulduğunu oradan denetleyin.

---

**Kaynak:** Veritabanı Eğitimi – Veysel, 04:30–07:30 ve 30:00–55:30; CodEase Eğitim 1 – Veysel, 17:00–27:50 ve 63:30–65:30. Videoda eksik ya da belirsiz kalan noktalar ürün davranışına göre tamamlandı.
