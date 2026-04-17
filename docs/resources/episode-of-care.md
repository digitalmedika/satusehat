# EpisodeOfCare

## Ringkasan

Resource `episodeOfCare` mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR EpisodeOfCare](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/episode-of-care/)
- [API EpisodeOfCare](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/integrations/apis/episode-of-care/)

`EpisodeOfCare` dipakai untuk menandai satu episode atau program perawatan
yang dapat mencakup banyak `Encounter`. ID balikan dari SATUSEHAT dapat dipakai
pada `Encounter.episodeOfCare`.

## Search

Query yang dimodelkan:

- `subject`
- `organization`
- `care-manager`
- `identifier`
- `status`
- `type`

Minimal satu parameter wajib diisi.

```ts
const result = await client.episodeOfCare.search({
  subject: "100000030009",
  identifier:
    "http://sys-ids.kemkes.go.id/episode-of-care/1000004|EOC-PTM-CAD-123",
});
```

## Get By ID

```ts
const episodeOfCare = await client.episodeOfCare.getById({
  id: "99d39101-4a41-4414-b1ef-6b45b7d73807",
});
```

## Create

Field wajib yang dimodelkan:

- `resourceType`
- `status`
- `patient`

Field opsional yang dimodelkan:

- `identifier`
- `statusHistory`
- `type`
- `diagnosis`
- `managingOrganization`
- `period`
- `referralRequest`
- `careManager`
- `team`
- `account`

Nilai `identifier.system` harus memakai format:

```text
http://sys-ids.kemkes.go.id/episode-of-care/{organization-ihs-number}
```

Contoh create:

```ts
const episodeOfCare = await client.episodeOfCare.create({
  resourceType: "EpisodeOfCare",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/episode-of-care/1000004",
      use: "official",
      value: "EOC-PTM-CAD-123",
    },
  ],
  status: "waitlist",
  statusHistory: [
    {
      status: "waitlist",
      period: {
        start: "2026-04-07T00:00:00.000+00:00",
      },
    },
  ],
  type: [
    {
      coding: [
        {
          system: "http://terminology.kemkes.go.id/CodeSystem/episodeofcare-type",
          code: "CAD",
          display: "Coronary Arterial Disease Management Care",
        },
      ],
    },
  ],
  patient: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  managingOrganization: {
    reference: "Organization/1000004",
  },
  period: {
    start: "2026-04-07T00:00:00.000+00:00",
  },
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi
resource `EpisodeOfCare` utuh sesuai schema SDK saat ini.

```ts
const updated = await client.episodeOfCare.update({
  id: "99d39101-4a41-4414-b1ef-6b45b7d73807",
  body: {
    ...episodeOfCare,
    status: "active",
  },
});
```

## Patch

```ts
const patched = await client.episodeOfCare.patch({
  id: "99d39101-4a41-4414-b1ef-6b45b7d73807",
  body: [
    {
      op: "replace",
      path: "/status",
      value: "active",
    },
  ],
});
```
