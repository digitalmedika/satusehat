# MedicationRequest

## Ringkasan

Resource `medicationRequest` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR MedicationRequest](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/medication-request/)
- [ReST API MedicationRequest](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/medication-request/)

## Search

Saat ini query yang dimodelkan adalah:

- `subject`
- `encounter`

Minimal salah satu query di atas harus diisi.

```ts
const result = await client.medicationRequest.search({
  subject: "100000030009",
  encounter: "2823ed1d-3e3e-434e-9a5b-9c579d192787",
});
```

## Get By ID

```ts
const medicationRequest = await client.medicationRequest.getById({
  id: "cf92db3e-a044-4e15-83fb-b7ec3a30ba76",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- `status`
- `intent`
- `medicationReference`
- `subject`

Field opsional yang saat ini dimodelkan:

- `identifier`
- `basedOn`
- `statusReason`
- `category`
- `priority`
- `reportedBoolean`
- `encounter`
- `authoredOn`
- `requester`
- `performer`
- `performerType`
- `recorder`
- `reasonCode`
- `reasonReference`
- `insurance`
- `note`
- `dosageInstruction`
- `dispenseRequest`
- `substitution`

Contoh create:

```ts
const medicationRequest = await client.medicationRequest.create({
  resourceType: "MedicationRequest",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/prescription/10000004/rme",
      use: "official",
      value: "RX-0001",
    },
  ],
  status: "active",
  intent: "order",
  medicationReference: {
    reference: "Medication/8f299a19-5887-4b8e-90a2-c2c15ecbe1d1",
    display: "Obat Anti Tuberculosis",
  },
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  encounter: {
    reference: "Encounter/2823ed1d-3e3e-434e-9a5b-9c579d192787",
  },
  authoredOn: "2024-04-01T02:10:00+00:00",
  requester: {
    reference: "Practitioner/N10000001",
    display: "Dokter Bronsig",
  },
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `MedicationRequest` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.medicationRequest.patch({
  id: "cf92db3e-a044-4e15-83fb-b7ec3a30ba76",
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

- Search `MedicationRequest` di SDK ini mengikuti parameter resmi SATUSEHAT yaitu `subject` dan `encounter`.
- Resource ini biasanya berpasangan dengan `Medication`. SDK saat ini baru memodelkan sisi `MedicationRequest` dulu agar alur resep bisa mulai dipakai, dan `Medication` bisa kita tambahkan berikutnya.
