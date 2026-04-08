---
"@digitalmedika/satusehat": minor
---

Add more ergonomic encounter builders for staged antrean workflows.

- allow `createEncounterBuilder(...)` to build initial `Encounter` drafts without `diagnosis`
- add `createEncounterDiagnosis(...)` for lightweight `Encounter.diagnosis` creation from `conditionId` or `conditionReference`
- add encounter helper shortcuts for identifier, service provider, participant, location, consultation method, and status timeline
- add `createEncounterQueueBuilder(...)` to support staged antrean flows from `arrived` to `in-progress`, `finished`, `Condition`, and final encounter diagnosis update
- update documentation and tests for the new encounter builder workflows
