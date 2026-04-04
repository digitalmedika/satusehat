# @digitalmedika/satusehat

Type-safe TypeScript SDK untuk SATUSEHAT API.

SDK ini dirancang untuk:

- validasi request dan response dengan runtime schema
- type inference end-to-end di TypeScript
- OAuth2 client credentials
- token cache in-memory atau file-based
- ergonomi SDK yang cocok untuk backend service dan internal tooling

## Helpers

Helper builder yang saat ini tersedia:

- `createCompleteBloodCountPanelBuilder`
- `createLaboratoryPanelBuilder`
- `createOrganizationBuilder`
- `createServiceRequestSpecimenObservationBuilder`

## Installation

```bash
bun add @digitalmedika/satusehat
```

Untuk development library ini sendiri:

```bash
bun install
```

## Quick Start

```ts
import { createSatuSehatClientFromEnv } from "@digitalmedika/satusehat";

const client = createSatuSehatClientFromEnv();

const patient = await client.patient.search({
  identifier: "https://fhir.kemkes.go.id/id/nik|9271060312000001",
});
```

## Environment Variables

Salin template dari [.env.example](./.env.example).

Variable utama:

- `SATUSEHAT_ENV`
- `SATUSEHAT_BASE_URL`
- `SATUSEHAT_AUTH_BASE_URL`
- `SATUSEHAT_DICOM_BASE_URL`
- `SATUSEHAT_CLIENT_ID`
- `SATUSEHAT_CLIENT_SECRET`
- `SATUSEHAT_TOKEN_CACHE_FILE`

## Available Resources

Saat ini resource yang sudah tersedia:

- `allergyIntolerance`
- `condition`
- `dicomRouter`
- `diagnosticReport`
- `encounter`
- `observation`
- `procedure`
- `medication`
- `medicationRequest`
- `serviceRequest`
- `specimen`
- `patient`
- `organization`
- `location`
- `practitioner`
- `practitionerRole`

## Token Handling

Secara default SDK mendukung:

- token provider berbasis OAuth2 client credentials
- cache token in-memory
- file-based token store opsional untuk local testing/internal tools
- refresh otomatis saat token expired atau mendekati expired
- retry sekali saat menerima `401` jika token bisa di-invalidasi

## Development

```bash
bun run typecheck
bun test
bun run build
```

Smoke test ke SATUSEHAT live:

```bash
bun run smoke:live
```

Untuk environment `sandbox`, smoke test akan memakai dummy patient resmi SATUSEHAT bila parameter test belum diisi.

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Authentication](./docs/authentication.md)
- [Errors](./docs/errors.md)
- [AllergyIntolerance](./docs/resources/allergy-intolerance.md)
- [Condition](./docs/resources/condition.md)
- [DICOM Router](./docs/resources/dicom-router.md)
- [DiagnosticReport](./docs/resources/diagnostic-report.md)
- [Patient](./docs/resources/patient.md)
- [Encounter](./docs/resources/encounter.md)
- [Procedure](./docs/resources/procedure.md)
- [Observation](./docs/resources/observation.md)
- [Medication](./docs/resources/medication.md)
- [MedicationRequest](./docs/resources/medication-request.md)
- [ServiceRequest](./docs/resources/service-request.md)
- [Specimen](./docs/resources/specimen.md)
- [ServiceRequest -> Specimen -> Observation Builder](./docs/helpers/service-request-specimen-observation-builder.md)
- [Laboratory Panel Builder](./docs/helpers/laboratory-panel-builder.md)
- [CBC Panel Builder](./docs/helpers/cbc-panel-builder.md)
- [Organization](./docs/resources/organization.md)
- [Location](./docs/resources/location.md)
- [Practitioner](./docs/resources/practitioner.md)
- [PractitionerRole](./docs/resources/practitioner-role.md)
- [Planning](./docs/planning.md)

## DICOM Router

SDK ini juga mendukung download file `docker-compose.yml` untuk DICOM Router SATUSEHAT:

```ts
const dockerCompose = await client.dicomRouter.downloadConfig();
```

Secara default SDK akan memakai endpoint berikut:

- sandbox: `https://api-satusehat-stg.dto.kemkes.go.id/dicom-router`
- production: `https://api-satusehat.kemkes.go.id/dicom-router`

## Buy Us a Coffee

Kalau project ini membantu, kamu bisa dukung Digital Medika lewat Saweria:

- [Buy us a coffee on Saweria](https://saweria.co/digitalmedika)

## Premium Support

Untuk premium support dan implementasi, hubungi:

- Email: [info@digitalmedika.co.id](mailto:info@digitalmedika.co.id)
- WhatsApp: [Digital Medika](https://wa.me/qr/F37IBV5GECN7K1)

![QR WhatsApp Digital Medika](docs/assets/premium-support-whatsapp-qr.jpeg)
