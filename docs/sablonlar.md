# Şablonlar: e-posta ve yazdırma

::: v-pre

> **Taslak.** Bu sayfa eğitim videolarından değil, ürünün kendisi incelenerek yazıldı; anlatılanlar canlı sistemde denenmedi. Biçim ve içerik onayı bekliyor.

Görev bildirimleri hazır bir e-posta metniyle gider. Kendi metninizi yazmak, e-postaya formdaki bilgileri koymak ya da formu kurumsal bir çıktı düzeniyle yazdırmak için **şablon** tanımlarsınız.

## Şablon tanımlama

Şablonlar **havuza** aittir.

1. Havuza tıklayın. Şemanın altındaki **Diğer** başlığında **Şablonlar**'ı açın.
2. **Yeni Şablon Ekle**'ye basın ve alanları doldurun:

| Alan | Ne yazılır |
|---|---|
| Ad | Şablonun listelerde görünen adı. |
| Konu | E-postanın konusu. |
| Tip | **Standart** ya da **XSLT**. |
| İçerik | Satırı açınca görünür. Standart tipte biçimli metin düzenleyicide, XSLT tipte XML olarak yazılır. |

> **Yer karışmasın.** Tasarımcıda iki **Diğer** başlığı vardır. Süreç düzeyindeki **Diğer**'de Veri Modeli, Veritabanları, Yerelleştirme bulunur. **Şablonlar** ve **Değişkenler** ise havuza tıkladığınızda açılan **Diğer**'dedir. Şablon yalnızca tanımlandığı havuzun görevlerinde seçilebilir; ikinci havuzda yeniden tanımlamanız gerekir.

## Standart şablon yazma

Konuya ve içeriğe çift süslü parantezle yer tutucu koyarsınız.

**Formdaki veri:** alanın yolunu yazın. Yol havuzun **Veri Kökü**'nden başlar.

```
{{Talep/AdSoyad}} adına {{Talep/Tutar}} TL tutarında masraf talebi açıldı.
```

**Görev ve sistem bilgisi:** başında `$` olan hazır değerleri kullanın.

| Yer tutucu | Değer |
|---|---|
| `{{ $Recipients }}` | Alıcıların adları (virgülle ayrılmış). |
| `{{ $WorkItem.Caption }}` | Görevin başlığı. |
| `{{ $WorkItem.Instructions }}` | Görevin talimatı. |
| `{{ $WorkItem.Id }}` | Görevin kimliği. |
| `{{ $WorkItem.DeadlineDate }}` | Termin tarihi. |
| `{{ $Instance.Number }}` | Akış (form) numarası. |
| `{{ $AssignedTo }}` | Görevin atandığı kimlikler. |
| `{{ $DomainUrl }}` | Sitenizin adresi. |
| `{{ $DomainName }}`, `{{ $ApplicationName }}`, `{{ $LogoUrl }}` | Kurum adı, uygulama adı, logo adresi. |

**Göreve bağlantı:**

```html
<a href="{{ $DomainUrl }}/app/?/workitem/{{ $WorkItem.Id }}">{{ $WorkItem.Caption }}</a>
```

**Koşul ve biçim:** bir değer yalnızca doluysa yazılsın istiyorsanız:

```
{{ if $WorkItem.DeadlineDate then Son tarih: {{ format($WorkItem.DeadlineDate) }} }}
```

Hazır e-posta şablonu da bu yer tutucularla yazılmıştır; kendi şablonunuza iyi bir başlangıç şudur:

```html
<p><b>{{ $Recipients }}</b>,</p>
<p>{{ $WorkItem.Caption }} adlı yeni bir göreviniz var.</p>
<p><a href="{{ $DomainUrl }}/app/?/workitem/{{ $WorkItem.Id }}">Görevi aç</a></p>
<p>{{ $WorkItem.Instructions }}</p>
<p>Form numarası: {{ $Instance.Number }}</p>
```

## XSLT şablon

**Tip** XSLT ise **İçerik** bir XSLT belgesidir ve formun verisine uygulanır. Yukarıdaki hazır değerler XSLT parametresi olarak gelir. **Konu** bu tipte de çift süslü parantezle yazılır. Tablo gibi tekrarlayan veriyi satır satır dökmek gereken çıktılarda XSLT kullanılır.

## Şablonu kullanma

### Bildirim e-postalarında

Görevin sağ tık menüsündeki **Bilgilendirme**, **İlk Hatırlatıcı**, **Tekrarlayan Hatırlatıcı**, **Termin** ve **İzleyiciler** pencerelerinin her birinde ayrı bir **Şablon** alanı vardır; her bildirim için farklı şablon seçebilirsiniz. Seçmezseniz **Varsayılan Şablon** kullanılır.

- **Şablon** alanı, ilgili bildirim açıkken ve havuzda en az bir şablon varken görünür.
- Şablon seçtiğinizde e-postanın konusu şablonun **Konu**'su olur. Varsayılan Şablon'daki konu önekleri (`R:`, `RR:`, `D:`, `W:`) kendi şablonunuzda **eklenmez**; hatırlatma olduğunu konuda belirtmek istiyorsanız kendiniz yazın.
- **İçeriği boş şablon seçilirse e-posta hiç gönderilmez.**

Ayrıntı: [Görev ayarları](/gorev-ayarlari).

### Yazdırmada

Görevin **Yazdırma** penceresindeki **Yazdırma Şablonları**'nda seçtiğiniz her şablon, görev ekranındaki yazıcı menüsünde kendi adıyla çıkar. Kullanıcı seçtiğinde şablon formun o anki verisiyle doldurulup yazdırılır.

Yazdırma şablonunda yalnızca **formdaki veri** kullanılabilir; `$WorkItem`, `$Recipients` gibi e-postaya özgü değerler burada dolmaz. Aynı şablonu hem e-postada hem yazdırmada kullanacaksanız bunu göz önünde tutun.

### Scriptte

Kendi e-postanızı ya da belgenizi scriptle hazırlıyorsanız şablonu `$Templates` ile doldurabilirsiniz:

| Çağrı | Verdiği |
|---|---|
| `$Templates.Get('Ad')` | Şablonun içeriği (doldurulmamış). |
| `$Templates.Subject('Ad', dugum)` | Doldurulmuş konu. |
| `$Templates.Format('Ad', dugum)` | Doldurulmuş içerik. |

`dugum`, yer tutucuların çözüleceği veridir (örnek: `$Xml`).

## Çeviri

Süreç birden çok dilde kullanılıyorsa şablonun içeriği ve konusu [Yerelleştirme](/yerellestirme) ekranında `Template` ve `TemplateSubject` gruplarında çevrilir. E-posta, akışın dilinde gider.

---

**Kaynak:** Ürün davranışı incelenerek yazıldı. Eğitim 2 – Fatih'te şablonların yalnızca nerede seçildiği gösterilir.

:::
