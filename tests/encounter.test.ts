import { describe, expect, test } from "bun:test";

import { createSatuSehatClient, SatuSehatValidationError } from "../src";

const encounterPayload = {
  resourceType: "Encounter" as const,
  identifier: [
    {
      system: "http://sys-ids.kemkes.go.id/encounter/10000004",
      use: "official",
      value: "P20240001",
    },
  ],
  status: "arrived" as const,
  statusHistory: [
    {
      status: "arrived" as const,
      period: {
        start: "2024-04-01T01:00:00+00:00",
        end: "2024-04-01T01:10:00+00:00",
      },
    },
  ],
  class: {
    system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    code: "AMB",
    display: "ambulatory",
  },
  classHistory: [
    {
      class: {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "AMB",
        display: "ambulatory",
      },
      period: {
        start: "2024-04-01T01:00:00+00:00",
        end: "2024-04-01T02:00:00+00:00",
      },
    },
  ],
  subject: {
    reference: "Patient/100000030009",
    display: "Budi Santoso",
  },
  participant: [
    {
      type: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              code: "ATND",
              display: "attender",
            },
          ],
        },
      ],
      individual: {
        reference: "Practitioner/N10000001",
        display: "Dokter Bronsig",
      },
    },
  ],
  period: {
    start: "2024-04-01T01:00:00+00:00",
    end: "2024-04-01T02:00:00+00:00",
  },
  reasonCode: [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/encounter-reason",
          code: "185349003",
          display: "Encounter for check up",
        },
      ],
    },
  ],
  diagnosis: [
    {
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
  ],
  location: [
    {
      location: {
        reference: "Location/408ba28c-3115-4df5-85c6-60f15b44e7fa",
        display: "Ruang 1A, Poliklinik Rawat Jalan",
      },
      status: "active" as const,
    },
  ],
  serviceProvider: {
    reference: "Organization/10000004",
    display: "RS SATUSEHAT",
  },
};

describe("encounter endpoint", () => {
  test("validates that search requires subject", async () => {
    const client = createSatuSehatClient({
      accessToken: "test-token",
      fetch: async () =>
        new Response(JSON.stringify({ resourceType: "Bundle", entry: [] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
    });

    await expect(client.encounter.search({} as never)).rejects.toBeInstanceOf(
      SatuSehatValidationError,
    );
  });

  test("searches encounter by subject", async () => {
    const client = createSatuSehatClient({
      accessToken: "test-token",
      fetch: async (input) => {
        const url = String(input);
        expect(url).toContain("subject=100000030009");

        return new Response(
          JSON.stringify({
            resourceType: "Bundle",
            total: 1,
            entry: [
              {
                resource: {
                  id: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
                  ...encounterPayload,
                },
              },
            ],
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      },
    });

    const result = await client.encounter.search({
      subject: "100000030009",
    });

    expect(result.total).toBe(1);
    expect(result.entry?.[0]?.resource.id).toBe("4f735a03-128b-464d-bf91-e6eacdf1c38f");
    expect(result.entry?.[0]?.resource.subject.reference).toBe("Patient/100000030009");
  });

  test("posts a validated encounter resource", async () => {
    let capturedBody: unknown;

    const client = createSatuSehatClient({
      accessToken: "test-token",
      fetch: async (_input, init) => {
        const requestBody = init?.body ? JSON.parse(String(init.body)) : undefined;
        capturedBody = requestBody;

        return new Response(
          JSON.stringify({
            id: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
            ...(requestBody && typeof requestBody === "object" ? requestBody : {}),
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      },
    });

    const encounter = await client.encounter.create(encounterPayload);

    expect((capturedBody as { resourceType: string }).resourceType).toBe("Encounter");
    expect(encounter.id).toBe("4f735a03-128b-464d-bf91-e6eacdf1c38f");
    expect(encounter.location[0]?.location.reference).toBe(
      "Location/408ba28c-3115-4df5-85c6-60f15b44e7fa",
    );
  });

  test("patches encounter with replace operations", async () => {
    let capturedMethod: string | undefined;
    let capturedBody: unknown;

    const client = createSatuSehatClient({
      accessToken: "test-token",
      fetch: async (_input, init) => {
        capturedMethod = init?.method;
        capturedBody = init?.body ? JSON.parse(String(init.body)) : undefined;

        return new Response(
          JSON.stringify({
            id: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
            ...encounterPayload,
            status: "finished",
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      },
    });

    const updated = await client.encounter.patch({
      id: "4f735a03-128b-464d-bf91-e6eacdf1c38f",
      body: [
        {
          op: "replace",
          path: "/status",
          value: "finished",
        },
      ],
    });

    expect(capturedMethod).toBe("PATCH");
    expect(capturedBody).toEqual([
      {
        op: "replace",
        path: "/status",
        value: "finished",
      },
    ]);
    expect(updated.status).toBe("finished");
  });
});
