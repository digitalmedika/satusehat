import { z } from "zod";

import { type Transport } from "../client/transport";
import { PatientBundleSchema, PatientSchema, PatientSearchParamsSchema } from "../schemas/patient";
import type { PatientSearchParams } from "../schemas/patient";

const PatientIdParamsSchema = z.object({
  id: z.string().min(1),
});

export function createPatientClient(transport: Transport) {
  return {
    getById(input: { id: string; signal?: AbortSignal }) {
      const parsed = PatientIdParamsSchema.parse({ id: input.id });

      return transport.request({
        method: "GET",
        path: `/Patient/${parsed.id}`,
        responseSchema: PatientSchema,
        ...(input.signal ? { signal: input.signal } : {}),
      });
    },

    search(input: PatientSearchParams, signal?: AbortSignal) {
      return transport.request({
        method: "GET",
        path: "/Patient",
        query: input,
        querySchema: PatientSearchParamsSchema,
        responseSchema: PatientBundleSchema,
        ...(signal ? { signal } : {}),
      });
    },
  };
}
