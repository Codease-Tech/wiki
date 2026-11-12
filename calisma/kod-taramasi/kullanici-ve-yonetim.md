# Kod taraması: son kullanıcı ve yönetici ekranları

Tarih: 2026-11-12. Kapsam: tasarımcılar dışında kalan her şey. Kod tabanı: `codEase-master/Src` (yalnızca okundu). Doküman sayfaları değiştirilmedi.

## Nasıl okunur

- Kanıt yolları `Src/` köküne görelidir. Kısaltmalar: `UI/` = `CodEase.Workflow.WebApp.Resources/js/codease/workflow/ui/`, `CORE/` = `CodEase.WebApp.Resources/js/codease/core/`, `LOGIC/` = `CodEase.Workflow/Business/Server/Logic/`, `RPC/` = `CodEase.Workflow.Web/RPC/`, `SYS/` = `CodEase.Workflow.WebApp/Configuration.global/System/`, `LOC` = `Localization.xml`.
- Kanıt düzeyi her maddede yazılı:
  - **okundu**: satırları bu taramayı yapan asistan açıp okudu.
  - **alt-asistan**: satırları bir alt asistan okudu; ana asistan yeniden açmadı (ayrıca "doğrulandı" yazıyorsa ana asistan da baktı).
  - **çıkarım**: okunan koddan dolaylı sonuç; canlıda denenmeli.
- Türkçe etiketler `LOC` içindeki tr çevirisinden ya da süreç/form XML'inin tr bloğundan alındı. Aynı İngilizce metnin birden çok çevirisi olabildiği için ekrandaki yazım birkaç yerde farklı çıkabilir.
- Önem: **yüksek** = kullanıcı bunu bilmeden işini yapamaz ya da yanlış yapar; **orta** = sık sorulur; **düşük** = ayrıntı.
- Dokümanda bugün bu alanda yalnızca `docs/is-listeleri.md` var. Aşağıda "dokümanda: yok" yazmayan her madde için varsayılan da "yok"tur.

---

# 1. Ekran ekran envanter

## 1.1 Sol menü ve üst çubuk

### Sol menü (yukarıdan aşağıya)

| Sıra | Giriş | Ne açar | Kim görür | Kanıt |
|---|---|---|---|---|
| 0 | Logo | Anasayfa (`/`). Logo kiracının logosudur. | herkes | `UI/logo/panel.js:5-19` okundu |
| 4 | **Etkinlik Akışı** | Etkinlik akışı sayfası (`#/activitystream`) | oturum açmış herkes | `UI/activity/panel.js:7-17`, `LOC:17363` okundu |
| 5 | İş listeleri: **Gelenler, Önemli, Tüm Bekleyenler, Takip Edilenler, Tamamlananlar**, kullanıcının kendi etiketleri, **Tümü** | İlgili iş listesi (`#/worklist/{etiket}`); her satırın yanında parantez içinde görev sayısı | oturum açmış herkes | `UI/panels/worklistfilter.js:7-28`, `LOGIC/WorkItemManager.cs:295-351`, `UI/tag.widgets.js:27-33` okundu |
| 20 | **Takvim** | Takvim sayfası (`#/calendar`); vekâlet de buradan tanımlanır (bkz. 1.4) | oturum açmış herkes | `UI/calendar/panel.js:7-17`, `LOC:16788` okundu |
| 25 | Dizin ağacı, en üstte **Tüm Dizinler** | Dizin sayfası: başlangıç kutucukları, varsa dizinin gösterge panoları | herkes (yetkisi olan dizinler) | `UI/panels/folders.js:7-31`, `UI/folder.widgets.js:849-872` okundu |
| 30 | **Market** | Uygulama marketi (`#/market`) | yalnızca yönetici | `CodEase.Market.WebApp.Resources/js/codease/market/ui/panel.js:7-18` okundu |
| 800 | **Sistem Yönetimi** | "Yönetim İşlemleri" sayfası (`#/admin`): yönetim süreçlerinin başlangıç kutucukları (bkz. 1.6) | yalnızca yönetici | `UI/panels/admin.js:7-17`, `UI/view.admin.js:7-35`, `LOC:17000, 17032` okundu |
| 900 | **Oturum Aç** | Giriş sayfası | yalnızca anonim ziyaretçi | `UI/panels/signin.js:7-17` okundu |

- Önem: yüksek. Dokümanda: yalnızca iş listeleri var; Etkinlik Akışı, Takvim, Market, Sistem Yönetimi hiç geçmiyor.
- Sıra, koddaki sıra numarasına göredir; ekranda aynı sırayla çizildiği **çıkarım**.
- Arşiv (doküman arşivi) için bir sol menü girişi kodda duruyor ama yüklenmiyor: **ölü** (`manifest.xml:33` yorum satırı, okundu). Doküman tipi dizinler ise dizin ağacından açılır (bkz. 1.9).

### Üst çubuk

| Giriş | Ne yapar | Kanıt |
|---|---|---|
| Soru işareti (**Yardım**) | Görev ekranındaysanız ve süreçte tanımlıysa **Dokümantasyon** ve **Destek** bağlantılarını gösterir; değilse `/help` adresini yeni sekmede açar. | `UI/help/panel.js:7-18`, `CORE/ui/ui.js:159-163`, `UI/workitem.widgets.js:682-724` okundu |
| Zil (**Bilgilendirmeler**) | Okunmamış bildirim sayısını gösterir; tıklayınca bildirim listesi ve **Tümünü Okundu Yap** düğmesi açılır. Bir bildirime tıklamak onu okundu yapar. | `UI/notifications/panel.js:7-38`, `UI/notifications/widgets.js:18-59`, `LOC:16952, 17008` okundu |
| Kullanıcı adı | Menü: **Kullanıcı Profilim**, **Geri Bildirim**, **Çıkış** | `UI/usermenu/panel.js:7-45`, `UI/userprofile/panel.js`, `UI/feedback/panel.js`, `UI/login/logoff.js` okundu |
| **Ara...** kutusu | Yazıp Enter'a basınca **Arama Sonuçları** sayfası açılır (bkz. 1.2 "Arama") | `UI/search/panel.js:7-61` okundu |
| **Çevrimdışı** düğmesi | Yalnızca sunucu bağlantısı kopunca görünür; tıklayınca bağlantıyı yeniden dener. | `UI/offline/panel.js:17-56`, `LOC:17216-17224` okundu |

- Anonim ziyaretçide zil, kullanıcı menüsü ve arama gizlidir.
- **Geri Bildirim**: tek bir metin kutusu ve **Tamam**; ileti ürün sahibine gider (nereye gittiği **doğrulanamadı**). `UI/feedback/view.js:7-50` okundu. Önem: düşük.
- **Çıkış**: onay sorar ("Çıkmak istediğinizden emin misiniz ?"). `LOC:17016-17020` okundu; onay penceresinin nerede açıldığı okunmadı (**çıkarım**).
- Anasayfa (`#/home`) iş listesidir; etiket verilmediği için **Gelenler** açılır. Kiracıya özel bir anasayfa dizini tanımlıysa dizin sayfası onu açar. `CORE/ui/ui.js:28, 82-88`, `UI/worklist.widgets.js:138`, `UI/view.folder.js:13-16` okundu.

---

## 1.2 İş listeleri

### Listeler arasındaki kesin fark

| Liste | İçinde ne var | Varsayılan sıra | Kanıt (okundu) |
|---|---|---|---|
| **Gelenler** | Size (ya da üyesi olduğunuz gruba/pozisyona, ya da vekili olduğunuz kişiye) atanmış, durumu **Bekliyor** olan ve üzerinde hâlâ **Gelenler** etiketi duran görevler | Önce akışın önceliği, sonra işin başlama tarihi; eski olan üstte | `LOGIC/Core/WorklistQueryBuilder.cs:102-115, 72-86` |
| **Önemli** | Aynı koşul, ama **Önemli** etiketi olanlar. Sistem hiçbir görevi kendiliğinden Önemli yapmaz; kullanıcı işaretler. | Gelenler ile aynı | aynı yer; `LOGIC/WorkItem.cs:1817, 1854` (yalnızca Gelenler ve Takip etiketleri otomatik) |
| **Tüm Bekleyenler** | Hangi etikette olursa olsun, size atanmış ve durumu **Bekliyor** olan bütün görevler | İş başlama tarihi; yeni olan üstte | `WorklistQueryBuilder.cs:116-123` |
| **Takip Edilenler** | İzleyici olarak eklendiğiniz görevler. Durum süzgeci yok: tamamlanmış olanlar da listede kalır. | Öncelik, sonra başlama tarihi; eski üstte | `WorklistQueryBuilder.cs:142-147`; `WorkItem.cs:796-803, 1848-1858` |
| **Tamamlananlar** | Size atanmış olup durumu **İşleniyor**, **Tamamlanmış** ya da **Başkasına Atandı** olan görevler. Yani başkasına devrettikleriniz de buradadır. | İş bitiş tarihi; yeni üstte | `WorklistQueryBuilder.cs:124-135` |
| Kendi etiketleriniz | O etiketi taşıyan görevler. Durum süzgeci yok. | Öncelik, sonra başlama tarihi; eski üstte | `WorklistQueryBuilder.cs:142-147` |
| **Tümü** | Size atanmış bütün görevler, durumu ne olursa olsun | İş başlama tarihi; yeni üstte | `WorklistQueryBuilder.cs:136-141` |

Ek kurallar:

- Hiçbir listede **Başlatıldı** (formu açılmış ama hiç aksiyon alınmamış başlangıç görevi) ve **Sonlandırıldı** durumundaki görevler görünmez. `WorklistQueryBuilder.cs:163-166` okundu. Sonuç: başlangıç kutucuğuna tıklayıp formu aksiyon almadan kapatırsanız o taslak hiçbir listede çıkmaz (**çıkarım**).
- "Başlattıklarım" diye ayrı bir liste **yok**. Başlattığınız akışın ilk görevi sizin tamamladığınız görev olarak **Tamamlananlar**'da durur. (okundu: etiket listesi `WorkItemManager.cs:295-351`.)
- Kodda bir "Taslak" listesi tanımlı ama menüde yok ve sorgusu boş döner: **ölü**. `Business/Tag.cs:27`, `WorklistQueryBuilder.cs:102-108, 163-166` okundu.
- İzleyici olduğunuz görevler **Tümü** listesine girmez; yalnızca **Takip Edilenler**'dedir (**çıkarım**: izleyiciler iş listesi kaydına eklenmiyor, `WorkItem.cs:1848-1858` `AddToWorklist = false`).
- Görev tamamlanınca üzerindeki **Gelenler** ve **Önemli** etiketleri sistemce kaldırılır. **Kendi etiketleriniz kaldırılmaz**: kendi etiketinize taşıdığınız görev tamamlandıktan sonra da o etiket listesinde durur, siz **Etiketi Kaldır** deyinceye kadar. `LOGIC/WorkItemManager.cs:364-400` okundu; "listede kalır" sonucu **çıkarım**.
- Menüdeki sayılar bir saate kadar önbellekten gelir ve taşıma/etiket kaldırma sonrasında yeniden hesaplanır; **Tüm Bekleyenler** sayısı, kendi etiketine taşınmış bir görev tamamlandığında bir süre eski kalabilir (**çıkarım**, `LOGIC/TagManager.cs:13, 58-72`, `WorkItemManager.cs:372-385`).
- Önem: yüksek. Dokümanda: var ama eksik/yer yer yanlış (bkz. bölüm 3).

### Liste ekranı

- Kolonlar: seçim kutusu (görevi gönderenin resmi; resme tıklamak satırı seçer), **İş Adı** (altında görevin talimat metni), **İş Başlama Tarihi**, **Termin**, **İş Bitiş Tarihi**, **Akış Başlama Tarihi**, **Dizin**, **#** (akış numarası ve durum simgesi), ünlem simgeli öncelik kolonu (0–10 arası sayı). `UI/worklist.widgets.js:139-229`, `LOC:17496-17548` okundu. Hangi kolonların hangi listede gizlendiği tema dosyalarında; okunmadı.
- **#** kolonundaki numaraya tıklamak akışın **Tarihçe** sayfasını açar. `worklist.widgets.js:19, 201-214` okundu.
- Öncelik kolonu Gelenler / Önemli / Takip Edilenler'de bir puandan hesaplanır: akışın önceliği, akışın ve görevin ne kadar süredir beklediği, termine kalan süre (terminine 8 saatten az kalan ya da termini geçen görev yükselir). Diğer listelerde yalnızca akışın önceliğidir. `WorklistQueryBuilder.cs:17-20, 97-100, 231-296` okundu. Puanın satır sırasını da belirleyip belirlemediği **doğrulanamadı**: kod puana göre sıralamayı yalnızca başka sıra verilmemişse yapıyor, oysa varsayılan sıra her zaman veriliyor (`:72-86, 298-301`).
- **Sıralama**: kolon başlığına tıklanır (**çıkarım**: tablo bileşeninin sunucu taraflı sıralaması, `CORE/ui/ui.widgets.js:1001-1010`).
- **Sayfalama** (sağ panel): **Önceki Sayfa** / **Sonraki Sayfa** düğmeleri ve satır sayısı seçimi: 25, 50, 100, **Tümü**. Seçim liste başına tarayıcıda hatırlanır. Varsayılan 25. `worklist.widgets.js:555-621, 240-244` okundu.
- **Filtre** (sağ panel): listedeki görev adlarında geçen kelimeler, yanlarında kaç görevde geçtiğiyle listelenir; ortak başlayan adlar iç içe gruplanır. Bir kelimeye tıklamak listeyi o kelimeyle başlayan görevlere daraltır, yeniden tıklamak süzgeci kaldırır; birden çok kelime seçilebilir (biri tutan görev gelir). `worklist.widgets.js:48-133, 475-553`, `WorklistQueryBuilder.cs:193-229` okundu. Önem: orta.
- İş listesinin kendi içinde **serbest metin arama kutusu yok**. Sunucu, akış numarasıyla ya da görev adı/talimat metniyle aramayı destekliyor ama arayüzde buna bağlı bir kutu yok: **ölü** (arayüze bağlanmamış). `RPC/WorkItems.cs:69-118` okundu; `worklist.widgets.js:233-235` (arama kutusu çizdirilmiyor) okundu.
- Kısayol harfleri tanımlı: Yenile `r`, Başkasına Ata `d`, Önceki Sayfa `p`, Sonraki Sayfa `n` (tarayıcının erişim tuşu bileşimiyle). `worklist.widgets.js:306, 393, 570, 579` okundu. Önem: düşük.

### Araç çubuğu ve toplu işlem

Bir ya da daha çok görev seçilince düğmeler görünür. Hepsi seçili görevlerin tümüne uygulanır. `UI/worklist.widgets.js:298-470` okundu.

| Düğme | Simge | Ne yapar | Ne zaman görünür |
|---|---|---|---|
| **Yenile** | döngü | Listeyi ve menüdeki sayıları yeniler; etkin süzgeci temizler | her zaman |
| **Taşı** | aşağı ok | Açılan listeden **tek** etiket seçilir. Görevin sizdeki bütün etiketleri (Gelenler dahil) silinir, yalnızca seçilen kalır. | görev seçiliyken; **Önemli, Tüm Bekleyenler, Tamamlananlar, Tümü** listelerinde görünmez |
| **Etiketle** | etiketler | Açılan listeden bir ya da birkaç etiket işaretlenir, **Uygula** denir. Seçilenler görevin etiketlerine **eklenir**; görev bulunduğu listede kalır. | görev seçiliyken, her listede |
| **Etiketi Kaldır** | çarpı | Görevden, o an açık olan listenin etiketini kaldırır. | görev seçiliyken; Önemli, Tüm Bekleyenler, Tamamlananlar, Tümü listelerinde görünmez |
| **Başkasına Ata** | paylaş oku | "Atanacak kimlik" kutusundan kişi seçilir, **Tamam** denir. Seçili görevler o kişiye devredilir. | seçili görevlerin hiçbiri bitmemişse |

- Taşı ve Etiketle pencerelerindeki listede sizin etiketleriniz ile **Gelenler**, **Önemli** ve **Takip Edilenler** bulunur (Tüm Bekleyenler, Tamamlananlar, Tümü bulunmaz). `tag.widgets.js:369-371`, `WorkItemManager.cs:303-336` okundu.
- **Yeni etiket** bu pencerelerden açılır: üstteki kutuya ad yazılır, listede eşleşen yoksa altta `"ad" (Yeni Yarat)` satırı çıkar; kutu boşken **Yeni Ekle** satırı vardır. Açılan pencerede **Ad** ve **Üst Birim** (etiketi başka bir etiketin altına koymak için) sorulur. `tag.widgets.js:108-130, 295-367`, `LOC:17245, 17257` okundu. Sol menüde yeni etiket düğmesi yoktur (`UI/panels/worklistfilter.js:19-24`).
- Kendi etiketlerinizin satırında kalem (ad / üst birim değiştir) ve çarpı (sil) simgeleri vardır. **Silme onay sormaz.** `tag.widgets.js:35-37, 214-224` okundu.
- Bir etiket silinince içindeki bekleyen görevler **Tüm Bekleyenler**'de kalır ama Gelenler'e geri dönmez (**çıkarım**: silme yalnızca etiketi kaldırıyor, görevlere Gelenler etiketi geri eklenmiyor; `TagManager.cs:116-126`, `LOGIC/Core/TagDatabase.cs:85-92`). Canlıda denenmeli.
- **Gelenler** ve **Önemli** etiketi yalnızca **Bekliyor** durumundaki göreve verilebilir; tamamlanmış göreve verilmeye çalışılırsa sessizce atlanır. `WorkItemManager.cs:402-415` okundu.
- Önem: yüksek. Dokümanda: düğme adları ve davranışları yok.

### "Önemli" nasıl işaretlenir

Görev(ler) seçilir → **Etiketle** → **Önemli** işaretlenir → **Uygula**. Görev Gelenler'de kalır, ayrıca Önemli'de de görünür. **Taşı** → **Önemli** seçilirse görev Gelenler'den çıkar, yalnızca Önemli'de (ve Tüm Bekleyenler'de) görünür. İşareti kaldırmak için görev açılır, üstteki **Etiketle** düğmesinden Önemli'nin işareti kaldırılıp **Uygula** denir (Önemli listesinin kendi araç çubuğunda Etiketi Kaldır yoktur). Kanıt: yukarıdaki satırlar + `UI/workitem.widgets.js:289-304`, `tag.widgets.js:443-458` okundu; adımların ekrandaki akışı **çıkarım**, canlıda denenmeli.

### Arama (üst çubuk)

- Üstteki **Ara...** kutusuna yazıp Enter'a basılır; **Arama Sonuçları** sayfası açılır. Her sonuç bir başlık (tıklanınca görev ya da doküman açılır) ve eşleşen metin parçasıdır. Hem görev hem doküman çıktıysa üstte **Görevleri Göster** / **Dokümanları Göster** düğmeleriyle tür gizlenip gösterilir. Kutu boşaltılıp odak dışına çıkılınca önceki sayfaya dönülür. `UI/search/panel.js:24-59`, `UI/search/view.js:7-109`, `LOC:17784-17792` okundu.
- Neyi aradığı (form verisi, ekler), kimin görevlerini kapsadığı: bkz. 1.9 "Arama kapsamı".
- Önem: orta.

---

## 1.3 Görev ekranı

Kanıtlar: `UI/workitem.widgets.js`, `UI/view.workitem.js`, `LOGIC/WorkItem.cs:1353-1526` (hepsi okundu).

### Düzen

- Başlıkta görev adı, akış numarası ve akışın başlama tarihi. `workitem.widgets.js:81-92`.
- Üst araç çubuğu: **Kapat**, ardından aşağıdaki simge düğmeleri, ardından aksiyon düğmeleri. Aksiyon düğmeleri sayfanın altındaki çubukta da yinelenir (dar ekranda yalnızca altta). `workitem.widgets.js:562-671`, `view.workitem.js:42-49`.
- Sağ panel: görevin **etkinlik akışı** (yorumlar). Görev salt okunursa ya da aksiyonu varsa gösterilir. `view.workitem.js:51-60`, `workitem.widgets.js:799-849`. Ayrıntı: bkz. 1.9 "Etkinlik akışı".

### Aksiyon dışındaki düğmeler

| Düğme | Ne yapar | Koşul |
|---|---|---|
| **Kapat** | Görevi kapatıp geldiğiniz listeye (yoksa son dizine, o da yoksa anasayfaya) döner. Formda kaydedilmemiş değişiklik varsa sayfadan ayrılma uyarısı çıkar. | her zaman |
| **Taşı** | Tek etiket seçilir; görevin etiketleri yalnızca o olur (Gelenler'den çıkar). | oturum açmış kullanıcı |
| **Etiketle** | Görevin o anki etiketleri işaretli gelir; işaretler değiştirilip **Uygula** denir. Liste ekranındakinden farklı olarak burada işaretini kaldırdığınız etiket de **silinir** (seçim, görevin etiketlerinin tamamının yerine geçer). | oturum açmış kullanıcı |
| **Yazdır** | **Bu formu yazdır** ve/ya da süreçte tanımlı yazdırma şablonları. | görevde varsayılan yazdırma açıksa ya da şablon tanımlıysa (ayar: `docs/gorev-ayarlari.md`) |
| **Tarihçe** | Küçük pencerede akışın görev listesi: **İş Adı, Tarih, Durum, Tamamlayan, Aksiyon**. Altındaki **Diğer detaylar...** bağlantısı tam tarihçe sayfasını yeni sekmede açar. | görev en az bir kez gönderilmişse (yeni başlatılan, henüz gönderilmemiş formda yok) |
| **Başkasına Ata** | "Atanacak kimlik" kutusundan kişi seçilir; onay düğmesi seçimden sonra belirir. Görev o kişiye geçer, ekran kapanır. | görev sizde, durumu Bekliyor ve salt okunur değilse |
| Soru işareti (üst çubuk) | Süreçte tanımlıysa **Dokümantasyon** ve **Destek** bağlantıları | havuzda adresler girilmişse |

Kanıt: `workitem.widgets.js:263-423, 562-578, 682-724, 736-797`; `view.workitem.js:64-128`.

- **Yorum / not**: aksiyon düğmesine basınca çıkan onay kutusunda, aksiyonda "yorum kutusu göster" açıksa **Yorum** alanı görünür; "yorum zorunlu" ise boş bırakılamaz ("Bu alan zorunlu" uyarısı). `workitem.widgets.js:443-529`. Ayrıca sağ paneldeki etkinlik akışına yorum yazılabilir (bkz. 1.9).
- **Onay sorusu**: her aksiyonda "{aksiyon} işlemini seçmek istediğinize emin misiniz ?" sorulur (**Evet** / **İptal**); süreçte aksiyona özel onay metni yazılmışsa o gösterilir. `workitem.widgets.js:448-457`, `LOC:17437`.
- **Eksik alan**: zorunlu alan boşsa aksiyon kutusu yerine "Eksik veya Hatalı Bilgi" iletisi çıkar; **Tamam** deyince ilk hatalı alana gidilir. `workitem.widgets.js:531-553`, `LOC:17441-17445`.
- **Ek dosya**: ayrı bir "ekler" bölmesi yok; ekler formdaki dosya bileşeniyle eklenir (**çıkarım**: görev ekranı kodunda ek düğmesi yok).
- **İzleyici ekleme**: görev ekranında kullanıcının izleyici ekleyebileceği bir düğme **yok**; izleyiciler süreç tasarımında tanımlanır (`docs/gorev-ayarlari.md`). Etkinlik akışında bir paylaşım hedefi seçilebiliyor (bkz. 1.9); bunun kişiyi Takip Edilenler'e ekleyip eklemediği **doğrulanamadı**.
- **Akışı iptal etme**: görev ekranında yok. Yöneticinin yolu için bkz. 1.8.
- **Akış şemasını görme**: görev ekranında doğrudan düğme yok; **Tarihçe → Diğer detaylar...** sayfası şemayı gösterir (bkz. 1.9 "Tarihçe"). Akış başlamadan önce, dizin sayfasındaki başlangıç kutucuğunun köşesindeki büyüteç simgesi sürecin şemasını açar. `UI/folder.widgets.js:526, 603-661` okundu.

### Başkasına Ata (devretme) kuralları

- Yalnızca görev sizdeyken devredebilirsiniz; yönetici her bekleyen görevi devredebilir. `LOGIC/WorkItemManager.cs:247-288` okundu.
- Devredilen görev sizde **Başkasına Atandı** durumuna geçer ve **Tamamlananlar**'da görünür; açınca "Bu görev {kim} tarafından {tarih} tarihinde {kime}'ya atandı." bilgisi çıkar. Karşı tarafa aynı adla, aynı veriyle **yeni bir görev** açılır ve onun **Gelenler**'ine düşer. `LOGIC/WorkItem.cs:599-640`, `workitem.widgets.js:615-638`, `LOC:17140, 17486` okundu.
- Devredilen kişiye görevin ilk bildirim e-postası gider; konu başına `FW:` eklenir. `WorkItem.cs:637, 1832-1843` okundu.
- Deneme durumundaki akışta bile devredilen görev gerçekten seçilen kişiye gider (deneme durumunun "her şey bana gelsin" kuralı devretmede uygulanmaz). `WorkItem.cs:637` (üçüncü parametre) okundu; **çıkarım**.
- Seçim kutusunun yalnızca kullanıcıları mı, yoksa grup/pozisyon/departmanı da mı sunduğu **doğrulanamadı** (kimlik seçici kısıtsız çağrılıyor).
- Önem: yüksek.

### Üstlenme / bırakma (kilit)

- Ayrı bir "üstlen" düğmesi yok. Bir gruba ya da pozisyona atanmış görevi ilk açan kişi görevi kilitler; aynı anda açan diğer kişi formu **salt okunur** görür, aksiyon düğmeleri yerine kırmızı "**{kişi} üzerinde çalışıyor.**" düğmesi çıkar; tıklayınca "Bu görev üzerinde çalışıldığı için kilitlendi ve {tarih} tarihine kadar kilitli kalacak." yazar. `WorkItem.cs:1396-1409, 1507-1509`, `workitem.widgets.js:641-666`, `LOC:17108-17112` okundu.
- Ekran kapatılınca kilit bırakılır; görev yine gruptaki herkesin listesinde durur (kilit görevi kimseye mal etmez). `view.workitem.js:83-90` okundu. Kilidin süresi **doğrulanamadı**.
- Görevi kim tamamlarsa görev herkesin Gelenler'inden çıkar (`docs/rol-scriptleri.md`'de yazılı).
- Önem: orta.

### Salt okunur açılma

Görev şu durumlarda salt okunur açılır, aksiyon düğmeleri gelmez: görev size atanmış değilse; durumu Bekliyor değilse (tamamlanmış, devredilmiş); başka biri kilitlemişse. Tamamlanmış görevde aksiyon yerine seçilen aksiyonun adını taşıyan bilgi düğmesi olur; tıklayınca "Bu görev {kim} tarafından {tarih} tarihinde tamamlandı." (ya da "sistem tarafından", ya da "zaman aşımı nedeniyle otomatik olarak kapatıldı") yazar. `WorkItem.cs:1364-1368`, `workitem.widgets.js:584-613`, `LOC:17128-17136` okundu.

### Bağlantı kopması ve boşta kalma

- Sunucu bağlantısı kopar ve görev kilidi yenilenemezse "Sunucu bağlantınız koptu." penceresi çıkar; **Tamam** deyince form kapanır. Girdikleriniz o tarayıcı sekmesinde saklanır ve aynı görevi yeniden açınca geri gelir (sayfa yenilenirse kaybolur). `workitem.widgets.js:6-24, 69-77`, `LOC:17196-17200` okundu; "sayfa yenilenirse kaybolur" **çıkarım** (bellek içi saklama).
- Görevde boşta kalma süresi tanımlıysa, süre dolunca "Boşta kalma süresi aşıldı." penceresi çıkar ve form kapanır; girdikleriniz aynı biçimde saklanır. `workitem.widgets.js:26-44, 115-121`, `LOC:17204-17208` okundu. Sürenin süreç tasarımcısında nereden verildiğine bakılmadı (tasarımcı alanı).
- Aksiyon sırasında hata olursa hata iletisi aksiyon kutusunun içinde gösterilir, form açık kalır. `workitem.widgets.js:509-519` okundu.
- Önem: orta.

### Deneme durumu uyarısı

Deneme durumundaki akışın görevinde formun üstünde "Deneme Durumu — Bu görev şu an deneme durumunda çalışıyor, kolay deneme yapabilmeniz için sonraki tüm adımlar yine size yönlen…" uyarısı çıkar ve formun altında verinin XML görünümü açılır. `workitem.widgets.js:102, 107-113`, `LOC:17116-17120` okundu. Önem: orta (süreç tasarlayan için).

### Görevden sonra nereye gidilir

Aksiyon alınca, sıradaki görev yine size atanmışsa doğrudan o görev açılır; değilse geldiğiniz liste, o yoksa son dizin, o da yoksa anasayfa. `view.workitem.js:99-128`, `LOGIC/WorkItemManager.cs:232-235` okundu. Önem: orta.

### Erişim notu (canlıda denenmeli)

Görev ekranını hazırlayan kodda "bu kullanıcı bu görevi görebilir mi" denetimi görülmedi: görev size atanmamışsa form salt okunur açılıyor ve olay günlüğe uyarı olarak yazılıyor. Yani bağlantısını bilen her oturumlu kullanıcının bir görevi salt okunur açabildiği **çıkarım**. Daha alt katmanda bir denetim olabilir; okunmadı. `WorkItem.cs:1364-1394` okundu.

---

<!--VEKALET-->

## 1.5 Profil / kişisel ayarlar

Nerede: üst çubukta kullanıcı adı → **Kullanıcı Profilim** (`#/profile`). Düğmeler: **Kapat**, **Kaydet**. Kaydedince sayfa yeniden yüklenir. Kanıt: `UI/userprofile/view.js:7-57`, `CodEase.Workflow.Web/Forms/System.xml:128-484` (form), `:1110-1229, 1278-1293` (tr çevirileri), `RPC/Membership.cs:177-203` — hepsi okundu.

| Bölüm | Alan | Açıklama |
|---|---|---|
| **Temel Bilgiler** | **Görünür Ad**, **Ad**, **Soyad** | Serbest metin |
| **Seçenekler** | **İmaj** | Profil resmi yükleme; 200×200 önizleme |
| | **e-Posta Adresi** | Serbest metin; kullanıcı kendisi değiştirebilir |
| | **Dil** | Liste: İngilizce'nin 26 bölge türü, Turkish (Türkiye), Finnish (Suomi), Dutch (Belgium), Dutch (Netherlands) |
| | **Tarih Formatı** | **Otomatik**, **Kısa Tarih**, **Uzun Tarih** |
| | **Tema** | **Varsayılan** (kiracının teması) ve kiracıda tanımlı temalar; seçince kaydetmeden önizlenir |
| **Giriş Yöntemleri** | Sağlayıcı listesi (salt okunur) | Hesabınıza bağlı giriş yöntemleri |
| | **Şifre Belirle veya Yeni Giriş Yöntemi Ekle** bağlantısı | Parola belirleme / değiştirme ve dış hesap bağlama sayfasını açar (bkz. 1.6 "Kullanıcı ekleme ve parola") |

- **Bildirim tercihleri yok**: profil formunda e-posta ya da ekran bildirimlerini kapatan bir alan bulunmuyor (okundu: formun tamamı).
- **İmza ayarı yok**: profilde imza görseli ya da e-imza ayarı yok. E-imza form bileşeniyle, imzalama anında kart okuyucu / sertifika / PIN sorularak yapılır (`LOC:16689-16693, 16848-16864` okundu; bileşenin kendisi form tasarımcısı alanında).
- Dil değişikliğinin, süren akışların formlarını etkilemediği `docs/yerellestirme.md`'de yazılı (akış başlatanın diliyle açılır).
- Önem: orta. Dokümanda: yok.

---

<!--YONETIM-->

<!--ISYONETICISI-->

<!--AKISYONETIMI-->

<!--RAPORLAR-->

## 1.10 Market

Kaynak: alt-asistan raporu; ◆ işaretli satırları ana asistan da açıp doğruladı.

### Nedir, nereden açılır

- Hazır süreç paketlerinin ("uygulama") listelendiği ve kiracıya eklendiği yer. Sol menüde **Market** (alışveriş arabası simgesi); yalnızca yöneticiye görünür. ◆ `CodEase.Market.WebApp.Resources/js/codease/market/ui/panel.js:7-18`.
- Sayfa yalnızca bir uygulama listesidir: ad (bağlantı) ve açıklama. Kategori, arama, sıralama yok; en son güncellenen üstte, en çok 99 kayıt. `UI/view.market.js:7-21`, `market/ui/widgets.js:6-36`, `CodEase.Market/Business/Server/Application.cs:456-495` (alt-asistan).
- Market her kurulumda açıktır; kapatma ayarı yok. Yalnızca market sunucusunun adresi sunucu yapılandırmasından değiştirilebilir (varsayılan ürün sahibinin market sunucusu). Sunucunun dışarıya erişimi yoksa sayfanın ne gösterdiği **doğrulanamadı**. `Business/Server/Configuration/ApplicationElement.cs:16-27`, `LOGIC/MarketManager.cs:25, 64-107` (alt-asistan).
- Hiç dizini olmayan kiracıda, iş listesinin altında "Henüz bir uygulama eklenmiş değil, kullanmak istediğiniz uygulamayı marketten seçerek ekleyebilirsiniz." kutusu ve aynı uygulama listesi çıkar; yönetici olmayan kullanıcı da görür. İlk dizin eklenince kaybolur. `UI/view.worklist.js:11-27` okundu; `LOC:244-245` (alt-asistan).
- Önem: orta.

### Uygulama ekleme

1. Listede uygulama adına tıklanır; ürün sayfası açılır: **Özellikler** (Ana Fayda, Açıklama, Ana Resim, bölümler), **Lisanslama** (paketler, fiyat, limitler), **Detaylar** (Versiyon, Lisans, Sahibi, Kategori).
2. Üstteki ileti durumu söyler: deneme ("1 ay boyunca kullanmak üzere…"), ücretsiz, ücretli ya da yetkiniz yok ("…lütfen sistem yöneticiniz ile irtibata geçiniz"; bu durumda düğme gizlenir).
3. **Şimdi Ekle** → "Kuruluyor...". Bitince uygulamanın kurulum görevi varsa doğrudan o açılır, yoksa uygulamanın dizini.

- İlk ekleme her zaman **1 aylık ücretsiz deneme**dir (ücretli üründe de). Deneme bitince ürün ücretliyse ödeme istenir.
- Uygulama, üründeki **Kategori** adını taşıyan dizine kurulur (dizin yoksa açılır); süreç ürün adıyla oluşur ve versiyonu doğrudan **Aktif** olur. Lisansı "Ticari" olan uygulamanın versiyonu düzenlemeye kapalıdır; "Açık Kaynak" olan açıktır.
- Abonelik bitiş tarihi geçince uygulamanın başlangıç kutucukları kaybolur (yeni akış başlatılamaz).
- **Güncelleme otomatiktir**: arka planda, içeriği değişen uygulamalar yeniden kurulur ve etkinlik akışına "{uygulama} otomatik olarak yeni versiyona güncellendi." düşer. Elle güncelle düğmesi yok; sıklık **doğrulanamadı**.
- **Kaldırma** için market üzerinde bir düğme yok; kurulan süreç olağan yolla silinebilir (**çıkarım**).
- Kanıt (alt-asistan): `CodEase.Workflow.Web/Forms/Market.xml:548-990, 1110-1309`; `market/ui/widgets.js:79-143`; `LOGIC/MarketManager.cs:394-397, 442-475, 503-642`; `CodEase.Market/Business/Server/Application.cs:599-721, 1027-1162`; `LOGIC/Workers/DomainUpgrade.cs:53-125`; `LOGIC/StartInfoBuilder.cs:141-143`; `LOC:17407` (okundu).

### Ödeme

- Ücretli abonelikte **Ödeme Yöntemi**: "Paypal" ya da "Use License Key" (çevirisi yok). Lisans anahtarı seçilince **Lisans Anahtarı** kutusu çıkar; anahtar geçerliyse ödeme istenmeden kurulur.
- PayPal yolu: PayPal'a yönlendirme → dönüşte "Sipariş tamamlandı" ekranı ve **Ödemeyi Onayla** düğmesi → kurulum.
- **PayPal yolu istemci kodunda bozuk görünüyor** (yönlendirme adresi yanlış değişkenden alınıyor; onay ekranı yüklenmede kalabilir). Etkisi **çıkarım**; canlıda denenmeden dokümana yazılmamalı. `CodEase.Market.WebApp.Resources/js/codease/market/api.js:53-55, 66-70`, `market/ui/view.confirmsubscription.js:17` (alt-asistan).
- Kanıt (alt-asistan): `Market.xml:562-741, 992-1100`; `RPC/Market.cs:75-97`; `Application.cs:866-880, 1383-1410`.
- Önem: düşük (şirket içi kurulumda büyük olasılıkla kullanılmıyor).

### Süreç yayınlama

- Süreç versiyonu araç çubuğunda alışveriş arabası simgeli **Yayınla** düğmesi; sayfa başlığı **Mağazaya Yükle**. ◆ `UI/process.widgets.js:574-589`.
- **Varsayılan kiracıda düğme görünmez**: kiracı düzeyinin Publisher ya da Enterprise olması gerekir (varsayılan Standard). Ayrıca versiyon düzenleniyor ya da arşivde olmamalı; marketten ticari lisansla kurulmuş uygulama yeniden yayınlanamaz. ◆ aynı satırlar; `Business/DomainLevel.cs:8-15` okundu.
- Form: **Genel Bilgiler** (Ad, Ücret, para birimi); **Açıklama** sekmesi (Ana Fayda, Açıklama, Ana Resim, Ana Video, Bölümler ve Özellikler, Medya); **SSS**; **Lisanslama** (Başlık, Ücret, Limitler); **Anahtar Kelimeler**; **Diğer** (Versiyon, Ödeme Tipi: Abonelik / Satılık, Lisans: Ticari / Açık Kaynak, Kategori, Sahibi, Hedef Mağazalar); **Yerelleştirme**.
- **Yayınla**'ya basınca versiyonun tanımı ve formdaki dosyalar market sunucusuna gönderilir, anasayfaya dönülür; başarı iletisi yok. Bugünkü kodda onay beklemeden listeye çıkar. Bir ürünü yalnızca ilk yayınlayan kiracı güncelleyebilir.
- Kanıt (alt-asistan): `Market.xml:4-545`; `UI/view.publish.js:36-63`; `LOGIC/MarketManager.cs:266-376`; `Application.cs:124-142, 181, 343-347, 466`.
- Önem: düşük (çoğu kiracıda görünmüyor).

---

## 1.11 Mobil uygulama

Kaynak: alt-asistan raporu.

- Depoda bir mobil kabuk projesi var (Cordova). Kendi ekranı yalnızca **sunucu listesi**dir: kiracı adresi yazılır, geçerliyse kiracı logosuyla listeye eklenir; birden çok kiracı eklenebilir, dişli düğmesiyle silinir. Bağlantıya dokununca kiracının olağan giriş sayfası açılır; girişten sonra **web arayüzünün aynısı** kabuğun içinde çalışır. Oturum 30 gün hatırlanır. `CodEase.Workflow.MobileApp/Src/www/js/index.js:50-69, 145-238, 285-415`, `RPC/Login.cs:22-37`.
- **Kaynaktaki uygulama adı ve kimliği başka bir marka adını taşıyor** (CodEase değil), arayüz metinleri yalnızca İngilizce, derleme betiği yalnızca Android paketi üretiyor ve eklenti sürümleri eski. CodEase adıyla mağazada bir uygulama olup olmadığı **doğrulanamadı**; bu proje eski bir kabuk olabilir. `CodEase.Workflow.MobileApp/Src/config.xml:2-5`, `index.js:8-17, 301`, `build.sh`.
- Anlık bildirim (push) yok; çevrimdışı form doldurma yok. Kamera/dosya eklentileri kabukta kurulu ama web arayüzünün bunları çağırdığı görülmedi. `config.xml:15-39`.
- **Mobil tarayıcı**: web arayüzü dar ekrana uyarlanıyor. Dar ekranda yan paneller kapalı açılır; dokunmatik ekranda sağa/sola kaydırma yan panelleri açıp kapatır; görev ekranında sağa kaydırma görevi kapatır; aksiyon düğmeleri alttaki çubukta durur. Siteyi "ana ekrana ekle" ile uygulama gibi açmak için gerekli tanımlar var. `CORE/ui/ui.frame.js:331-420`; `UI/view.workitem.js:130-134` okundu; `CodEase.Workflow.WebApp/site.master:5-17`, `manifest.json:1-45`.
- Önem: orta. Dokümana "mobil uygulama var" diye yazmadan önce kullanıcıya sorulmalı (bkz. bölüm 4).

---

## 1.12 Dış erişim

Kaynak: alt-asistan raporu; ◆ işaretli satırları ana asistan da açıp doğruladı.

### Anonim başlatma

`docs/akis-tasarimi.md` yalnızca havuzdaki **Anonim Ulaşılabilir mi ?** kutusunu anlatıyor. Eksik olanlar:

- **Havuzdaki kutu tek başına yetmez**: kiracının kendisinde de anonim erişimin açık olması gerekir. Bu ayar kiracı oluşturulurken kapalı gelir ve yönetim ekranlarında onu açan bir alan **bulunamadı**; açmanın yolu **doğrulanamadı** (veri tabanından açılıyor olabilir). ◆ `LOGIC/DomainManager.cs:85`, `LOGIC/Core/DomainDatabase.cs:152`, `CodEase.Workflow.Web/Pages/Login.cs:114-123`. Önem: yüksek — sayfadaki anlatım bu koşul olmadan yanıltıcı.
- Ayar açıkken oturumu olmayan ziyaretçi giriş sayfası yerine doğrudan uygulamaya "anonim" olarak alınır; ayrı bir genel adres yoktur, olağan adresler kullanılır. Giriş sayfasını görmek için adrese `?f=1` eklenir (sol menüdeki **Oturum Aç** bunu yapar). ◆ `Login.cs:114-123`, `UI/panels/signin.js:10`.
- Anonim ziyaretçi yalnızca anonim işaretli havuzların başlangıç kutucuklarını görür; takvim, arama, bildirimler, etkinlik akışı, profil, iş listeleri, Taşı/Etiketle/Başkasına Ata gizlidir. `LOGIC/StartInfoBuilder.cs:254-267`, `LOGIC/FolderManager.cs:518, 571-573` (alt-asistan); `UI/` panellerindeki görünürlük koşulları okundu.
- Form gönderilince özel bir "teşekkürler" sayfası yok; sıradaki görev yine anonim kullanıcıya düşüyorsa o açılır, yoksa dizine/anasayfaya dönülür. Bütün anonim ziyaretçiler aynı kimliği paylaşır; birbirlerinin görevlerini görüp görmedikleri **doğrulanamadı**.
- Görev bağlantısına `&returnurl={adres}` eklenirse görev tamamlanınca tarayıcı o adrese gider. `UI/view.workitem.js:113-117` okundu.

### Doğrudan bağlantılar

Genel biçim: `https://{kiracı adresi}/app/#/{sayfa}/{parça}…`. Aynı adres `/app/?/{sayfa}/…` biçiminde de yazılabilir (bildirim e-postaları bunu kullanır). `CORE/ui/ui.frame.js:13-72` (alt-asistan).

| Adres | Açtığı yer |
|---|---|
| `#/worklist/{etiket}` | İş listesi |
| `#/workitem/{görev}` | Görev formu |
| `#/history/{görev}` | Akışın tarihçesi |
| `#/initiate/{süreç}/{görev}/{versiyon}` | Süreci başlatır ve oluşan görevi açar |
| `#/folder/{dizin}` | Dizin |
| `#/report/{dizin}/{rapor}` | Rapor |
| `#/document/{id}` | Doküman |
| `#/activitystream`, `#/calendar`, `#/search`, `#/profile`, `#/admin` | İlgili sayfalar |

- Başlatma bağlantısında süreç ve görev **adla** da verilebilir; versiyon verilmezse aktif versiyon başlar. Tarayıcıda "geri"ye basmak ikinci bir akış başlatmaz. `LOGIC/StartInfoBuilder.cs:123-191` (alt-asistan); `UI/view.initiate.js:9-37` okundu.
- **Bağlantıyla alan doldurma**: başlatma bağlantısının sonuna `&alan=değer` eklenince değerler sürecin verisine aktarılıyor. Kesin adres biçimi ve büyük/küçük harf davranışı **doğrulanamadı** (alan adları küçük harfe çevriliyor); canlıda denenmeden yazılmamalı. `RPC/Domain.cs:145-170`, `LOGIC/Instance.cs:880-906` (alt-asistan).
- Önem: orta (süreç tasarlayan / entegrasyon yapan için).

### Başka siteye gömme

- Menüsüz gömme sayfası var (`/app/embed.aspx`); barındıran sayfa hangi görünümün açılacağını ve kimlik belirtecini çerçeveye iletir. Kiracı ayarlarında **Güvenlik** sekmesindeki **API Anahtarları** bölümü buna aittir: **Yeni Anahtar Ekle**, **Açıklama**, **Yönlendirenler**, **Servis Kullanıcıları**, **Çerezi Destekler**, **Girişi Engeller**. `CodEase.Workflow.WebApp/app/embed.aspx:25-157`, `SYS/EditDomain.xml:1375-1660, 2921-3206`, `CodEase.Workflow.Web/SessionHandler.cs:113-186` (alt-asistan).
- **Varsayılan sunucu yapılandırması başka alan adından çerçeve içinde gösterimi engelliyor**; gömmenin çalışması için sunucu yapılandırmasının değişmesi gerekir (**çıkarım**). ◆ `CodEase.Workflow.WebApp/Web.Global.Release.config:150-154`.
- Önem: düşük; yazılacaksa kurulum bölümüyle birlikte.

### E-postadan aksiyon alma

- **Yok.** Bildirim e-postalarında yalnızca göreve giden bir düğme/bağlantı var; tıklayınca görev tarayıcıda açılır ve oturum gerekir. E-postayı yanıtlayarak ya da e-postadaki bir düğmeyle onay/ret verilemez. `CodEase.Workflow.WebApp/Configuration.global/MessageTemplates.xml:53-190`; gelen e-posta işleyen bir arka plan işi yok (`LOGIC/Workers/`) (alt-asistan).
- Önem: orta (sık sorulur; "yok" diye yazılmalı).

### Web servis / API

Üç ayrı yol var (alt-asistan; `CodEase.Workflow.Web/RestServices.cs:16-481`, `Business/Server/Services/ProcessService.cs:31-285`).

1. **Genel servis** (`/rest.asmx`): kiracı ayarlarındaki API anahtarıyla, bir kullanıcı adına çağrılır (parola istenmez). İşlemler: belirteç alma (`GetToken`, `GetTokenWithDuration`, `Login`), iş listesi (`GetWorklist`, `GetWorklistCount`), görev (`GetWorkItem`, `GetWorkItemData`), aksiyon seçerek görev tamamlama (`SelectAction`), süreç başlatma (`InitiateByProcess`), olay tetikleme (`Trigger`). Süreçte ayrıca ayar gerekmez.
2. **Sürece özel web servisi** (`/services/process/{süreç}`): süreçte başlangıç görevi **Modül** tipinde ve **Modül Tipi** = **Web Servisi Sağlayıcı** ise oluşur. Her havuz bir sözleşme, her böyle görev bir işlemdir; girdi havuzun verisidir, çıktı oluşan görevin kimliği. Kiracı kullanıcı adı ve parolasıyla çağrılır. Süreç versiyonu araç çubuğundaki **Web Servisleri** düğmesi tanımlı servisleri gösterir (`LOC:17040-17044` okundu).
3. Arayüzün kendi iç çağrıları (`/rpc/...`): dışa dönük bir API olarak tasarlandığına dair iz yok; belgelenmemeli.

- Önem: orta (entegrasyon yapan için ayrı sayfa). Uçların girdi/çıktı ayrıntısı alt-asistan raporunda tablo halinde vardı; sayfa yazılırken `RestServices.cs` yeniden okunmalı.

### Dosya bağlantıları

- Ek dosya adresleri (`/file/{id}`, `/attachment/{id}`) **varsayılan ayarda oturum istemez**: adresi bilen indirebilir. Kiracı ayarlarında "Dosya erişimi için kimlik doğrulama gereklidir." kutusu işaretlenirse oturumsuz istek reddedilir. `CodEase.Workflow.Web/FileHandler.cs:32-165`, `SYS/EditDomain.xml:2068, 3181-3182` (alt-asistan). Önem: yüksek (yönetici için güvenlik ayarı).
- Profil resimleri (`/avatar/{kullanıcı}`) oturum istemez.

### Diğer sayfalar (kısaca)

- `/trynow`: yeni kiracı kaydı (alt alan adı, e-posta, parola ya da dış hesapla); yalnızca ana sitede çalışır. `/verify`: "e-postanızı denetleyin" sayfası. `/register`: e-postadaki doğrulama bağlantısının vardığı yer. Şirket içi kurulumda kullanılıp kullanılmadığı **doğrulanamadı**.
- `/stats.aspx`: arka plan iş kuyruğu grafikleri; oturum istemiyor, yalnızca İngilizce. Operatör sayfası.
- `/help`: ürün sahibinin dış doküman sitesine yönlendirir.
- Kanıt (alt-asistan): `CodEase.Workflow.WebApp/trynow.aspx:10-75`, `Pages/RegisterCallback.cs:13-131`, `stats.aspx:13-214`, `Web.Global.Release.config:78-87`.

---

<!--BOLUM2-->
