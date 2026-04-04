# DiagnosticReport

## Ringkasan

Resource `diagnosticReport` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [ReST API DiagnosticReport](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/diagnostic-report/)

## Search

Saat ini query yang dimodelkan adalah:

- `subject`
- `encounter`
- `specimen`

Mode search yang didukung:

- `subject` dan/atau `encounter`
- `subject` + `specimen`

```ts
const result = await client.diagnosticReport.search({
  subject: "100000030009",
  specimen: "5edd0663-093f-40f9-bf04-0c103fd6ec32",
});
```

## Get By ID

```ts
const diagnosticReport = await client.diagnosticReport.getById({
  id: "dr-1",
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
- `category`
- `effectiveDateTime`
- `effectivePeriod`
- `effectiveInstant`
- `issued`
- `performer`
- `resultsInterpreter`
- `specimen`
- `result`
- `imagingStudy`
- `media`
- `conclusion`
- `conclusionCode`
- `presentedForm`

Contoh create:

```ts
const diagnosticReport = await client.diagnosticReport.create({
  resourceType: "DiagnosticReport",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/diagnostic/10000004/lab",
      use: "official",
      value: "DR-0001",
    },
  ],
  basedOn: [
    {
      reference: "ServiceRequest/6694e8c8-052a-4ea6-8072-157b6d47ca08",
    },
  ],
  status: "final",
  category: [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/v2-0074",
          code: "LAB",
          display: "Laboratory",
        },
      ],
    },
  ],
  code: {
    coding: [
      {
        system: "http://loinc.org",
        code: "58410-2",
        display: "Complete blood count panel",
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
  specimen: [
    {
      reference: "Specimen/5edd0663-093f-40f9-bf04-0c103fd6ec32",
    },
  ],
  result: [
    {
      reference: "Observation/af8ac2e3-0e72-45d7-ab8a-332f52fccbcd",
    },
  ],
  conclusion: "Hasil pemeriksaan hematologi lengkap dalam batas normal.",
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `DiagnosticReport` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.diagnosticReport.patch({
  id: "dr-1",
  body: [
    {
      op: "replace",
      path: "/conclusion",
      value: "Kesimpulan diperbarui.",
    },
  ],
});
```

## Catatan

- Search `DiagnosticReport` di SDK ini mengikuti mode resmi SATUSEHAT: `subject` dan/atau `encounter`, atau `subject + specimen`.
- Schema ini difokuskan untuk alur umum hasil pemeriksaan yang menghubungkan `ServiceRequest`, `Specimen`, dan `Observation`.
