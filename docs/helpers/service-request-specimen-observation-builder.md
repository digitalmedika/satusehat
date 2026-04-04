# ServiceRequest -> Specimen -> Observation Builder

## Ringkasan

Helper `createServiceRequestSpecimenObservationBuilder` membantu menyusun payload berantai untuk alur:

- `ServiceRequest`
- `Specimen`
- `Observation`

Builder ini cocok saat resource dibuat bertahap. `ServiceRequest` biasanya dibuat lebih dulu, lalu ID hasil create dipakai untuk mengisi relasi pada `Specimen` dan `Observation`.

## Contoh Dasar

```ts
import { createServiceRequestSpecimenObservationBuilder } from "satusehat";

const builder = createServiceRequestSpecimenObservationBuilder({
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  encounter: {
    reference: "Encounter/6694e8c8-052a-4ea6-8072-157b6d47ca08",
  },
  serviceRequest: {
    status: "active",
    intent: "order",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "58410-2",
          display: "Complete blood count panel",
        },
      ],
    },
  },
  specimen: {
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
  },
  observation: {
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "718-7",
          display: "Hemoglobin",
        },
      ],
    },
  },
})
  .mergeServiceRequest({
    authoredOn: "2024-04-01T02:45:00+00:00",
  })
  .setSpecimenCollection({
    collector: {
      reference: "Practitioner/N10000001",
    },
    collectedDateTime: "2024-04-01T03:00:00+00:00",
  })
  .setObservationValueQuantity({
    value: 13.5,
    unit: "g/dL",
    system: "http://unitsofmeasure.org",
    code: "g/dL",
  });

const serviceRequestBody = builder.buildServiceRequest();
const createdServiceRequest = await client.serviceRequest.create(serviceRequestBody);

const specimenBody = builder.buildSpecimen({
  serviceRequestId: createdServiceRequest.id,
});
const createdSpecimen = await client.specimen.create(specimenBody);

const observationBody = builder.buildObservation({
  serviceRequestId: createdServiceRequest.id,
  specimenId: createdSpecimen.id,
});
const observation = await client.observation.create(observationBody);
```

## Auto-Link yang Dibantu

- `buildServiceRequest()` mengembalikan payload `ServiceRequest` dengan `subject` dan `encounter` bersama.
- `buildSpecimen({ serviceRequestId })` otomatis menambahkan `Specimen.request = [{ reference: "ServiceRequest/{id}" }]`.
- `buildObservation({ serviceRequestId, specimenId })` otomatis menambahkan:
  - `Observation.basedOn = [{ reference: "ServiceRequest/{id}" }]`
  - `Observation.specimen = { reference: "Specimen/{id}" }`

Kalau Anda sudah punya object reference lengkap, bisa pakai `serviceRequestReference` atau `specimenReference` sebagai pengganti ID.

## Helper yang Tersedia

- `setSubject`
- `setEncounter`
- `mergeServiceRequest`
- `mergeSpecimen`
- `mergeObservation`
- `addServiceRequestNote`
- `addSpecimenNote`
- `addObservationNote`
- `setSpecimenCollection`
- `addSpecimenContainer`
- `setObservationValueQuantity`
- `buildServiceRequest`
- `buildSpecimen`
- `buildObservation`

## Catatan

- Builder ini tidak melakukan create ke API; tugasnya hanya menyusun payload yang sudah tervalidasi schema SDK.
- Jika satu `ServiceRequest` menghasilkan beberapa `Observation`, Anda bisa memanggil `buildObservation(...)` berkali-kali dengan ID yang sama dan mengubah draft lewat `mergeObservation(...)` di antara pemanggilan.
