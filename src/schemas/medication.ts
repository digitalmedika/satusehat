import { z } from "zod";

import {
  CodeableConceptSchema,
  IdentifierSchema,
  MetaSchema,
  ReferenceSchema,
} from "./common";

export const MedicationIdentifierSchema = IdentifierSchema.extend({
  system: z
    .string()
    .regex(
      /^http:\/\/sys-ids\.kemkes\.go\.id\/medication\/.+$/,
      "Medication identifier.system must use http://sys-ids.kemkes.go.id/medication/{organization-ihs-number}",
    ),
  value: z.string().min(1),
});

export const MedicationStatusSchema = z.enum([
  "active",
  "inactive",
  "entered-in-error",
]);

export const MedicationCodingSchema = z.object({
  system: z.string().min(1),
  code: z.string().min(1),
  display: z.string().optional(),
});

export const MedicationCodeableConceptSchema = CodeableConceptSchema.extend({
  coding: z.array(MedicationCodingSchema).min(1),
});

export const MedicationQuantitySchema = z.object({
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  system: z.string().optional(),
  code: z.string().optional(),
});

export const MedicationRatioSchema = z.object({
  numerator: MedicationQuantitySchema.optional(),
  denominator: MedicationQuantitySchema.optional(),
});

export const MedicationTypeExtensionSchema = z.object({
  url: z.literal("https://fhir.kemkes.go.id/r4/StructureDefinition/MedicationType"),
  valueCodeableConcept: MedicationCodeableConceptSchema,
});

export const MedicationIngredientSchema = z.object({
  itemCodeableConcept: MedicationCodeableConceptSchema.optional(),
  itemReference: ReferenceSchema.optional(),
  isActive: z.boolean().optional(),
  strength: MedicationRatioSchema.optional(),
});

export const MedicationBatchSchema = z.object({
  lotNumber: z.string().optional(),
  expirationDate: z.string().optional(),
});

export const MedicationPatchOperationSchema = z.object({
  op: z.literal("replace"),
  path: z.string().min(1),
  value: z.unknown(),
});

export const MedicationPatchSchema = z.array(MedicationPatchOperationSchema).min(1);

export const MedicationBaseSchema = z.object({
  resourceType: z.literal("Medication"),
  identifier: z.array(MedicationIdentifierSchema).optional(),
  code: MedicationCodeableConceptSchema.optional(),
  status: MedicationStatusSchema.optional(),
  manufacturer: ReferenceSchema.optional(),
  form: MedicationCodeableConceptSchema.optional(),
  amount: MedicationRatioSchema.optional(),
  ingredient: z.array(MedicationIngredientSchema).optional(),
  batch: MedicationBatchSchema.optional(),
  extension: z.array(MedicationTypeExtensionSchema).min(1),
});

export const MedicationCreateSchema = MedicationBaseSchema;

export const MedicationSchema = MedicationBaseSchema.extend({
  id: z.string().min(1),
  meta: MetaSchema.optional(),
});

export const MedicationUpdateParamsSchema = z.object({
  id: z.string().min(1),
});

export type MedicationIdentifier = z.infer<typeof MedicationIdentifierSchema>;
export type MedicationStatus = z.infer<typeof MedicationStatusSchema>;
export type MedicationCoding = z.infer<typeof MedicationCodingSchema>;
export type MedicationQuantity = z.infer<typeof MedicationQuantitySchema>;
export type MedicationRatio = z.infer<typeof MedicationRatioSchema>;
export type MedicationTypeExtension = z.infer<typeof MedicationTypeExtensionSchema>;
export type MedicationIngredient = z.infer<typeof MedicationIngredientSchema>;
export type MedicationBatch = z.infer<typeof MedicationBatchSchema>;
export type MedicationPatchOperation = z.infer<typeof MedicationPatchOperationSchema>;
export type MedicationPatchInput = z.infer<typeof MedicationPatchSchema>;
export type Medication = z.infer<typeof MedicationSchema>;
export type MedicationCreateInput = z.infer<typeof MedicationCreateSchema>;
