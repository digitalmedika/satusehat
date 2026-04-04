import { describe, expect, test } from "bun:test";

import { createEncounterBuilder } from "../src";

describe("encounter builder", () => {
  test("builds an outpatient encounter using preset defaults", () => {
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
          display: "Tuberculosis of lung",
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
          reference: "Location/408ba28c-3115-4df5-85c6-60f15b44e7fa",
          display: "Poliklinik Rawat Jalan",
        },
        status: "active",
      },
      serviceProvider: {
        reference: "Organization/10000004",
        display: "RS SATUSEHAT",
      },
    }).build();

    expect(encounter.resourceType).toBe("Encounter");
    expect(encounter.class.code).toBe("AMB");
    expect(encounter.classHistory[0]?.class.code).toBe("AMB");
    expect(encounter.statusHistory[0]?.status).toBe("arrived");
    expect(encounter.identifier).toHaveLength(1);
    expect(encounter.location[0]?.location.display).toBe("Poliklinik Rawat Jalan");
  });

  test("supports inpatient encounters with hospitalization details", () => {
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

    expect(encounter.class.code).toBe("IMP");
    expect(encounter.hospitalization?.admitSource?.coding?.[0]?.code).toBe("hosp-trans");
  });

  test("supports emergency preset and custom class overrides", () => {
    const encounter = createEncounterBuilder({
      preset: "emergency",
      identifier: {
        system: "http://sys-ids.kemkes.go.id/encounter/10000004",
        use: "official",
        value: "IGD-20240001",
      },
      status: "triaged",
      subject: {
        reference: "Patient/100000030009",
      },
      period: {
        start: "2024-04-01T01:00:00+00:00",
        end: "2024-04-01T04:00:00+00:00",
      },
      reasonCode: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/encounter-reason",
            code: "308335008",
            display: "Patient encounter procedure",
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
              code: "DD",
              display: "Discharge diagnosis",
            },
          ],
        },
        rank: 1,
      },
      location: {
        location: {
          reference: "Location/igd-01",
          display: "IGD",
        },
        status: "active",
      },
      serviceProvider: {
        reference: "Organization/10000004",
      },
    })
      .setClass({
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "VR",
        display: "virtual",
      })
      .build();

    expect(encounter.status).toBe("triaged");
    expect(encounter.class.code).toBe("VR");
    expect(encounter.classHistory[0]?.class.code).toBe("EMER");
  });
});
