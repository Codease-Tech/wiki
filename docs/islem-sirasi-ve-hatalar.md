# İşlem sırası ve hatalar

> **Taslak.** Biçim ve içerik onayı bekliyor.

Bir süreçte script yazılabilen birçok yer vardır. Bu sayfa hangisinin ne zaman çalıştığını, kullanıcı aksiyona bastığında işin ne zaman işlendiğini ve bir script hata verdiğinde ne olduğunu anlatır.

## Scriptler hangi sırayla çalışır

Kullanıcı bir aksiyonla görevi tamamladığında:

1. Tamamlanan görevin **İş Sonrası Script**'i
2. Aksiyondan çıkan rotaların **Doğrulama Kuralı**
3. Sonraki görev oluşur; onun **İş Öncesi Script**'i
4. Sonraki görevin aksiyonlarındaki **Otomatik Seçim Scriptleri**
5. Hiçbiri doğru dönmediyse görevin **rol scripti**
6. Görev, rolün döndürdüğü kişilere atanır

Otomatik Seçim Scripti bir aksiyonu seçerse 5 ve 6 atlanır; sıra o görev için 1'den yeniden başlar: [Koşullu yönlendirme](/kosullu-yonlendirme).

## `return` ne zaman yazılır

| Script nerede | Sonuç nasıl verilir |
|---|---|
| **Form üzerinde:** Biçimlendirme Kuralı, Doğrulama Kuralı (dinamik kurallar) | `return` ile: `return $Xml.IsEmpty();` |
| **Akış tarafında:** rol scripti, rotanın Doğrulama Kuralı, Otomatik Seçim Scripti | `return` yazılmaz; son satırdaki ifadenin değeri sonuçtur: `$Xml.Sum('…') >= 500` |

Form üzerindeki scriptler kullanıcının tarayıcısında, akış tarafındakiler sunucuda çalışır. Akış tarafındaki scriptlere `return` yazmayın.

Akış tarafında sonucu son satıra tek başına yazdığınızda düzenleyici satırı uyarı işaretiyle gösterir ("Expected an assignment or function call…"). Bu uyarı zararsızdır.

## Aksiyona basınca iş ne zaman işlenir

**Aktif süreçte** kullanıcı aksiyona bastığında yalnızca form verisi kaydedilir ve görev kapanır; kullanıcının ekranı hemen serbest kalır. Yukarıdaki adımların hepsi kısa süre sonra **arka planda** işlenir.

İki durumda adımlar arka plana bırakılmaz, kullanıcı beklerken **anında** işlenir:

- Süreç **Deneme Durumu**'ndaysa. Denerken sonucu hemen görmeniz için böyledir.
- Aksiyonun özelliklerinde **İşlemi Takip Et** → *Evet, hemen işle.* işaretliyse.

### İşlemi Takip Et ne zaman işaretlenir

- **Aynı göreve dönen aksiyonlarda** (Kaydet ve Beklet). Kullanıcı kaydedip doldurmaya devam etmek ister; arka planda işlenirse form kapanır ve görevi iş listesinden yeniden bulması gerekir.
- **Sonucun o anda oluşması gerektiğinde:** aksiyonla birlikte bir dış sisteme o anki değerin gönderilmesi gibi.

Her aksiyonda işaretlemeyin. Anında işlemenin bedeli vardır: kullanıcı bütün adımlar bitene kadar bekler ve aradaki scriptlerden biri hata verirse hatayı kullanıcı görür.

## Script hata verirse

Bir aksiyonun tetiklediği adımların hepsi tek parça olarak işlenir. Herhangi birinde hata olursa o ana kadar yapılanların **tümü geri alınır**: form verisindeki script değişiklikleri, tabloya yazılan kayıtlar, oluşturulan görevler.

Geri alınamayan tek şey dış sistemlere yapılmış çağrılardır: bir scriptte dış web servisi çağrıldıysa ve sonraki adım hata verdiyse, çağrı yapılmış olarak kalır. Dış çağrıları mümkün olduğunca son adıma koyun.

Hatanın nereye düştüğü işin nasıl işlendiğine bağlıdır:

| İşleme | Hata olunca |
|---|---|
| Anında (Deneme Durumu ya da İşlemi Takip Et) | Hata kullanıcının ekranında görünür. Görev tamamlanmaz, form açık kalır. |
| Arka planda | Kullanıcı hatayı görmez; görevi tamamlamış sayılır ama akış ilerlemez. İş **Arkaplan İş Yöneticisi**'nde **Hata** durumuna geçer ve sistem yöneticisine e-posta gider. |

### Arka planda hataya düşen işi yeniden çalıştırma

1. **Arkaplan İş Yöneticisi** ekranını açın. Hataya düşen işler kırmızı görünür.
2. İşin durumuna tıklayın; **Log** sekmesinde hatanın ayrıntısı yazar.
3. Hatanın nedenini giderin (scripti düzeltin, eksik veriyi tamamlayın).
4. İşin durumunu yeniden **Bekliyor** yapın. İş kaldığı yerden yeniden işlenir.

Bu ekranı yalnızca yöneticiler kullanabilir.

### Sık görülen hata: "No participant specified for task …"

Rol scripti hiç kimse döndürmediğinde çıkar: görev oluşmuş ama atanacak kişi bulunamamıştır. Rol scriptini ve döndürdüğü kimliği denetleyin: [Rol scriptleri](/rol-scriptleri).

## Değer görmek ve akışı bilerek durdurmak

Denerken bir scriptteki değeri görmenin iki yolu vardır: `console` ile tarayıcı konsoluna yazdırmak ya da `throw` ile akışı o noktada durdurmak. İkisi de: [İş Öncesi ve İş Sonrası Script → Hata ayıklama](/is-oncesi-ve-is-sonrasi-script#hata-ayıklama).

JavaScript'in kendi işlevlerini (`substring` gibi) denemek için süreci çalıştırmanız gerekmez; tarayıcının konsoluna (`F12`) yazıp sonucu hemen görebilirsiniz.

---

**Kaynak:** Script Eğitimi – Veysel, 44:30–47:30, 125:00–129:00 ve 141:30–158:30. Videoda eksik ya da belirsiz kalan noktalar ürün davranışına göre tamamlandı.
