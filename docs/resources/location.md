# Location

## Ringkasan

Resource `location` saat ini mendukung:

- `getById`
- `search`
- `create`
- `patch`
- `update`

Dokumentasi resmi SATUSEHAT yang menjadi acuan:

- [FHIR Location](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/location/)
- [ReST API Location](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/onboardings/apis/location/)

## Search

Minimal salah satu query berikut harus diisi:

- `identifier`
- `name`
- `organization`

### Search by identifier

Format `identifier` yang dimodelkan:

`http://sys-ids.kemkes.go.id/location/{id-lokasi-induk}|{kode-lokasi}`

```ts
const result = await client.location.search({
  identifier: "http://sys-ids.kemkes.go.id/location/1000001|G-2-R-1A",
});
```

### Search by name

```ts
const result = await client.location.search({
  name: "ruang",
});
```

### Search by organization

```ts
const result = await client.location.search({
  organization: "54278fdf-57f9-4e6f-aca4-be97ac12a3f7",
});
```

## Get By ID

```ts
const location = await client.location.getById({
  id: "3362d984-af65-43ac-8e5c-7db2b3be3f8b",
});
```

## Create

Field wajib yang saat ini dimodelkan:

- `resourceType`
- minimal 1 `identifier`
- `status`
- `name`

Field opsional yang saat ini dimodelkan:

- `operationalStatus`
- `alias`
- `description`
- `mode`
- `type`
- `telecom`
- `address`
- `physicalType`
- `position`
- `managingOrganization`
- `partOf`
- `hoursOfOperation`
- `availabilityExceptions`
- `endpoint`

Contoh create:

```ts
const location = await client.location.create({
  resourceType: "Location",
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/location/1000001",
      value: "G-2-R-1A",
    },
  ],
  status: "active",
  name: "Ruang 1A IRJT",
  description: "Ruang 1A, Poliklinik Bedah Rawat Jalan Terpadu, Lantai 2, Gedung G",
  mode: "instance",
  physicalType: {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
        code: "ro",
        display: "Room",
      },
    ],
  },
  managingOrganization: {
    reference: "Organization/10000004",
    display: "RS SATUSEHAT",
  },
});
```

## Update

Method `update` menggunakan `PUT`, jadi body yang dikirim adalah representasi resource `Location` yang utuh sesuai schema SDK saat ini.

```ts
const updated = await client.location.update({
  id: "3362d984-af65-43ac-8e5c-7db2b3be3f8b",
  body: {
    resourceType: "Location",
    identifier: [
      {
        system: "http://sys-ids.kemkes.go.id/location/1000001",
        value: "G-2-R-1A",
      },
    ],
    status: "active",
    name: "Ruang 1A IRJT",
    managingOrganization: {
      reference: "Organization/10000004",
      display: "RS SATUSEHAT",
    },
  },
});
```

## Patch

Method `patch` menggunakan operasi JSON patch yang saat ini divalidasi sebagai array berisi operasi `replace`.

Contoh:

```ts
const patched = await client.location.patch({
  id: "3362d984-af65-43ac-8e5c-7db2b3be3f8b",
  body: [
    {
      op: "replace",
      path: "/description",
      value: "Deskripsi terbaru",
    },
    {
      op: "replace",
      path: "/status",
      value: "active",
    },
  ],
});
```

## Catatan

- SDK saat ini membungkus operasi `GET /Location`, `GET /Location/:id`, `POST /Location`, `PATCH /Location/:id`, dan `PUT /Location/:id`.
- Schema `Location` yang dimodelkan sekarang fokus ke field yang paling umum dipakai untuk registrasi struktur lokasi. Jika nanti dibutuhkan, kita masih bisa menambah field seperti extension `serviceClass` dan detail lain yang lebih spesifik.
