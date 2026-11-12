# Modül görevleri: kişiye atanmayan adımlar

> **Taslak.** Bu sayfa eğitim videolarından değil, ürünün kendisi incelenerek yazıldı; anlatılanlar canlı sistemde denenmedi. Biçim ve içerik onayı bekliyor.

Akıştaki her adımı bir kişi yapmak zorunda değildir. Bir kaydı veri tabanına yazan, her satır için ayrı bir onay akışı açan ya da başka bir akıştan haber bekleyen adımlar için **Modül** tipinde görev kullanırsınız. Modül görevi kimseye atanmaz; sistem onu kendisi işler ve görevin aksiyonlarından biriyle akışı sürdürür.

## Görevi modül yapma

1. Göreve tıklayın. Sağdaki özellik panelinde **Tip** alanını **Normal**'den **Modül**'e çevirin.
2. Panelde **Rol**, **Talimatlar** ve **Boşta Kalma Süresi** kalkar; yerine **Modül Tipi** gelir. Tipi seçin.
3. Göreve sağ tıklayıp **Modül**'ü seçin; seçtiğiniz tipin ayarları açılır.

| Modül Tipi | Ne yapar |
|---|---|
| Alt Akış | Başka bir havuzdan, verideki her satır için ayrı bir akış başlatır. |
| Komut Otomasyonu | Bir script çalıştırır; script hangi aksiyonla devam edileceğini seçer. |
| Olay | Adı verilen bir olayı tetikler; o olayı bekleyen görevler uyanır. |
| Olay Dinleyici | Adı verilen olayı bekler; olay gelince devam eder ya da yeni akış başlatır. |
| Web Servisi Sağlayıcı | Ayarı yoktur; sırası gelince ilk aksiyonla ilerler. Bu sayfada anlatılmıyor. |

Modül görevinin sağ tık menüsünde Bilgilendirme, hatırlatıcılar, İzleyiciler, Form ve Yazdırma bulunmaz. İş Öncesi Script, İş Sonrası Script, Termin, Değerlendirme ve Değişkenler bulunur.

> **Modül görevine de aksiyon ekleyin.** Modül görevi akışı aksiyonla sürdürür. Alt Akış, Olay ve Olay Dinleyici görevleri (script yazmadıysanız) **ilk aksiyonu** seçer; aksiyonu olmayan Alt Akış görevi hata verir.

Çalışma sırası kullanıcı görevindekiyle aynıdır: önce İş Öncesi Script, sonra aksiyonlardaki [Otomatik Seçim Scriptleri](/kosullu-yonlendirme), sonra modülün kendisi. Otomatik Seçim Scripti bir aksiyon seçerse modül hiç çalışmaz.

## Komut Otomasyonu

Kimsenin bir şey yapmasına gerek olmayan işler içindir: veri tabanına kayıt, bir web servisini çağırma, hesaplama.

**Modül** penceresindeki **Kod** kutusuna scripti yazın. Script, görev scriptleriyle aynı nesneleri kullanır (`$Xml`, `$WorkItem`, `$Database` …).

```js
// Tutar sınırın altındaysa onaysız geç
if ($Xml.Evaluate('number(Tutar)') < 1000) {
    $WorkItem.SelectedAction = 'Onaysız';
} else {
    $WorkItem.SelectedAction = 'Onaya Gönder';
}
```

- Script `$WorkItem.SelectedAction` ile bir aksiyon seçerse görev o aksiyonla tamamlanır ve akış sürer. Aksiyonun **Ad**'ını yazın.
- Script aksiyon seçmezse görev **bekler**. Bekleyen görev, [Değerlendirme](/zamanlanmis-isler) takvimi her geldiğinde scripti yeniden çalıştırır. Bir koşul gerçekleşene kadar belirli aralıklarla denetleme böyle kurulur.

> **Dikkat.** Aksiyon seçmeyen ve Değerlendirme'si kapalı bir otomasyon görevini ilerletecek bir şey kalmaz; akış o görevde bekler. Scriptinizin her yolda bir aksiyon seçtiğinden emin olun ya da göreve **Termin** koyun.

## Alt Akış

Bir talepteki her kalem için ayrı onay akışı, bir toplantıdaki her katılımcı için ayrı görev zinciri gibi durumlarda kullanılır. Alt akış, **aynı süreçteki başka bir havuzdur**.

**Modül** penceresindeki alanlar:

| Alan | Ne yazılır |
|---|---|
| Havuz | Alt akışın çalışacağı havuz. |
| Görev | O havuzda alt akışın başlayacağı görev. |
| Mod | Üst akışın alt akışları bekleyip beklemeyeceği (aşağıda). |
| XPath | Verideki hangi satırlar için alt akış açılacağı (örnek: `Kalemler/Kalem`). Boş bırakırsanız görevin verisi için tek bir alt akış açılır. |
| Koşul | Satırları süzen koşul (örnek: `Tutar > 1000`). Yalnızca koşula uyan satırlar için alt akış açılır. |
| Satır No XPath'i | Satırı tekil olarak tanıtan alan (örnek: `Id`). |
| Eşleme Verisi XPath | Yalnızca senkronize modunda: satırın değişip değişmediğine karar verirken bakılacak alanlar. |

Her alt akış, üst akışın verisindeki **kendi satırı** üzerinde çalışır: alt akışta doldurulan alanlar üst akışın verisine yazılmış olur. Alt akış, üst akışın dilini ve deneme durumunu devralır.

### Mod

| Mod | Davranış |
|---|---|
| Alt akışları yarat ve devam et | Alt akışlar açılır; üst akış beklemeden ilk aksiyonla ilerler. |
| Tüm alt akışları bekle | Üst akış bu görevde bekler; alt akışların hepsi tamamlanınca ilk aksiyonla ilerler. |
| Alt akışları senkronize ederek devam et | Akış bu göreve yeniden geldiğinde, önceki gelişte açılıp hâlâ süren alt akışlar satırlarla karşılaştırılır: karşılığı süren satır için yenisi açılmaz, satırı artık bulunmayan alt akış sonlandırılır, yeni satırlar için alt akış açılır. Üst akış beklemeden ilerler. |

Senkronize modunda eşleşme **Satır No XPath'i** değerine ve varsa **Eşleme Verisi XPath** ile seçilen içeriğe göre yapılır. İçerik değiştiyse satır yeni sayılır: eski alt akış sonlandırılır, yenisi açılır.

### Dikkat edilecekler

- Üst akış her zaman görevin **ilk aksiyonuyla** ilerler. Görevde aksiyon yoksa akış "No action defined for … subworkflow task" hatası verir.
- **Satır No XPath'i** yazdıysanız o alan her satırda dolu ve tekil olmalıdır. Boşsa "Invalid Row Id value", iki satırda aynıysa "Row Id value already exists", alan bulunamazsa "Row Id xpath not found" hatası alırsınız.
- Seçime uyan satır yoksa alt akış açılmaz; görev yine ilk aksiyonla geçer.
- Hedef havuzun **Veri Kökü** satır elemanıyla aynı adı taşıyorsa alt akış doğrudan o satır üzerinde çalışır. Aynı değilse satırın bir kopyası hedef havuzun kökü altında oluşturulur ve alt akış onun üzerinde çalışır.

## Olay ve Olay Dinleyici

İki akışı birbirine doğrudan bağlamadan haberleştirir: biri olayı tetikler, öbürü dinler.

**Olay** görevinin ayarları:

| Alan | Ne yazılır |
|---|---|
| Olay Adı | Tetiklenecek olayın adı. Liste, süreçte daha önce yazılmış adları önerir; yeni ad da yazabilirsiniz. |
| Olay Veri XPath'i | Dinleyenlere gönderilecek veri. |
| İşleme Script'i | Boşsa görev ilk aksiyonla ilerler. Doluysa aksiyonu script seçer; scriptte `$Handlers`, olayı işleyen görevlerin kimliklerini dizi olarak verir. |

İşleme Script'i yazdıysanız mutlaka bir aksiyon seçmelidir; seçmezse "Event trigger module must be select an action." hatası alırsınız.

**Olay Dinleyici** görevinin ayarları:

| Alan | Ne yazılır |
|---|---|
| Olay Adı | Beklenecek olayın adı. |
| İşleme Script'i | Boşsa olay gelince görev ilk aksiyonla ilerler. Doluysa aksiyonu script seçer; scriptte `$Input`, olayla gelen veridir (`$Input.GetValue('Alan')`). |

Dinleyicinin akıştaki yeri davranışını belirler:

- **Akışın ortasındaysa** akış o görevde bekler; olay tetiklenince devam eder.
- **Başlangıç Noktası** *Evet* ise olay her tetiklendiğinde **yeni bir akış başlar**.

Uzun süre gelmeyebilecek bir olayı bekleyen göreve **Termin** koyarak zaman aşımı tanımlayabilirsiniz: [Görev ayarları](/gorev-ayarlari#termin).

## İlgili sayfalar

- [Akış tasarımı](/akis-tasarimi)
- [Koşullu yönlendirme](/kosullu-yonlendirme): Otomatik Seçim Scripti
- [Zamanlanmış işler](/zamanlanmis-isler): Değerlendirme
- [İşlem sırası ve hatalar](/islem-sirasi-ve-hatalar)

---

**Kaynak:** Ürün davranışı incelenerek yazıldı; eğitim videolarında anlatılmıyor.
