# Composition

## Ringkasan

Resource `composition` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [ReST API Composition](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/composition/)

Implementasi schema pada SDK ini memakai parameter pencarian resmi SATUSEHAT, lalu memodelkan field inti resource `Composition` berdasarkan FHIR R4 untuk use case dokumen klinis seperti resume medis.

## Search

Saat ini query yang dimodelkan adalah:

- `subject`
- `encounter`

Minimal salah satu dari dua parameter tersebut harus diisi.

```ts
const result = await client.composition.search({
  subject: "100000030009",
  encounter: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
});
```

## Get By ID

```ts
const composition = await client.composition.getById({
  id: "1ec67403-c6f1-4d46-8611-d20875525438",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- `status`
- `type`
- `date`
- `author`
- `title`

Field opsional yang saat ini dimodelkan:

- `identifier`
- `category`
- `subject`
- `encounter`
- `confidentiality`
- `attester`
- `custodian`
- `relatesTo`
- `event`
- `section`

Contoh create:

```ts
const composition = await client.composition.create({
  resourceType: "Composition",
  status: "final",
  type: {
    coding: [
      {
        system: "http://loinc.org",
        code: "34133-9",
        display: "Summary of episode note",
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
  date: "2024-04-01T05:00:00+00:00",
  author: [
    {
      reference: "Practitioner/N10000001",
      display: "Dokter Bronsig",
    },
  ],
  title: "Resume Medis Rawat Jalan",
  section: [
    {
      title: "Ringkasan Klinis",
      text: {
        status: "generated",
        div: "<div>Pasien datang dengan keluhan batuk sejak 3 hari terakhir.</div>",
      },
      entry: [
        {
          reference: "Condition/6f8aa0da-7513-4d75-9655-6d17ca4e5900",
        },
      ],
    },
  ],
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `Composition` utuh sesuai schema SDK saat ini.

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

```ts
const updated = await client.composition.patch({
  id: "1ec67403-c6f1-4d46-8611-d20875525438",
  body: [
    {
      op: "replace",
      path: "/title",
      value: "Resume Medis Rawat Jalan Terverifikasi",
    },
  ],
});
```

## Catatan

- Pencarian `Composition` di SDK ini mengikuti mode resmi SATUSEHAT: `subject` dan/atau `encounter`.
- Bentuk `section` dibuat rekursif agar dokumen klinis bertingkat tetap bisa dimodelkan.
- Implementasi ini fokus pada field inti yang umum dipakai dalam dokumen klinis, bukan seluruh permukaan resource FHIR `Composition`.
