import { beforeEach, describe, expect, it } from 'vitest'
import { env } from 'cloudflare:test'
import { SignJWT, createLocalJWKSet, exportJWK, generateKeyPair } from 'jose'
import { cerezDegeri, giris, hazirla, istek } from './yardimci'
import { googleKimlikDogrula } from '../worker/google'

beforeEach(hazirla)

describe('oturum', () => {
  it('çerezsiz /api/ben kullanıcı döndürmez, ayarları döndürür', async () => {
    const y = await istek('/api/ben')
    expect(y.status).toBe(200)
    expect(await y.json()).toEqual({ kullanici: null, googleIstemciKimligi: 'test-istemci', gelistirmeGirisi: true })
  })

  it('geliştirme girişi çerez verir ve /api/ben kullanıcıyı tanır', async () => {
    const y = await istek('/api/gelistirme-girisi', { yontem: 'POST', govde: { ad: 'Ayşe', eposta: 'ayse@ornek.test' } })
    expect(y.status).toBe(200)
    const cerez = y.headers.get('Set-Cookie')!
    expect(cerez.startsWith('oturum=')).toBe(true)
    expect(cerez).toContain('HttpOnly')
    expect(cerez).toContain('Secure')
    expect(cerez).toContain('SameSite=Lax')
    expect(cerez).toContain('Path=/')
    expect(cerez).toContain('Max-Age=2592000')
    const ben: any = await (await istek('/api/ben', { cerez: cerezDegeri(y) })).json()
    expect(ben.kullanici.ad).toBe('Ayşe')
    expect(ben.kullanici.eposta).toBe('ayse@ornek.test')
    expect(ben.kullanici.yonetici).toBe(false)
  })

  it('yönetici listesindeki e-posta yönetici olur (harf büyüklüğüne bakılmaz)', async () => {
    const cerez = await giris('Yonetici@Ornek.Test')
    const ben: any = await (await istek('/api/ben', { cerez })).json()
    expect(ben.kullanici.yonetici).toBe(true)
  })

  it('aynı e-postayla iki giriş tek kullanıcı satırı bırakır', async () => {
    await giris('ayse@ornek.test', 'Ayşe')
    await giris('ayse@ornek.test', 'Ayşe Yılmaz')
    const s = await (env as any).DB.prepare('SELECT ad FROM kullanicilar').all()
    expect(s.results).toEqual([{ ad: 'Ayşe Yılmaz' }])
  })

  it('bozulmuş çerez kabul edilmez', async () => {
    const cerez = await giris('ayse@ornek.test')
    // İmzanın ortasından bir karakter değiştirilir (son karakterin bazı bitleri imzaya girmez).
    const i = cerez.length - 20
    const bozuk = cerez.slice(0, i) + (cerez[i] === 'A' ? 'B' : 'A') + cerez.slice(i + 1)
    const ben: any = await (await istek('/api/ben', { cerez: bozuk })).json()
    expect(ben.kullanici).toBeNull()
  })

  it('çıkış çerezi siler', async () => {
    await giris('ayse@ornek.test')
    const y = await istek('/api/cikis', { yontem: 'POST' })
    expect(y.status).toBe(204)
    expect(y.headers.get('Set-Cookie')).toContain('Max-Age=0')
    const ben: any = await (await istek('/api/ben', { cerez: cerezDegeri(y) })).json()
    expect(ben.kullanici).toBeNull()
  })

  it('eksik alanla geliştirme girişi 400 döner', async () => {
    const y = await istek('/api/gelistirme-girisi', { yontem: 'POST', govde: { ad: '', eposta: 'x' } })
    expect(y.status).toBe(400)
  })

  it('geliştirme girişi localhost dışında yoktur', async () => {
    const { SELF } = await import('cloudflare:test')
    const y = await SELF.fetch('https://belge.example/api/gelistirme-girisi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ad: 'Sahte', eposta: 'yonetici@ornek.test' }),
    })
    expect(y.status).toBe(404)
    const ben: any = await (await SELF.fetch('https://belge.example/api/ben')).json()
    expect(ben.gelistirmeGirisi).toBe(false)
  })

  it('geçersiz Google belirteci 401 döner', async () => {
    const y = await istek('/api/giris', { yontem: 'POST', govde: { credential: 'saçma' } })
    expect(y.status).toBe(401)
    expect(await y.json()).toEqual({ hata: 'Google girişi doğrulanamadı' })
  })
})

describe('googleKimlikDogrula', () => {
  async function ortam() {
    const { publicKey, privateKey } = await generateKeyPair('RS256', { extractable: true })
    const jwk = { ...(await exportJWK(publicKey)), kid: 'k1', alg: 'RS256', use: 'sig' }
    const anahtarlar = createLocalJWKSet({ keys: [jwk] })
    const belirtec = (yuk: Record<string, unknown>, bitis = '5m', anahtar = privateKey) =>
      new SignJWT({ email: 'ayse@gmail.com', email_verified: true, name: 'Ayşe Yılmaz', picture: 'https://x/p.png', ...yuk })
        .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
        .setIssuer('https://accounts.google.com')
        .setAudience('test-istemci')
        .setSubject('g-123')
        .setIssuedAt()
        .setExpirationTime(bitis)
        .sign(anahtar)
    return { anahtarlar, belirtec }
  }

  it('geçerli belirtecin alanlarını döndürür', async () => {
    const { anahtarlar, belirtec } = await ortam()
    const k = await googleKimlikDogrula(await belirtec({}), 'test-istemci', anahtarlar)
    expect(k).toEqual({ sub: 'g-123', email: 'ayse@gmail.com', name: 'Ayşe Yılmaz', picture: 'https://x/p.png' })
  })

  it('başka istemci için kesilmiş belirteci reddeder', async () => {
    const { anahtarlar, belirtec } = await ortam()
    await expect(googleKimlikDogrula(await belirtec({}), 'baska-istemci', anahtarlar)).rejects.toThrow()
  })

  it('süresi geçmiş belirteci reddeder', async () => {
    const { anahtarlar, belirtec } = await ortam()
    await expect(googleKimlikDogrula(await belirtec({}, '-1m'), 'test-istemci', anahtarlar)).rejects.toThrow()
  })

  it('doğrulanmamış e-postayı reddeder', async () => {
    const { anahtarlar, belirtec } = await ortam()
    await expect(googleKimlikDogrula(await belirtec({ email_verified: false }), 'test-istemci', anahtarlar)).rejects.toThrow()
  })

  it('başka anahtarla imzalanmış belirteci reddeder', async () => {
    const { anahtarlar, belirtec } = await ortam()
    const baska = await generateKeyPair('RS256', { extractable: true })
    await expect(googleKimlikDogrula(await belirtec({}, '5m', baska.privateKey), 'test-istemci', anahtarlar)).rejects.toThrow()
  })

  it('adı olmayan hesapta e-postanın başını ad olarak kullanır', async () => {
    const { anahtarlar, belirtec } = await ortam()
    const k = await googleKimlikDogrula(await belirtec({ name: undefined }), 'test-istemci', anahtarlar)
    expect(k.name).toBe('ayse')
  })
})
