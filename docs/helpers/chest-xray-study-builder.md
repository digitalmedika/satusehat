# Chest X-Ray Study Builder

## Ringkasan

Helper `createChestXRayStudyBuilder` adalah preset radiologi di atas `createServiceRequestImagingStudyDiagnosticReportBuilder` untuk workflow foto thoraks / chest X-ray.

Preset ini sudah menyiapkan:

- kode `ServiceRequest` chest X-ray LOINC `42272-5`
- `ImagingStudy.modality` default `CR`
- `ImagingStudy.identifier` dari `organizationId` dan `accessionNumber`
- kategori `DiagnosticReport` radiologi (`RAD`)
- kode `DiagnosticReport` sama dengan order radiologi

## Contoh Dasar

```ts
import { createChestXRayStudyBuilder } from "satusehat";

const builder = createChestXRayStudyBuilder({
  subject: {
    reference: "Patient/100000030009",
  },
  encounter: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
  },
  organizationId: "10000004",
  accessionNumber: "XR.240401.001",
});

const serviceRequest = await client.serviceRequest.create(builder.buildServiceRequest());

const imagingStudy = await client.imagingStudy.create(
  builder.buildImagingStudy({
    serviceRequestId: serviceRequest.id,
  }),
);

const diagnosticReport = await client.diagnosticReport.create(
  builder.buildDiagnosticReport({
    serviceRequestId: serviceRequest.id,
    imagingStudyId: imagingStudy.id,
  }),
);
```

## Input Penting

- `organizationId`
  Dipakai untuk membentuk `ImagingStudy.identifier[0].system` menjadi `http://sys-ids.kemkes.go.id/acsn/{organizationId}`.
- `accessionNumber`
  Dipakai untuk mengisi `ImagingStudy.identifier[0].value`.
- `identifierUse`
  Opsional, default `usual`.

## Override Default

Anda tetap bisa override draft default jika perlu:

```ts
const builder = createChestXRayStudyBuilder({
  subject: {
    reference: "Patient/100000030009",
  },
  encounter: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
  },
  organizationId: "10000004",
  accessionNumber: "XR.240401.002",
  imagingStudy: {
    description: "Portable AP chest radiograph",
  },
  diagnosticReport: {
    conclusion: "Tidak tampak infiltrat aktif.",
  },
});
```

## Catatan

- Helper ini mengembalikan `ServiceRequestImagingStudyDiagnosticReportBuilder`, jadi helper lanjutan seperti `addImagingStudySeries(...)`, `addImagingStudyNote(...)`, atau `mergeDiagnosticReport(...)` tetap bisa dipakai.
- Default LOINC chest X-ray yang dipakai di preset ini adalah `42272-5` untuk `XR Chest PA and Lateral`, dan kategori `DiagnosticReport` memakai kode HL7 `RAD` untuk radiologi.
