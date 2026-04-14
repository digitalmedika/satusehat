# MedicationDispense

## Ringkasan

Resource `medicationDispense` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [ReST API MedicationDispense](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/medication-dispense/)

## Search

SDK memodelkan query berikut:

- `subject`
- `context`
- `prescription`

Aturan validasi yang diterapkan:

- Minimal isi salah satu dari `subject`, `context`, atau `prescription`
- Jika memakai `context`, wajib sertakan `subject`
- Jika memakai `prescription`, wajib sertakan `subject`

```ts
const result = await client.medicationDispense.search({
  subject: "100000030009",
  context: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
});
```

## Get By ID

```ts
const medicationDispense = await client.medicationDispense.getById({
  id: "a105b589-d571-4be6-bb0e-98b4be891e14",
});
```

## Create

Field wajib minimum yang saat ini dimodelkan:

- `resourceType`
- `status`
- `subject`
- salah satu dari `medicationCodeableConcept` atau `medicationReference`

Contoh create:

```ts
const medicationDispense = await client.medicationDispense.create({
  resourceType: "MedicationDispense",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/prescription/10000004",
      use: "official",
      value: "RX-0001",
    },
    {
      system: "http://sys-ids.kemkes.go.id/prescription-item/10000004",
      use: "official",
      value: "RX-ITEM-0001",
    },
  ],
  status: "completed",
  medicationReference: {
    reference: "Medication/8f299a19-5887-4b8e-90a2-c2c15ecbe1d1",
    display: "Paracetamol 500 mg tablet",
  },
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  context: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
  },
  authorizingPrescription: [
    {
      reference: "MedicationRequest/cf92db3e-a044-4e15-83fb-b7ec3a30ba76",
    },
  ],
  quantity: {
    value: 30,
    unit: "TAB",
    system: "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
    code: "TAB",
  },
  whenHandedOver: "2024-04-01T02:30:00+00:00",
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `MedicationDispense` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.medicationDispense.patch({
  id: "a105b589-d571-4be6-bb0e-98b4be891e14",
  body: [
    {
      op: "replace",
      path: "/status",
      value: "cancelled",
    },
  ],
});
```
