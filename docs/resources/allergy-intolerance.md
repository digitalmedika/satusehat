# AllergyIntolerance

## Ringkasan

Resource `allergyIntolerance` saat ini mendukung:

- `create`
- `getById`
- `search`
- `patch`
- `update`

## Search

Sesuai dokumentasi SATUSEHAT, mode pencarian yang saat ini dimodelkan di SDK adalah:

1. `patient`
2. `patient + code`

### Search by patient

```ts
const result = await client.allergyIntolerance.search({
  patient: "100000030009",
});
```

### Search by patient and allergy code

```ts
const result = await client.allergyIntolerance.search({
  patient: "100000030009",
  code: "294513009",
});
```

## Create

```ts
const allergyIntolerance = await client.allergyIntolerance.create({
  resourceType: "AllergyIntolerance",
  clinicalStatus: {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
        code: "active",
      },
    ],
  },
  verificationStatus: {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
        code: "confirmed",
      },
    ],
  },
  code: {
    coding: [
      {
        system: "http://snomed.info/sct",
        code: "294513009",
        display: "Penicillin allergy",
      },
    ],
  },
  patient: {
    reference: "Patient/100000030009",
  },
});
```

## Patch

```ts
const updated = await client.allergyIntolerance.patch({
  id: "6c1202d7-660a-473b-b1c9-f536c0c40283",
  body: [
    {
      op: "replace",
      path: "/criticality",
      value: "low",
    },
  ],
});
```

## Catatan Validasi

- `search` mewajibkan `patient`
- `code` opsional, tetapi bila dipakai akan divalidasi sebagai string non-kosong
- `code` pada resource dan `patient.reference` dimodelkan sebagai field wajib untuk payload create/update
