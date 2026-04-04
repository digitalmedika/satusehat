# Practitioner

## Ringkasan

Resource `practitioner` saat ini mendukung:

- `getById`
- `search`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR Practitioner](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/practitioner/)
- [ReST API Practitioner](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/onboardings/apis/practitioner/)

## Search

SDK memvalidasi query `Practitioner` sesuai mode pencarian yang didokumentasikan SATUSEHAT.

Mode yang saat ini didukung:

1. `identifier`
2. `name + birthdate + gender`

### Search by identifier

Format `identifier` yang dimodelkan:

`https://fhir.kemkes.go.id/id/nik|{nik-practitioner}`

```ts
const result = await client.practitioner.search({
  identifier: "https://fhir.kemkes.go.id/id/nik|7209061211900001",
});
```

### Search by name, birthdate, and gender

```ts
const result = await client.practitioner.search({
  name: "Alexander",
  birthdate: "1994-01-01",
  gender: "male",
});
```

## Get By ID

```ts
const practitioner = await client.practitioner.getById({
  id: "10009880728",
});
```

## Catatan Penting dari Dokumentasi Resmi

- SATUSEHAT mendokumentasikan bahwa pencarian nama boleh menggunakan nama sebagian atau lengkap, tetapi penulisannya tetap harus sesuai data yang tersimpan di SATUSEHAT.
- ID `Practitioner` yang didapat dari hasil pencarian bisa dipakai sebagai `{practitioner-ihs-number}` pada resource lain dengan format referensi `Practitioner/{id}`.
- Dokumentasi resmi juga menyebutkan bahwa error `5xx` pada endpoint ini dapat kembali sebagai `text/plain`, bukan JSON. Di SDK ini nilai mentah tersebut akan tersedia pada `SatuSehatApiError.response`.

## Data Dummy Sandbox

Dokumentasi resmi SATUSEHAT menyediakan data dummy `Practitioner` untuk environment sandbox. Beberapa contoh yang berguna untuk testing:

- NIK `7209061211900001`, nama `dr. Alexander`, gender `male`, birthDate `1994-01-01`, IHS `10009880728`
- NIK `3217040109800006`, nama `dr. Olivia Kirana, Sp.OG`, gender `female`, birthDate `1984-06-06`, IHS `10002074224`
- NIK `3578083008700010`, nama `apt. Aditya Pradhana, S.Farm.`, gender `female`, birthDate `1980-10-10`, IHS `10001915884`

Contoh memakai data dummy sandbox:

```ts
const result = await client.practitioner.search({
  identifier: "https://fhir.kemkes.go.id/id/nik|7209061211900001",
});

const practitioner = result.entry?.[0]?.resource;
```

## Catatan Validasi

- `identifier` saat ini divalidasi dengan format `https://fhir.kemkes.go.id/id/nik|...`
- `gender` untuk mode search dibatasi ke `male` atau `female`
- `birthdate` mengikuti format `YYYY`, `YYYY-MM`, atau `YYYY-MM-DD`
