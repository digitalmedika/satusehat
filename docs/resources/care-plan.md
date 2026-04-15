# CarePlan

## Ringkasan

Resource `carePlan` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR CarePlan](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/care-plan/)

## Search

Saat ini query yang dimodelkan adalah:

- `patient`
- `subject`
- `encounter`

Mode search yang didukung:

- `patient` dan/atau `encounter`
- `subject` dan/atau `encounter`
- `encounter` saja

Parameter `subject` disediakan sebagai alias kompatibilitas dan akan dinormalisasi menjadi `patient` saat request dikirim.

```ts
const result = await client.carePlan.search({
  patient: "100000030009",
  encounter: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
});
```

## Get By ID

```ts
const carePlan = await client.carePlan.getById({
  id: "4aa9ce4d-0712-4cfd-b7a0-396f9384f95f",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- `status`
- `intent`
- `category`
- `subject`

Field opsional yang saat ini dimodelkan:

- `identifier`
- `instantiatesCanonical`
- `instantiatesUri`
- `basedOn`
- `replaces`
- `partOf`
- `title`
- `description`
- `encounter`
- `period`
- `created`
- `author`
- `contributor`
- `careTeam`
- `addresses`
- `supportingInfo`
- `goal`
- `activity`
- `note`

Jika `activity` diisi, tiap item activity saat ini harus memiliki salah satu dari:

- `reference`
- `detail`

Jika `activity.detail` diisi, maka `activity.detail.status` wajib ada.

Contoh create:

```ts
const carePlan = await client.carePlan.create({
  resourceType: "CarePlan",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/careplan/1000004",
      use: "official",
      value: "98457729",
    },
  ],
  status: "draft",
  intent: "proposal",
  category: [
    {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: "736372004",
          display: "Discharge care plan",
        },
      ],
    },
  ],
  title: "Rencana Tindak Lanjut",
  description: "Kontrol ulang 3 hari lagi atau bila keluhan memberat.",
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  encounter: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
  },
  created: "2024-04-01T01:15:00+00:00",
  author: {
    reference: "Practitioner/N10000001",
    display: "Dokter Bronsig",
  },
  activity: [
    {
      detail: {
        status: "not-started",
        description: "Kontrol ulang 3 hari lagi atau bila keluhan memberat.",
      },
    },
  ],
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `CarePlan` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.carePlan.patch({
  id: "4aa9ce4d-0712-4cfd-b7a0-396f9384f95f",
  body: [
    {
      op: "replace",
      path: "/status",
      value: "active",
    },
  ],
});
```

## Catatan

- SATUSEHAT mensyaratkan `category` untuk use case CarePlan, jadi schema SDK menandainya sebagai field wajib.
- Untuk pencarian, SDK menormalisasi `subject` menjadi `patient` sebelum request dikirim.
