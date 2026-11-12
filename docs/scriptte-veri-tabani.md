# Scriptte veri tabanı

> **Taslak.** Biçim ve içerik onayı bekliyor.

Görev scriptlerinde `$Database` nesnesi ile süreçte tanımlı tablolara yazabilir ve tablolardan okuyabilirsiniz. En sık kullanım: kullanıcı görevi tamamladığında formdaki satırları **İş Sonrası Script**'te tabloya yazmak. Bu sayfa üç işlevi anlatır.

| İşlev | Ne yapar |
|---|---|
| `$Database.ImportFromXml(sorgu)` | Form verisindeki satırları tabloya yazar. |
| `$Database.ExportToXml(sorgu)` | Tablodan okuduğu kayıtları form verisine satır olarak ekler. |
| `$Database.Get(sorgu)` | Tablodan okuduğu kayıtları scriptte dolaşabileceğiniz bir liste olarak verir. |

## Sorguyu sihirbazla yazma

Sorguyu elle yazmazsınız. Script alanında işlevi yazıp parantezi açın (`$Database.ImportFromXml(`); çıkan ipucunda **Query** sözcüğüne tıklayın. Açılan pencere formdaki **Veritabanı Sorgusu** bileşeninin penceresiyle aynıdır: şema, tablo ve alanlar seçilir, **Tamam**'a basınca sorgu parantezin içine yazılır.

## Formdan tabloya yazma: `ImportFromXml`

```js
$Database.ImportFromXml({
    "Parameters": {
        "TargetSchema": "Egitim",
        "TargetTable": "Kategoriler"
    },
    "XPath": "Categories/Category",
    "Columns": [
        { "Name": "Id" },
        { "Name": "Ad",    "Properties": { "XPath": "Name" } },
        { "Name": "No",    "Properties": { "XPath": "Number" } },
        { "Name": "TurId", "Properties": { "XPath": "Type/Value" } }
    ]
});
```

- **XPath**, tabloya yazılacak satırların yoludur; uyan her eleman bir kayıt olur.
- **Columns** yazılacak sütunlardır. Her sütunun **Eşlenen XPath**'i (`Properties.XPath`) değerin satırdaki hangi alandan alınacağını söyler. Boş bırakılırsa sütunla aynı adlı alan kullanılır.
- Sihirbazdaki **Kriter** bölümü yazarken kullanılmaz.

**Ekleme mi, güncelleme mi?** Her satır için önce aynı `Id`'li kaydı güncellemeyi dener; kayıt yoksa ekler. Satırda `Id` boşsa yeni bir `Id` üretilir ve kayıt eklenir (tablonun anahtarı sistemin ürettiği türden bir kimlikse; CodEase'te oluşturulan tablolarda böyledir). `Id` sütununu listeye yazmasanız da böyle çalışır, ama görünür olması için yazmanız önerilir.

**Silinen satırlar.** Kullanıcı tablodan okunmuş bir satırı formda silerse satır form verisinde "silindi" diye işaretli kalır; `ImportFromXml` bu satırın kaydını tablodan da siler. Satırda `Id` bulunmalıdır.

**Üstteki satırın değerini yazma.** Eşlenen XPath'ler yazılan satıra göredir; yukarı da çıkabilir. İç içe iki tabloda alttaki satırlara üsttekinin kimliğini yazmak için eşlenen XPath `../../Id` olur. Örnek: [Örnek: listeleri yöneten ayar ekranı](/ayar-ekrani).

Ayrıca kaydetmeniz gerekmez; `ImportFromXml` yazmayı kendisi yapar.

## Tablodan forma okuma: `ExportToXml`

Aynı sorguyla işlevin adını değiştirmeniz yeterlidir:

```js
$Database.ExportToXml({ /* aynı sorgu */ });
```

Tablodaki her kayıt için `Categories`'in altına bir `Category` ekler ve sütunları eşlenen alanlara yazar. Başlangıç görevinin **İş Öncesi Script**'ine yazarsanız form bu satırlarla dolu açılır. Formdaki **Veritabanı Sorgusu** bileşeninin yaptığı işin script karşılığıdır: [Veritabanı Sorgusu bileşeni](/veritabani-sorgusu).

Yalnızca sorguda bulunan sütunlar gelir: tür adını da istiyorsanız sorguya o sütunu ekleyip bir alana eşleyin.

## Kayıtları scriptte dolaşma: `Get`

```js
$Database.Get({ /* sorgu */ }).Each(function () {
    console.info(this.Id + ' ' + this.Ad);
});
```

`Each` her kayıt için fonksiyonu bir kez çalıştırır; `this` o kayıttır, sütunlar adlarıyla okunur. `Get` sorgusunda **XPath** kullanılmaz.

Kayıtları değiştirip geri yazmak için listeyi bir değişkene alın, alanlara değer atayın ve `Save` çağırın:

```js
var table = $Database.Get({ /* sorgu */ });

table.Each(function () {
    this.TurId = '';
});

table.Save();
```

`Save` listedeki bütün kayıtları günceller.

## Özel eşleştirme

Bir sütunun değeri alandan olduğu gibi alınmayacaksa (hesaplanacak, biçimi değişecekse) sihirbazda **Özel Eşleştirme Kullanılsın mı?** → *Evet, özel eşleştirme fonksiyonu kullan.* kutusunu işaretleyin. Sorguya bir `Map` fonksiyonu eklenir; fonksiyona parametre adını siz verirsiniz:

```js
$Database.ImportFromXml({
    /* … sorgu … */
    "Map": function (category) {
        this.No = '000' + category.Evaluate('Number');
    }
});
```

- Fonksiyon her satır için bir kez çalışır.
- `this` tablodaki kayıttır; parametre (`category`) form verisindeki satırdır.
- Sütun eşleştirmelerinden **sonra** çalışır; aynı sütuna yazarsa onun değeri geçerli olur.

`ExportToXml`'de de aynıdır; bu kez tablodan okunan değeri satıra yazarsınız:

```js
"Map": function (category) {
    category.SetValue('Number', this.No.substring(3));
}
```

## Hata olursa

Script hata verirse o adımda tabloya yazılanlar dahil her şey geri alınır: [İşlem sırası ve hatalar](/islem-sirasi-ve-hatalar).

---

**Kaynak:** Script Eğitimi – Veysel, 89:30–113:30; CodEase Eğitim – Atılay, Veri Tabanı, 13:00–29:00 ve 66:00–68:30. Videoda eksik ya da belirsiz kalan noktalar ürün davranışına göre tamamlandı.
