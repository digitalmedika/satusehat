# PractitionerRole

## Ringkasan

Resource `practitionerRole` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [ReST API PractitionerRole](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/practitioner-role/)

## Search

SATUSEHAT mendokumentasikan bahwa parameter `practitioner` wajib diisi untuk pencarian `PractitionerRole`. Parameter `organization` bersifat opsional sebagai filter tambahan.

### Search by practitioner

```ts
const result = await client.practitionerRole.search({
  practitioner: "10009880728",
});
```

### Search by practitioner and organization

```ts
const result = await client.practitionerRole.search({
  practitioner: "10009880728",
  organization: "6694e8c8-052a-4ea6-8072-157b6d47ca08",
});
```

## Get By ID

```ts
const practitionerRole = await client.practitionerRole.getById({
  id: "7a44b421-677e-45a1-b7c0-5249264a3189",
});
```

## Create

Body `PractitionerRole` di SATUSEHAT mengikuti format FHIR. SDK saat ini memodelkan subset field yang paling umum dipakai:

- `resourceType`
- `identifier`
- `active`
- `period`
- `practitioner`
- `organization`
- `code`
- `specialty`
- `location`
- `healthcareService`
- `telecom`
- `availableTime`
- `notAvailable`
- `availabilityExceptions`
- `endpoint`

Contoh create:

```ts
const practitionerRole = await client.practitionerRole.create({
  resourceType: "PractitionerRole",
  active: true,
  practitioner: {
    reference: "Practitioner/10009880728",
    display: "dr. Alexander",
  },
  organization: {
    reference: "Organization/6694e8c8-052a-4ea6-8072-157b6d47ca08",
    display: "RS SATUSEHAT",
  },
  code: [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/practitioner-role",
          code: "doctor",
          display: "Doctor",
        },
      ],
    },
  ],
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `PractitionerRole` yang utuh sesuai schema SDK saat ini.

```ts
const updated = await client.practitionerRole.update({
  id: "7a44b421-677e-45a1-b7c0-5249264a3189",
  body: {
    resourceType: "PractitionerRole",
    practitioner: {
      reference: "Practitioner/10009880728",
      display: "dr. Alexander",
    },
    organization: {
      reference: "Organization/6694e8c8-052a-4ea6-8072-157b6d47ca08",
      display: "RS SATUSEHAT",
    },
  },
});
```

## Patch

Dokumentasi resmi SATUSEHAT menyebutkan bahwa `PATCH /PractitionerRole/:id` saat ini menggunakan JSON patch dengan operasi `replace` saja.

```ts
const patched = await client.practitionerRole.patch({
  id: "7a44b421-677e-45a1-b7c0-5249264a3189",
  body: [
    {
      op: "replace",
      path: "/availabilityExceptions",
      value: "Libur nasional",
    },
  ],
});
```

## Catatan Penting dari Dokumentasi Resmi

- Parameter search `practitioner` bersifat wajib.
- Parameter search `organization` hanya dipakai bila ingin mempersempit hasil pada fasyankes tertentu.
- Dokumentasi resmi mencontohkan payload patch dengan format `[{ op, path, value }]` dan saat ini operasi yang tersedia hanya `replace`.
- Referensi `PractitionerRole.practitioner` menggunakan format `Practitioner/{practitioner-ihs-number}`. Nilai `practitioner-ihs-number` bisa didapat dari hasil lookup resource `Practitioner`.

## Catatan

- Schema `PractitionerRole` yang dimodelkan SDK saat ini adalah subset yang paling umum untuk relasi nakes ke organisasi/lokasi.
- Bila nanti diperlukan, kita masih bisa memperluas field FHIR lain yang lebih spesifik tanpa mengubah pola client yang sekarang.
