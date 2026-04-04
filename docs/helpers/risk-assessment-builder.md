# Risk Assessment Builder

## Ringkasan

Helper `createRiskAssessmentBuilder` mempermudah penyusunan payload `RiskAssessment` secara bertahap tanpa perlu merakit seluruh object manual di satu tempat.

Builder ini cocok saat:

- assessment dibentuk dari beberapa hasil observasi atau condition
- prediksi risiko perlu ditambahkan satu per satu
- payload dibangun secara incremental di service layer

## Contoh Dasar

```ts
import { createRiskAssessmentBuilder } from "@digitalmedika/satusehat";

const riskAssessment = createRiskAssessmentBuilder({
  subject: {
    reference: "Patient/100000030009",
  },
  encounter: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
  },
  status: "final",
  code: {
    coding: [
      {
        system: "http://snomed.info/sct",
        code: "225358003",
        display: "Risk for coronary heart disease",
      },
    ],
  },
})
  .setCondition({
    reference: "Condition/2a4e1a13-ee52-4c8b-a2ef-f41c79de698d",
  })
  .addBasis({
    reference: "Observation/af8ac2e3-0e72-45d7-ab8a-332f52fccbcd",
  })
  .addPrediction({
    probabilityDecimal: 0.32,
    rationale: "Faktor risiko meningkat berdasarkan profil lipid dan riwayat keluarga.",
  })
  .setMitigation("Anjurkan modifikasi gaya hidup dan follow-up kardiologi.")
  .build();
```

## Method Utama

- `setSubject(reference)`
- `setEncounter(reference)`
- `setStatus(status)`
- `setCode(code)`
- `setCondition(reference)`
- `setPerformer(reference)`
- `setReasonCode(codeableConcept)`
- `setReasonReference(reference)`
- `setMethod(codeableConcept)`
- `setOccurrenceDateTime(value)`
- `setOccurrencePeriod(value)`
- `setMitigation(text)`
- `setBasedOn(reference)`
- `addIdentifier(identifier)`
- `addBasis(reference)`
- `addPrediction(prediction)`
- `addNote(note)`
- `merge(partial)`
- `build()`

## Catatan

- `build()` selalu memvalidasi draft akhir dengan schema `RiskAssessmentCreateSchema`.
- `setOccurrenceDateTime(...)` dan `setOccurrencePeriod(...)` saling menimpa agar payload tetap konsisten.
- Untuk field yang belum punya helper khusus, gunakan `merge(...)`.
