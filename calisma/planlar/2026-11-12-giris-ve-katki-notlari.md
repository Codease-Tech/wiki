# Giriş ve katkı notları — uygulama planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Doküman sitesine Google ile giriş, seçilen metne güncelleme notu yazma, "Katkılarım" ve yönetici dökümü eklemek; hepsini tek bir Cloudflare Worker'da çalıştırmak.

**Architecture:** Tek Worker `/api/*` isteklerini kendisi yanıtlar, geri kalan her şeyi VitePress çıktısından (statik dosyalar) sunar. Veri Cloudflare D1'de (SQLite) durur. Arayüz, VitePress varsayılan temasını genişleten birkaç Vue bileşenidir.

**Tech Stack:** VitePress 1.6 (Vue 3), Cloudflare Workers + statik dosyalar + D1, `wrangler`, `jose` (JWT), `vitest` + `@cloudflare/vitest-pool-workers`, Google Identity Services.

**Spec:** `NOTLAR.md` → "2026-11-12 — Giriş ve katkı notları (tasarım, kullanıcı onayladı)"

## Global Constraints

- Herkes okur; Google hesabı olan herkes not yazar. Başka giriş yolu yok.
- Not uzunluğu ve not sayısı için uygulama sınırı **konmaz**.
- Notu yalnızca yazan kişi ve yöneticiler görür.
- Arayüz metinleri Türkçe. Kod adları (dosya, tablo, uç, değişken) Türkçe, ASCII harflerle.
- Oturum çerezi: adı `oturum`, `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`.
- Sahte giriş yalnızca `GELISTIRME_GIRISI=1` iken çalışır; bu değişken yalnızca `.dev.vars` içinde bulunur, `wrangler.jsonc`'ye yazılmaz.
- Gizli değerler (`OTURUM_ANAHTARI`) dosyaya yazılmaz; yerelde `.dev.vars`, canlıda `wrangler secret`.
- Var olan `docs/*.md` sayfalarının içeriğine dokunulmaz.
- Klasör git deposu değil; plan adımlarında commit yok.
- Wrangler ayar anahtarları yazılmadan önce güncel Cloudflare belgesinden doğrulanır (statik dosya ayarı, D1 bağlaması, vitest havuzu).

## Review Focus

1. Aynı metin sayfada birden çok kez geçiyor → not, seçilen geçişe işaretlenir (öncesi/sonrası bağlamıyla ayırt edilir). Test: Görev 4.
2. Sayfa metni değişmiş, alıntı artık yok → not kaybolmaz, "Bu sayfadaki notlarım" listesinde alıntısıyla görünür. Test: Görev 4 (`yerBul` → `null`), elle doğrulama Görev 6.
3. Not yazarken oturum bitmiş (401) → yazılan metin silinmez, giriş istenir, girişten sonra kaydet yeniden denenebilir. Elle doğrulama: Görev 6.
4. Notta HTML, tırnak, satır sonu, noktalı virgül ya da `=` ile başlayan metin → sayfada düz metin olarak görünür; CSV'de hücre bozulmaz ve formül olarak çalışmaz. Test: Görev 3.
5. Başkasının notunun kimliğiyle düzenleme/silme → 404, not değişmez. Test: Görev 3.

---

## Dosya yapısı

| Dosya | Sorumluluk |
|---|---|
| `wrangler.jsonc` | Worker, statik dosya ve D1 ayarı |
| `migrations/0001_ilk.sql` | Tablolar |
| `worker/index.ts` | İstek yönlendirme, ortak yanıt/hata biçimi |
| `worker/oturum.ts` | Oturum çerezi üretme/okuma |
| `worker/google.ts` | Google kimlik belirteci doğrulama |
| `worker/notlar.ts` | Not uçları ve sorguları |
| `worker/yonetim.ts` | Yönetici listesi ve CSV |
| `test/*.test.ts` | Worker ve `yerBul` testleri |
| `docs/.vitepress/theme/index.ts` | Varsayılan temayı genişletir, bileşenleri yuvalara koyar |
| `docs/.vitepress/theme/katki/api.ts` | `/api` çağrıları |
| `docs/.vitepress/theme/katki/oturum.ts` | Giriş durumu (paylaşılan reaktif durum) |
| `docs/.vitepress/theme/katki/yer.ts` | Seçimi yakalama, alıntının yerini bulma, işaretleme |
| `docs/.vitepress/theme/katki/KullaniciMenusu.vue` | Sağ üst: giriş düğmesi / "Hoş geldin, Ad ▾" |
| `docs/.vitepress/theme/katki/NotKatmani.vue` | "Not ekle" düğmesi, not kutusu, işaretler |
| `docs/.vitepress/theme/katki/SayfaNotlari.vue` | Sayfa sonunda "Bu sayfadaki notlarım" |
| `docs/.vitepress/theme/katki/Katkilarim.vue`, `docs/katkilarim.md` | Kişinin tüm notları |
| `docs/.vitepress/theme/katki/TumKatkilar.vue`, `docs/katkilar.md` | Yönetici: herkesin notları + CSV |
| `docs/.vitepress/theme/katki/katki.css` | Stil (VitePress renk değişkenleriyle, açık/koyu) |
| `YAYIN.md` | Google istemci kimliği ve Cloudflare yayın adımları |

Paylaşılan tipler (`worker/tipler.ts`, arayüz de buradan içe aktarır):

```ts
export interface Kullanici { id: number; ad: string; eposta: string; resim: string | null; yonetici: boolean }
export interface Yer { sayfa: string; sayfaBasligi: string; baslikCapa: string | null; baslikMetni: string | null; alinti: string; once: string; sonra: string }
export interface Not extends Yer { id: number; metin: string; olusturma: string; guncelleme: string }
export interface YonetimNotu extends Not { yazarAd: string; yazarEposta: string }
export interface Ben { kullanici: Kullanici | null; googleIstemciKimligi: string | null; gelistirmeGirisi: boolean }
export interface Env { DB: D1Database; ASSETS: Fetcher; OTURUM_ANAHTARI: string; GOOGLE_ISTEMCI_KIMLIGI?: string; YONETICI_EPOSTALARI?: string; GELISTIRME_GIRISI?: string }
```

`sayfa` her zaman sondaki `/` ve `.html` atılmış yoldur (`/veri-modeli`; ana sayfa `/`). `once` ve `sonra` alıntının iki yanındaki en çok 40 karakterdir. `olusturma`/`guncelleme` ISO 8601 UTC.

---

### Task 1: Worker iskeleti, veritabanı ve yerel çalışma düzeni

**Files:**
- Create: `wrangler.jsonc`, `migrations/0001_ilk.sql`, `worker/index.ts`, `worker/tipler.ts`, `vitest.config.ts`, `tsconfig.json`, `.dev.vars.ornek`, `.dev.vars`, `.gitignore`, `test/iskelet.test.ts`
- Modify: `package.json`, `docs/.vitepress/config.mts`

**Interfaces:**
- Produces: `Env` ve diğer tipler (yukarıda); `worker/index.ts` içinde `json(veri: unknown, durum = 200): Response` ve `hata(durum: number, mesaj: string): Response` (`{ hata: mesaj }` gövdesi); varsayılan dışa aktarım `{ fetch(istek, env) }`.

- [ ] **Step 1:** `npm i -D wrangler vitest @cloudflare/vitest-pool-workers @cloudflare/workers-types typescript concurrently` ve `npm i jose`.
- [ ] **Step 2:** `migrations/0001_ilk.sql`:

```sql
CREATE TABLE kullanicilar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  google_kimlik TEXT NOT NULL UNIQUE,
  eposta TEXT NOT NULL,
  ad TEXT NOT NULL,
  resim TEXT,
  olusturma TEXT NOT NULL
);
CREATE TABLE notlar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kullanici_id INTEGER NOT NULL REFERENCES kullanicilar(id),
  sayfa TEXT NOT NULL,
  sayfa_basligi TEXT NOT NULL,
  baslik_capa TEXT,
  baslik_metni TEXT,
  alinti TEXT NOT NULL,
  once TEXT NOT NULL DEFAULT '',
  sonra TEXT NOT NULL DEFAULT '',
  metin TEXT NOT NULL,
  olusturma TEXT NOT NULL,
  guncelleme TEXT NOT NULL
);
CREATE INDEX notlar_kullanici_sayfa ON notlar(kullanici_id, sayfa);
```

- [ ] **Step 3:** `wrangler.jsonc`: `name: "codease-dokumantasyon"`, `main: "worker/index.ts"`, güncel `compatibility_date`; statik dosyalar `docs/.vitepress/dist`, bağlama adı `ASSETS`, Worker yalnızca `/api/*` için önce çalışır, uzantısız adresler (`/veri-modeli`) `.html` dosyasına çözülür, bulunamayan yol `404.html` verir; D1 bağlaması `DB`, veritabanı adı `codease-dokumantasyon`, `migrations_dir: "migrations"`; `vars`: `GOOGLE_ISTEMCI_KIMLIGI: ""`, `YONETICI_EPOSTALARI: ""` (virgülle ayrılmış liste).
- [ ] **Step 4:** `.dev.vars.ornek` ve `.dev.vars`: `OTURUM_ANAHTARI=` (yerelde rastgele 32 bayt, base64), `GELISTIRME_GIRISI=1`, `YONETICI_EPOSTALARI=yonetici@ornek.test`. `.gitignore`: `node_modules`, `.dev.vars`, `.wrangler`, `docs/.vitepress/dist`, `docs/.vitepress/cache`.
- [ ] **Step 5:** `vitest.config.ts`: Workers havuzu, `wrangler.jsonc`'den ayar, testten önce `migrations/` uygulanır, test başına yalıtılmış depolama; `include: ['test/**/*.test.ts']`. Testlerde `OTURUM_ANAHTARI`, `GELISTIRME_GIRISI=1`, `YONETICI_EPOSTALARI=yonetici@ornek.test`, `GOOGLE_ISTEMCI_KIMLIGI=test-istemci` bağlamaları verilir.
- [ ] **Step 6: Başarısız testi yaz** — `test/iskelet.test.ts`:

```ts
import { SELF } from 'cloudflare:test'
it('bilinmeyen api yolu 404 ve JSON döner', async () => {
  const y = await SELF.fetch('https://x.test/api/yok')
  expect(y.status).toBe(404)
  expect(await y.json()).toEqual({ hata: 'Bulunamadı' })
})
```

- [ ] **Step 7:** `npx vitest run` → FAIL (Worker yok).
- [ ] **Step 8:** `worker/index.ts`: `/api/` ile başlamayan istek `env.ASSETS.fetch(istek)`; eşleşmeyen `/api` yolu `hata(404, 'Bulunamadı')`; yakalanmayan istisna `hata(500, 'Sunucu hatası')` ve `console.error`. Değişiklik yapan istekler (`POST/PUT/DELETE`) için `Origin` başlığı varsa ve isteğin kendi kökeniyle aynı değilse `hata(403, 'Geçersiz köken')`.
- [ ] **Step 9:** `npx vitest run` → PASS.
- [ ] **Step 10:** `package.json` betikleri: `"dev": "concurrently -k -n site,api \"vitepress dev docs\" \"wrangler dev --port 8787\""`, `"build": "vitepress build docs"`, `"test": "vitest run"`, `"db:yerel": "wrangler d1 migrations apply codease-dokumantasyon --local"`, `"deploy": "vitepress build docs && wrangler deploy"`. `config.mts`'ye `vite: { server: { proxy: { '/api': 'http://localhost:8787' } } }` eklenir.
- [ ] **Step 11: Doğrula** — `npm run build && npm run db:yerel && npm run dev`; `curl -s localhost:5173/api/yok` → `{"hata":"Bulunamadı"}`; `curl -sI localhost:8787/veri-modeli` → 200.

### Task 2: Oturum ve giriş uçları

**Files:**
- Create: `worker/oturum.ts`, `worker/google.ts`, `test/giris.test.ts`
- Modify: `worker/index.ts`

**Interfaces:**
- Produces:
  - `oturumCerezi(kullaniciId: number, env: Env): Promise<string>` — `Set-Cookie` değeri (HS256 JWT, `sub` = kullanıcı kimliği, 30 gün).
  - `cikisCerezi(): string` — `Max-Age=0`.
  - `oturumdakiKullanici(istek: Request, env: Env): Promise<Kullanici | null>` — çerezi doğrular, `kullanicilar`dan okur; `yonetici` = e-posta `YONETICI_EPOSTALARI` içinde (büyük/küçük harf duyarsız).
  - `googleKimlikDogrula(jeton: string, istemciKimligi: string, anahtarlar?: JWTVerifyGetKey): Promise<{ sub: string; email: string; name: string; picture?: string }>` — varsayılan anahtar kaynağı `https://www.googleapis.com/oauth2/v3/certs`; `iss` `accounts.google.com` ya da `https://accounts.google.com`, `aud` = istemci kimliği, `email_verified` doğru olmalı; değilse hata fırlatır.
  - Uçlar: `GET /api/ben` → `Ben`; `POST /api/giris` `{ credential }` → `{ kullanici }` + çerez; `POST /api/gelistirme-girisi` `{ ad, eposta }` → aynı (yalnızca `GELISTIRME_GIRISI === '1'`, değilse 404); `POST /api/cikis` → 204 + silme çerezi.

- [ ] **Step 1: Başarısız testleri yaz** — `test/giris.test.ts`:
  - `GET /api/ben` çerezsiz → `{ kullanici: null, googleIstemciKimligi: 'test-istemci', gelistirmeGirisi: true }`.
  - `POST /api/gelistirme-girisi {ad:'Ayşe', eposta:'ayse@ornek.test'}` → 200, `Set-Cookie` `oturum=` ile başlar ve `HttpOnly`, `SameSite=Lax`, `Max-Age=2592000` içerir; aynı çerezle `GET /api/ben` → `kullanici.ad === 'Ayşe'`, `yonetici === false`.
  - `yonetici@ornek.test` ile giriş → `yonetici === true`.
  - Aynı e-postayla iki kez giriş → `kullanicilar`da tek satır.
  - Bozulmuş çerez (son karakteri değiştirilmiş) → `kullanici: null`.
  - `POST /api/cikis` → 204; dönen çerezle `GET /api/ben` → `kullanici: null`.
  - `googleKimlikDogrula`: `jose` ile üretilen yerel RS256 anahtar çifti ve yerel anahtar kümesiyle — geçerli belirteç alanları döndürür; yanlış `aud`, süresi geçmiş `exp`, `email_verified: false` ve başka anahtarla imzalanmış belirteç için ayrı ayrı reddeder.
  - `POST /api/giris {credential:'saçma'}` → 401 `{ hata: 'Google girişi doğrulanamadı' }`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** `worker/oturum.ts`, `worker/google.ts` ve uçları yaz. Kullanıcı kaydı `google_kimlik` üzerinden `INSERT … ON CONFLICT DO UPDATE` (ad, e-posta, resim her girişte güncellenir). Geliştirme girişinde `google_kimlik = 'gelistirme:' + eposta`.
- [ ] **Step 4:** `npm test` → PASS.

### Task 3: Not uçları ve yönetici dökümü

**Files:**
- Create: `worker/notlar.ts`, `worker/yonetim.ts`, `test/notlar.test.ts`, `test/yonetim.test.ts`
- Modify: `worker/index.ts`

**Interfaces:**
- Consumes: `oturumdakiKullanici`, `json`, `hata`.
- Produces:
  - `GET /api/notlar` → `{ notlar: Not[] }` (kendi notları, yeniden eskiye); `?sayfa=/veri-modeli` ile o sayfanınkiler.
  - `POST /api/notlar` gövde `Yer & { metin }` → 201 `{ not: Not }`.
  - `PUT /api/notlar/:id` `{ metin }` → `{ not: Not }`; `DELETE /api/notlar/:id` → 204.
  - `GET /api/yonetim/notlar` → `{ notlar: YonetimNotu[] }`; `?bicim=csv` → `text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="katkilar-YYYY-AA-GG.csv"`.
  - `csvSatiri(hucreler: string[]): string` (`worker/yonetim.ts`).

- [ ] **Step 1: Başarısız testleri yaz** — `test/notlar.test.ts` (yardımcı: `giris(eposta)` çerez döndürür):
  - Çerezsiz `GET`/`POST /api/notlar` → 401 `{ hata: 'Giriş gerekli' }`.
  - `POST` geçerli gövde → 201; dönen notta `id`, `olusturma === guncelleme`, gönderilen tüm `Yer` alanları aynen.
  - `metin` boş ya da yalnızca boşluk → 400 `{ hata: 'Not boş olamaz' }`; `sayfa` ya da `alinti` eksik → 400.
  - 200 000 karakterlik `metin` → 201 ve aynen geri okunur (sınır yok).
  - `metin: '<script>alert(1)</script>'` → aynen saklanır ve JSON'da aynen döner (kaçış arayüzün işi).
  - Ayşe'nin notu Burak'ın `GET /api/notlar` yanıtında yok.
  - Burak, Ayşe'nin not kimliğiyle `PUT` ve `DELETE` → 404; not değişmemiş.
  - `PUT` kendi notu → `metin` değişir, `guncelleme > olusturma`, `Yer` alanları aynı.
  - `DELETE` kendi notu → 204; sonra listede yok.
  - `?sayfa=/a` yalnızca o sayfanın notlarını verir.
- [ ] **Step 2:** `test/yonetim.test.ts`:
  - Yönetici olmayan → 403 `{ hata: 'Yetki yok' }`; çerezsiz → 401.
  - Yönetici → iki kullanıcının notları `yazarAd`, `yazarEposta` ile.
  - CSV: ilk karakter BOM (`﻿`), başlık satırı `Tarih;Yazar;E-posta;Sayfa;Başlık;Seçilen metin;Not;Bağlantı`; ayırıcı `;`, satır sonu `\r\n`.
  - `csvSatiri(['a;b', 'c"d', 'e\nf'])` → `"a;b";"c""d";"e\nf"`.
  - `csvSatiri(['=1+1', '+x', '-y', '@z'])` → her hücrenin başına `'` eklenir.
  - Bağlantı sütunu: isteğin kökeni + `sayfa` + `?not=<id>`.
- [ ] **Step 3:** `npm test` → FAIL.
- [ ] **Step 4:** `worker/notlar.ts`, `worker/yonetim.ts` yaz. Sahiplik her sorguda `WHERE id = ? AND kullanici_id = ?` ile denetlenir.
- [ ] **Step 5:** `npm test` → PASS.

### Task 4: Alıntının yerini bulma

**Files:**
- Create: `docs/.vitepress/theme/katki/yer.ts`, `test/yer.test.ts`

**Interfaces:**
- Produces:
  - `yerBul(metin: string, alinti: string, once: string, sonra: string): { bas: number; son: number } | null` — saf işlev. Tek geçiş varsa onu döndürür; birden çoksa `once` sonekinin ve `sonra` önekinin en uzun eşleştiği geçişi; hiç yoksa `null`. Boşluk dizileri karşılaştırmada tek boşluk sayılır; dönen konumlar özgün `metin`e göredir.
  - `secimiYakala(kok: HTMLElement): Omit<Yer, 'sayfa' | 'sayfaBasligi'> | null` — seçim boşsa ya da `kok` dışına taşıyorsa `null`; `baslikCapa`/`baslikMetni` seçimin başından geriye doğru ilk `h2`/`h3`.
  - `isaretle(kok: HTMLElement, notlar: Not[]): number[]` — bulunan her notun metnini `<mark class="katki-isaret" data-not="<id>">` ile sarar (birden çok metin düğümüne yayılabilir); yeri bulunamayan notların kimliklerini döndürür.
  - `isaretleriKaldir(kok: HTMLElement): void` — işaretleri söker, metin düğümlerini birleştirir.

- [ ] **Step 1: Başarısız testleri yaz** — `test/yer.test.ts` (`yerBul` için):
  - `yerBul('Görev ayarları açılır.', 'ayarları', '', '')` → `{ bas: 6, son: 14 }`.
  - `yerBul('Kaydet. Sonra Kaydet düğmesi.', 'Kaydet', 'Sonra ', ' düğmesi')` → `{ bas: 14, son: 20 }`.
  - Aynı metin, bağlam boş → ilk geçiş `{ bas: 0, son: 6 }`.
  - `yerBul('a  b\n c', 'a b c', '', '')` → `{ bas: 0, son: 7 }`.
  - Alıntı yok → `null`; boş alıntı → `null`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** `yer.ts` yaz. DOM işlevleri `kok.textContent` üzerinde `yerBul` çağırır, konumları `TreeWalker` ile metin düğümlerine çevirir.
- [ ] **Step 4:** `npm test` → PASS. (DOM işlevleri Görev 6'da tarayıcıda doğrulanır.)

### Task 5: Sağ üstte giriş ve kullanıcı menüsü

**Files:**
- Create: `docs/.vitepress/theme/index.ts`, `katki/api.ts`, `katki/oturum.ts`, `katki/KullaniciMenusu.vue`, `katki/katki.css`

**Interfaces:**
- Consumes: Görev 2 ve 3 uçları.
- Produces:
  - `api.ts`: `ben(): Promise<Ben>`, `googleIleGir(credential: string)`, `gelistirmeGirisi(ad: string, eposta: string)`, `cikis()`, `notlar(sayfa?: string): Promise<Not[]>`, `notEkle(v: Yer & { metin: string }): Promise<Not>`, `notGuncelle(id: number, metin: string): Promise<Not>`, `notSil(id: number): Promise<void>`, `tumNotlar(): Promise<YonetimNotu[]>`. Başarısız yanıtta `ApiHatasi` (`durum: number`, `message` = sunucunun `hata` metni) fırlatır.
  - `oturum.ts`: `useOturum(): { kullanici: Ref<Kullanici | null>; hazir: Ref<boolean>; ayar: Ref<Ben | null>; yukle(): Promise<void>; girisIste(): void; cik(): Promise<void> }` — modül düzeyinde tek durum; `girisIste()` menüdeki giriş kutusunu açar (başka bileşenler de çağırır).

- [ ] **Step 1:** `theme/index.ts`: `DefaultTheme`'i genişletir; `Layout` yuvaları: `nav-bar-content-after` → `KullaniciMenusu`, `layout-bottom` → `NotKatmani`, `doc-after` → `SayfaNotlari` (son ikisi Görev 6'da; şimdilik yalnızca menü). `Katkilarim` ve `TumKatkilar` genel bileşen olarak kaydedilir (Görev 7).
- [ ] **Step 2:** `KullaniciMenusu.vue`:
  - Tümü `ClientOnly` içinde; sunucu tarafında hiçbir şey çizilmez.
  - Giriş yokken: "Giriş yap" düğmesi. Tıklanınca küçük kutu: `googleIstemciKimligi` varsa Google'ın kendi düğmesi (`https://accounts.google.com/gsi/client` ilk açılışta yüklenir; `google.accounts.id.initialize({ client_id, callback })` + `renderButton`); `gelistirmeGirisi` doğruysa altında "Geliştirme girişi" (ad + e-posta alanı). İkisi de yoksa "Giriş henüz ayarlanmadı."
  - Giriş varken: profil resmi (yoksa adın baş harfi) + "Hoş geldin, {adın ilk sözcüğü}" + ▾. Menü: **Katkılarım** (`/katkilarim`), yöneticiye ayrıca **Tüm katkılar** (`/katkilar`), **Çıkış**.
  - Menü dışarı tıklayınca ve `Esc` ile kapanır; düğme `aria-expanded` taşır; dar ekranda (VitePress'in 768px kırılımı altında) yalnızca resim/baş harf görünür.
- [ ] **Step 3: Doğrula (tarayıcı)** — `npm run dev`, `http://localhost:5173`: geliştirme girişiyle "Hoş geldin, Ayşe" görünür; sayfa yenilenince giriş sürer; Çıkış sonrası "Giriş yap" döner; açık ve koyu temada okunur; `npm run build` hatasız.

### Task 6: Metin seçip not yazma ve sayfadaki işaretler

**Files:**
- Create: `katki/NotKatmani.vue`, `katki/SayfaNotlari.vue`
- Modify: `theme/index.ts`, `katki/katki.css`

**Interfaces:**
- Consumes: `useOturum`, `api.ts`, `yer.ts`.
- Produces: `katki/sayfaNotlari.ts` — `useSayfaNotlari(): { notlar: Ref<Not[]>; yersizler: Ref<number[]>; yenile(): Promise<void>; ac(id: number): void }` (iki bileşen ortak kullanır).

- [ ] **Step 1:** `NotKatmani.vue`:
  - Kök: `.vp-doc` (yalnızca doküman sayfalarında; `/katkilarim` ve `/katkilar`da devre dışı).
  - `selectionchange`/`mouseup`/`touchend` sonrası `secimiYakala` doluysa seçimin yanında "Not ekle" düğmesi. Tıklanınca: giriş yoksa `girisIste()` (yakalanan yer saklanır, girişten sonra kutu açılır); varsa not kutusu.
  - Not kutusu: üstte alıntı (en çok 3 satır, taşarsa …), çok satırlı metin alanı, **Kaydet** / **Vazgeç**; `Ctrl/⌘+Enter` kaydeder, `Esc` kapatır (yazılmış metin varsa onay sorar). Uzunluk sınırı yok.
  - Kayıt 401 dönerse kutu ve metin kalır, "Oturum süresi doldu, yeniden giriş yapın" yazar, `girisIste()` çağrılır. Başka hata: sunucu mesajı kutuda gösterilir, metin korunur.
  - Sayfa açıldığında ve her sayfa değişiminde (`onContentUpdated`): önce `isaretleriKaldir`, giriş varsa `notlar(sayfa)` + `isaretle`. Giriş/çıkışta da yenilenir.
  - İşarete tıklanınca aynı kutu görüntüleme kipinde açılır: not metni (düz metin, satır sonları korunur), tarih, **Düzenle** / **Sil** (silmeden önce onay).
  - Adres `?not=<id>` içeriyorsa işaret görünür alana kaydırılır ve kutusu açılır.
- [ ] **Step 2:** `SayfaNotlari.vue` (`doc-after`): giriş varsa ve sayfada not varsa "Bu sayfadaki notlarım (n)" listesi; her satırda alıntı, not, tarih. Yeri bulunan notta tıklama işarete götürür; `yersizler`dekilerde "Metin değişmiş; yer bulunamadı" etiketi ve yanında Düzenle/Sil.
- [ ] **Step 3: Doğrula (tarayıcı)** — Chrome'da, geliştirme girişiyle:
  - Tek paragrafta seçim → not → işaret görünür, yenileyince durur.
  - İki paragrafa ve satır içi koda yayılan seçim → işaret tümünü kaplar.
  - Sayfada iki kez geçen sözcüğün ikincisi seçilir → yenileyince ikincisi işaretli.
  - Başka sayfaya gidip dönünce işaretler yerinde, çift işaret yok.
  - Düzenle, Sil çalışır; silince işaret kalkar.
  - Giriş yapmadan seçim → giriş istenir → girişten sonra kutu aynı alıntıyla açılır.
  - Not `<b>x</b>` içerirse düz metin olarak görünür.
  - Yerel veritabanında bir notun `alinti` değeri elle bozulur → sayfada "yer bulunamadı" etiketiyle listelenir.
  - Kutudayken çerez silinip Kaydet → metin korunur, giriş istenir.
  - Çıkış yapılınca tüm işaretler ve liste kalkar.
  - Sayfa içi arama (`Ctrl+K`) ve kenar çubuğu bağlantıları bozulmamış.

### Task 7: Katkılarım, Tüm katkılar ve yayın belgesi

**Files:**
- Create: `katki/Katkilarim.vue`, `katki/TumKatkilar.vue`, `docs/katkilarim.md`, `docs/katkilar.md`, `YAYIN.md`
- Modify: `theme/index.ts`, `katki/katki.css`, `docs/.vitepress/config.mts` (yerel aramada bu iki sayfa dışarıda), `YOL-HARITASI.md`, `NOTLAR.md`, `CLAUDE.md`

**Interfaces:**
- Consumes: `api.notlar()`, `api.tumNotlar()`, `useOturum`.

- [ ] **Step 1:** `docs/katkilarim.md` ve `docs/katkilar.md`: ön bilgi `title`, `aside: false`, `editLink: false`, `search: false`; gövde tek bileşen (`<Katkilarim />`, `<TumKatkilar />`). Kenar çubuğuna eklenmez.
- [ ] **Step 2:** `Katkilarim.vue`: giriş yoksa "Katkılarınızı görmek için giriş yapın" + düğme. Varsa notlar sayfaya göre gruplanır (grup başlığı `sayfaBasligi`), grup içinde yeniden eskiye; her notta başlık metni, alıntı, not, tarih (`tr-TR`, gün ay yıl saat) ve `sayfa?not=id` bağlantısı; Düzenle/Sil burada da var. Hiç not yoksa nasıl not yazılacağını anlatan iki cümle.
- [ ] **Step 3:** `TumKatkilar.vue`: yönetici değilse "Bu sayfa yalnızca yöneticiler içindir." Yöneticiyse tablo (Tarih, Yazar, Sayfa, Seçilen metin, Not), yazara ve sayfaya göre süzme, toplam sayı, **CSV indir** (`/api/yonetim/notlar?bicim=csv`).
- [ ] **Step 4:** `YAYIN.md` (Türkçe, adım adım): Google Cloud'da OAuth istemci kimliği açma (tür: Web; izinli JavaScript kökenleri: yayın adresi ve `http://localhost:5173`); `npx wrangler login`; `npx wrangler d1 create codease-dokumantasyon` ve çıkan kimliğin `wrangler.jsonc`'ye yazılması; `npx wrangler d1 migrations apply codease-dokumantasyon --remote`; `npx wrangler secret put OTURUM_ANAHTARI`; `GOOGLE_ISTEMCI_KIMLIGI` ve `YONETICI_EPOSTALARI` değerlerinin `wrangler.jsonc` `vars` içine yazılması; `npm run deploy`; tüm veriyi dışa alma: `npx wrangler d1 export codease-dokumantasyon --remote --output=katkilar.sql`.
- [ ] **Step 5: Doğrula** — `npm test` PASS; `npm run build` hatasız; `python3 calisma/baglanti-denetle.py` yeni kırık bağlantı bildirmiyor; tarayıcıda: Katkılarım'daki bağlantı doğru sayfayı açıp nota kaydırıyor; `yonetici@ornek.test` ile Tüm katkılar iki kullanıcının notlarını gösteriyor, CSV Excel/Numbers'ta Türkçe harflerle ve doğru sütunlarda açılıyor; yönetici olmayan uyarıyı görüyor; `npx wrangler deploy --dry-run` hatasız.
- [ ] **Step 6:** `YOL-HARITASI.md`'ye "Aşama 6 — Giriş ve katkı notları" eklenir ve işaretlenir; `NOTLAR.md`'ye uygulama sırasında öğrenilenler; `CLAUDE.md` "Nereden başlanır" bölümüne çalıştırma (`npm run dev`), test (`npm test`) ve `YAYIN.md` satırı.

### Task 8: Adres çubuğu şikâyeti

**Files:** (bulguya göre)

- [ ] **Step 1:** `npm run dev` açıkken Chrome'da kenar çubuğundan üç sayfaya geçilir; adres çubuğu `/veri-modeli` gibi değişiyor mu, sayfa yenilenince aynı sayfa açılıyor mu, başlığa tıklanınca `#çapa` ekleniyor mu bakılır. Aynısı `wrangler dev` (8787) üzerinde derlenmiş siteyle yinelenir.
- [ ] **Step 2:** Değişiyorsa: kod değişikliği yapılmaz; bulgu ve kullanıcının hangi pencerede gördüğü sorusu `SORULAR.md`'ye yazılır. Değişmiyorsa: neden bulunur, düzeltilir, burada not edilir.
