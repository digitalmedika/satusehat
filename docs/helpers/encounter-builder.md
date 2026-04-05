# Encounter Builder

## Ringkasan

Helper `createEncounterBuilder` mempermudah penyusunan payload `Encounter` secara bertahap, terutama untuk pola yang sering berulang seperti:

- rawat jalan
- rawat inap
- IGD
- kebutuhan custom dengan `Encounter.class` sendiri

Untuk alur IGD/triage yang punya banyak transisi status dan perpindahan class layanan, gunakan `createEmergencyEncounterHistory(...)` supaya `statusHistory` dan `classHistory` terbentuk otomatis dari titik waktu transisi.

Preset yang tersedia:

- `outpatient` -> `AMB`
- `inpatient` -> `IMP`
- `emergency` -> `EMER`

Kalau butuh kasus lain, kamu bisa melewatkan `preset` dan mengirim `encounterClass` secara manual.

## Contoh Dasar

```ts
import { createEncounterBuilder } from "@digitalmedika/satusehat";

const encounter = createEncounterBuilder({
  preset: "outpatient",
  identifier: {
    system: "http://sys-ids.kemkes.go.id/encounter/10000004",
    use: "official",
    value: "RJ-20240001",
  },
  status: "arrived",
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  period: {
    start: "2024-04-01T01:00:00+00:00",
    end: "2024-04-01T02:00:00+00:00",
  },
  reasonCode: {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/encounter-reason",
        code: "185349003",
        display: "Encounter for check up",
      },
    ],
  },
  diagnosis: {
    condition: {
      reference: "Condition/4bbbe654-14f5-4ab3-a36e-a1e307f67bb8",
    },
    use: {
      coding: [
        {
          system: "https://www.hl7.org/fhir/Codesystem-diagnosis-role",
          code: "AD",
          display: "Admission diagnosis",
        },
      ],
    },
    rank: 1,
  },
  location: {
    location: {
      reference: "Location/poli-anak",
      display: "Poliklinik Anak",
    },
    status: "active",
  },
  serviceProvider: {
    reference: "Organization/10000004",
  },
})
  .addParticipant({
    individual: {
      reference: "Practitioner/N10000001",
      display: "Dokter Bronsig",
    },
  })
  .build();
```

## Contoh Rawat Inap

```ts
const encounter = createEncounterBuilder({
  preset: "inpatient",
  identifier: {
    system: "http://sys-ids.kemkes.go.id/encounter/10000004",
    use: "official",
    value: "RI-20240001",
  },
  status: "in-progress",
  subject: {
    reference: "Patient/100000030009",
  },
  period: {
    start: "2024-04-01T01:00:00+00:00",
    end: "2024-04-03T08:00:00+00:00",
  },
  reasonCode: {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/encounter-reason",
        code: "32485007",
        display: "Hospital admission",
      },
    ],
  },
  diagnosis: {
    condition: {
      reference: "Condition/4bbbe654-14f5-4ab3-a36e-a1e307f67bb8",
    },
    use: {
      coding: [
        {
          system: "https://www.hl7.org/fhir/Codesystem-diagnosis-role",
          code: "AD",
          display: "Admission diagnosis",
        },
      ],
    },
    rank: 1,
  },
  location: {
    location: {
      reference: "Location/bed-rawat-inap-a",
      display: "Bangsal Mawar Bed A",
    },
    status: "active",
  },
  serviceProvider: {
    reference: "Organization/10000004",
  },
})
  .setHospitalization({
    admitSource: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/admit-source",
          code: "hosp-trans",
          display: "Transferred from other hospital",
        },
      ],
    },
  })
  .build();
```

## Contoh Alur IGD/Triage

```ts
import {
  createEmergencyEncounterHistory,
  createEncounterBuilder,
} from "@digitalmedika/satusehat";

const emergencyFlow = createEmergencyEncounterHistory({
  statusStages: [
    {
      status: "arrived",
      start: "2024-04-03T01:00:00+00:00",
    },
    {
      status: "triaged",
      start: "2024-04-03T01:05:00+00:00",
    },
    {
      status: "in-progress",
      start: "2024-04-03T01:15:00+00:00",
    },
  ],
  classStages: [
    {
      start: "2024-04-03T01:00:00+00:00",
      preset: "emergency",
    },
    {
      start: "2024-04-03T03:00:00+00:00",
      preset: "inpatient",
    },
  ],
  periodEnd: "2024-04-05T05:00:00+00:00",
});

const encounter = createEncounterBuilder({
  ...emergencyFlow,
  identifier: {
    system: "http://sys-ids.kemkes.go.id/encounter/10000004",
    use: "official",
    value: "IGD-20240001",
  },
  subject: {
    reference: "Patient/100000030009",
  },
  reasonCode: {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/encounter-reason",
        code: "29857009",
        display: "Chest pain",
      },
    ],
  },
  diagnosis: {
    condition: {
      reference: "Condition/4bbbe654-14f5-4ab3-a36e-a1e307f67bb8",
    },
    use: {
      coding: [
        {
          system: "https://www.hl7.org/fhir/Codesystem-diagnosis-role",
          code: "AD",
          display: "Admission diagnosis",
        },
      ],
    },
    rank: 1,
  },
  location: {
    location: {
      reference: "Location/igd-observation-bed-02",
      display: "Bed Observasi IGD 02",
    },
    status: "active",
  },
  serviceProvider: {
    reference: "Organization/10000004",
  },
}).build();
```

Aturan helper ini:

- status pertama harus `arrived`
- setiap `start` harus urut naik
- `periodEnd` otomatis menjadi akhir status dan class terakhir
- kalau `classStages` tidak diberikan, helper akan membuat 1 class `emergency` untuk seluruh encounter

## Method Utama

- `setPreset(preset)`
- `setClass(classCoding)`
- `setStatus(status)`
- `setSubject(reference)`
- `setPeriod(period)`
- `setServiceType(codeableConcept)`
- `setPriority(codeableConcept)`
- `setHospitalization(hospitalization)`
- `setLength(quantity)`
- `setServiceProvider(reference)`
- `addIdentifier(identifier)`
- `addParticipant(participant)`
- `addReasonCode(reasonCode)`
- `addReasonReference(reference)`
- `addDiagnosis(diagnosis)`
- `addLocation(location)`
- `addStatusHistory(statusHistory)`
- `addClassHistory(classHistory)`
- `addEpisodeOfCare(reference)`
- `addBasedOn(reference)`
- `addAccount(reference)`
- `addType(type)`
- `merge(partial)`
- `build()`

## Catatan

- Constructor otomatis mengisi `statusHistory` dan `classHistory` default dari `status`, `period`, dan preset atau `encounterClass` yang dipilih.
- `setPreset(...)` hanya mengubah `class` saat ini. Kalau kamu juga ingin menyesuaikan histori class, tambahkan atau ganti `classHistory` secara eksplisit.
- `createEmergencyEncounterHistory(...)` mengembalikan `status`, `period`, `encounterClass`, `statusHistory`, dan `classHistory` sehingga bisa langsung di-spread ke `createEncounterBuilder(...)`.
- `build()` selalu memvalidasi draft akhir dengan `EncounterCreateSchema`.
