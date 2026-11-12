CREATE TABLE kullanicilar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  google_kimlik TEXT NOT NULL UNIQUE,
  eposta TEXT NOT NULL,
  ad TEXT NOT NULL,
  resim TEXT,
  olusturma TEXT NOT NULL
);
CREATE TABLE notlar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kullanici_id INTEGER NOT NULL REFERENCES kullanicilar(id),
  sayfa TEXT NOT NULL,
  sayfa_basligi TEXT NOT NULL,
  baslik_capa TEXT,
  baslik_metni TEXT,
  alinti TEXT NOT NULL,
  once TEXT NOT NULL DEFAULT '',
  sonra TEXT NOT NULL DEFAULT '',
  metin TEXT NOT NULL,
  olusturma TEXT NOT NULL,
  guncelleme TEXT NOT NULL
);
CREATE INDEX notlar_kullanici_sayfa ON notlar(kullanici_id, sayfa);
