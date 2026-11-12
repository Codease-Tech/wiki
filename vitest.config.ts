import { defineConfig } from 'vitest/config'
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin'

export default defineConfig(async () => {
  const gocler = await readD1Migrations('./migrations')
  return {
    plugins: [
      cloudflareTest({
        wrangler: { configPath: './wrangler.jsonc' },
        miniflare: {
          bindings: {
            TEST_GOCLERI: gocler,
            OTURUM_ANAHTARI: 'test-icin-sabit-anahtar-0123456789abcdef',
            GELISTIRME_GIRISI: '1',
            YONETICI_EPOSTALARI: 'yonetici@ornek.test',
            GOOGLE_ISTEMCI_KIMLIGI: 'test-istemci',
          },
        },
      }),
    ],
    test: { include: ['test/**/*.test.ts'] },
  }
})
