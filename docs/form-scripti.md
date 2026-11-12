# Form scripti

> **Taslak.** Biçim ve içerik onayı bekliyor.

Her formun, form ekrana çizilmeden hemen önce kullanıcının tarayıcısında çalışan bir scripti vardır. En sık kullanımı, formdaki bir alanın değişimini izleyip buna göre bir iş yapmaktır.

Form scripti güçlüdür ama pahalıdır: yazdığınız her şey kullanıcının tarayıcısında, form açıkken çalışır. Aynı işi bir bileşen ayarı, **Koşullu İçerik** ya da dinamik kural yapabiliyorsa onu tercih edin; scripti kısa tutun.

## Nerede yazılır

Süreç ekranında **Formlar** başlığının altındaki formun yanındaki oka tıklayın ve **Script**'i seçin.

## Ne zaman çalışır

Form her açıldığında, alanlar ekrana çizilmeden önce bir kez. Script içinde form verisini `$Xml` ile okuyabilir ve değiştirebilirsiniz.

## Bir alanın değişimini izleme

```js
$Xml.Bind('Expenses/Expense/Amount', function () {
    alert(this.Evaluate());
});
```

- İlk parametre izlenecek alanın yoludur; köke göre yazılır, kök adı yazılmaz.
- İkinci parametre, alan değiştiğinde çalışacak fonksiyondur. İçinde `this` değişen alandır; `this.Evaluate()` değerini okur, `this.SetValue(…)` yazar.
- Fonksiyon kullanıcı alandan çıktığında (ya da Enter'a bastığında) çalışır; her tuşta değil.

### `Bind` ve `Live` farkı

| | Neye bağlanır |
|---|---|
| `$Xml.Bind(yol, fonksiyon)` | Çağrıldığı anda **var olan** alanlara. |
| `$Xml.Live(yol, fonksiyon)` | Var olanlara **ve sonradan eklenenlere**. |

Fark tablolarda ortaya çıkar. Yukarıdaki örnek, form açıldığında var olan masraf satırlarının tutarını izler; kullanıcı **Yeni Ekle** ile satır eklerse yeni satırdaki tutar izlenmez. Form açıldığında hiç satır yoksa `Bind` hiçbir şeye bağlanmaz ve hata da vermez.

Sonradan eklenen satırları da izlemek için `Live` kullanın:

```js
$Xml.Live('Categories/Category/Name', function () {
    alert(this.Evaluate());
});
```

`Live` bunu formdaki bütün değişiklikleri dinleyerek yapar; `Bind`'dan pahalıdır. `Bind` yetiyorsa `Live` kullanmayın.

## `alert` ve `console`

Form üzerindeki scriptlerde (form scripti, dinamik kurallar) `alert(…)` kullanabilirsiniz; ekran vardır. Akış tarafındaki scriptler sunucuda çalışır, orada `alert` yoktur; değer görmek için `console` kullanılır: [İş Öncesi ve İş Sonrası Script → Hata ayıklama](/is-oncesi-ve-is-sonrasi-script#hata-ayıklama).

---

**Kaynak:** Script Eğitimi – Veysel, 73:30–88:00. Videoda eksik ya da belirsiz kalan noktalar ürün davranışına göre tamamlandı.
