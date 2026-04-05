import { MedicationRequestCreateSchema } from "../schemas/medication-request";
import type { Reference } from "../schemas/common";
import type {
  MedicationRequestCreateInput,
  MedicationRequestDispenseRequest,
  MedicationRequestDosageInstruction,
  MedicationRequestIdentifier,
  MedicationRequestIntent,
  MedicationRequestNote,
  MedicationRequestPriority,
  MedicationRequestStatus,
  MedicationRequestSubstitution,
} from "../schemas/medication-request";

type MedicationRequestMutableInput = Partial<
  Omit<
    MedicationRequestCreateInput,
    "resourceType" | "subject" | "encounter" | "medicationReference"
  >
>;

export interface EncounterMedicationRequestBuilderInput {
  subject: Reference;
  encounter: Reference;
  medicationRequest: Pick<
    MedicationRequestCreateInput,
    "status" | "intent" | "medicationReference"
  > &
    MedicationRequestMutableInput;
}

export class EncounterMedicationRequestBuilder {
  private medicationRequestDraft: MedicationRequestCreateInput;

  public constructor(input: EncounterMedicationRequestBuilderInput) {
    this.medicationRequestDraft = MedicationRequestCreateSchema.parse({
      resourceType: "MedicationRequest",
      subject: input.subject,
      encounter: input.encounter,
      ...input.medicationRequest,
    });
  }

  public setSubject(subject: Reference): this {
    this.medicationRequestDraft.subject = subject;
    return this;
  }

  public setEncounter(encounter: Reference): this {
    this.medicationRequestDraft.encounter = encounter;
    return this;
  }

  public mergeMedicationRequest(input: MedicationRequestMutableInput): this {
    this.medicationRequestDraft = MedicationRequestCreateSchema.parse({
      ...this.medicationRequestDraft,
      ...input,
    });
    return this;
  }

  public addIdentifier(identifier: MedicationRequestIdentifier): this {
    this.medicationRequestDraft.identifier = [
      ...(this.medicationRequestDraft.identifier ?? []),
      identifier,
    ];
    return this;
  }

  public addBasedOn(reference: Reference): this {
    this.medicationRequestDraft.basedOn = [
      ...(this.medicationRequestDraft.basedOn ?? []),
      reference,
    ];
    return this;
  }

  public addCategory(category: NonNullable<MedicationRequestCreateInput["category"]>[number]): this {
    this.medicationRequestDraft.category = [
      ...(this.medicationRequestDraft.category ?? []),
      category,
    ];
    return this;
  }

  public addReasonCode(
    reasonCode: NonNullable<MedicationRequestCreateInput["reasonCode"]>[number],
  ): this {
    this.medicationRequestDraft.reasonCode = [
      ...(this.medicationRequestDraft.reasonCode ?? []),
      reasonCode,
    ];
    return this;
  }

  public addReasonReference(reference: Reference): this {
    this.medicationRequestDraft.reasonReference = [
      ...(this.medicationRequestDraft.reasonReference ?? []),
      reference,
    ];
    return this;
  }

  public addInsurance(reference: Reference): this {
    this.medicationRequestDraft.insurance = [
      ...(this.medicationRequestDraft.insurance ?? []),
      reference,
    ];
    return this;
  }

  public addNote(note: MedicationRequestNote): this {
    this.medicationRequestDraft.note = [...(this.medicationRequestDraft.note ?? []), note];
    return this;
  }

  public addDosageInstruction(dosageInstruction: MedicationRequestDosageInstruction): this {
    this.medicationRequestDraft.dosageInstruction = [
      ...(this.medicationRequestDraft.dosageInstruction ?? []),
      dosageInstruction,
    ];
    return this;
  }

  public setStatus(status: MedicationRequestStatus): this {
    this.medicationRequestDraft.status = status;
    return this;
  }

  public setStatusReason(
    statusReason: NonNullable<MedicationRequestCreateInput["statusReason"]>,
  ): this {
    this.medicationRequestDraft.statusReason = statusReason;
    return this;
  }

  public setIntent(intent: MedicationRequestIntent): this {
    this.medicationRequestDraft.intent = intent;
    return this;
  }

  public setPriority(priority: MedicationRequestPriority): this {
    this.medicationRequestDraft.priority = priority;
    return this;
  }

  public setReportedBoolean(reportedBoolean: boolean): this {
    this.medicationRequestDraft.reportedBoolean = reportedBoolean;
    return this;
  }

  public setMedicationReference(
    medicationReference: NonNullable<MedicationRequestCreateInput["medicationReference"]>,
  ): this {
    this.medicationRequestDraft.medicationReference = medicationReference;
    return this;
  }

  public setAuthoredOn(authoredOn: NonNullable<MedicationRequestCreateInput["authoredOn"]>): this {
    this.medicationRequestDraft.authoredOn = authoredOn;
    return this;
  }

  public setRequester(
    requester: NonNullable<MedicationRequestCreateInput["requester"]>,
  ): this {
    this.medicationRequestDraft.requester = requester;
    return this;
  }

  public setPerformer(
    performer: NonNullable<MedicationRequestCreateInput["performer"]>,
  ): this {
    this.medicationRequestDraft.performer = performer;
    return this;
  }

  public setPerformerType(
    performerType: NonNullable<MedicationRequestCreateInput["performerType"]>,
  ): this {
    this.medicationRequestDraft.performerType = performerType;
    return this;
  }

  public setRecorder(recorder: NonNullable<MedicationRequestCreateInput["recorder"]>): this {
    this.medicationRequestDraft.recorder = recorder;
    return this;
  }

  public setDispenseRequest(dispenseRequest: MedicationRequestDispenseRequest): this {
    this.medicationRequestDraft.dispenseRequest = dispenseRequest;
    return this;
  }

  public setSubstitution(substitution: MedicationRequestSubstitution): this {
    this.medicationRequestDraft.substitution = substitution;
    return this;
  }

  public buildMedicationRequest(): MedicationRequestCreateInput {
    return MedicationRequestCreateSchema.parse(this.medicationRequestDraft);
  }
}

export function createEncounterMedicationRequestBuilder(
  input: EncounterMedicationRequestBuilderInput,
): EncounterMedicationRequestBuilder {
  return new EncounterMedicationRequestBuilder(input);
}
