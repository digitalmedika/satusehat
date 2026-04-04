import { z } from "zod";

export const MetaSchema = z.object({
  lastUpdated: z.string().optional(),
  profile: z.array(z.string()).optional(),
  versionId: z.string().optional(),
});

export const IdentifierSchema = z.object({
  system: z.string().optional(),
  use: z.string().optional(),
  value: z.string().optional(),
});

export const HumanNameSchema = z.object({
  use: z.string().optional(),
  text: z.string().optional(),
  family: z.string().optional(),
  given: z.array(z.string()).optional(),
  prefix: z.array(z.string()).optional(),
  suffix: z.array(z.string()).optional(),
});

export const BundleLinkSchema = z.object({
  relation: z.string().optional(),
  url: z.string().optional(),
});

export const BundleEntrySchema = <TResource extends z.ZodTypeAny>(resourceSchema: TResource) =>
  z.object({
    fullUrl: z.string().optional(),
    resource: resourceSchema,
  });
