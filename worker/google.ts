import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose'

// Google'ın imza anahtarları; jose yanıtı bellekte tutar ve gerektiğinde yeniler.
const googleAnahtarlari = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

export interface GoogleKimlik {
  sub: string
  email: string
  name: string
  picture?: string
}

/**
 * "Google ile giriş" düğmesinin verdiği kimlik belirtecini doğrular.
 * İmza, veren (Google), hedef (bizim istemci kimliğimiz), süre ve e-postanın
 * Google'ca doğrulanmış olması denetlenir; biri tutmazsa hata fırlatır.
 */
export async function googleKimlikDogrula(
  belirtec: string,
  istemciKimligi: string,
  anahtarlar: JWTVerifyGetKey = googleAnahtarlari,
): Promise<GoogleKimlik> {
  const { payload } = await jwtVerify(belirtec, anahtarlar, {
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience: istemciKimligi,
    algorithms: ['RS256'],
  })
  const { sub, email, email_verified, name, picture } = payload as Record<string, unknown>
  if (typeof sub !== 'string' || !sub) throw new Error('Kimlik eksik')
  if (typeof email !== 'string' || !email) throw new Error('E-posta eksik')
  if (email_verified !== true && email_verified !== 'true') throw new Error('E-posta doğrulanmamış')
  const kimlik: GoogleKimlik = {
    sub,
    email,
    name: typeof name === 'string' && name.trim() ? name.trim() : email.split('@')[0],
  }
  if (typeof picture === 'string' && picture) kimlik.picture = picture
  return kimlik
}
