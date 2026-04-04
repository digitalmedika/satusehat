# Laboratory Panel Builder

## Ringkasan

Helper `createLaboratoryPanelBuilder` membantu alur panel laboratorium dengan komponen:

- `ServiceRequest`
- `Specimen`
- banyak `Observation`
- satu `DiagnosticReport`

Helper ini cocok untuk use case seperti hematologi lengkap, kimia klinik, atau panel pemeriksaan lain yang menghasilkan beberapa `Observation` lalu dirangkum di satu `DiagnosticReport`.

## Contoh Dasar

```ts
import { createLaboratoryPanelBuilder } from "satusehat";

const builder = createLaboratoryPanelBuilder({
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  encounter: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
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
  diagnosticReport: {
    status: "final",
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
  observationDefaults: {
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "laboratory",
            display: "Laboratory",
          },
        ],
      },
    ],
  },
})
  .addObservation("hemoglobin", {
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
  })
  .setObservationValueQuantity("hemoglobin", {
    value: 13.5,
    unit: "g/dL",
    system: "http://unitsofmeasure.org",
    code: "g/dL",
  })
  .addObservation("hematocrit", {
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "4544-3",
          display: "Hematocrit",
        },
      ],
    },
  })
  .setObservationValueQuantity("hematocrit", {
    value: 41,
    unit: "%",
    system: "http://unitsofmeasure.org",
    code: "%",
  });

const serviceRequest = await client.serviceRequest.create(builder.buildServiceRequest());
const specimen = await client.specimen.create(
  builder.buildSpecimen({
    serviceRequestId: serviceRequest.id,
  }),
);

const observationEntries = builder.buildObservationEntries({
  serviceRequestId: serviceRequest.id,
  specimenId: specimen.id,
});

const createdObservations = [];

for (const entry of observationEntries) {
  const createdObservation = await client.observation.create(entry.body);
  createdObservations.push({
    key: entry.key,
    id: createdObservation.id,
  });
}

const diagnosticReport = await client.diagnosticReport.create(
  builder.buildDiagnosticReport({
    serviceRequestId: serviceRequest.id,
    specimenId: specimen.id,
    resultIds: createdObservations.map((item) => item.id),
  }),
);
```

## Helper yang Tersedia

- `setSubject`
- `setEncounter`
- `mergeServiceRequest`
- `mergeSpecimen`
- `mergeDiagnosticReport`
- `setObservationDefaults`
- `addObservation`
- `mergeObservation`
- `setObservationValueQuantity`
- `addObservationNote`
- `addServiceRequestNote`
- `addSpecimenNote`
- `setSpecimenCollection`
- `addSpecimenContainer`
- `listObservationKeys`
- `buildServiceRequest`
- `buildSpecimen`
- `buildObservation`
- `buildObservationEntries`
- `buildObservations`
- `buildDiagnosticReport`

## Catatan

- `addObservation(key, ...)` memakai key stabil supaya Anda bisa melacak hasil create per item panel.
- `buildObservationEntries(...)` cocok untuk loop create yang butuh pasangan `key` dan `body`.
- `buildDiagnosticReport(...)` menerima `resultIds` atau `resultReferences` untuk menghubungkan semua hasil `Observation` yang sudah dibuat.
