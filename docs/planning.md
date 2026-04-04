# Planning: Satu Sehat TypeScript SDK

## Tujuan

Membangun library TypeScript untuk membungkus Satu Sehat API dengan karakteristik berikut:

- Full type safety untuk request body, query, path params, headers, dan response.
- Runtime validation untuk memastikan data eksternal tetap aman meskipun type sudah kuat di compile time.
- Developer experience yang nyaman untuk konsumsi di backend service maupun frontend tooling yang aman.
- Siap dipublish ke npm dengan output ESM yang bersih dan dokumentasi yang jelas.

## Prinsip Arsitektur

- Pisahkan transport HTTP dari definisi endpoint agar testing dan maintenance mudah.
- Simpan schema request dan response sebagai single source of truth.
- Turunkan type TypeScript langsung dari schema agar tidak terjadi drift antara runtime dan compile time.
- Bungkus error API dalam error object yang konsisten dan typed.
- Hindari `any`; gunakan generic yang terkontrol untuk extensibility.

## Rekomendasi Stack

- Runtime/package manager: Bun
- Language: TypeScript
- Schema validation: Zod
- Testing: Bun test
- Build: `tsc` untuk typecheck dan Bun/tsup untuk output distribusi
- Lint/formatting: bisa ditambahkan setelah fondasi package siap

## Struktur Folder yang Disarankan

```text
src/
  client/
    create-client.ts
    transport.ts
    auth.ts
  core/
    errors.ts
    result.ts
    types.ts
  schemas/
    common.ts
    patient.ts
    encounter.ts
  endpoints/
    patient/
      get-patient.ts
      search-patient.ts
    encounter/
      create-encounter.ts
  index.ts
tests/
docs/
```

## Desain API Library

Target pengalaman pemakaian:

```ts
const client = createSatuSehatClient({
  baseUrl: "https://api-satusehat.example",
  accessToken: async () => "token",
});

const patient = await client.patient.getById({
  patientId: "123",
});
```

Prinsip desain:

- Satu client utama sebagai entry point.
- Endpoint dikelompokkan per domain resource.
- Setiap method menerima object parameter yang typed, bukan positional arguments.
- Response sukses dan error memiliki bentuk yang stabil.

## Strategi Full Type Safety

1. Definisikan schema Zod untuk setiap request dan response.
2. Turunkan type memakai `z.infer`.
3. Validasi input sebelum request dikirim.
4. Validasi response sebelum data dikembalikan ke consumer.
5. Normalisasi error transport, auth, dan error payload API ke union type yang jelas.

Contoh pola:

```ts
const GetPatientParamsSchema = z.object({
  patientId: z.string().min(1),
});

type GetPatientParams = z.infer<typeof GetPatientParamsSchema>;
```

## Milestone Implementasi

### Phase 1: Fondasi Package

- Rapikan `package.json` untuk package library npm.
- Pindahkan entry point ke `src/index.ts`.
- Tambahkan script `build`, `typecheck`, `test`, dan `prepublishOnly`.
- Aktifkan strict TypeScript config yang cocok untuk library.

### Phase 2: Core Client

- Buat HTTP transport wrapper berbasis `fetch`.
- Tambahkan auth strategy untuk bearer token dan refresh token callback.
- Buat typed error model dan response normalizer.

### Phase 3: Schema dan Endpoint Awal

- Pilih 1 sampai 2 resource Satu Sehat prioritas awal, misalnya patient dan encounter.
- Tulis schema request/response.
- Implementasikan endpoint method typed end-to-end.
- Tambahkan unit test untuk success, validation failure, dan API failure.

### Phase 4: Publishing Readiness

- Lengkapi metadata npm: `name`, `version`, `description`, `license`, `repository`, `keywords`.
- Hasilkan output `dist/`.
- Tambahkan `exports`, `types`, dan `files`.
- Siapkan README usage dan changelog.
- Tambahkan CI untuk typecheck, test, dan publish pipeline.

## Checklist Publish ke npm

- Package name final sudah dipilih dan tersedia.
- `private` dihapus atau diubah ke `false`.
- Build menghasilkan file JS dan declaration file.
- README menjelaskan instalasi, auth, contoh pemakaian, dan error handling.
- Semua endpoint publik punya type yang diekspor dengan jelas.
- Versioning mengikuti semver.

## Risiko yang Perlu Diantisipasi

- Spec Satu Sehat bisa kompleks atau tidak sepenuhnya konsisten.
- Response API nyata bisa berbeda dari dokumentasi.
- Beberapa field bisa kondisional sehingga perlu schema union/discriminated union.
- Auth flow mungkin butuh strategi yang fleksibel sejak awal.

## Langkah Praktis Berikutnya

1. Ubah scaffold Bun menjadi struktur library npm.
2. Tambahkan dependency schema validation.
3. Buat core client dan satu endpoint vertikal penuh sebagai reference implementation.
4. Setelah pola stabil, lanjutkan ekspansi resource lain.

## TODO Backlog

### Encounter

- Tambahkan perluasan schema dan helper untuk use case rawat inap, termasuk `hospitalization`, `admitSource`, `destination`, dan `dischargeDisposition` yang lebih ketat.
- Tambahkan dukungan use case IGD/triage dengan pola status dan class history yang lebih spesifik per alur layanan.
- Tambahkan field dan contoh untuk use case poli/rawat jalan yang lebih lengkap, termasuk `serviceType`, `priority`, dan participant yang lebih terstruktur.
- Tambahkan dukungan extension `serviceClass` pada `Encounter.location` untuk kelas perawatan.
- Tambahkan contoh integrasi `Encounter` yang terhubung dengan resource klinis lanjutan seperti `Condition`, `Observation`, `Procedure`, dan `Medication`.
- Tambahkan test fixture dan contoh payload per use case agar validasi schema tidak hanya generik, tapi juga representatif terhadap skenario SATUSEHAT nyata.
