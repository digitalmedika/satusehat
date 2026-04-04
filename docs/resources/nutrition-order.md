# NutritionOrder

## Ringkasan

Resource `nutritionOrder` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR NutritionOrder](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/nutrition-order/)
- [Playbook Interoperabilitas Gizi](https://satusehat.kemkes.go.id/platform/docs/id/interoperability/gizi/)

## Search

Saat ini query yang dimodelkan adalah:

- `patient`
- `subject`
- `encounter`

Mode search yang didukung:

- `patient` dan/atau `encounter`
- `subject` dan/atau `encounter`
- `encounter` saja

Parameter `subject` disediakan sebagai alias kompatibilitas dan akan dinormalisasi menjadi `patient` saat request dikirim.

```ts
const result = await client.nutritionOrder.search({
  patient: "100000030009",
  encounter: "6694e8c8-052a-4ea6-8072-157b6d47ca08",
});
```

## Get By ID

```ts
const nutritionOrder = await client.nutritionOrder.getById({
  id: "a0b4b86c-9a48-4711-8238-69e4dcde50df",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- `status`
- `intent`
- `dateTime`
- salah satu dari `patient` atau `subject`

Field opsional yang saat ini dimodelkan:

- `identifier`
- `instantiatesCanonical`
- `instantiatesUri`
- `instantiates`
- `priority`
- `encounter`
- `orderer`
- `allergyIntolerance`
- `foodPreferenceModifier`
- `excludeFoodModifier`
- `oralDiet`
- `supplement`
- `enteralFormula`
- `note`

Contoh create:

```ts
const nutritionOrder = await client.nutritionOrder.create({
  resourceType: "NutritionOrder",
  status: "active",
  intent: "order",
  patient: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  encounter: {
    reference: "Encounter/6694e8c8-052a-4ea6-8072-157b6d47ca08",
  },
  dateTime: "2024-04-01T03:15:00+00:00",
  oralDiet: {
    instruction: "Diet rendah garam 1700 kkal per hari.",
  },
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `NutritionOrder` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.nutritionOrder.patch({
  id: "a0b4b86c-9a48-4711-8238-69e4dcde50df",
  body: [
    {
      op: "replace",
      path: "/status",
      value: "completed",
    },
  ],
});
```

## Catatan

- Dokumentasi SATUSEHAT saat ini menampilkan istilah `subject` pada halaman resource, tetapi playbook gizi masih memakai `patient`. SDK ini menerima keduanya agar integrasi tetap fleksibel.
- Untuk pencarian, SDK menormalisasi `subject` menjadi `patient` sebelum request dikirim.
