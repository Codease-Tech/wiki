# Havuz scriptleri ve değişkenler

> **Taslak.** Bu sayfa eğitim videolarından değil, ürünün kendisi incelenerek yazıldı; anlatılanlar canlı sistemde denenmedi. Biçim ve içerik onayı bekliyor.

[İş Öncesi ve İş Sonrası Script](/is-oncesi-ve-is-sonrasi-script) bir göreve bağlıdır. Bu sayfa havuzun tamamı için geçerli iki şeyi anlatır: akış başlarken ve biterken çalışan **havuz scriptleri** ile bütün scriptlerde okunabilen **değişkenler**.

## Havuz scriptleri

Havuza tıkladığınızda şemanın altında açılan **Scriptler** başlığında dört kutu vardır:

| Script | Ne zaman çalışır |
|---|---|
| Açılış Scripti | Akış başlatılırken, bir kez. Başlangıç görevinin İş Öncesi Script'inden önce. |
| Kapanış Scripti | Akış olağan yoldan tamamlandığında (açık görev kalmadığında), bir kez. |
| Sonlandırma Scripti | Akış sonlandırıldığında (iptal). Bu durumda Kapanış Scripti çalışmaz. |
| Yürütme Scripti | Akışta bir görev her işlendiğinde. |

Bu scriptler akışın verisi üzerinde çalışır: `$Xml`, `$Instance`, `$Initiator`, `$Database` kullanılabilir. Belirli bir göreve bağlı olmadıkları için `$WorkItem` **yoktur**.

### Ne zaman havuz scripti, ne zaman görev scripti

- **Akış bittiğinde yapılacak iş** (sonucu veri tabanına yazmak, talep sahibine haber vermek) için **Kapanış Scripti**'ni kullanın. Akış hangi görevde, hangi aksiyonla biterse bitsin çalışır; aynı kodu her son görevin İş Sonrası Script'ine yazmanız gerekmez.
- **İptal edilen akışta geri alınacak iş** (ayrılan bütçeyi serbest bırakmak, kaydı "iptal" diye işaretlemek) için **Sonlandırma Scripti**'ni kullanın.
- **Akış başında bir kez yapılacak hazırlık** hangi başlangıç görevinden başlanırsa başlansın aynıysa **Açılış Scripti**'ne yazın.
- Yalnızca belirli bir adımda yapılacak iş görev scriptinde kalır.

## Değişkenler

Değişken, havuzun bütün scriptlerinde adıyla okunan sabit bir değerdir: bir onay sınırı, bir e-posta adresi, bir servis adresi. Değeri tek yerden değiştirirsiniz.

### Tanımlama

Havuza tıklayın, **Diğer** başlığı altında **Değişkenler**'i açın ve **Yeni Değişken Ekle**'ye basın:

| Alan | Ne yazılır |
|---|---|
| Ad | Scriptte kullanılacak ad (örnek: `OnaySiniri`). |
| Değer | Değişkenin değeri. |
| Tip | Metin, Numara, Tarih ya da İkili. |

Scriptte adın başına `$` koyarak okursunuz:

```js
if ($Xml.Evaluate('number(Tutar)') > $OnaySiniri) {
    $WorkItem.SelectedAction = 'Onaya Gönder';
}
```

### Görevde değeri değiştirme

Aynı script ya da form her görevde biraz farklı davransın istiyorsanız değişkenin değerini görev bazında ezebilirsiniz.

1. Göreve sağ tıklayıp **Değişkenler**'i seçin.
2. **Varolan Değişkeni Değiştir** ile havuz değişkenini seçin ve o görevde geçerli olacak **Değer**'i yazın.

Örnek: `$Asama` değişkeni havuzda `Talep`, yönetici görevinde `Onay` olur; ortak bir kütüphane fonksiyonu hangi adımda çağrıldığını buradan anlar. Yazdığınız değer değişkenin tipine çevrilir.

### Hazır gelen değişkenler

| Değişken | Değer |
|---|---|
| `$Process` | Sürecin kimliği. |
| `$FolderName` | Sürecin bulunduğu dizinin adı. |
| `$FolderPath` | Dizinin üst dizinlerle birlikte yolu (`Üst\Alt`). |
| `$Calendar_HoursInDay` | Çalışma takvimine göre bir gündeki çalışma saati. |

> **Değişken akış boyunca bilgi taşımaz.** Değişkenler tasarımda verilen sabit değerlerdir. Bir scriptte hesapladığınız değerin sonraki görevde de bulunmasını istiyorsanız onu veri modelindeki bir alana yazın (`$Xml.SetValue`).

## İlgili sayfalar

- [İş Öncesi ve İş Sonrası Script](/is-oncesi-ve-is-sonrasi-script)
- [İşlem sırası ve hatalar](/islem-sirasi-ve-hatalar)
- [Script kütüphaneleri](/script-kutuphaneleri)

---

**Kaynak:** Ürün davranışı incelenerek yazıldı; eğitim videolarında anlatılmıyor.
