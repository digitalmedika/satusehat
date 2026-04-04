# satusehat

Wrapper TypeScript untuk SATUSEHAT API dengan fokus pada full type safety untuk request dan response.

## Quick Start

Install dependency:

```bash
bun install
```

Salin env template:

```bash
cp .env.example .env
```

Build library:

```bash
bun run build
```

## Status

Fondasi package library npm sudah disiapkan:

- struktur `src/`
- typed transport
- OAuth2 client credentials helper
- token cache in-memory dan file-based store opsional
- endpoint awal `patient.search()` dan `patient.getById()`
- schema validation dengan Zod

## Next

Lihat dokumen plan di `docs/planning.md` untuk roadmap implementasi, struktur folder, dan checklist publish ke npm.
