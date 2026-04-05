import { ProcedureCreateSchema } from "../schemas/procedure";
import type { Reference } from "../schemas/common";
import type {
  ProcedureCreateInput,
  ProcedureFocalDevice,
  ProcedureIdentifier,
  ProcedureNote,
  ProcedurePerformer,
} from "../schemas/procedure";

type ProcedureMutableInput = Partial<
  Omit<ProcedureCreateInput, "resourceType" | "subject" | "encounter">
>;

export interface EncounterProcedureBuilderInput {
  subject: Reference;
  encounter: Reference;
  procedure: Pick<ProcedureCreateInput, "status" | "code"> & ProcedureMutableInput;
}

export class EncounterProcedureBuilder {
  private procedureDraft: ProcedureCreateInput;

  public constructor(input: EncounterProcedureBuilderInput) {
    this.procedureDraft = ProcedureCreateSchema.parse({
      resourceType: "Procedure",
      subject: input.subject,
      encounter: input.encounter,
      ...input.procedure,
    });
  }

  public setSubject(subject: Reference): this {
    this.procedureDraft.subject = subject;
    return this;
  }

  public setEncounter(encounter: Reference): this {
    this.procedureDraft.encounter = encounter;
    return this;
  }

  public mergeProcedure(input: ProcedureMutableInput): this {
    this.procedureDraft = ProcedureCreateSchema.parse({
      ...this.procedureDraft,
      ...input,
    });
    return this;
  }

  public addIdentifier(identifier: ProcedureIdentifier): this {
    this.procedureDraft.identifier = [...(this.procedureDraft.identifier ?? []), identifier];
    return this;
  }

  public addBasedOn(reference: Reference): this {
    this.procedureDraft.basedOn = [...(this.procedureDraft.basedOn ?? []), reference];
    return this;
  }

  public addPartOf(reference: Reference): this {
    this.procedureDraft.partOf = [...(this.procedureDraft.partOf ?? []), reference];
    return this;
  }

  public addPerformer(performer: ProcedurePerformer): this {
    this.procedureDraft.performer = [...(this.procedureDraft.performer ?? []), performer];
    return this;
  }

  public addReasonCode(reasonCode: NonNullable<ProcedureCreateInput["reasonCode"]>[number]): this {
    this.procedureDraft.reasonCode = [...(this.procedureDraft.reasonCode ?? []), reasonCode];
    return this;
  }

  public addReasonReference(reference: Reference): this {
    this.procedureDraft.reasonReference = [
      ...(this.procedureDraft.reasonReference ?? []),
      reference,
    ];
    return this;
  }

  public addBodySite(bodySite: NonNullable<ProcedureCreateInput["bodySite"]>[number]): this {
    this.procedureDraft.bodySite = [...(this.procedureDraft.bodySite ?? []), bodySite];
    return this;
  }

  public addReport(reference: Reference): this {
    this.procedureDraft.report = [...(this.procedureDraft.report ?? []), reference];
    return this;
  }

  public addComplication(
    complication: NonNullable<ProcedureCreateInput["complication"]>[number],
  ): this {
    this.procedureDraft.complication = [
      ...(this.procedureDraft.complication ?? []),
      complication,
    ];
    return this;
  }

  public addComplicationDetail(reference: Reference): this {
    this.procedureDraft.complicationDetail = [
      ...(this.procedureDraft.complicationDetail ?? []),
      reference,
    ];
    return this;
  }

  public addFollowUp(followUp: NonNullable<ProcedureCreateInput["followUp"]>[number]): this {
    this.procedureDraft.followUp = [...(this.procedureDraft.followUp ?? []), followUp];
    return this;
  }

  public addNote(note: ProcedureNote): this {
    this.procedureDraft.note = [...(this.procedureDraft.note ?? []), note];
    return this;
  }

  public addFocalDevice(focalDevice: ProcedureFocalDevice): this {
    this.procedureDraft.focalDevice = [...(this.procedureDraft.focalDevice ?? []), focalDevice];
    return this;
  }

  public addUsedReference(reference: Reference): this {
    this.procedureDraft.usedReference = [...(this.procedureDraft.usedReference ?? []), reference];
    return this;
  }

  public addUsedCode(usedCode: NonNullable<ProcedureCreateInput["usedCode"]>[number]): this {
    this.procedureDraft.usedCode = [...(this.procedureDraft.usedCode ?? []), usedCode];
    return this;
  }

  public setStatus(value: ProcedureCreateInput["status"]): this {
    this.procedureDraft.status = value;
    return this;
  }

  public setStatusReason(value: NonNullable<ProcedureCreateInput["statusReason"]>): this {
    this.procedureDraft.statusReason = value;
    return this;
  }

  public setCategory(value: NonNullable<ProcedureCreateInput["category"]>): this {
    this.procedureDraft.category = value;
    return this;
  }

  public setLocation(value: NonNullable<ProcedureCreateInput["location"]>): this {
    this.procedureDraft.location = value;
    return this;
  }

  public setOutcome(value: NonNullable<ProcedureCreateInput["outcome"]>): this {
    this.procedureDraft.outcome = value;
    return this;
  }

  public setRecorder(value: NonNullable<ProcedureCreateInput["recorder"]>): this {
    this.procedureDraft.recorder = value;
    return this;
  }

  public setAsserter(value: NonNullable<ProcedureCreateInput["asserter"]>): this {
    this.procedureDraft.asserter = value;
    return this;
  }

  public setPerformedDateTime(value: NonNullable<ProcedureCreateInput["performedDateTime"]>): this {
    this.procedureDraft.performedDateTime = value;
    delete this.procedureDraft.performedPeriod;
    return this;
  }

  public setPerformedPeriod(value: NonNullable<ProcedureCreateInput["performedPeriod"]>): this {
    this.procedureDraft.performedPeriod = value;
    delete this.procedureDraft.performedDateTime;
    return this;
  }

  public clearPerformed(): this {
    delete this.procedureDraft.performedDateTime;
    delete this.procedureDraft.performedPeriod;
    return this;
  }

  public buildProcedure(): ProcedureCreateInput {
    return ProcedureCreateSchema.parse(this.procedureDraft);
  }
}

export function createEncounterProcedureBuilder(
  input: EncounterProcedureBuilderInput,
): EncounterProcedureBuilder {
  return new EncounterProcedureBuilder(input);
}
