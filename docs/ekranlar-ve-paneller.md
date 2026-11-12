# Ekranlar ve paneller

> **Taslak.** Bu sayfa eğitim videolarından değil, ürünün kendisi incelenerek yazıldı; anlatılanlar canlı sistemde denenmedi. Biçim ve içerik onayı bekliyor.

Form bir görevin parçasıdır: biri doldurur, akış ilerler. **Ekran** ise bir akışa bağlı olmayan formdur. İçine sorgu, tablo ve grafik bileşenleri koyarak rapor, liste ya da pano kurarsınız: "bu ay açılan talepler", "bekleyen onaylar" gibi.

## Ekran oluşturma

Süreç ekranında **Ekranlar** başlığının altındaki **Yeni Ekle**'ye basın.

| Alan | Ne yazılır |
|---|---|
| Ad | Ekranın adı. Kullanıcı sekme ya da liste satırı olarak bunu görür. |
| Veri Kökü | Ekranın kullanacağı veri modeli (süzgeç alanları gibi geçici değerler burada tutulur). |
| Sıralama Numarası | Birden çok ekran varsa sırası. |
| Süreç Paneli mi ? | İşaretlerseniz ekran, sürecin bulunduğu dizin sayfasında panel olarak gösterilir. |
| Yönetici Paneli mi ? | İşaretlerseniz ekranı yalnızca süreçte yazma yetkisi olanlar görür. |
| Anonim Ulaşılabilir mi ? | İşaretlerseniz giriş yapmamış kullanıcılar da açabilir. Yönetici Paneli işaretliyken bu kutu görünmez. |

Ekrana tıkladığınızda iki sekme açılır:

- **Form:** form tasarımcısı. Ekranı normal bir form gibi tasarlarsınız: [Form tasarımı](/form-tasarimi), [Veritabanı Sorgusu bileşeni](/veritabani-sorgusu).
- **Genel:** ekrandaki adlı bölümlerin durumu (Varsayılan, Etkin, Gizli, Kapalı).

Ekrana sağ tıklayınca **Düzenle**, **Script**, **XML** ve **Sil** çıkar. **Script**, ekran açılırken tarayıcıda çalışan [form scriptidir](/form-scripti).

## Ekran nerede görünür

| Ayar | Kullanıcı nerede görür |
|---|---|
| **Süreç Paneli mi ?** işaretli | Sürecin bulunduğu dizin sayfasında, başlangıç kutucuklarıyla birlikte. Birden çok panel varsa sekmeler halinde, **Sıralama Numarası** sırasıyla. |
| İşaretli değil | Dizindeki **Raporlar** düğmesinin listesinde; tıklanınca ayrı sayfada açılır. |

- **Yönetici Paneli** olan ekranı yalnızca süreçte yazma yetkisi olanlar görür.
- Deneme Durumu'ndaki versiyonun ekranlarını da yalnızca yazma yetkisi olanlar görür.
- Yeni eklediğiniz panel dizin sayfasında hemen görünmeyebilir; liste yaklaşık bir dakikada bir yenilenir.

Ekranın verisi her açılışta boş oluşur. Veri modelindeki "Başlatan Kişi …" varsayılan değerleri, ekranı **açan kullanıcının** bilgileriyle dolar; "yalnızca benim taleplerim" süzgecini böyle kurabilirsiniz.

## Ekran Sihirbazı: akış listesini hazır üretme

Bir havuzun akışlarını süzüp listeleyen ekranı elle kurmak yerine sihirbaza ürettirebilirsiniz.

1. Süreç ekranında havuz kutusuna sağ tıklayın ve **Ekran Oluştur**'u seçin.
2. **Sütunlar** tablosuna ekranda kullanılacak alanları ekleyin:

| Sütun | Ne yazılır |
|---|---|
| Sütun XPath'i | Veri modelindeki alan. Zorunlu. |
| Formül | *Yok*, *Toplam* ya da *Adet*. |
| Kullanım | *Filtre* (yalnızca süzgeçte), *Sonuç* (yalnızca listede) ya da *Her İkisi*. |
| Değer XPath'i, Başlık XPath'i | Alan bir seçim listesiyse (bölüm tipinde) değerin ve görünen yazının yolu. Zorunlu. |

3. **Tamam**'a basın.

Sihirbaz "*havuz adı* Dashboard" adında, **Süreç Paneli** işaretli bir ekran üretir: üstte seçtiğiniz alanlarla bir süzgeç, altında havuzun akışlarını form numarası, tarih, durum, bekleyen görev ve atanan kişiyle listeleyen bir tablo. Ekran sıradan bir ekrandır; sonradan **Form** sekmesinden istediğiniz gibi değiştirebilirsiniz.

## Çeviri

Panel adları [Yerelleştirme](/yerellestirme) ekranında `DashboardName` grubunda çevrilir.

---

**Kaynak:** Ürün davranışı incelenerek yazıldı; eğitim videolarında anlatılmıyor.
