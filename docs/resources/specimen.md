# Specimen

## Ringkasan

Resource `specimen` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR Specimen](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/specimen/)
- [ReST API Specimen](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/specimen/)

## Search

Saat ini query yang dimodelkan adalah:

- `subject`
- `collector`
- `collected`

Mode search yang didukung:

- `subject`
- `subject` + `collector`
- `subject` + `collected`

```ts
const result = await client.specimen.search({
  subject: "100000030009",
  collector: "N10000001",
});
```

Field `collected` divalidasi dengan format tanggal `YYYY-MM-DD`.

## Get By ID

```ts
const specimen = await client.specimen.getById({
  id: "5edd0663-093f-40f9-bf04-0c103fd6ec32",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- `status`
- `type`
- `subject`

Field opsional yang saat ini dimodelkan:

- `identifier`
- `accessionIdentifier`
- `receivedTime`
- `parent`
- `request`
- `collection`
- `processing`
- `container`
- `condition`
- `note`
- `extension`

Contoh create:

```ts
const specimen = await client.specimen.create({
  resourceType: "Specimen",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/specimen/10000004",
      use: "official",
      value: "SP-0001",
    },
  ],
  status: "available",
  type: {
    coding: [
      {
        system: "http://snomed.info/sct",
        code: "119364003",
        display: "Serum specimen",
      },
    ],
  },
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  request: [
    {
      reference: "ServiceRequest/6694e8c8-052a-4ea6-8072-157b6d47ca08",
    },
  ],
  collection: {
    collector: {
      reference: "Practitioner/N10000001",
      display: "Dokter Bronsig",
    },
    collectedDateTime: "2024-04-01T03:00:00+00:00",
  },
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `Specimen` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.specimen.patch({
  id: "5edd0663-093f-40f9-bf04-0c103fd6ec32",
  body: [
    {
      op: "replace",
      path: "/status",
      value: "unavailable",
    },
  ],
});
```

## Catatan

- Search `Specimen` di SDK ini mengikuti mode resmi SATUSEHAT: `subject`, `subject + collector`, atau `subject + collected`.
- Schema difokuskan pada field yang umum dipakai untuk alur laboratorium dan pemeriksaan berbasis `ServiceRequest` lalu `Observation`.
- Jika nanti dibutuhkan, kita bisa tambah helper atau pengetatan schema untuk use case tertentu seperti rujukan spesimen atau panel lab yang lebih detail.
