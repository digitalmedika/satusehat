# ImagingStudy

## Ringkasan

Resource `imagingStudy` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR ImagingStudy](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/imaging-study/)
- [ReST API ImagingStudy](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/imaging-study/)

## Search

Saat ini query yang dimodelkan adalah:

- `identifier`

Field `identifier` wajib mengikuti format accession number SATUSEHAT:

```ts
const result = await client.imagingStudy.search({
  identifier: "http://sys-ids.kemkes.go.id/acsn/100000030009|CR.221005.002",
});
```

## Get By ID

```ts
const imagingStudy = await client.imagingStudy.getById({
  id: "8031179c-cd31-475e-8f94-feeb4c618c6b",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- minimal 1 `identifier`
- `status`
- minimal 1 `modality`
- `subject`
- minimal 1 `basedOn`

Field opsional yang saat ini dimodelkan:

- `encounter`
- `started`
- `referrer`
- `interpreter`
- `endpoint`
- `numberOfSeries`
- `numberOfInstances`
- `procedureReference`
- `procedureCode`
- `location`
- `reasonCode`
- `reasonReference`
- `note`
- `description`
- `series`

Contoh create:

```ts
const imagingStudy = await client.imagingStudy.create({
  resourceType: "ImagingStudy",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/acsn/10000004",
      use: "usual",
      value: "CR.221005.002",
    },
  ],
  status: "available",
  modality: [
    {
      system: "http://dicom.nema.org/resources/ontology/DCM",
      code: "CR",
      display: "Computed Radiography",
    },
  ],
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  basedOn: [
    {
      reference: "ServiceRequest/83218f28-0027-4d3d-9981-94517f14223e",
    },
  ],
  description: "Pemeriksaan radiografi thorax AP/PA.",
  series: [
    {
      uid: "1.2.48.670589.30.39.0.1.966169786508.1664950724077.1",
      modality: {
        system: "http://dicom.nema.org/resources/ontology/DCM",
        code: "CR",
      },
      instance: [
        {
          uid: "2.16.380.31256.1.2449191199178232.20210610114930875.1.1",
          sopClass: {
            system: "urn:ietf:rfc:3986",
            code: "urn:oid:1.2.840.10008.5.1.4.1.1.1",
          },
        },
      ],
    },
  ],
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `ImagingStudy` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.imagingStudy.patch({
  id: "8031179c-cd31-475e-8f94-feeb4c618c6b",
  body: [
    {
      op: "replace",
      path: "/description",
      value: "Deskripsi radiologi diperbarui.",
    },
  ],
});
```

## Catatan

- Search `ImagingStudy` di SDK ini saat ini mengikuti parameter resmi SATUSEHAT yang terdokumentasi, yaitu `identifier`.
- Schema memodelkan field yang paling relevan untuk alur radiologi/DICOM router saat ini, dan masih bisa kita perluas bila nanti perlu elemen ImagingStudy yang lebih detail.
