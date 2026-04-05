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

- Selesai: `package.json` sudah siap untuk library npm.
- Selesai: entry point sudah memakai `src/index.ts`.
- Selesai: script `build`, `typecheck`, `test`, dan `prepublishOnly` sudah tersedia.
- Selesai: strict TypeScript config sudah aktif.

### Phase 2: Core Client

- Selesai: HTTP transport wrapper berbasis `fetch` sudah dipakai di client.
- Selesai: auth strategy untuk bearer token dan token provider sudah tersedia.
- Selesai: typed error model dan response normalizer sudah dipakai lintas endpoint.

### Phase 3: Schema dan Endpoint Awal

- Selesai: implementasi sudah melewati resource awal dan meluas ke banyak resource klinis utama.
- Selesai: schema request/response tersedia untuk resource yang diekspor publik.
- Selesai: endpoint typed end-to-end sudah tersedia untuk patient, encounter, dan resource lanjutan lain.
- Selesai: unit test sudah mencakup success, validation failure, dan API failure.

### Phase 4: Publishing Readiness

- Selesai: metadata npm utama sudah lengkap.
- Selesai: output `dist/` sudah dihasilkan lewat build.
- Selesai: `exports`, `types`, dan `files` sudah dikonfigurasi.
- Selesai: README usage dan changelog sudah tersedia.
- Selesai: workflow GitHub Actions untuk release/publish sudah tersedia.

## Status Saat Ini

- Library sudah berada di fase ekspansi helper, dokumentasi, dan use case klinis spesifik.
- Resource publik utama sudah tersedia lengkap dengan schema, endpoint, dan test.
- Helper builder sudah mencakup encounter, alur IGD/triage, workflow pasca-encounter `Encounter -> Condition`, `Encounter -> Procedure`, `Encounter -> MedicationAdministration`, dan `Encounter -> MedicationRequest`, rawat inap, organisasi, risk assessment, radiologi, dan panel laboratorium.
- Build, typecheck, dan test suite penuh sudah berjalan hijau di repo lokal.

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

1. Perluas helper pasca-encounter dari workflow `Condition`, `Procedure`, `MedicationAdministration`, dan `MedicationRequest` ke resource terapi lain yang masih berdekatan.
2. Pilih helper workflow berikutnya yang menghubungkan `Encounter` ke `Medication` atau resource terapi lanjutan lain.
3. Tambahkan dokumentasi contoh penggunaan yang menunjukkan urutan resource setelah encounter dibuat, diagnosis awal tercatat, tindakan klinis awal selesai, lalu order dan pemberian obat terdokumentasi.
4. Setelah helper workflow lanjutan stabil, baru lanjutkan backlog use case lain di luar Encounter bila ada issue baru.

## TODO Backlog

### Encounter

- Selesai: perluasan schema dan helper untuk use case rawat inap, termasuk `hospitalization`, `admitSource`, `destination`, dan `dischargeDisposition` yang lebih ketat.
- Selesai: dukungan use case IGD/triage dengan pola `statusHistory` dan `classHistory` yang lebih spesifik per alur layanan.
- Selesai: field dan contoh untuk use case poli/rawat jalan yang lebih lengkap, termasuk `serviceType`, `priority`, dan participant yang lebih terstruktur.
- Selesai: dukungan extension `serviceClass` pada `Encounter.location` untuk kelas perawatan.
- Selesai: helper workflow pasca-encounter untuk alur IGD `Encounter -> Condition` sudah tersedia.
- Selesai: helper workflow pasca-encounter untuk alur IGD `Encounter -> Procedure` sudah tersedia.
- Selesai: helper workflow pasca-encounter untuk alur IGD `Encounter -> MedicationAdministration` sudah tersedia.
- Selesai: helper workflow pasca-encounter untuk alur IGD `Encounter -> MedicationRequest` sudah tersedia.
- Belum: workflow klinis lanjutan pasca-encounter yang meluas ke `Medication`.
- Selesai: test fixture dan contoh payload per use case agar validasi schema representatif terhadap skenario SATUSEHAT nyata.

## Prioritas Rekomendasi

Kerjakan berikutnya:

- Helper atau contoh workflow klinis pasca-encounter yang memperluas alur dari `Encounter -> Condition`, `Encounter -> Procedure`, `Encounter -> MedicationAdministration`, dan `Encounter -> MedicationRequest` menuju `Medication`.

Alasan diprioritaskan:

- Fondasi alur diagnosis awal, order obat, dan pemberian obat dari encounter sudah tersedia, jadi langkah berikutnya tinggal memperluas rantai resource klinis yang tersisa.
- Value-nya tinggi karena pengguna bisa melihat alur klinis yang makin end-to-end setelah encounter berhasil dibuat.
- Schema, endpoint, dan builder resource lanjutan sebagian besar sudah ada, jadi risikonya lebih rendah dibanding memulai area baru.
