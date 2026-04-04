# QuestionnaireResponse

## Ringkasan

Resource `questionnaireResponse` saat ini mendukung:

- `create`
- `getById`
- `search`
- `patch`
- `update`

## Search

Sesuai dokumentasi SATUSEHAT, mode pencarian yang saat ini dimodelkan di SDK adalah:

1. `patient + encounter`

```ts
const result = await client.questionnaireResponse.search({
  patient: "100000030009",
  encounter: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
});
```

## Create

```ts
const questionnaireResponse = await client.questionnaireResponse.create({
  resourceType: "QuestionnaireResponse",
  questionnaire: "Questionnaire/Q123",
  status: "completed",
  subject: {
    reference: "Patient/100000030009",
  },
  encounter: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
  },
  item: [
    {
      linkId: "1",
      text: "Apakah pasien mengalami nyeri dada?",
      answer: [
        {
          valueBoolean: true,
        },
      ],
    },
  ],
});
```

## Patch

```ts
const updated = await client.questionnaireResponse.patch({
  id: "bc5edf78-ea8d-4827-97b3-3c73a810fa29",
  body: [
    {
      op: "replace",
      path: "/status",
      value: "amended",
    },
  ],
});
```

## Catatan Validasi

- `search` mengikuti mode yang terdokumentasi SATUSEHAT: `patient + encounter`
- `encounter` pada query divalidasi sebagai UUID
- setiap `answer` harus memiliki minimal satu `value[x]`
- `status` adalah field wajib untuk payload create/update
