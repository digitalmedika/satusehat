import { RiskAssessmentCreateSchema } from "../schemas/risk-assessment";
import type { Reference } from "../schemas/common";
import type {
  RiskAssessmentCreateInput,
  RiskAssessmentNote,
  RiskAssessmentPrediction,
  RiskAssessmentStatus,
} from "../schemas/risk-assessment";

export interface RiskAssessmentBuilderInput {
  subject: Reference;
  status: RiskAssessmentStatus;
  code?: RiskAssessmentCreateInput["code"];
  encounter?: Reference;
  occurrenceDateTime?: string;
  performer?: Reference;
  condition?: Reference;
  reasonCode?: RiskAssessmentCreateInput["reasonCode"];
  reasonReference?: Reference;
  method?: RiskAssessmentCreateInput["method"];
  mitigation?: string;
}

export class RiskAssessmentBuilder {
  private draft: RiskAssessmentCreateInput;

  public constructor(input: RiskAssessmentBuilderInput) {
    this.draft = RiskAssessmentCreateSchema.parse({
      resourceType: "RiskAssessment",
      subject: input.subject,
      status: input.status,
      ...(input.code ? { code: input.code } : {}),
      ...(input.encounter ? { encounter: input.encounter } : {}),
      ...(input.occurrenceDateTime ? { occurrenceDateTime: input.occurrenceDateTime } : {}),
      ...(input.performer ? { performer: input.performer } : {}),
      ...(input.condition ? { condition: input.condition } : {}),
      ...(input.reasonCode ? { reasonCode: input.reasonCode } : {}),
      ...(input.reasonReference ? { reasonReference: input.reasonReference } : {}),
      ...(input.method ? { method: input.method } : {}),
      ...(input.mitigation ? { mitigation: input.mitigation } : {}),
    });
  }

  public addBasis(reference: Reference): this {
    this.draft.basis = [...(this.draft.basis ?? []), reference];
    return this;
  }

  public addIdentifier(identifier: NonNullable<RiskAssessmentCreateInput["identifier"]>[number]): this {
    this.draft.identifier = [...(this.draft.identifier ?? []), identifier];
    return this;
  }

  public addNote(note: RiskAssessmentNote): this {
    this.draft.note = [...(this.draft.note ?? []), note];
    return this;
  }

  public addPrediction(prediction: RiskAssessmentPrediction): this {
    this.draft.prediction = [...(this.draft.prediction ?? []), prediction];
    return this;
  }

  public merge(input: Partial<Omit<RiskAssessmentCreateInput, "resourceType">>): this {
    this.draft = RiskAssessmentCreateSchema.parse({
      ...this.draft,
      ...input,
    });
    return this;
  }

  public setBasedOn(reference: Reference): this {
    this.draft.basedOn = reference;
    return this;
  }

  public setCode(code: NonNullable<RiskAssessmentCreateInput["code"]>): this {
    this.draft.code = code;
    return this;
  }

  public setCondition(reference: Reference): this {
    this.draft.condition = reference;
    return this;
  }

  public setEncounter(reference: Reference): this {
    this.draft.encounter = reference;
    return this;
  }

  public setMethod(method: NonNullable<RiskAssessmentCreateInput["method"]>): this {
    this.draft.method = method;
    return this;
  }

  public setMitigation(mitigation: string): this {
    this.draft.mitigation = mitigation;
    return this;
  }

  public setOccurrenceDateTime(value: string): this {
    delete this.draft.occurrencePeriod;
    this.draft.occurrenceDateTime = value;
    return this;
  }

  public setOccurrencePeriod(value: NonNullable<RiskAssessmentCreateInput["occurrencePeriod"]>): this {
    delete this.draft.occurrenceDateTime;
    this.draft.occurrencePeriod = value;
    return this;
  }

  public setPerformer(reference: Reference): this {
    this.draft.performer = reference;
    return this;
  }

  public setReasonCode(reasonCode: NonNullable<RiskAssessmentCreateInput["reasonCode"]>): this {
    this.draft.reasonCode = reasonCode;
    return this;
  }

  public setReasonReference(reference: Reference): this {
    this.draft.reasonReference = reference;
    return this;
  }

  public setStatus(status: RiskAssessmentStatus): this {
    this.draft.status = status;
    return this;
  }

  public setSubject(reference: Reference): this {
    this.draft.subject = reference;
    return this;
  }

  public build(): RiskAssessmentCreateInput {
    return RiskAssessmentCreateSchema.parse(this.draft);
  }
}

export function createRiskAssessmentBuilder(
  input: RiskAssessmentBuilderInput,
): RiskAssessmentBuilder {
  return new RiskAssessmentBuilder(input);
}
