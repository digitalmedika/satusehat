# Observation

## Ringkasan

Resource `observation` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR Observation](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/observation/)
- [ReST API Observation](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/observation/)

## Search

Saat ini query yang dimodelkan adalah:

- `subject`
- `encounter`
- `"based-on"`

Mode search yang didukung:

- `subject` dan/atau `encounter`
- `subject` + `"based-on"`

```ts
const result = await client.observation.search({
  subject: "100000030009",
  "based-on": "6694e8c8-052a-4ea6-8072-157b6d47ca08",
});
```

## Get By ID

```ts
const observation = await client.observation.getById({
  id: "af8ac2e3-0e72-45d7-ab8a-332f52fccbcd",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- `status`
- `code`
- `subject`
- `encounter`

Field opsional yang saat ini dimodelkan:

- `identifier`
- `basedOn`
- `category`
- `effectiveDateTime`
- `effectivePeriod`
- `effectiveInstant`
- `issued`
- `performer`
- `valueQuantity`
- `valueCodeableConcept`
- `valueString`
- `valueBoolean`
- `valueInteger`
- `valueRange`
- `dataAbsentReason`
- `interpretation`
- `note`
- `bodySite`
- `method`
- `specimen`
- `device`
- `referenceRange`
- `hasMember`
- `derivedFrom`
- `component`

Contoh create:

```ts
const observation = await client.observation.create({
  resourceType: "Observation",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/observation/10000004",
      use: "official",
      value: "R100005",
    },
  ],
  basedOn: [
    {
      reference: "ServiceRequest/6694e8c8-052a-4ea6-8072-157b6d47ca08",
    },
  ],
  status: "final",
  category: [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/observation-category",
          code: "vital-signs",
          display: "Vital Signs",
        },
      ],
    },
  ],
  code: {
    coding: [
      {
        system: "http://loinc.org",
        code: "8867-4",
        display: "Heart rate",
      },
    ],
  },
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  encounter: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
  },
  effectiveDateTime: "2024-04-01T01:30:00+00:00",
  issued: "2024-04-01T01:35:00+00:00",
  performer: [
    {
      reference: "Practitioner/N10000001",
      display: "Dokter Bronsig",
    },
  ],
  valueQuantity: {
    value: 80,
    unit: "beats/minute",
    system: "http://unitsofmeasure.org",
    code: "/min",
  },
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `Observation` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.observation.patch({
  id: "af8ac2e3-0e72-45d7-ab8a-332f52fccbcd",
  body: [
    {
      op: "replace",
      path: "/issued",
      value: "2024-04-01T02:00:00+00:00",
    },
  ],
});
```

## Catatan

- Search `Observation` di SDK ini mengikuti parameter resmi SATUSEHAT yaitu `subject`, `encounter`, dan `"based-on"`.
- Schema saat ini difokuskan untuk hasil observasi umum seperti vital sign dan hasil pemeriksaan dengan nilai kuantitatif atau coded result. Use case panel laboratorium yang lebih kompleks masih bisa kita tambah bertahap berikutnya.
