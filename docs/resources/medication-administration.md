# MedicationAdministration

## Ringkasan

Resource `medicationAdministration` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR MedicationAdministration](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/medication-administration/)
- [Interoperabilitas IGD - Pengiriman Data Pemberian Obat](https://satusehat.kemkes.go.id/platform/docs/id/interoperability/igd/)

## Search

Saat ini query yang dimodelkan adalah:

- `subject`
- `context`

Minimal salah satu query di atas harus diisi.

```ts
const result = await client.medicationAdministration.search({
  subject: "100000030009",
  context: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
});
```

## Get By ID

```ts
const medicationAdministration = await client.medicationAdministration.getById({
  id: "86da7eb8-b3af-4f78-bdd2-3a546df992e1",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- `status`
- `subject`
- salah satu dari `medicationCodeableConcept` atau `medicationReference`
- salah satu dari `effectiveDateTime` atau `effectivePeriod`

Field opsional yang saat ini dimodelkan:

- `identifier`
- `instantiates`
- `partOf`
- `statusReason`
- `category`
- `context`
- `supportingInformation`
- `performer`
- `reasonCode`
- `reasonReference`
- `request`
- `device`
- `note`
- `dosage`
- `eventHistory`

Contoh create:

```ts
const medicationAdministration = await client.medicationAdministration.create({
  resourceType: "MedicationAdministration",
  identifier: [
    {
      use: "official",
      value: "MEDADMIN-001",
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
  effectiveDateTime: "2024-04-01T02:30:00+00:00",
  request: {
    reference: "MedicationRequest/cf92db3e-a044-4e15-83fb-b7ec3a30ba76",
  },
  dosage: {
    text: "Berikan 1 tablet sesudah makan.",
    dose: {
      value: 1,
      unit: "TAB",
      system: "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
      code: "TAB",
    },
  },
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `MedicationAdministration` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.medicationAdministration.patch({
  id: "86da7eb8-b3af-4f78-bdd2-3a546df992e1",
  body: [
    {
      op: "replace",
      path: "/status",
      value: "stopped",
    },
  ],
});
```

## Catatan

- Resource ini dimodelkan untuk alur pemberian obat dan direlasikan dengan `Medication`, `MedicationRequest`, `Patient`, dan `Encounter`.
- Untuk search, SDK saat ini memodelkan query `subject` dan `context` agar mengikuti pola dokumentasi SATUSEHAT pada resource pemberian/pengeluaran obat.
