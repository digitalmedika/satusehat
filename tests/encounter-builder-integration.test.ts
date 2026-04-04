import { describe, expect, test } from "bun:test";

import {
  createEncounterBuilder,
  createServiceRequestSpecimenObservationBuilder,
} from "../src";

describe("encounter builder integration", () => {
  test("reuses encounter subject and created encounter reference in downstream builders", () => {
    const encounterDraft = createEncounterBuilder({
      preset: "outpatient",
      identifier: {
        system: "http://sys-ids.kemkes.go.id/encounter/10000004",
        use: "official",
        value: "RJ-20240099",
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
          reference: "Location/poli-interna",
          display: "Poliklinik Penyakit Dalam",
        },
        status: "active",
      },
      serviceProvider: {
        reference: "Organization/10000004",
      },
    }).build();

    const createdEncounter = {
      id: "enc-123",
      ...encounterDraft,
    };

    const downstreamBuilder = createServiceRequestSpecimenObservationBuilder({
      subject: encounterDraft.subject,
      encounter: {
        reference: `Encounter/${createdEncounter.id}`,
      },
      serviceRequest: {
        status: "active",
        intent: "order",
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "718-7",
              display: "Hemoglobin",
            },
          ],
        },
      },
      specimen: {
        status: "available",
        type: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "122555007",
              display: "Venous blood specimen",
            },
          ],
        },
      },
      observation: {
        status: "final",
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "718-7",
              display: "Hemoglobin",
            },
          ],
        },
      },
    });

    const serviceRequest = downstreamBuilder.buildServiceRequest();
    const observation = downstreamBuilder.buildObservation({
      serviceRequestId: "srv-1",
      specimenId: "spm-1",
    });

    expect(serviceRequest.subject).toEqual(encounterDraft.subject);
    expect(serviceRequest.encounter?.reference).toBe("Encounter/enc-123");
    expect(observation.subject).toEqual(encounterDraft.subject);
    expect(observation.encounter.reference).toBe("Encounter/enc-123");
  });
});
