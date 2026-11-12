import type { Env, YonetimNotu } from './tipler'
import { json } from './yanit'
import { NOT_SUTUNLARI, notaCevir, type NotSatiri } from './notlar'

/**
 * Bir CSV satırı üretir (ayırıcı `;`, Türkçe Excel'in varsayılanı).
 * Her hücre tırnak içine alınır. `=`, `+`, `-`, `@` ile başlayan hücrenin başına
 * `'` konur; yoksa tablo programı okuyucunun yazdığı metni formül olarak çalıştırır.
 */
export function csvSatiri(hucreler: string[]): string {
  return hucreler
    .map((h) => {
      const guvenli = /^[=+\-@\t\r]/.test(h) ? `'${h}` : h
      return `"${guvenli.replace(/"/g, '""')}"`
    })
    .join(';')
}

const CSV_BASLIK = 'Tarih;Yazar;E-posta;Sayfa;Başlık;Seçilen metin;Not;Bağlantı'

type YonetimSatiri = NotSatiri & { yazar_ad: string; yazar_eposta: string }

export async function tumNotlar(istek: Request, env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT ${NOT_SUTUNLARI}, k.ad AS yazar_ad, k.eposta AS yazar_eposta
     FROM notlar n JOIN kullanicilar k ON k.id = n.kullanici_id
     ORDER BY n.olusturma DESC, n.id DESC`,
  ).all<YonetimSatiri>()
  const notlar: YonetimNotu[] = results.map((s) => ({ ...notaCevir(s), yazarAd: s.yazar_ad, yazarEposta: s.yazar_eposta }))

  const adres = new URL(istek.url)
  if (adres.searchParams.get('bicim') !== 'csv') return json({ notlar })

  const satirlar = notlar.map((n) =>
    csvSatiri([
      n.olusturma,
      n.yazarAd,
      n.yazarEposta,
      n.sayfaBasligi || n.sayfa,
      n.baslikMetni ?? '',
      n.alinti,
      n.metin,
      `${adres.origin}${n.sayfa}?not=${n.id}${n.baslikCapa ? '#' + n.baslikCapa : ''}`,
    ]),
  )
  // Baştaki BOM, Excel'in dosyayı UTF-8 olarak açmasını sağlar.
  const govde = '﻿' + [CSV_BASLIK, ...satirlar].join('\r\n') + '\r\n'
  return new Response(govde, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="katkilar-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
