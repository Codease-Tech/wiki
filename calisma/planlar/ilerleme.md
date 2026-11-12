# SDD ledger — plan: calisma/planlar/2026-11-12-giris-ve-katki-notlari.md

Ruling: klasör git deposu değil — worktree, commit ve superpowers betikleri kullanılmıyor; ilerleme bu dosyada tutuluyor — yanlışsa: geri alma için git geçmişi yok.
Pre-flight: Görev 2→3 (oturumdakiKullanici), 2/3→5 (uçlar ↔ api.ts), 4→6 (yer.ts) — çelişki yok.
Task 1: Ruling: @cloudflare/vitest-pool-workers kullanımdan kalkmış — yerine @cloudflare/vitest-plugin kuruldu; vitest ^4.1 — yanlışsa: yalnızca test düzeni etkilenir.
Task 1: Ruling: json/hata yardımcıları index.ts yerine worker/yanit.ts'de (döngüsel içe aktarma olmasın) — maliyet yok.
Task 2: Ruling: çerezde Secure yalnızca https isteklerde — Safari http://localhost'ta Secure çerezi saklamıyor; canlı her zaman https — yanlışsa: yalnızca yerel http etkilenir.
Task 2: Ruling: oturumCerezi/cikisCerezi imzasına `istek` eklendi (yukarıdaki nedenle).
Task 1-3: testler önce yazıldı ve kırmızı görüldü (worker/index.ts yok → derleme hatası), sonra kod.
Task 1: Ruling: yerelde vite vekili Host ve Origin başlıklarını 8787'ye çevirir — köken denetimi canlıda sıkı kalsın diye Worker'a istisna eklenmedi — yanlışsa: yalnızca yerel çalışma etkilenir.
Task 4: Ruling: metin modelinde bloklar arasına satır sonu eklenir (plan söylemiyordu) — çok bloklu alıntı yapışık görünüyordu — maliyet yok (yerBul boşluğu yok sayar).
Task 5: Ruling: dar ekranda "Giriş yap" yazısı yerine kişi simgesi — üst çubuk taşıyordu.
Task 6: Ruling: yeni not yazılırken kutu dışına tıklamak kutuyu kapatmaz — yazılan kaybolmasın.
Task 8: adres değişiyor (Chrome, 5173 ve 8787); kod değişikliği yok; SORULAR S1.
Task 1: complete (tests: npm test → 38/38; curl /api/yok, /veri-modeli 200)
Task 2: complete (tests: npm test → 38/38)
Task 3: complete (tests: npm test → 38/38)
Task 4: complete (tests: npm test → 38/38)
Task 5: complete (tarayıcı: 35/35, dar ekran taşma yok)
Task 6: complete (tarayıcı: 35/35 + yersiz not denemesi)
Task 7: complete (npm run build, wrangler deploy --dry-run, baglanti-denetle sorun: 0)
Task 8: complete
Final review: bağımsız alt-asistan (kod izleme). Kritik yok.
Final: fixed sayfa yolu site dışına çıkabiliyordu (açık yönlendirme) — "site dışına çıkan sayfa yolu reddedilir" RED→GREEN, 42/42
Final: fixed kısa alıntı sayfa değişince yanlış yere işaretleniyordu — "birden çok geçiş var ve bağlam hiçbirine uymuyorsa null" RED→GREEN, 42/42
Final: fixed geliştirme girişi tek değişkene bağlıydı — "geliştirme girişi localhost dışında yoktur" RED→GREEN, 42/42
Final: fixed düzenlerken 401'de taslak kayboluyordu; taslak varken sayfa geçişi/dışarı tıklama/Escape sormuyordu; işaretli bağlantı tıklanamıyordu — tarayıcı betiği 10/10 (birim testi yok: DOM davranışı)
Final: fixed CSV bağlantısına başlık çapası; işaretlerde tek klavye durağı; vekil yalnızca 5173 kökenini çevirir; "Not ekle" seçim kalkmışsa hata vermez.
Final: Ruling: birim testi olmayan arayüz düzeltmeleri tarayıcı betiğiyle doğrulandı (betik proje dışında, kalıcı değil) — jsdom kurmak bu iş için fazla — yanlışsa: bu davranışlar ileride sessizce bozulabilir.
Final: minor (deferred): isaretleriKaldir içindeki normalize() Vue'nun boş metin düğümlerini silebilir (bugünkü sayfalarda etkisiz).
Final: minor (deferred): not listesi çekilemezse (ağ hatası) işaretler mesajsız kalkar.
Final: minor (deferred): çerezde __Host- öneki yok; çıkış 30 günlük belirteci sunucuda iptal etmez.
Final: minor (deferred): Katkılarım'da çıkıştan sonra dönen eski yanıt kısa süre görünebilir.
Final: minor (deferred): ?not= bağlantısı girişten sonra yeniden denenmez; yönetici için başkasının notunu açmaz (çapaya götürür).
Final: minor (deferred): tarayıcının Geri tuşu taslak varken sormaz (yalnızca site içi bağlantılar ve sekme kapatma sorar).
