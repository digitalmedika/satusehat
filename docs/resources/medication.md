# Medication

## Ringkasan

Resource `medication` saat ini mendukung:

- `getById`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR Medication](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/medication/)
- [ReST API Medication](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/medication/)

## Get By ID

```ts
const medication = await client.medication.getById({
  id: "4a6d884b-8d4b-4e16-b192-6416502d0999",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- minimal 1 `extension` untuk `MedicationType`

Field opsional yang saat ini dimodelkan:

- `identifier`
- `code`
- `status`
- `manufacturer`
- `form`
- `amount`
- `ingredient`
- `batch`

Contoh create:

```ts
const medication = await client.medication.create({
  resourceType: "Medication",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/medication/10000004",
      use: "official",
      value: "MED-0001",
    },
  ],
  code: {
    coding: [
      {
        system: "http://sys-ids.kemkes.go.id/kfa",
        code: "93001002",
        display: "Obat Anti Tuberculosis Tablet",
      },
    ],
  },
  status: "active",
  extension: [
    {
      url: "https://fhir.kemkes.go.id/r4/StructureDefinition/MedicationType",
      valueCodeableConcept: {
        coding: [
          {
            system: "http://terminology.kemkes.go.id/CodeSystem/medication-type",
            code: "NC",
            display: "Non-compound",
          },
        ],
      },
    },
  ],
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `Medication` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.medication.patch({
  id: "4a6d884b-8d4b-4e16-b192-6416502d0999",
  body: [
    {
      op: "replace",
      path: "/status",
      value: "inactive",
    },
  ],
});
```

## Catatan

- Dokumentasi katalog SATUSEHAT yang saya cek saat ini menampilkan `GET /Medication/:id`, `POST`, `PUT`, dan `PATCH`, jadi SDK belum mengekspos method `search` untuk `Medication`.
- Schema saat ini menutupi kebutuhan awal untuk obat non-racikan dan racikan sederhana. Kalau nanti dibutuhkan, kita bisa perluas validasi ingredient dan extension untuk use case farmasi yang lebih detail.
