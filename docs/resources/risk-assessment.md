# RiskAssessment

## Ringkasan

Resource `riskAssessment` saat ini mendukung:

- `create`
- `getById`
- `search`
- `patch`
- `update`

## Search

Saat ini query yang dimodelkan adalah:

- `subject`
- `encounter`

Minimal salah satu query di atas harus diisi.

```ts
const result = await client.riskAssessment.search({
  subject: "100000030009",
  encounter: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- `status`
- `subject`

Field opsional yang saat ini dimodelkan:

- `identifier`
- `basedOn`
- `parent`
- `method`
- `code`
- `encounter`
- `occurrenceDateTime`
- `occurrencePeriod`
- `condition`
- `performer`
- `reasonCode`
- `reasonReference`
- `basis`
- `prediction`
- `mitigation`
- `note`

Contoh create:

```ts
const riskAssessment = await client.riskAssessment.create({
  resourceType: "RiskAssessment",
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
  subject: {
    reference: "Patient/100000030009",
  },
  encounter: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
  },
  prediction: [
    {
      probabilityDecimal: 0.32,
      rationale: "Faktor risiko meningkat berdasarkan profil lipid dan riwayat keluarga.",
    },
  ],
  mitigation: "Anjurkan modifikasi gaya hidup dan follow-up kardiologi.",
});
```

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.riskAssessment.patch({
  id: "b523ec9d-9df6-4d20-911d-703f74d5ec0a",
  body: [
    {
      op: "replace",
      path: "/mitigation",
      value: "Tambahkan terapi statin dan evaluasi ulang dalam 1 bulan.",
    },
  ],
});
```

## Catatan

- Search `RiskAssessment` di SDK ini mengikuti pola parameter `subject` dan `encounter` seperti resource klinis lain yang sudah ada.
- Untuk prediksi risiko, SDK saat ini memodelkan `probabilityDecimal`, `probabilityRange`, `qualitativeRisk`, `relativeRisk`, `whenPeriod`, dan `whenRange`.
- Jika payload dibentuk bertahap, gunakan helper [`createRiskAssessmentBuilder`](../helpers/risk-assessment-builder.md).
