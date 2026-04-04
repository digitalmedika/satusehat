# Getting Started

## Instalasi

Untuk consumer package:

```bash
bun add satusehat
```

Untuk development repository ini:

```bash
bun install
```

## Konfigurasi Environment

Salin `.env.example` menjadi `.env`.

```env
SATUSEHAT_ENV=sandbox
SATUSEHAT_BASE_URL=https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1
SATUSEHAT_AUTH_BASE_URL=https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1
SATUSEHAT_CLIENT_ID=your-client-id
SATUSEHAT_CLIENT_SECRET=your-client-secret
SATUSEHAT_TOKEN_CACHE_FILE=.satusehat/token.json
```

## Membuat Client

### Dari environment

```ts
import { createSatuSehatClientFromEnv } from "satusehat";

const client = createSatuSehatClientFromEnv();
```

### Dari konfigurasi manual

```ts
import { createSatuSehatClient } from "satusehat";

const client = createSatuSehatClient({
  environment: "sandbox",
  credentials: {
    clientId: process.env.SATUSEHAT_CLIENT_ID!,
    clientSecret: process.env.SATUSEHAT_CLIENT_SECRET!,
  },
});
```

## Contoh Pertama

```ts
const result = await client.patient.search({
  identifier: "https://fhir.kemkes.go.id/id/nik|9271060312000001",
});

console.log(result.total);
```

## Resource yang Sudah Tersedia

- `patient`
- `organization`
- `location`
- `practitioner`
- `practitionerRole`

## Verifikasi Lokal

```bash
bun run typecheck
bun test
bun run smoke:live
```
