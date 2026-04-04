# ClinicalImpression

## Ringkasan

Resource `clinicalImpression` saat ini mendukung:

- `create`
- `getById`
- `search`
- `patch`
- `update`

## Search

Sesuai dokumentasi SATUSEHAT, mode pencarian yang saat ini dimodelkan di SDK adalah:

1. `subject`
2. `encounter`
3. `subject + encounter`

### Search by subject

```ts
const result = await client.clinicalImpression.search({
  subject: "100000030009",
});
```

### Search by subject and encounter

```ts
const result = await client.clinicalImpression.search({
  subject: "100000030009",
  encounter: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
});
```

## Create

```ts
const clinicalImpression = await client.clinicalImpression.create({
  resourceType: "ClinicalImpression",
  status: "completed",
  subject: {
    reference: "Patient/100000030009",
  },
  encounter: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
  },
  summary: "Kemungkinan angina stabil, perlu pemeriksaan lanjutan.",
});
```

## Patch

```ts
const updated = await client.clinicalImpression.patch({
  id: "a139a557-9404-4d45-bccc-979def0c928f",
  body: [
    {
      op: "replace",
      path: "/summary",
      value: "Observasi mengarah ke angina stabil, evaluasi EKG disarankan.",
    },
  ],
});
```

## Catatan Validasi

- `search` mewajibkan minimal salah satu dari `subject` atau `encounter`
- `encounter` pada query divalidasi sebagai UUID
- `status` dan `subject.reference` dimodelkan sebagai field wajib untuk payload create/update
