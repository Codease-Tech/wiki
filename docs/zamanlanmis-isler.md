# Zamanlanmış işler: Değerlendirme

> **Taslak.** Bu sayfa eğitim videolarından değil, ürünün kendisi incelenerek yazıldı; anlatılanlar canlı sistemde denenmedi. Biçim ve içerik onayı bekliyor.

Bir işin kimse tıklamadan, belirli aralıklarla yapılmasını istiyorsanız görevin **Değerlendirme** ayarını kullanırsınız: her sabah bir rapor akışı başlatmak, bekleyen talepleri saatte bir denetleyip koşul oluşunca ilerletmek gibi.

Değerlendirme iki parçadan oluşur: bir **script** ve scriptin ne sıklıkta çalışacağını söyleyen bir **takvim**.

## Açma

1. Göreve sağ tıklayıp **Değerlendirme**'yi seçin.
2. **Kod** kutusuna scripti yazın.
3. **Takvim** bölümünde **Değerlendirme Etkin** → *Evet, belirlenen takvimde çalıştır.* kutusunu işaretleyin.
4. Açılan kutuya takvimi yazın (aşağıda).

Değerlendirme'si etkin görevin kutusunun altındaki takvim simgesi koyulaşır.

**Hemen Çalıştır** kutusu varsayılan olarak işaretlidir: ilk çalışma, **Değişiklikleri Uygula** dediğiniz anda olur. İşareti kaldırırsanız ilk çalışma takvimin ilk uygun zamanını bekler.

## Script ne yapar

Script, görev scriptleriyle aynı nesneleri kullanır. İşi **aksiyon seçerek** ilerletir:

```js
if ($Xml.Evaluate('string(OdemeDurumu)') == 'Ödendi') {
    $WorkItem.SelectedAction = 'Tamamla';
}
```

Aksiyonun **Ad**'ını yazın. Script aksiyon seçmezse o çalışmada hiçbir şey değişmez.

Görevin akıştaki yeri davranışı belirler:

### Başlangıç görevinde: akışı takvim başlatır

Görevin **Başlangıç Noktası** *Evet* ise takvim her geldiğinde sistem, kimse başlatmadan **yeni bir akış** açar ve scripti çalıştırır.

- Script bir aksiyon seçerse akış o aksiyonla ilerler.
- Script aksiyon seçmezse açılan akış **tümüyle geri alınır**; hiçbir iz kalmaz.

Görevin İş Öncesi Script'i ve Otomatik Seçim Scriptleri Değerlendirme scriptinden önce çalışır. Onlardan biri aksiyon seçtiyse Değerlendirme scripti çalışmaz.

Kimse başlatmadığı için bu akışta "Başlatan Kişi …" varsayılan değerleri boş gelir; `$Initiator`'a güvenmeyin.

### Diğer görevlerde: bekleyen işler denetlenir

Takvim her geldiğinde o görevde **bekleyen her iş** için script ayrı ayrı çalışır.

- Script aksiyon seçerse iş o aksiyonla tamamlanır.
- Seçmezse iş beklemeye devam eder; sıradaki çalışmada yeniden denenir.

[Modül görevlerinde](/modul-gorevleri) önce modülün kendi scripti yeniden denenir; o da aksiyon seçmezse Değerlendirme scripti çalışır.

## Takvim

Takvim bir XML parçası olarak yazılır. Tasarımcı varsayılan olarak 12 saatte bir çalışan takvimi önerir:

```xml
<Schedule Name="">
  <Rule Type="Hourly">
    <Duration>12:00:00</Duration>
  </Rule>
</Schedule>
```

`Duration` yineleme aralığıdır ve `gün.saat:dakika:saniye` biçiminde yazılır: `00:30:00` yarım saat, `1.00:00:00` bir gün.

Takvime başka kurallar ekleyerek çalışmanın **yapılmayacağı** zamanları belirtirsiniz:

| `Type` | İçine yazılan | Anlamı |
|---|---|---|
| `Hourly` | `Duration` | Yineleme aralığı. |
| `Weekly` | Bir ya da birkaç `DayOfWeek` (`Monday` … `Sunday`) | Çalışılmayacak günler. |
| `Daily` | `Start`, `End` (saat), `Invert` (`True` / `False`) | Gün içinde çalışılmayacak saat aralığı; `Invert` `True` ise aralığın dışı. |
| `Monthly` | Bir ya da birkaç `Day` (sayı) | Çalışılmayacak ayın günleri. |

**Örnek:** saatte bir, hafta sonları hariç:

```xml
<Schedule Name="">
  <Rule Type="Hourly">
    <Duration>01:00:00</Duration>
  </Rule>
  <Rule Type="Weekly">
    <DayOfWeek>Saturday</DayOfWeek>
    <DayOfWeek>Sunday</DayOfWeek>
  </Rule>
</Schedule>
```

> **Günler tersinden yazılır.** `Weekly` kuralına yazdığınız günler işin çalışacağı değil, **çalışmayacağı** günlerdir. Yalnızca pazartesi çalışsın istiyorsanız öbür altı günü yazarsınız.

## Dikkat edilecekler

- **En kısa aralık 10 dakikadır.** Daha kısa bir süre yazsanız da iki çalışma arası 10 dakikadan az olmaz (sunucu ayarıdır; yöneticiniz değiştirmiş olabilir).
- **Takvim ne zaman kurulur:** **Değişiklikleri Uygula** dediğinizde ve versiyonun durumunu değiştirdiğinizde. Takvimi değiştirip uygulamadıysanız eski takvim geçerlidir.
- **Deneme Durumu'ndaki versiyon da çalışır.** Başlangıç görevindeki takvim, versiyon arşive alınana kadar işler; Deneme Durumu'nda açtığı akışlar deneme akışıdır. Denemeyi bitirdiğiniz bir versiyonda takvimi açık unutmayın.
- **"Çalışmıyor" gibi görünebilir.** Başlangıç görevinde aksiyon seçmeyen script hiçbir iz bırakmaz. Çalışıp çalışmadığını **Arkaplan İş Yöneticisi**'nden izleyin: [İşlem sırası ve hatalar](/islem-sirasi-ve-hatalar).
- Takvimde tanınmayan bir `Type` yazarsanız "Schedule type … not found." hatası alırsınız.

## İlgili sayfalar

- [Modül görevleri](/modul-gorevleri): Komut Otomasyonu ile birlikte kullanım
- [Koşullu yönlendirme](/kosullu-yonlendirme)
- [Görev ayarları](/gorev-ayarlari): Termin (süre dolunca tek seferlik aksiyon)

---

**Kaynak:** Ürün davranışı incelenerek yazıldı. Eğitim 1 – Veysel'de yalnızca değinilir.
