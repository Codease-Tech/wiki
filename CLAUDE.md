# CodEase dokümantasyon projesi

CodEase eğitim videolarından yazılı dokümantasyon üretme projesi. Kullanıcıyla Türkçe konuşulur.

Bu proje `codease-asistan` (CodEase sohbet asistanı) işinden **tamamen ayrıdır**. Kullanıcı kararı (2026-11-11): bu projenin notları, kararları ve durumu bu klasörde tutulur; `codEase-master` projesinin hafızasına yazılmaz.

## Nereden başlanır

- Plan ve güncel durum: `YOL-HARITASI.md`. Her oturumun başında okunur, aşama ilerledikçe işaretlenir.
- Kararlar ve öğrenilenler: `NOTLAR.md` (tarihli, en yeni üstte).
- Soru sayfası (kullanıcı isteği, 2026-11-11; 2026-11-12'de sunucusuz tek dosyaya çevrildi): `araclar/soru-sunucu/index.html` tarayıcıda doğrudan açılır, sunucu gerekmez. Açık soruları tek tek gösterir; Onayla (gerektiği yere yazılır) / Reddet (belgelerde bulunmaz) / Düzenle (kullanıcının yazdığına göre nereye ve nasıl ekleneceğine asistan karar verir). Sorular sayfanın içine gömülüdür (`/*VERI-BASLANGIC*/ … /*VERI-BITIS*/` arası); `SORULAR.md` değişince asistan bu bloğu yeniden üretir. Yanıtlar tarayıcıda saklanır ve sayfanın altındaki metne yazılır (Kopyala / İndir → `SORU-YANITLARI.md`); kullanıcı metni verip "işle" deyince belgeler buna göre düzenlenir.
- Kullanıcıya sorulacaklar: `SORULAR.md`. Kullanıcı kararı (2026-11-11): bu tür sorular sohbette bırakılmaz, buraya yazılır; kullanıcı sonra toplu bakar.

## Site, giriş ve katkı notları (2026-11-12)

- Çalıştırma: `npm run dev` (site 5173 + Worker 8787 birlikte; ilk kez `npm run db:yerel`). Test: `npm test`. Canlıdaki gibi deneme: `npm run preview`.
- Yayın adımları ve notları dışarı alma: `YAYIN.md`. Yayınlamak dışarıya dönük bir iştir; kullanıcı istemeden `npm run deploy` çalıştırılmaz.
- Sunucu tarafı `worker/` (tek Worker, D1), arayüz `docs/.vitepress/theme/katki/`. Kod adları Türkçe.
- Yerelde giriş: "Giriş yap" → Geliştirme girişi. `yonetici@ornek.test` yönetici olur (`.dev.vars`).

## Bilinenler (2026-11-11)

- Kullanıcının elinde onlarca CodEase eğitim videosu var; yeri, dili ve toplam süresi henüz bilinmiyor.
- Önerilen ve kullanıcının "onu yapacağız" dediği akış: ses → yerel döküm (Whisper), sahne karelerinden ekran görüntüsü, video başına ham not, konuya göre birleştirme, kullanıcı gözden geçirmesi. Önce tek video ile deneme.
- Bu Mac: Apple M3, `ffmpeg` kurulu (`/opt/homebrew/bin/ffmpeg`), Whisper kurulu değil, 2026-11-11'de 6,8 GB boş disk.

## Kurallar

- Videolar ve dökümler dış servise gönderilmez; döküm yerelde alınır.
- Ara çıktılar `calisma/` altında, bitmiş sayfalar `docs/` altında durur.
- Kullanıcı onaylamadan konu ağacı ya da sayfa biçimi kesinleşmiş sayılmaz.
