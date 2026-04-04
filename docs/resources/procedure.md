# Procedure

## Ringkasan

Resource `procedure` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR Procedure](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/procedure/)
- [ReST API Procedure](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/procedure/)

## Search

Saat ini query yang dimodelkan adalah:

- `subject`
- `encounter`

Minimal salah satu query di atas harus diisi.

```ts
const result = await client.procedure.search({
  subject: "100000030009",
  encounter: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
});
```

## Get By ID

```ts
const procedure = await client.procedure.getById({
  id: "6c9cb16e-7775-4c80-b5b2-3d04901df1f3",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- `status`
- `code`
- `subject`
- `encounter`

Field opsional yang saat ini dimodelkan:

- `identifier`
- `basedOn`
- `partOf`
- `statusReason`
- `category`
- `performedDateTime`
- `performedPeriod`
- `recorder`
- `asserter`
- `performer`
- `location`
- `reasonCode`
- `reasonReference`
- `bodySite`
- `outcome`
- `report`
- `complication`
- `complicationDetail`
- `followUp`
- `note`
- `focalDevice`
- `usedReference`
- `usedCode`

Contoh create:

```ts
const procedure = await client.procedure.create({
  resourceType: "Procedure",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/procedure/10000004",
      use: "official",
      value: "PROC-001",
    },
  ],
  status: "completed",
  code: {
    coding: [
      {
        system: "http://hl7.org/fhir/sid/icd-9-cm",
        code: "87.44",
        display: "Routine chest x-ray, so described",
      },
    ],
  },
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  encounter: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
  },
  performedDateTime: "2024-04-01T02:00:00+00:00",
  performer: [
    {
      actor: {
        reference: "Practitioner/N10000001",
        display: "Dokter Bronsig",
      },
    },
  ],
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `Procedure` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.procedure.patch({
  id: "6c9cb16e-7775-4c80-b5b2-3d04901df1f3",
  body: [
    {
      op: "replace",
      path: "/status",
      value: "completed",
    },
  ],
});
```

## Catatan

- Search `Procedure` di SDK ini mengikuti parameter resmi SATUSEHAT yaitu `subject` dan `encounter`.
- Schema saat ini fokus pada use case tindakan klinis umum. Jika nanti kita butuh perluasan untuk device-centric procedure atau follow-up detail per modul layanan, kita bisa tambah bertahap.
