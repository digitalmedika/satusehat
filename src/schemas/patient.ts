import { z } from "zod";

import {
  BundleEntrySchema,
  BundleLinkSchema,
  HumanNameSchema,
  IdentifierSchema,
  MetaSchema,
} from "./common";

export const PatientIdentifierSchema = IdentifierSchema;

export const PatientSchema = z.object({
  resourceType: z.literal("Patient"),
  id: z.string(),
  active: z.boolean().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["male", "female", "other", "unknown"]).optional(),
  identifier: z.array(PatientIdentifierSchema).optional(),
  meta: MetaSchema.optional(),
  name: z.array(HumanNameSchema).optional(),
});

export const PatientSearchParamsSchema = z
  .object({
    identifier: z.string().optional(),
    name: z.string().optional(),
    birthdate: z.string().optional(),
    gender: z.enum(["male", "female", "other", "unknown"]).optional(),
  })
  .refine((value) => Boolean(value.identifier || value.name), {
    message: "At least one SATUSEHAT patient search parameter is required",
    path: ["identifier"],
  });

export const PatientBundleSchema = z.object({
  resourceType: z.literal("Bundle"),
  type: z.string().optional(),
  total: z.number().optional(),
  link: z.array(BundleLinkSchema).optional(),
  entry: z.array(BundleEntrySchema(PatientSchema)).optional(),
});

export type PatientIdentifier = z.infer<typeof PatientIdentifierSchema>;
export type Patient = z.infer<typeof PatientSchema>;
export type PatientSearchParams = z.infer<typeof PatientSearchParamsSchema>;
export type PatientSearchResponse = z.infer<typeof PatientBundleSchema>;
