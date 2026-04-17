# Immunization

## Ringkasan

Resource `immunization` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR Immunization](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/immunization/)
- [Terminologi Imunisasi](https://satusehat.kemkes.go.id/platform/docs/id/terminology/lampiran-terminologi/imunisasi-new/)

## Search

Saat ini query yang dimodelkan adalah:

- `patient`
- `encounter`
- `date`
- `status`
- `identifier`

Minimal salah satu query di atas harus diisi.

```ts
const result = await client.immunization.search({
  patient: "100000030009",
  encounter: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
});
```

## Get By ID

```ts
const immunization = await client.immunization.getById({
  id: "a9f62a9f-5a1a-4d60-94fd-7d018df7963c",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- `status`
- `vaccineCode`
- `patient`
- salah satu dari `occurrenceDateTime` atau `occurrenceString`

Untuk kompatibilitas SATUSEHAT pada pengiriman imunisasi rutin, SDK juga memvalidasi:

- `status: "completed"` harus mengisi `reasonCode`
- `expirationDate` tidak boleh sebelum tanggal `occurrenceDateTime`

Contoh create HB-0:

```ts
const immunization = await client.immunization.create({
  resourceType: "Immunization",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/immunization/1000004",
      use: "official",
      value: "IMM-HB0-001",
    },
  ],
  status: "completed",
  vaccineCode: {
    coding: [
      {
        system: "http://sys-ids.kemkes.go.id/kfa",
        code: "93023161",
        display: "Hepatitis B Uniject 0,5 mL",
      },
      {
        system: "http://hl7.org/fhir/sid/cvx",
        code: "08",
        display: "Hep B, adolescent or pediatric",
      },
    ],
  },
  patient: {
    reference: "Patient/100000030009",
  },
  encounter: {
    reference: "Encounter/4f735a03-128b-464d-bf91-e6eacdf1c38f",
  },
  occurrenceDateTime: "2026-04-09T03:32:00+07:00",
  recorded: "2026-04-09T03:32:00+07:00",
  primarySource: true,
  reasonCode: [
    {
      coding: [
        {
          system: "http://terminology.kemkes.go.id/CodeSystem/immunization-reason",
          code: "IM-Dasar",
          display: "Imunisasi Program Rutin Dasar",
        },
      ],
    },
  ],
  lotNumber: "HB0-LOT-001",
  expirationDate: "2027-04-09",
  doseQuantity: {
    value: 0.5,
    unit: "mL",
    system: "http://unitsofmeasure.org",
    code: "mL",
  },
  performer: [
    {
      actor: {
        reference: "Practitioner/N10000001",
      },
    },
  ],
  protocolApplied: [
    {
      series: "Hepatitis B",
      targetDisease: [
        {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/icd-10",
              code: "B16.9",
              display:
                "Acute hepatitis B without delta-agent and without hepatic coma",
            },
          ],
        },
      ],
      doseNumberPositiveInt: 1,
      seriesDosesPositiveInt: 1,
    },
  ],
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `Immunization` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.immunization.patch({
  id: "a9f62a9f-5a1a-4d60-94fd-7d018df7963c",
  body: [
    {
      op: "replace",
      path: "/status",
      value: "entered-in-error",
    },
  ],
});
```

## Catatan

- Untuk HB-0, pastikan kode vaksin KFA dan CVX sudah sesuai dengan data obat/vaksin yang dipakai di aplikasi.
- `reasonCode` memakai terminologi imunisasi SATUSEHAT, misalnya `IM-Dasar` untuk imunisasi program rutin dasar.
