# satusehat

Type-safe TypeScript SDK untuk SATUSEHAT API.

SDK ini dirancang untuk:

- validasi request dan response dengan runtime schema
- type inference end-to-end di TypeScript
- OAuth2 client credentials
- token cache in-memory atau file-based
- ergonomi SDK yang cocok untuk backend service dan internal tooling

## Installation

```bash
bun add satusehat
```

Untuk development library ini sendiri:

```bash
bun install
```

## Quick Start

```ts
import { createSatuSehatClientFromEnv } from "satusehat";

const client = createSatuSehatClientFromEnv();

const patient = await client.patient.search({
  identifier: "https://fhir.kemkes.go.id/id/nik|9271060312000001",
});
```

## Environment Variables

Salin template dari [.env.example](D:/project/satusehat/.env.example).

Variable utama:

- `SATUSEHAT_ENV`
- `SATUSEHAT_BASE_URL`
- `SATUSEHAT_AUTH_BASE_URL`
- `SATUSEHAT_CLIENT_ID`
- `SATUSEHAT_CLIENT_SECRET`
- `SATUSEHAT_TOKEN_CACHE_FILE`

## Available Resources

Saat ini resource yang sudah tersedia:

- `condition`
- `encounter`
- `observation`
- `patient`
- `organization`
- `location`
- `practitioner`
- `practitionerRole`

## Token Handling

Secara default SDK mendukung:

- token provider berbasis OAuth2 client credentials
- cache token in-memory
- file-based token store opsional untuk local testing/internal tools
- refresh otomatis saat token expired atau mendekati expired
- retry sekali saat menerima `401` jika token bisa di-invalidasi

## Development

```bash
bun run typecheck
bun test
bun run build
```

Smoke test ke SATUSEHAT live:

```bash
bun run smoke:live
```

Untuk environment `sandbox`, smoke test akan memakai dummy patient resmi SATUSEHAT bila parameter test belum diisi.

## Documentation

- [Getting Started](D:/project/satusehat/docs/getting-started.md)
- [Authentication](D:/project/satusehat/docs/authentication.md)
- [Errors](D:/project/satusehat/docs/errors.md)
- [Condition](D:/project/satusehat/docs/resources/condition.md)
- [Patient](D:/project/satusehat/docs/resources/patient.md)
- [Encounter](D:/project/satusehat/docs/resources/encounter.md)
- [Observation](D:/project/satusehat/docs/resources/observation.md)
- [Organization](D:/project/satusehat/docs/resources/organization.md)
- [Location](D:/project/satusehat/docs/resources/location.md)
- [Practitioner](D:/project/satusehat/docs/resources/practitioner.md)
- [PractitionerRole](D:/project/satusehat/docs/resources/practitioner-role.md)
- [Planning](D:/project/satusehat/docs/planning.md)
