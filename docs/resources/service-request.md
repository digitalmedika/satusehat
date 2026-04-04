# ServiceRequest

## Ringkasan

Resource `serviceRequest` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [ReST API ServiceRequest](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/service-request/)

## Search

Saat ini query yang dimodelkan adalah:

- `subject`
- `encounter`
- `identifier`

Mode search yang didukung:

- `subject` dan/atau `encounter`
- `subject` + `identifier`

Format `identifier` yang dimodelkan:

`http://sys-ids.kemkes.go.id/img-accession-no/{subject}|{accession_number}`

```ts
const result = await client.serviceRequest.search({
  subject: "100000030009",
  identifier: "http://sys-ids.kemkes.go.id/img-accession-no/100000030009|CR.221005.002",
});
```

## Get By ID

```ts
const serviceRequest = await client.serviceRequest.getById({
  id: "6694e8c8-052a-4ea6-8072-157b6d47ca08",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- `status`
- `intent`
- `code`
- `subject`

Field opsional yang saat ini dimodelkan:

- `identifier`
- `instantiatesCanonical`
- `instantiatesUri`
- `basedOn`
- `replaces`
- `requisition`
- `category`
- `priority`
- `doNotPerform`
- `orderDetail`
- `quantityQuantity`
- `quantityRatio`
- `quantityRange`
- `encounter`
- `occurrenceDateTime`
- `occurrencePeriod`
- `asNeededBoolean`
- `asNeededCodeableConcept`
- `authoredOn`
- `requester`
- `performerType`
- `performer`
- `locationCode`
- `locationReference`
- `reasonCode`
- `reasonReference`
- `insurance`
- `supportingInfo`
- `specimen`
- `bodySite`
- `note`
- `patientInstruction`
- `relevantHistory`

Contoh create:

```ts
const serviceRequest = await client.serviceRequest.create({
  resourceType: "ServiceRequest",
  status: "active",
  intent: "order",
  code: {
    coding: [
      {
        system: "http://loinc.org",
        code: "58410-2",
        display: "Complete blood count (hemogram) panel - Blood by Automated count",
      },
    ],
  },
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  encounter: {
    reference: "Encounter/6694e8c8-052a-4ea6-8072-157b6d47ca08",
  },
  authoredOn: "2024-04-01T02:45:00+00:00",
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `ServiceRequest` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.serviceRequest.patch({
  id: "6694e8c8-052a-4ea6-8072-157b6d47ca08",
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

- Search `ServiceRequest` di SDK ini mengikuti parameter resmi SATUSEHAT yaitu `subject`, `encounter`, dan `identifier`.
- Resource ini menjadi pasangan alami untuk `Observation` dan sebagian `MedicationRequest`/alur order pelayanan. Kalau nanti dibutuhkan, kita bisa tambah helper use case lab atau imaging di atas schema ini.
