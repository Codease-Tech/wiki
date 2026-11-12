# Siteyi yayına alma

Site tek bir Cloudflare Worker olarak yayınlanır: doküman sayfalarını da, giriş ve not uçlarını da o sunar. Notlar Cloudflare D1 veritabanında (SQLite) durur.

Aşağıdaki adımlar bir kez yapılır. Sonraki güncellemelerde yalnızca 6. adım yeter.

## 1. Google giriş kimliği

> **Durum (2026-11-12):** İstemci kimliği açıldı ve `wrangler.jsonc`'ye yazıldı. Geriye yalnızca aşağıdaki 4. madde kaldı: **Authorized JavaScript origins** listesine `https://wiki.codease.io` (ve yerelde denemek için `http://localhost:5173`) eklenmeli. Site, Google'ın giriş düğmesini kullanır; client secret, scope ve redirect URI gerekmez.

1. <https://console.cloud.google.com> adresinde bir proje açın (ya da var olanı seçin).
2. **APIs & Services → OAuth consent screen**: kullanıcı türü **External**, uygulama adı "CodEase Dokümantasyonu". Kaydettikten sonra **Publish app** deyin. Uygulama "Testing" durumunda kalırsa yalnızca elle eklediğiniz hesaplar giriş yapabilir.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**: tür **Web application**.
4. **Authorized JavaScript origins** alanına sitenin adresini yazın (ör. `https://docs.sirket.com`). Yerelde gerçek Google girişini denemek isterseniz `http://localhost:5173` adresini de ekleyin.
5. Çıkan **Client ID** değerini kopyalayın (`….apps.googleusercontent.com`). Client secret gerekmez.

## 2. Cloudflare'e giriş

```sh
npx wrangler login
```

## 3. Veritabanı

```sh
npx wrangler d1 create codease-dokumantasyon
```

Komutun yazdığı `database_id` değerini `wrangler.jsonc` içindeki `database_id` satırına yapıştırın (şu an sıfırlardan oluşan yer tutucu var). Sonra tabloları oluşturun:

```sh
npx wrangler d1 migrations apply codease-dokumantasyon --remote
```

## 4. Ayarlar

`wrangler.jsonc` içindeki `vars` bölümünü doldurun:

- `GOOGLE_ISTEMCI_KIMLIGI`: 1. adımdaki Client ID (yazıldı).
- `YONETICI_EPOSTALARI`: herkesin notlarını görebilecek Google hesapları, virgülle ayrılmış (ör. `"ad@sirket.com,baska@sirket.com"`).

## 5. Oturum anahtarı

Oturum çerezlerini imzalayan gizli anahtar. Dosyaya yazılmaz:

```sh
openssl rand -base64 32
npx wrangler secret put OTURUM_ANAHTARI
```

İkinci komut değer sorduğunda ilk komutun çıktısını yapıştırın. Bu anahtarı değiştirirseniz herkesin oturumu kapanır; notlara bir şey olmaz.

`GELISTIRME_GIRISI` değişkenini canlıya **koymayın**. O yalnızca yereldeki `.dev.vars` dosyasında durur; açık olduğunda herkes istediği adla giriş yapabilir.

## 6. Yayınlama

```sh
npm run deploy
```

Siteyi derler ve Worker'ı yükler. Site `https://wiki.codease.io` adresinden açılır (`wrangler.jsonc` → `routes`); bunun için `codease.io` alan adının aynı Cloudflare hesabında olması gerekir. Alan adını sonradan değiştirirseniz Google'daki **Authorized JavaScript origins** listesine yenisini ekleyin.

## Notları dışarı alma

- Sitede: yönetici hesabıyla giriş yapın → sağ üstteki adınız → **Tüm katkılar** → **CSV indir**. Dosya Excel ve Numbers'ta doğrudan açılır.
- Veritabanının tamamı (kullanıcılar dahil):

  ```sh
  npx wrangler d1 export codease-dokumantasyon --remote --output=katkilar.sql
  ```

- Tek seferlik sorgu:

  ```sh
  npx wrangler d1 execute codease-dokumantasyon --remote --command "SELECT COUNT(*) FROM notlar"
  ```

## Yerelde çalıştırma

```sh
cp .dev.vars.ornek .dev.vars   # ilk kez; OTURUM_ANAHTARI satırını doldurun
npm run db:yerel               # ilk kez ve tablo değiştiğinde
npm run dev                    # http://localhost:5173
```

Yerelde "Giriş yap" kutusunda Google düğmesinin altında **Geliştirme girişi** çıkar; ad ve e-posta yazıp girilir. `.dev.vars` içindeki `YONETICI_EPOSTALARI` listesindeki e-postayla girerseniz yönetici olursunuz.

`npm run preview` siteyi derleyip canlıdaki gibi yalnızca Worker üzerinden sunar (`http://localhost:8787`). `npm test` sunucu tarafının testlerini çalıştırır.
