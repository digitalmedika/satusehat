import { DiagnosticReportCreateSchema } from "../schemas/diagnostic-report";
import { ObservationCreateSchema } from "../schemas/observation";
import { ServiceRequestCreateSchema } from "../schemas/service-request";
import { SpecimenCreateSchema } from "../schemas/specimen";
import type {
  DiagnosticReportCreateInput,
} from "../schemas/diagnostic-report";
import type {
  ObservationCreateInput,
  ObservationNote,
  ObservationQuantity,
} from "../schemas/observation";
import type { Reference } from "../schemas/common";
import type {
  ServiceRequestCreateInput,
  ServiceRequestNote,
} from "../schemas/service-request";
import type {
  SpecimenCollection,
  SpecimenContainer,
  SpecimenCreateInput,
  SpecimenNote,
} from "../schemas/specimen";

export interface ServiceRequestSpecimenObservationBuilderInput {
  subject: Reference;
  encounter: Reference;
  serviceRequest: Pick<ServiceRequestCreateInput, "status" | "intent" | "code"> &
    Partial<Omit<ServiceRequestCreateInput, "resourceType" | "subject" | "encounter">>;
  specimen: Pick<SpecimenCreateInput, "status" | "type"> &
    Partial<Omit<SpecimenCreateInput, "resourceType" | "subject">>;
  observation: Pick<ObservationCreateInput, "status" | "code"> &
    Partial<Omit<ObservationCreateInput, "resourceType" | "subject" | "encounter">>;
  diagnosticReport?: Pick<DiagnosticReportCreateInput, "status" | "code"> &
    Partial<Omit<DiagnosticReportCreateInput, "resourceType" | "subject" | "encounter">>;
}

export interface ServiceRequestBuildLinks {
  serviceRequestId?: string;
  serviceRequestReference?: Reference;
}

export interface ObservationBuildLinks extends ServiceRequestBuildLinks {
  specimenId?: string;
  specimenReference?: Reference;
}

export interface DiagnosticReportBuildLinks extends ServiceRequestBuildLinks {
  specimenId?: string;
  specimenIds?: string[];
  specimenReference?: Reference;
  specimenReferences?: Reference[];
  resultId?: string;
  resultIds?: string[];
  resultReference?: Reference;
  resultReferences?: Reference[];
}

type ServiceRequestMutableInput = Partial<
  Omit<ServiceRequestCreateInput, "resourceType" | "subject" | "encounter">
>;
type SpecimenMutableInput = Partial<Omit<SpecimenCreateInput, "resourceType" | "subject">>;
type ObservationMutableInput = Partial<
  Omit<ObservationCreateInput, "resourceType" | "subject" | "encounter">
>;
type DiagnosticReportMutableInput = Partial<
  Omit<DiagnosticReportCreateInput, "resourceType" | "subject" | "encounter">
>;

export class ServiceRequestSpecimenObservationBuilder {
  private serviceRequestDraft: ServiceRequestCreateInput;
  private specimenDraft: SpecimenCreateInput;
  private observationDraft: ObservationCreateInput;
  private diagnosticReportDraft?: DiagnosticReportCreateInput;

  public constructor(input: ServiceRequestSpecimenObservationBuilderInput) {
    this.serviceRequestDraft = ServiceRequestCreateSchema.parse({
      resourceType: "ServiceRequest",
      subject: input.subject,
      encounter: input.encounter,
      ...input.serviceRequest,
    });

    this.specimenDraft = SpecimenCreateSchema.parse({
      resourceType: "Specimen",
      subject: input.subject,
      ...input.specimen,
    });

    this.observationDraft = ObservationCreateSchema.parse({
      resourceType: "Observation",
      subject: input.subject,
      encounter: input.encounter,
      ...input.observation,
    });

    if (input.diagnosticReport) {
      this.diagnosticReportDraft = DiagnosticReportCreateSchema.parse({
        resourceType: "DiagnosticReport",
        subject: input.subject,
        encounter: input.encounter,
        ...input.diagnosticReport,
      });
    }
  }

  public setSubject(subject: Reference): this {
    this.serviceRequestDraft.subject = subject;
    this.specimenDraft.subject = subject;
    this.observationDraft.subject = subject;
    if (this.diagnosticReportDraft) {
      this.diagnosticReportDraft.subject = subject;
    }
    return this;
  }

  public setEncounter(encounter: Reference): this {
    this.serviceRequestDraft.encounter = encounter;
    this.observationDraft.encounter = encounter;
    if (this.diagnosticReportDraft) {
      this.diagnosticReportDraft.encounter = encounter;
    }
    return this;
  }

  public mergeServiceRequest(input: ServiceRequestMutableInput): this {
    this.serviceRequestDraft = ServiceRequestCreateSchema.parse({
      ...this.serviceRequestDraft,
      ...input,
    });
    return this;
  }

  public mergeSpecimen(input: SpecimenMutableInput): this {
    this.specimenDraft = SpecimenCreateSchema.parse({
      ...this.specimenDraft,
      ...input,
    });
    return this;
  }

  public mergeObservation(input: ObservationMutableInput): this {
    this.observationDraft = ObservationCreateSchema.parse({
      ...this.observationDraft,
      ...input,
    });
    return this;
  }

  public setDiagnosticReport(
    input: Pick<DiagnosticReportCreateInput, "status" | "code"> &
      Partial<Omit<DiagnosticReportCreateInput, "resourceType" | "subject" | "encounter">>,
  ): this {
    this.diagnosticReportDraft = DiagnosticReportCreateSchema.parse({
      resourceType: "DiagnosticReport",
      subject: this.serviceRequestDraft.subject,
      encounter: this.serviceRequestDraft.encounter,
      ...input,
    });
    return this;
  }

  public mergeDiagnosticReport(input: DiagnosticReportMutableInput): this {
    const draft = this.requireDiagnosticReportDraft();

    this.diagnosticReportDraft = DiagnosticReportCreateSchema.parse({
      ...draft,
      ...input,
    });
    return this;
  }

  public addServiceRequestNote(note: ServiceRequestNote): this {
    this.serviceRequestDraft.note = [...(this.serviceRequestDraft.note ?? []), note];
    return this;
  }

  public addSpecimenNote(note: SpecimenNote): this {
    this.specimenDraft.note = [...(this.specimenDraft.note ?? []), note];
    return this;
  }

  public addObservationNote(note: ObservationNote): this {
    this.observationDraft.note = [...(this.observationDraft.note ?? []), note];
    return this;
  }

  public setSpecimenCollection(collection: SpecimenCollection): this {
    this.specimenDraft.collection = collection;
    return this;
  }

  public addSpecimenContainer(container: SpecimenContainer): this {
    this.specimenDraft.container = [...(this.specimenDraft.container ?? []), container];
    return this;
  }

  public setObservationValueQuantity(valueQuantity: ObservationQuantity): this {
    this.observationDraft.valueQuantity = valueQuantity;
    delete this.observationDraft.valueCodeableConcept;
    delete this.observationDraft.valueString;
    delete this.observationDraft.valueBoolean;
    delete this.observationDraft.valueInteger;
    delete this.observationDraft.valueRange;
    return this;
  }

  public buildServiceRequest(): ServiceRequestCreateInput {
    return ServiceRequestCreateSchema.parse(this.serviceRequestDraft);
  }

  public buildSpecimen(links: ServiceRequestBuildLinks = {}): SpecimenCreateInput {
    const draft = SpecimenCreateSchema.parse(this.specimenDraft);
    const serviceRequestReference = resolveServiceRequestReference(links);

    if (serviceRequestReference) {
      draft.request = appendUniqueReference(draft.request, serviceRequestReference);
    }

    return SpecimenCreateSchema.parse(draft);
  }

  public buildObservation(links: ObservationBuildLinks = {}): ObservationCreateInput {
    const draft = ObservationCreateSchema.parse(this.observationDraft);
    const serviceRequestReference = resolveServiceRequestReference(links);
    const specimenReference = resolveSpecimenReference(links);

    if (serviceRequestReference) {
      draft.basedOn = appendUniqueReference(draft.basedOn, serviceRequestReference);
    }

    if (specimenReference) {
      draft.specimen = specimenReference;
    }

    return ObservationCreateSchema.parse(draft);
  }

  public buildDiagnosticReport(links: DiagnosticReportBuildLinks = {}): DiagnosticReportCreateInput {
    const draft = DiagnosticReportCreateSchema.parse(this.requireDiagnosticReportDraft());
    const serviceRequestReference = resolveServiceRequestReference(links);
    const specimenReferences = resolveReferenceList({
      id: links.specimenId,
      ids: links.specimenIds,
      reference: links.specimenReference,
      references: links.specimenReferences,
      resourceType: "Specimen",
    });
    const resultReferences = resolveReferenceList({
      id: links.resultId,
      ids: links.resultIds,
      reference: links.resultReference,
      references: links.resultReferences,
      resourceType: "Observation",
    });

    if (serviceRequestReference) {
      draft.basedOn = appendUniqueReference(draft.basedOn, serviceRequestReference);
    }

    if (specimenReferences.length > 0) {
      draft.specimen = appendUniqueReferences(draft.specimen, specimenReferences);
    }

    if (resultReferences.length > 0) {
      draft.result = appendUniqueReferences(draft.result, resultReferences);
    }

    return DiagnosticReportCreateSchema.parse(draft);
  }

  private requireDiagnosticReportDraft(): DiagnosticReportCreateInput {
    if (!this.diagnosticReportDraft) {
      throw new Error(
        "DiagnosticReport draft is not configured. Call setDiagnosticReport(...) first or provide diagnosticReport in the builder input.",
      );
    }

    return this.diagnosticReportDraft;
  }
}

export function createServiceRequestSpecimenObservationBuilder(
  input: ServiceRequestSpecimenObservationBuilderInput,
): ServiceRequestSpecimenObservationBuilder {
  return new ServiceRequestSpecimenObservationBuilder(input);
}

function resolveServiceRequestReference(links: ServiceRequestBuildLinks): Reference | undefined {
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

function resolveSpecimenReference(links: ObservationBuildLinks): Reference | undefined {
  if (links.specimenReference) {
    return links.specimenReference;
  }

  if (links.specimenId) {
    return {
      reference: `Specimen/${links.specimenId}`,
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
