import { beforeEach, expect, it } from 'vitest'
import { giris, hazirla, istek, ornekYer } from './yardimci'

beforeEach(hazirla)

const ekle = (cerez: string, ek: Record<string, unknown> = {}) =>
  istek('/api/notlar', { yontem: 'POST', cerez, govde: { ...ornekYer, metin: 'Burası güncellenmeli.', ...ek } })
const liste = async (cerez: string, sorgu = '') =>
  ((await (await istek('/api/notlar' + sorgu, { cerez })).json()) as any).notlar as any[]

it('giriş yoksa 401', async () => {
  for (const y of [await istek('/api/notlar'), await ekle('')]) {
    expect(y.status).toBe(401)
    expect(await y.json()).toEqual({ hata: 'Giriş gerekli' })
  }
})

it('not eklenir ve yer alanları aynen döner', async () => {
  const cerez = await giris('ayse@ornek.test')
  const y = await ekle(cerez)
  expect(y.status).toBe(201)
  const { not }: any = await y.json()
  expect(not).toMatchObject({ ...ornekYer, metin: 'Burası güncellenmeli.' })
  expect(typeof not.id).toBe('number')
  expect(not.olusturma).toBe(not.guncelleme)
  expect(new Date(not.olusturma).toISOString()).toBe(not.olusturma)
  expect(await liste(cerez)).toEqual([not])
})

it('boş not ve eksik yer reddedilir', async () => {
  const cerez = await giris('ayse@ornek.test')
  for (const metin of ['', '   \n ', undefined]) {
    const y = await ekle(cerez, { metin })
    expect(y.status).toBe(400)
    expect(await y.json()).toEqual({ hata: 'Not boş olamaz' })
  }
  expect((await ekle(cerez, { sayfa: undefined })).status).toBe(400)
  expect((await ekle(cerez, { sayfa: 'veri-modeli' })).status).toBe(400)
  expect((await ekle(cerez, { alinti: '' })).status).toBe(400)
  expect(await liste(cerez)).toEqual([])
})

it('gövde JSON değilse 400', async () => {
  const cerez = await giris('ayse@ornek.test')
  const { SELF } = await import('cloudflare:test')
  const y = await SELF.fetch('https://localhost/api/notlar', { method: 'POST', headers: { Cookie: cerez }, body: 'x{' })
  expect(y.status).toBe(400)
})

it('çok uzun not kabul edilir (sınır yok)', async () => {
  const cerez = await giris('ayse@ornek.test')
  const metin = 'ğüşiöç '.repeat(30000).trim()
  expect(metin.length).toBeGreaterThan(200000)
  expect((await ekle(cerez, { metin })).status).toBe(201)
  expect((await liste(cerez))[0].metin).toBe(metin)
})

it('HTML içeren not değiştirilmeden saklanır', async () => {
  const cerez = await giris('ayse@ornek.test')
  const metin = '<script>alert(1)</script> "tırnak" & \'tek\''
  await ekle(cerez, { metin })
  expect((await liste(cerez))[0].metin).toBe(metin)
})

it('başkasının notu görünmez, düzenlenemez, silinemez', async () => {
  const ayse = await giris('ayse@ornek.test')
  const burak = await giris('burak@ornek.test')
  const { not }: any = await (await ekle(ayse)).json()
  expect(await liste(burak)).toEqual([])
  const d = await istek('/api/notlar/' + not.id, { yontem: 'PUT', cerez: burak, govde: { metin: 'ele geçirildi' } })
  expect(d.status).toBe(404)
  const s = await istek('/api/notlar/' + not.id, { yontem: 'DELETE', cerez: burak })
  expect(s.status).toBe(404)
  expect(await liste(ayse)).toEqual([not])
})

it('kendi notu düzenlenir; yer değişmez, güncelleme zamanı ilerler', async () => {
  const cerez = await giris('ayse@ornek.test')
  const { not }: any = await (await ekle(cerez)).json()
  await new Promise((r) => setTimeout(r, 5))
  const y = await istek('/api/notlar/' + not.id, { yontem: 'PUT', cerez, govde: { metin: 'Düzeltildi.' } })
  expect(y.status).toBe(200)
  const yeni = ((await y.json()) as any).not
  expect(yeni).toMatchObject({ ...ornekYer, id: not.id, metin: 'Düzeltildi.', olusturma: not.olusturma })
  expect(yeni.guncelleme > not.olusturma).toBe(true)
  const bos = await istek('/api/notlar/' + not.id, { yontem: 'PUT', cerez, govde: { metin: ' ' } })
  expect(bos.status).toBe(400)
})

it('kendi notu silinir', async () => {
  const cerez = await giris('ayse@ornek.test')
  const { not }: any = await (await ekle(cerez)).json()
  expect((await istek('/api/notlar/' + not.id, { yontem: 'DELETE', cerez })).status).toBe(204)
  expect(await liste(cerez)).toEqual([])
  expect((await istek('/api/notlar/' + not.id, { yontem: 'DELETE', cerez })).status).toBe(404)
  expect((await istek('/api/notlar/abc', { yontem: 'DELETE', cerez })).status).toBe(404)
})

it('sayfaya göre süzülür, yeniden eskiye sıralanır', async () => {
  const cerez = await giris('ayse@ornek.test')
  await ekle(cerez, { sayfa: '/a', metin: 'bir' })
  await ekle(cerez, { sayfa: '/b', metin: 'iki' })
  await ekle(cerez, { sayfa: '/a', metin: 'üç' })
  expect((await liste(cerez, '?sayfa=/a')).map((n) => n.metin)).toEqual(['üç', 'bir'])
  expect((await liste(cerez)).map((n) => n.metin)).toEqual(['üç', 'iki', 'bir'])
})

it('site dışına çıkan sayfa yolu reddedilir', async () => {
  const cerez = await giris('ayse@ornek.test')
  for (const sayfa of ['/\\evil.example/giris', '//evil.example', '/a\\b', '/a b', 'https://evil.example/']) {
    expect((await ekle(cerez, { sayfa })).status, sayfa).toBe(400)
  }
  expect((await ekle(cerez, { sayfa: '/' })).status).toBe(201)
  expect((await ekle(cerez, { sayfa: '/alt/sayfa-adı' })).status).toBe(201)
})
