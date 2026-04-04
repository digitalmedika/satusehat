import { DiagnosticReportCreateSchema } from "../schemas/diagnostic-report";
import { ImagingStudyCreateSchema } from "../schemas/imaging-study";
import { ServiceRequestCreateSchema } from "../schemas/service-request";
import type { Reference } from "../schemas/common";
import type {
  DiagnosticReportCreateInput,
  DiagnosticReportMedia,
} from "../schemas/diagnostic-report";
import type {
  ImagingStudyCreateInput,
  ImagingStudyNote,
  ImagingStudySeries,
} from "../schemas/imaging-study";
import type {
  ServiceRequestCreateInput,
  ServiceRequestNote,
} from "../schemas/service-request";

export interface ServiceRequestImagingStudyDiagnosticReportBuilderInput {
  subject: Reference;
  encounter: Reference;
  serviceRequest: Pick<ServiceRequestCreateInput, "status" | "intent" | "code"> &
    Partial<Omit<ServiceRequestCreateInput, "resourceType" | "subject" | "encounter">>;
  imagingStudy: Pick<ImagingStudyCreateInput, "identifier" | "status" | "modality"> &
    Partial<Omit<ImagingStudyCreateInput, "resourceType" | "subject" | "encounter" | "basedOn">>;
  diagnosticReport: Pick<DiagnosticReportCreateInput, "status" | "code"> &
    Partial<Omit<DiagnosticReportCreateInput, "resourceType" | "subject" | "encounter">>;
}

export interface RadiologyServiceRequestBuildLinks {
  serviceRequestId?: string;
  serviceRequestReference?: Reference;
}

export interface RadiologyImagingStudyBuildLinks extends RadiologyServiceRequestBuildLinks {}

export interface RadiologyDiagnosticReportBuildLinks extends RadiologyServiceRequestBuildLinks {
  imagingStudyId?: string;
  imagingStudyIds?: string[];
  imagingStudyReference?: Reference;
  imagingStudyReferences?: Reference[];
}

type ServiceRequestMutableInput = Partial<
  Omit<ServiceRequestCreateInput, "resourceType" | "subject" | "encounter">
>;
type ImagingStudyDraftInput = Pick<ImagingStudyCreateInput, "identifier" | "status" | "modality"> &
  Partial<Omit<ImagingStudyCreateInput, "resourceType" | "subject" | "encounter" | "basedOn">>;
type ImagingStudyMutableInput = Partial<
  Omit<ImagingStudyDraftInput, "identifier" | "status" | "modality">
> &
  Partial<Pick<ImagingStudyDraftInput, "identifier" | "status" | "modality">>;
type DiagnosticReportMutableInput = Partial<
  Omit<DiagnosticReportCreateInput, "resourceType" | "subject" | "encounter">
>;

export class ServiceRequestImagingStudyDiagnosticReportBuilder {
  private serviceRequestDraft: ServiceRequestCreateInput;
  private imagingStudyDraft: ImagingStudyDraftInput;
  private diagnosticReportDraft: DiagnosticReportCreateInput;
  private subject: Reference;
  private encounter: Reference;

  public constructor(input: ServiceRequestImagingStudyDiagnosticReportBuilderInput) {
    this.subject = input.subject;
    this.encounter = input.encounter;

    this.serviceRequestDraft = ServiceRequestCreateSchema.parse({
      resourceType: "ServiceRequest",
      subject: input.subject,
      encounter: input.encounter,
      ...input.serviceRequest,
    });

    this.imagingStudyDraft = parseImagingStudyDraft(input.imagingStudy);

    this.diagnosticReportDraft = DiagnosticReportCreateSchema.parse({
      resourceType: "DiagnosticReport",
      subject: input.subject,
      encounter: input.encounter,
      ...input.diagnosticReport,
    });
  }

  public setSubject(subject: Reference): this {
    this.subject = subject;
    this.serviceRequestDraft.subject = subject;
    this.diagnosticReportDraft.subject = subject;
    return this;
  }

  public setEncounter(encounter: Reference): this {
    this.encounter = encounter;
    this.serviceRequestDraft.encounter = encounter;
    this.diagnosticReportDraft.encounter = encounter;
    return this;
  }

  public mergeServiceRequest(input: ServiceRequestMutableInput): this {
    this.serviceRequestDraft = ServiceRequestCreateSchema.parse({
      ...this.serviceRequestDraft,
      ...input,
    });
    return this;
  }

  public mergeImagingStudy(input: ImagingStudyMutableInput): this {
    this.imagingStudyDraft = parseImagingStudyDraft({
      ...this.imagingStudyDraft,
      ...input,
    });
    return this;
  }

  public mergeDiagnosticReport(input: DiagnosticReportMutableInput): this {
    this.diagnosticReportDraft = DiagnosticReportCreateSchema.parse({
      ...this.diagnosticReportDraft,
      ...input,
    });
    return this;
  }

  public addServiceRequestNote(note: ServiceRequestNote): this {
    this.serviceRequestDraft.note = [...(this.serviceRequestDraft.note ?? []), note];
    return this;
  }

  public addImagingStudyNote(note: ImagingStudyNote): this {
    this.imagingStudyDraft = parseImagingStudyDraft({
      ...this.imagingStudyDraft,
      note: [...(this.imagingStudyDraft.note ?? []), note],
    });
    return this;
  }

  public addImagingStudySeries(series: ImagingStudySeries): this {
    this.imagingStudyDraft = parseImagingStudyDraft({
      ...this.imagingStudyDraft,
      series: [...(this.imagingStudyDraft.series ?? []), series],
    });
    return this;
  }

  public addDiagnosticReportMedia(media: DiagnosticReportMedia): this {
    this.diagnosticReportDraft = DiagnosticReportCreateSchema.parse({
      ...this.diagnosticReportDraft,
      media: [...(this.diagnosticReportDraft.media ?? []), media],
    });
    return this;
  }

  public buildServiceRequest(): ServiceRequestCreateInput {
    return ServiceRequestCreateSchema.parse(this.serviceRequestDraft);
  }

  public buildImagingStudy(
    links: RadiologyImagingStudyBuildLinks = {},
  ): ImagingStudyCreateInput {
    const serviceRequestReference = resolveServiceRequestReference(links);

    if (!serviceRequestReference) {
      throw new Error(
        "ImagingStudy requires a ServiceRequest link. Provide serviceRequestId or serviceRequestReference when calling buildImagingStudy(...).",
      );
    }

    return ImagingStudyCreateSchema.parse({
      resourceType: "ImagingStudy",
      subject: this.subject,
      encounter: this.encounter,
      ...this.imagingStudyDraft,
      basedOn: appendUniqueReference(undefined, serviceRequestReference),
    });
  }

  public buildDiagnosticReport(
    links: RadiologyDiagnosticReportBuildLinks = {},
  ): DiagnosticReportCreateInput {
    const draft = DiagnosticReportCreateSchema.parse(this.diagnosticReportDraft);
    const serviceRequestReference = resolveServiceRequestReference(links);
    const imagingStudyReferences = resolveReferenceList({
      id: links.imagingStudyId,
      ids: links.imagingStudyIds,
      reference: links.imagingStudyReference,
      references: links.imagingStudyReferences,
      resourceType: "ImagingStudy",
    });

    if (serviceRequestReference) {
      draft.basedOn = appendUniqueReference(draft.basedOn, serviceRequestReference);
    }

    if (imagingStudyReferences.length > 0) {
      draft.imagingStudy = appendUniqueReferences(draft.imagingStudy, imagingStudyReferences);
    }

    return DiagnosticReportCreateSchema.parse(draft);
  }
}

export function createServiceRequestImagingStudyDiagnosticReportBuilder(
  input: ServiceRequestImagingStudyDiagnosticReportBuilderInput,
): ServiceRequestImagingStudyDiagnosticReportBuilder {
  return new ServiceRequestImagingStudyDiagnosticReportBuilder(input);
}

function parseImagingStudyDraft(input: ImagingStudyDraftInput): ImagingStudyDraftInput {
  return ImagingStudyCreateSchema.omit({
    resourceType: true,
    subject: true,
    encounter: true,
    basedOn: true,
  }).parse(input);
}

function resolveServiceRequestReference(
  links: RadiologyServiceRequestBuildLinks,
): Reference | undefined {
  if (links.serviceRequestReference) {
    return links.serviceRequestReference;
  }

  if (links.serviceRequestId) {
    return {
      reference: `ServiceRequest/${links.serviceRequestId}`,
    };
  }

  return undefined;
}

function appendUniqueReference(
  existing: Reference[] | undefined,
  reference: Reference,
): Reference[] {
  const items = existing ?? [];

  if (items.some((item) => item.reference === reference.reference)) {
    return items;
  }

  return [...items, reference];
}

function appendUniqueReferences(
  existing: Reference[] | undefined,
  references: Reference[],
): Reference[] {
  return references.reduce((items, reference) => appendUniqueReference(items, reference), existing ?? []);
}

function resolveReferenceList(input: {
  id?: string | undefined;
  ids?: string[] | undefined;
  reference?: Reference | undefined;
  references?: Reference[] | undefined;
  resourceType: string;
}): Reference[] {
  const resolved: Reference[] = [];

  if (input.reference) {
    resolved.push(input.reference);
  }

  if (input.references) {
    resolved.push(...input.references);
  }

  if (input.id) {
    resolved.push({
      reference: `${input.resourceType}/${input.id}`,
    });
  }

  if (input.ids) {
    resolved.push(
      ...input.ids.map((id) => ({
        reference: `${input.resourceType}/${id}`,
      })),
    );
  }

  return appendUniqueReferences([], resolved);
}
