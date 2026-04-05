import { MedicationAdministrationCreateSchema } from "../schemas/medication-administration";
import type { Reference } from "../schemas/common";
import type {
  MedicationAdministrationCreateInput,
  MedicationAdministrationDosage,
  MedicationAdministrationIdentifier,
  MedicationAdministrationNote,
  MedicationAdministrationPerformer,
  MedicationAdministrationStatus,
} from "../schemas/medication-administration";

type MedicationAdministrationMedicationChoice =
  | {
      medicationCodeableConcept: NonNullable<
        MedicationAdministrationCreateInput["medicationCodeableConcept"]
      >;
      medicationReference?: never;
    }
  | {
      medicationCodeableConcept?: never;
      medicationReference: NonNullable<
        MedicationAdministrationCreateInput["medicationReference"]
      >;
    };

type MedicationAdministrationEffectiveChoice =
  | {
      effectiveDateTime: NonNullable<
        MedicationAdministrationCreateInput["effectiveDateTime"]
      >;
      effectivePeriod?: never;
    }
  | {
      effectiveDateTime?: never;
      effectivePeriod: NonNullable<MedicationAdministrationCreateInput["effectivePeriod"]>;
    };

type MedicationAdministrationMutableInput = Partial<
  Omit<
    MedicationAdministrationCreateInput,
    | "resourceType"
    | "subject"
    | "context"
    | "medicationCodeableConcept"
    | "medicationReference"
    | "effectiveDateTime"
    | "effectivePeriod"
  >
>;

export interface EncounterMedicationAdministrationBuilderInput {
  subject: Reference;
  encounter: Reference;
  medicationAdministration: Pick<MedicationAdministrationCreateInput, "status"> &
    MedicationAdministrationMedicationChoice &
    MedicationAdministrationEffectiveChoice &
    MedicationAdministrationMutableInput;
}

export class EncounterMedicationAdministrationBuilder {
  private medicationAdministrationDraft: MedicationAdministrationCreateInput;

  public constructor(input: EncounterMedicationAdministrationBuilderInput) {
    this.medicationAdministrationDraft = MedicationAdministrationCreateSchema.parse({
      resourceType: "MedicationAdministration",
      subject: input.subject,
      context: input.encounter,
      ...input.medicationAdministration,
    });
  }

  public setSubject(subject: Reference): this {
    this.medicationAdministrationDraft.subject = subject;
    return this;
  }

  public setEncounter(encounter: Reference): this {
    this.medicationAdministrationDraft.context = encounter;
    return this;
  }

  public mergeMedicationAdministration(input: MedicationAdministrationMutableInput): this {
    this.medicationAdministrationDraft = MedicationAdministrationCreateSchema.parse({
      ...this.medicationAdministrationDraft,
      ...input,
    });
    return this;
  }

  public addIdentifier(identifier: MedicationAdministrationIdentifier): this {
    this.medicationAdministrationDraft.identifier = [
      ...(this.medicationAdministrationDraft.identifier ?? []),
      identifier,
    ];
    return this;
  }

  public addInstantiates(uri: string): this {
    this.medicationAdministrationDraft.instantiates = [
      ...(this.medicationAdministrationDraft.instantiates ?? []),
      uri,
    ];
    return this;
  }

  public addPartOf(reference: Reference): this {
    this.medicationAdministrationDraft.partOf = [
      ...(this.medicationAdministrationDraft.partOf ?? []),
      reference,
    ];
    return this;
  }

  public addStatusReason(
    reason: NonNullable<MedicationAdministrationCreateInput["statusReason"]>[number],
  ): this {
    this.medicationAdministrationDraft.statusReason = [
      ...(this.medicationAdministrationDraft.statusReason ?? []),
      reason,
    ];
    return this;
  }

  public setCategory(category: NonNullable<MedicationAdministrationCreateInput["category"]>): this {
    this.medicationAdministrationDraft.category = category;
    return this;
  }

  public setMedicationCodeableConcept(
    medicationCodeableConcept: NonNullable<
      MedicationAdministrationCreateInput["medicationCodeableConcept"]
    >,
  ): this {
    this.medicationAdministrationDraft.medicationCodeableConcept = medicationCodeableConcept;
    delete this.medicationAdministrationDraft.medicationReference;
    return this;
  }

  public setMedicationReference(
    medicationReference: NonNullable<MedicationAdministrationCreateInput["medicationReference"]>,
  ): this {
    this.medicationAdministrationDraft.medicationReference = medicationReference;
    delete this.medicationAdministrationDraft.medicationCodeableConcept;
    return this;
  }

  public addSupportingInformation(reference: Reference): this {
    this.medicationAdministrationDraft.supportingInformation = [
      ...(this.medicationAdministrationDraft.supportingInformation ?? []),
      reference,
    ];
    return this;
  }

  public setEffectiveDateTime(
    effectiveDateTime: NonNullable<MedicationAdministrationCreateInput["effectiveDateTime"]>,
  ): this {
    this.medicationAdministrationDraft.effectiveDateTime = effectiveDateTime;
    delete this.medicationAdministrationDraft.effectivePeriod;
    return this;
  }

  public setEffectivePeriod(
    effectivePeriod: NonNullable<MedicationAdministrationCreateInput["effectivePeriod"]>,
  ): this {
    this.medicationAdministrationDraft.effectivePeriod = effectivePeriod;
    delete this.medicationAdministrationDraft.effectiveDateTime;
    return this;
  }

  public clearEffective(): this {
    delete this.medicationAdministrationDraft.effectiveDateTime;
    delete this.medicationAdministrationDraft.effectivePeriod;
    return this;
  }

  public addPerformer(performer: MedicationAdministrationPerformer): this {
    this.medicationAdministrationDraft.performer = [
      ...(this.medicationAdministrationDraft.performer ?? []),
      performer,
    ];
    return this;
  }

  public addReasonCode(
    reasonCode: NonNullable<MedicationAdministrationCreateInput["reasonCode"]>[number],
  ): this {
    this.medicationAdministrationDraft.reasonCode = [
      ...(this.medicationAdministrationDraft.reasonCode ?? []),
      reasonCode,
    ];
    return this;
  }

  public addReasonReference(reference: Reference): this {
    this.medicationAdministrationDraft.reasonReference = [
      ...(this.medicationAdministrationDraft.reasonReference ?? []),
      reference,
    ];
    return this;
  }

  public setRequest(request: NonNullable<MedicationAdministrationCreateInput["request"]>): this {
    this.medicationAdministrationDraft.request = request;
    return this;
  }

  public addDevice(reference: Reference): this {
    this.medicationAdministrationDraft.device = [
      ...(this.medicationAdministrationDraft.device ?? []),
      reference,
    ];
    return this;
  }

  public addNote(note: MedicationAdministrationNote): this {
    this.medicationAdministrationDraft.note = [
      ...(this.medicationAdministrationDraft.note ?? []),
      note,
    ];
    return this;
  }

  public setDosage(dosage: MedicationAdministrationDosage): this {
    this.medicationAdministrationDraft.dosage = dosage;
    return this;
  }

  public addEventHistory(reference: Reference): this {
    this.medicationAdministrationDraft.eventHistory = [
      ...(this.medicationAdministrationDraft.eventHistory ?? []),
      reference,
    ];
    return this;
  }

  public setStatus(status: MedicationAdministrationStatus): this {
    this.medicationAdministrationDraft.status = status;
    return this;
  }

  public buildMedicationAdministration(): MedicationAdministrationCreateInput {
    return MedicationAdministrationCreateSchema.parse(this.medicationAdministrationDraft);
  }
}

export function createEncounterMedicationAdministrationBuilder(
  input: EncounterMedicationAdministrationBuilderInput,
): EncounterMedicationAdministrationBuilder {
  return new EncounterMedicationAdministrationBuilder(input);
}
