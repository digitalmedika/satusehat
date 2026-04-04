import { z } from "zod";

import { type Transport } from "../client/transport";
import {
  PractitionerBundleSchema,
  PractitionerSchema,
  PractitionerSearchParamsSchema,
} from "../schemas/practitioner";
import type { PractitionerSearchParams } from "../schemas/practitioner";

const PractitionerIdParamsSchema = z.object({
  id: z.string().min(1),
});

export function createPractitionerClient(transport: Transport) {
  return {
    getById(input: { id: string; signal?: AbortSignal }) {
      const parsed = PractitionerIdParamsSchema.parse({ id: input.id });

      return transport.request({
        method: "GET",
        path: `/Practitioner/${parsed.id}`,
        responseSchema: PractitionerSchema,
        ...(input.signal ? { signal: input.signal } : {}),
      });
    },

    search(input: PractitionerSearchParams, signal?: AbortSignal) {
      return transport.request({
        method: "GET",
        path: "/Practitioner",
        query: input,
        querySchema: PractitionerSearchParamsSchema,
        responseSchema: PractitionerBundleSchema,
        ...(signal ? { signal } : {}),
      });
    },
  };
}
