import { describe, expect, test } from "bun:test";

import { createEncounterBuilder } from "../src";
import type { EncounterCreateInput } from "../src";
import { createEncounterFixture } from "./fixtures/encounter";

function toBuilderInput(fixture: EncounterCreateInput) {
  return {
    identifier: fixture.identifier,
    status: fixture.status,
    statusHistory: fixture.statusHistory,
    classHistory: fixture.classHistory,
    ...(fixture.type ? { type: fixture.type } : {}),
    ...(fixture.serviceType ? { serviceType: fixture.serviceType } : {}),
    ...(fixture.priority ? { priority: fixture.priority } : {}),
    subject: fixture.subject,
    ...(fixture.episodeOfCare ? { episodeOfCare: fixture.episodeOfCare } : {}),
    ...(fixture.basedOn ? { basedOn: fixture.basedOn } : {}),
    ...(fixture.participant ? { participant: fixture.participant } : {}),
    period: fixture.period,
    ...(fixture.length ? { length: fixture.length } : {}),
    reasonCode: fixture.reasonCode,
    ...(fixture.reasonReference ? { reasonReference: fixture.reasonReference } : {}),
    diagnosis: fixture.diagnosis,
    ...(fixture.account ? { account: fixture.account } : {}),
    ...(fixture.hospitalization ? { hospitalization: fixture.hospitalization } : {}),
    location: fixture.location,
    serviceProvider: fixture.serviceProvider,
    ...(fixture.partOf ? { partOf: fixture.partOf } : {}),
  };
}

describe("encounter builder", () => {
  test("builds an outpatient encounter using preset defaults", () => {
    const fixture = createEncounterFixture("outpatient");
    const encounter = createEncounterBuilder({
      preset: "outpatient",
      ...toBuilderInput(fixture),
    }).build();

    expect(encounter.resourceType).toBe("Encounter");
    expect(encounter.class.code).toBe("AMB");
    expect(encounter.classHistory[0]?.class.code).toBe("AMB");
    expect(encounter.statusHistory[0]?.status).toBe("arrived");
    expect(encounter.identifier).toHaveLength(1);
    expect(encounter.serviceType?.coding?.[0]?.code).toBe("poli-interna");
    expect(encounter.priority?.coding?.[0]?.code).toBe("R");
    expect(encounter.participant).toHaveLength(2);
    expect(encounter.location[0]?.location.display).toBe("Poliklinik Penyakit Dalam");
  });

  test("supports inpatient encounters with hospitalization details", () => {
    const fixture = createEncounterFixture("inpatient");
    const {
      hospitalization,
    } = fixture;

    const encounter = createEncounterBuilder({
      preset: "inpatient",
      ...toBuilderInput(fixture),
    })
      .setHospitalization(hospitalization!)
      .build();

    expect(encounter.class.code).toBe("IMP");
    expect(encounter.hospitalization?.admitSource?.coding?.[0]?.code).toBe("emd");
    expect(encounter.hospitalization?.dischargeDisposition?.coding?.[0]?.code).toBe("home");
    expect(encounter.location[0]?.extension?.[0]).toEqual({
      url: "https://fhir.kemkes.go.id/r4/StructureDefinition/serviceClass",
      extension: [
        {
          url: "valueCode",
          valueCode: "kelas-1",
        },
      ],
    });
  });

  test("supports emergency preset and custom class overrides", () => {
    const fixture = createEncounterFixture("emergency");

    const encounter = createEncounterBuilder({
      preset: "emergency",
      ...toBuilderInput(fixture),
    })
      .setClass({
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "VR",
        display: "virtual",
      })
      .build();

    expect(encounter.status).toBe("in-progress");
    expect(encounter.class.code).toBe("VR");
    expect(encounter.classHistory[0]?.class.code).toBe("EMER");
    expect(encounter.statusHistory.map((entry) => entry.status)).toEqual([
      "arrived",
      "triaged",
      "in-progress",
    ]);
    expect(encounter.location).toHaveLength(2);
  });
});
