// Ortak yanıt biçimi: başarı JSON, hata `{ hata: "..." }`.

export function json(veri: unknown, durum = 200, basliklar: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(veri), {
    status: durum,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...basliklar },
  })
}

export function hata(durum: number, mesaj: string): Response {
  return json({ hata: mesaj }, durum)
}

/** İşleyicilerin fırlattığı, kullanıcıya gösterilecek hata. */
export class IstekHatasi extends Error {
  constructor(public durum: number, mesaj: string) {
    super(mesaj)
  }
}

/** İstek gövdesini JSON nesnesi olarak okur. */
export async function govdeOku(istek: Request): Promise<Record<string, unknown>> {
  let govde: unknown
  try {
    govde = await istek.json()
  } catch {
    throw new IstekHatasi(400, 'Geçersiz istek')
  }
  if (!govde || typeof govde !== 'object' || Array.isArray(govde)) throw new IstekHatasi(400, 'Geçersiz istek')
  return govde as Record<string, unknown>
}
