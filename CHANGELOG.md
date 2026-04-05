# Changelog

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
