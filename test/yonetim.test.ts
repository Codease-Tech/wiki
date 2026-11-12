import { beforeEach, expect, it } from 'vitest'
import { giris, hazirla, istek, ornekYer } from './yardimci'
import { csvSatiri } from '../worker/yonetim'

beforeEach(hazirla)

const ekle = (cerez: string, metin: string) =>
  istek('/api/notlar', { yontem: 'POST', cerez, govde: { ...ornekYer, metin } })

it('yönetici olmayan göremez', async () => {
  const y = await istek('/api/yonetim/notlar')
  expect(y.status).toBe(401)
  const y2 = await istek('/api/yonetim/notlar', { cerez: await giris('ayse@ornek.test') })
  expect(y2.status).toBe(403)
  expect(await y2.json()).toEqual({ hata: 'Yetki yok' })
  const y3 = await istek('/api/yonetim/notlar?bicim=csv', { cerez: await giris('ayse@ornek.test') })
  expect(y3.status).toBe(403)
})

it('yönetici herkesin notlarını yazarıyla görür', async () => {
  await ekle(await giris('ayse@ornek.test', 'Ayşe'), 'bir')
  await ekle(await giris('burak@ornek.test', 'Burak'), 'iki')
  const y = await istek('/api/yonetim/notlar', { cerez: await giris('yonetici@ornek.test') })
  const { notlar }: any = await y.json()
  expect(notlar.map((n: any) => [n.yazarAd, n.yazarEposta, n.metin])).toEqual([
    ['Burak', 'burak@ornek.test', 'iki'],
    ['Ayşe', 'ayse@ornek.test', 'bir'],
  ])
  expect(notlar[0]).toMatchObject(ornekYer)
})

it('CSV dökümü Excel uyumludur', async () => {
  const ayse = await giris('ayse@ornek.test', 'Ayşe')
  const { not }: any = await (await ekle(ayse, '=TOPLA(A1)\nikinci; "satır"')).json()
  const y = await istek('/api/yonetim/notlar?bicim=csv', { cerez: await giris('yonetici@ornek.test') })
  expect(y.status).toBe(200)
  expect(y.headers.get('Content-Type')).toBe('text/csv; charset=utf-8')
  expect(y.headers.get('Content-Disposition')).toMatch(/^attachment; filename="katkilar-\d{4}-\d{2}-\d{2}\.csv"$/)
  const bayt = new Uint8Array(await y.arrayBuffer())
  expect([...bayt.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf])
  const metin = new TextDecoder('utf-8', { ignoreBOM: true }).decode(bayt).slice(1)
  const satirlar = metin.split('\r\n')
  expect(satirlar[0]).toBe('Tarih;Yazar;E-posta;Sayfa;Başlık;Seçilen metin;Not;Bağlantı')
  expect(satirlar[1]).toBe(
    `"${not.olusturma}";"Ayşe";"ayse@ornek.test";"Veri modeli";"Alan ekleme";"Alan adı boş bırakılamaz";"'=TOPLA(A1)\nikinci; ""satır""";"https://localhost/veri-modeli?not=${not.id}#alan-ekleme"`,
  )
})

it('csvSatiri ayırıcı, tırnak ve satır sonunu korur', () => {
  expect(csvSatiri(['a;b', 'c"d', 'e\nf'])).toBe('"a;b";"c""d";"e\nf"')
})

it('csvSatiri formül gibi başlayan hücreyi etkisizleştirir', () => {
  expect(csvSatiri(['=1+1', '+x', '-y', '@z', 'a=b'])).toBe(`"'=1+1";"'+x";"'-y";"'@z";"a=b"`)
})
