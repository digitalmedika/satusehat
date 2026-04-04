# Authentication

## Ringkasan

SDK ini memakai OAuth2 client credentials untuk mendapatkan access token SATUSEHAT.

Secara default alurnya:

1. cek token di cache
2. jika token masih valid, gunakan token lama
3. jika token expired atau mendekati expired, minta token baru
4. jika request resource mengembalikan `401`, cache akan dihapus lalu SDK retry sekali

## Client Credentials

```ts
import { createSatuSehatClient } from "@digitalmedika/satusehat";

const client = createSatuSehatClient({
  environment: "sandbox",
  credentials: {
    clientId: process.env.SATUSEHAT_CLIENT_ID!,
    clientSecret: process.env.SATUSEHAT_CLIENT_SECRET!,
  },
});
```

## Token Cache

### In-memory

Ini perilaku default untuk proses runtime yang sedang aktif.

### File-based cache

Cocok untuk internal testing dan local tooling.

```ts
import { createFileTokenStore, createSatuSehatClient } from "@digitalmedika/satusehat";

const client = createSatuSehatClient({
  environment: "sandbox",
  credentials: {
    clientId: process.env.SATUSEHAT_CLIENT_ID!,
    clientSecret: process.env.SATUSEHAT_CLIENT_SECRET!,
  },
  tokenStore: createFileTokenStore({
    filePath: ".satusehat/token.json",
  }),
});
```

Atau lewat environment:

```env
SATUSEHAT_TOKEN_CACHE_FILE=.satusehat/token.json
```

## Custom Access Token Provider

Jika ingin mengelola token sendiri:

```ts
const client = createSatuSehatClient({
  environment: "sandbox",
  accessToken: async () => {
    return "your-managed-token";
  },
});
```

## Expiry Check

SDK menyediakan helper:

```ts
import { isAccessTokenExpired } from "@digitalmedika/satusehat";

const expired = isAccessTokenExpired({
  expiresAt: Date.now() + 30_000,
});
```

## Catatan Praktik

- Untuk public SDK, persistence sebaiknya opsional.
- Untuk internal testing, file cache sangat membantu mengurangi request token berulang.
- Jangan commit token cache atau secret ke git.
