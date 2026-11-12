import { describe, expect, it } from 'vitest'
import { yerBul } from '../docs/.vitepress/theme/katki/yer'

describe('yerBul', () => {
  it('tek geçişi bulur', () => {
    expect(yerBul('Görev ayarları açılır.', 'ayarları', '', '')).toEqual({ bas: 6, son: 14 })
  })
  it('birden çok geçişte bağlama uyanı seçer', () => {
    expect(yerBul('Kaydet. Sonra Kaydet düğmesi.', 'Kaydet', 'Sonra ', ' düğmesi')).toEqual({ bas: 14, son: 20 })
  })
  it('yalnızca öncesi ya da yalnızca sonrası da ayırt etmeye yeter', () => {
    expect(yerBul('Kaydet. Sonra Kaydet düğmesi.', 'Kaydet', 'Sonra ', '')).toEqual({ bas: 14, son: 20 })
    expect(yerBul('Kaydet. Sonra Kaydet düğmesi.', 'Kaydet', '', ' düğmesi')).toEqual({ bas: 14, son: 20 })
  })
  it('bağlam yoksa ilk geçişi verir', () => {
    expect(yerBul('Kaydet. Sonra Kaydet düğmesi.', 'Kaydet', '', '')).toEqual({ bas: 0, son: 6 })
  })
  it('boşluk farklarını yok sayar, konumu özgün metne göre verir', () => {
    expect(yerBul('a  b\n c', 'a b c', '', '')).toEqual({ bas: 0, son: 7 })
    expect(yerBul('x  a b', ' a\n\nb ', 'x ', '')).toEqual({ bas: 3, son: 6 })
  })
  it('metin değişmiş ve alıntı yoksa null', () => {
    expect(yerBul('Görev ayarları açılır.', 'ayarlar kapanır', '', '')).toBeNull()
  })
  it('birden çok geçiş var ve bağlam hiçbirine uymuyorsa null (yanlış yere işaretleme)', () => {
    expect(yerBul('Kaydet. Sonra Kaydet düğmesi.', 'Kaydet', 'silinen paragraf ', ' artık yok')).toBeNull()
  })
  it('tek geçiş varsa bağlam uymasa da bulunur', () => {
    expect(yerBul('Görev ayarları açılır.', 'ayarları', 'eski ', ' metin')).toEqual({ bas: 6, son: 14 })
  })
  it('boş alıntı null', () => {
    expect(yerBul('abc', '', '', '')).toBeNull()
    expect(yerBul('abc', '  \n', '', '')).toBeNull()
  })
})
