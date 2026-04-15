# Changelog

## 0.10.0

### Minor Changes

- 9cc1f87: Add first-class `carePlan` support to the SDK, including typed schemas, endpoint client methods, documentation, and test coverage for create, search, patch, and update flows.

## 0.9.0

### Minor Changes

- c206660: Add first-class `medicationStatement` support to the SDK, including typed schemas, endpoint client methods, and test coverage for create, search, patch, and update flows.

## 0.8.1

### Patch Changes

- 86c50b0: Fix Encounter update typing to require a full Encounter resource body, including `id`, for PUT requests.

## 0.8.0

### Minor Changes

- dce81a1: Add MedicationDispense client support with typed create, search, getById, patch, and update helpers.

## 0.7.3

### Patch Changes

- 74cb9e3: Relax MedicationRequest identifier validation to accept both `prescription/{organization-ihs-number}/{subsystem}` and `prescription-item/{organization-ihs-number}` systems, matching real SATUSEHAT integration variants.

## 0.7.2

### Patch Changes

- fda1bba: Handle malformed SATUSEHAT responses more safely in the shared transport layer.
  When a response is labeled as JSON but contains plain text such as `Internal Server Error`,
  the SDK now preserves the raw text in `SatuSehatApiError.response` instead of throwing a
  JSON parse error. This makes downstream app errors clearer for resources such as
  `QuestionnaireResponse`.

## 0.7.1

### Patch Changes

- c6fc9b9: Support SATUSEHAT radiology accession identifiers on `ServiceRequest` by allowing
  `identifier.system` values under `http://sys-ids.kemkes.go.id/acsn/{organization-ihs-number}`
  in addition to the existing `servicerequest` identifier. This patch also preserves
  `Identifier.type` in the shared schema so accession identifiers such as `ACSN` can
  be validated and forwarded correctly, and updates the ServiceRequest docs/tests to
  cover the radiology use case.

## 0.7.0

### Minor Changes

- 75bd027: Add more ergonomic encounter builders for staged antrean workflows.

  - allow `createEncounterBuilder(...)` to build initial `Encounter` drafts without `diagnosis`
  - add `createEncounterDiagnosis(...)` for lightweight `Encounter.diagnosis` creation from `conditionId` or `conditionReference`
  - add encounter helper shortcuts for identifier, service provider, participant, location, consultation method, and status timeline
  - add `createEncounterQueueBuilder(...)` to support staged antrean flows from `arrived` to `in-progress`, `finished`, `Condition`, and final encounter diagnosis update
  - update documentation and tests for the new encounter builder workflows

## 0.6.2

### Patch Changes

- 3f5122a: reason code on encounter resource optional

## 0.6.1

### Patch Changes

- e0468b3: fix: replace bun build with esbuild to resolve empty dist/index.js bundle — all internal modules were incorrectly marked as external, causing ReferenceError at runtime

## 0.6.0

### Minor Changes

- acda63d: Add `createEncounterMedicationRequestBuilder` for post-encounter prescribing flows, including exports, documentation, and tests.

## 0.5.0

### Minor Changes

- 53c9bf6: Add an encounter-to-medication-administration helper builder for post-encounter IGD workflows, including documentation and tests.

## 0.4.0

### Minor Changes

- 3828b14: Add `createEncounterProcedureBuilder` to support simple post-encounter IGD flows from `Encounter` to `Procedure`, including documentation, exports, and test coverage.

## 0.3.0

### Minor Changes

- ed3ffab: Add `createEncounterConditionBuilder` to support simple post-encounter IGD flows from `Encounter` to `Condition`, including helper output for `Encounter.diagnosis`.

## 0.2.0

### Minor Changes

- c07801e: Add `createEmergencyEncounterHistory` to build emergency encounter status and class history for IGD and triage flows, including transitions into inpatient care.

### Patch Changes

- a7833ae: implement Encounter resource builder and schemas for SatuSehat integration

Semua perubahan penting pada project ini akan didokumentasikan di file ini.

## 0.1.0 - 2026-04-05

### Added

- rilis publik pertama untuk package `@digitalmedika/satusehat`
- SDK TypeScript untuk SATUSEHAT API dengan validasi schema runtime dan type inference end-to-end
- dukungan OAuth2 client credentials dengan token cache in-memory dan file-based
- helper builder untuk resource klinis seperti encounter, laboratory panel, CBC panel, chest X-ray study, organization, dan risk assessment
- dukungan resource SATUSEHAT utama seperti patient, encounter, observation, diagnostic report, imaging study, medication, service request, specimen, organization, location, practitioner, dan practitioner role
- dokumentasi awal dan smoke test untuk integrasi ke environment SATUSEHAT
