# Patient

## Ringkasan

Resource `patient` saat ini mendukung:

- `getById`
- `search`

## Get By ID

```ts
const patient = await client.patient.getById({
  id: "100000030009",
});
```

## Search

SDK memvalidasi query `Patient` sesuai aturan SATUSEHAT yang sudah kita modelkan.

Mode yang saat ini didukung:

1. `identifier`
2. `name + birthdate + nik`
3. `name + birthdate + gender`

### Search by identifier

```ts
const result = await client.patient.search({
  identifier: "https://fhir.kemkes.go.id/id/nik|9271060312000001",
});
```

### Search by name, birthdate, and NIK

```ts
const result = await client.patient.search({
  name: "Ardianto Putra",
  birthdate: "1992-01-09",
  nik: "9271060312000001",
});
```

### Search by name, birthdate, and gender

```ts
const result = await client.patient.search({
  name: "Ardianto Putra",
  birthdate: "1992-01-09",
  gender: "male",
});
```

## Catatan Validasi

- `identifier` harus berbentuk `https://fhir.kemkes.go.id/id/nik|...` atau `.../nik-ibu|...`
- `gender` saat ini dibatasi ke `male` atau `female` untuk mode search
- `birthdate` mengikuti format `YYYY`, `YYYY-MM`, atau `YYYY-MM-DD`
