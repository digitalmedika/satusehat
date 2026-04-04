import { DiagnosticReportCreateSchema } from "../schemas/diagnostic-report";
import { ObservationCreateSchema } from "../schemas/observation";
import { ServiceRequestCreateSchema } from "../schemas/service-request";
import { SpecimenCreateSchema } from "../schemas/specimen";
import type { DiagnosticReportCreateInput } from "../schemas/diagnostic-report";
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

export interface LaboratoryPanelBuilderInput {
  subject: Reference;
  encounter: Reference;
  serviceRequest: Pick<ServiceRequestCreateInput, "status" | "intent" | "code"> &
    Partial<Omit<ServiceRequestCreateInput, "resourceType" | "subject" | "encounter">>;
  specimen: Pick<SpecimenCreateInput, "status" | "type"> &
    Partial<Omit<SpecimenCreateInput, "resourceType" | "subject">>;
  diagnosticReport: Pick<DiagnosticReportCreateInput, "status" | "code"> &
    Partial<Omit<DiagnosticReportCreateInput, "resourceType" | "subject" | "encounter">>;
  observationDefaults?: Partial<
    Omit<ObservationCreateInput, "resourceType" | "subject" | "encounter" | "status" | "code">
  >;
}

export type LaboratoryPanelObservationInput = Pick<ObservationCreateInput, "status" | "code"> &
  Partial<Omit<ObservationCreateInput, "resourceType" | "subject" | "encounter" | "status" | "code">>;

export interface LaboratoryPanelObservationEntry {
  key: string;
  body: ObservationCreateInput;
}

export interface LaboratoryPanelServiceRequestLinks {
  serviceRequestId?: string;
  serviceRequestReference?: Reference;
}

export interface LaboratoryPanelObservationLinks extends LaboratoryPanelServiceRequestLinks {
  specimenId?: string;
  specimenReference?: Reference;
}

export interface LaboratoryPanelDiagnosticReportLinks extends LaboratoryPanelServiceRequestLinks {
  specimenId?: string;
  specimenIds?: string[];
  specimenReference?: Reference;
  specimenReferences?: Reference[];
  resultIds?: string[];
  resultReferences?: Reference[];
}

type ServiceRequestMutableInput = Partial<
  Omit<ServiceRequestCreateInput, "resourceType" | "subject" | "encounter">
>;
type SpecimenMutableInput = Partial<Omit<SpecimenCreateInput, "resourceType" | "subject">>;
type DiagnosticReportMutableInput = Partial<
  Omit<DiagnosticReportCreateInput, "resourceType" | "subject" | "encounter">
>;
type ObservationDefaultsInput = Partial<
  Omit<ObservationCreateInput, "resourceType" | "subject" | "encounter" | "status" | "code">
>;
type ObservationMutableInput = Partial<
  Omit<ObservationCreateInput, "resourceType" | "subject" | "encounter">
>;

export class LaboratoryPanelBuilder {
  private serviceRequestDraft: ServiceRequestCreateInput;
  private specimenDraft: SpecimenCreateInput;
  private diagnosticReportDraft: DiagnosticReportCreateInput;
  private observationDefaults: ObservationDefaultsInput;
  private observationDrafts = new Map<string, ObservationCreateInput>();

  public constructor(input: LaboratoryPanelBuilderInput) {
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

    this.diagnosticReportDraft = DiagnosticReportCreateSchema.parse({
      resourceType: "DiagnosticReport",
      subject: input.subject,
      encounter: input.encounter,
      ...input.diagnosticReport,
    });

    this.observationDefaults = input.observationDefaults ?? {};
  }

  public setSubject(subject: Reference): this {
    this.serviceRequestDraft.subject = subject;
    this.specimenDraft.subject = subject;
    this.diagnosticReportDraft.subject = subject;

    for (const [key, draft] of this.observationDrafts) {
      this.observationDrafts.set(
        key,
        ObservationCreateSchema.parse({
          ...draft,
          subject,
        }),
      );
    }

    return this;
  }

  public setEncounter(encounter: Reference): this {
    this.serviceRequestDraft.encounter = encounter;
    this.diagnosticReportDraft.encounter = encounter;

    for (const [key, draft] of this.observationDrafts) {
      this.observationDrafts.set(
        key,
        ObservationCreateSchema.parse({
          ...draft,
          encounter,
        }),
      );
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

  public mergeDiagnosticReport(input: DiagnosticReportMutableInput): this {
    this.diagnosticReportDraft = DiagnosticReportCreateSchema.parse({
      ...this.diagnosticReportDraft,
      ...input,
    });
    return this;
  }

  public setObservationDefaults(input: ObservationDefaultsInput): this {
    this.observationDefaults = {
      ...this.observationDefaults,
      ...input,
    };
    return this;
  }

  public addObservation(key: string, input: LaboratoryPanelObservationInput): this {
    this.observationDrafts.set(key, this.createObservationDraft(input));
    return this;
  }

  public mergeObservation(key: string, input: ObservationMutableInput): this {
    const draft = this.requireObservationDraft(key);

    this.observationDrafts.set(
      key,
      ObservationCreateSchema.parse({
        ...draft,
        ...input,
      }),
    );
    return this;
  }

  public setObservationValueQuantity(key: string, valueQuantity: ObservationQuantity): this {
    const draft = this.requireObservationDraft(key);
    const nextDraft: ObservationCreateInput = {
      ...draft,
      valueQuantity,
    };

    delete nextDraft.valueCodeableConcept;
    delete nextDraft.valueString;
    delete nextDraft.valueBoolean;
    delete nextDraft.valueInteger;
    delete nextDraft.valueRange;

    this.observationDrafts.set(key, ObservationCreateSchema.parse(nextDraft));
    return this;
  }

  public addObservationNote(key: string, note: ObservationNote): this {
    const draft = this.requireObservationDraft(key);

    this.observationDrafts.set(
      key,
      ObservationCreateSchema.parse({
        ...draft,
        note: [...(draft.note ?? []), note],
      }),
    );
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

  public setSpecimenCollection(collection: SpecimenCollection): this {
    this.specimenDraft.collection = collection;
    return this;
  }

  public addSpecimenContainer(container: SpecimenContainer): this {
    this.specimenDraft.container = [...(this.specimenDraft.container ?? []), container];
    return this;
  }

  public listObservationKeys(): string[] {
    return [...this.observationDrafts.keys()];
  }

  public buildServiceRequest(): ServiceRequestCreateInput {
    return ServiceRequestCreateSchema.parse(this.serviceRequestDraft);
  }

  public buildSpecimen(links: LaboratoryPanelServiceRequestLinks = {}): SpecimenCreateInput {
    const draft = SpecimenCreateSchema.parse(this.specimenDraft);
    const serviceRequestReference = resolveServiceRequestReference(links);

    if (serviceRequestReference) {
      draft.request = appendUniqueReference(draft.request, serviceRequestReference);
    }

    return SpecimenCreateSchema.parse(draft);
  }

  public buildObservation(key: string, links: LaboratoryPanelObservationLinks = {}): ObservationCreateInput {
    const draft = ObservationCreateSchema.parse(this.requireObservationDraft(key));
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

  public buildObservationEntries(
    links: LaboratoryPanelObservationLinks = {},
  ): LaboratoryPanelObservationEntry[] {
    return this.listObservationKeys().map((key) => ({
      key,
      body: this.buildObservation(key, links),
    }));
  }

  public buildObservations(links: LaboratoryPanelObservationLinks = {}): ObservationCreateInput[] {
    return this.buildObservationEntries(links).map((entry) => entry.body);
  }

  public buildDiagnosticReport(
    links: LaboratoryPanelDiagnosticReportLinks = {},
  ): DiagnosticReportCreateInput {
    const draft = DiagnosticReportCreateSchema.parse(this.diagnosticReportDraft);
    const serviceRequestReference = resolveServiceRequestReference(links);
    const specimenReferences = resolveReferenceList({
      id: links.specimenId,
      ids: links.specimenIds,
      reference: links.specimenReference,
      references: links.specimenReferences,
      resourceType: "Specimen",
    });
    const resultReferences = resolveReferenceList({
      ids: links.resultIds,
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

  private createObservationDraft(input: LaboratoryPanelObservationInput): ObservationCreateInput {
    return ObservationCreateSchema.parse({
      resourceType: "Observation",
      subject: this.serviceRequestDraft.subject,
      encounter: this.serviceRequestDraft.encounter,
      ...this.observationDefaults,
      ...input,
    });
  }

  private requireObservationDraft(key: string): ObservationCreateInput {
    const draft = this.observationDrafts.get(key);

    if (!draft) {
      throw new Error(`Observation draft with key "${key}" was not found.`);
    }

    return draft;
  }
}

export function createLaboratoryPanelBuilder(input: LaboratoryPanelBuilderInput): LaboratoryPanelBuilder {
  return new LaboratoryPanelBuilder(input);
}

function resolveServiceRequestReference(
  links: LaboratoryPanelServiceRequestLinks,
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

function resolveSpecimenReference(links: LaboratoryPanelObservationLinks): Reference | undefined {
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
