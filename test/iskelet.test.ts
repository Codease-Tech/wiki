import { beforeEach, expect, it } from 'vitest'
import { hazirla, istek, KOK } from './yardimci'
import { SELF } from 'cloudflare:test'

beforeEach(hazirla)

it('bilinmeyen api yolu 404 ve JSON döner', async () => {
  const y = await istek('/api/yok')
  expect(y.status).toBe(404)
  expect(await y.json()).toEqual({ hata: 'Bulunamadı' })
})

it('başka kökenden gelen değişiklik isteği reddedilir', async () => {
  const y = await SELF.fetch(KOK + '/api/cikis', { method: 'POST', headers: { Origin: 'https://kotu.test' } })
  expect(y.status).toBe(403)
  expect(await y.json()).toEqual({ hata: 'Geçersiz köken' })
})
