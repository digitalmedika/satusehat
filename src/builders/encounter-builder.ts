import { EncounterCreateSchema } from "../schemas/encounter";
import type { Reference } from "../schemas/common";
import type {
  EncounterClass,
  EncounterClassHistory,
  EncounterCreateInput,
  EncounterDiagnosis,
  EncounterHospitalization,
  EncounterIdentifier,
  EncounterLocation,
  EncounterParticipant,
  EncounterStatus,
  EncounterStatusHistory,
} from "../schemas/encounter";

const ENCOUNTER_CLASS_PRESETS = {
  outpatient: {
    system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    code: "AMB",
    display: "ambulatory",
  },
  inpatient: {
    system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    code: "IMP",
    display: "inpatient encounter",
  },
  emergency: {
    system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    code: "EMER",
    display: "emergency",
  },
} satisfies Record<string, EncounterClass>;

type EncounterBuilderCommonInput = {
  identifier: EncounterIdentifier | EncounterIdentifier[];
  status: EncounterStatus;
  statusHistory?: EncounterStatusHistory[];
  classHistory?: EncounterClassHistory[];
  type?: NonNullable<EncounterCreateInput["type"]>;
  serviceType?: EncounterCreateInput["serviceType"];
  priority?: EncounterCreateInput["priority"];
  subject: Reference;
  episodeOfCare?: Reference[];
  basedOn?: Reference[];
  participant?: EncounterParticipant[];
  period: EncounterCreateInput["period"];
  length?: EncounterCreateInput["length"];
  reasonCode:
    | EncounterCreateInput["reasonCode"][number]
    | EncounterCreateInput["reasonCode"];
  reasonReference?: Reference[];
  diagnosis: EncounterDiagnosis | EncounterDiagnosis[];
  account?: Reference[];
  hospitalization?: EncounterHospitalization;
  location: EncounterLocation | EncounterLocation[];
  serviceProvider: Reference;
  partOf?: Reference;
};

type EncounterBuilderPresetInput = EncounterBuilderCommonInput & {
  preset: keyof typeof ENCOUNTER_CLASS_PRESETS;
  encounterClass?: never;
};

type EncounterBuilderCustomClassInput = EncounterBuilderCommonInput & {
  preset?: never;
  encounterClass: EncounterClass;
};

export type EncounterBuilderPreset = keyof typeof ENCOUNTER_CLASS_PRESETS;
export type EncounterBuilderInput =
  | EncounterBuilderPresetInput
  | EncounterBuilderCustomClassInput;

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

function cloneEncounterClass(value: EncounterClass): EncounterClass {
  return { ...value };
}

function resolveEncounterClass(input: EncounterBuilderInput): EncounterClass {
  if ("encounterClass" in input && input.encounterClass) {
    return cloneEncounterClass(input.encounterClass);
  }

  return cloneEncounterClass(ENCOUNTER_CLASS_PRESETS[input.preset]);
}

export class EncounterBuilder {
  private draft: EncounterCreateInput;

  public constructor(input: EncounterBuilderInput) {
    const encounterClass = resolveEncounterClass(input);

    this.draft = EncounterCreateSchema.parse({
      resourceType: "Encounter",
      identifier: toArray(input.identifier),
      status: input.status,
      statusHistory: input.statusHistory ?? [
        {
          status: input.status,
          period: input.period,
        },
      ],
      class: encounterClass,
      classHistory: input.classHistory ?? [
        {
          class: encounterClass,
          period: input.period,
        },
      ],
      ...(input.type ? { type: input.type } : {}),
      ...(input.serviceType ? { serviceType: input.serviceType } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
      subject: input.subject,
      ...(input.episodeOfCare ? { episodeOfCare: input.episodeOfCare } : {}),
      ...(input.basedOn ? { basedOn: input.basedOn } : {}),
      ...(input.participant ? { participant: input.participant } : {}),
      period: input.period,
      ...(input.length ? { length: input.length } : {}),
      reasonCode: toArray(input.reasonCode),
      ...(input.reasonReference ? { reasonReference: input.reasonReference } : {}),
      diagnosis: toArray(input.diagnosis),
      ...(input.account ? { account: input.account } : {}),
      ...(input.hospitalization ? { hospitalization: input.hospitalization } : {}),
      location: toArray(input.location),
      serviceProvider: input.serviceProvider,
      ...(input.partOf ? { partOf: input.partOf } : {}),
    });
  }

  public addAccount(reference: Reference): this {
    this.draft.account = [...(this.draft.account ?? []), reference];
    return this;
  }

  public addBasedOn(reference: Reference): this {
    this.draft.basedOn = [...(this.draft.basedOn ?? []), reference];
    return this;
  }

  public addDiagnosis(diagnosis: EncounterDiagnosis): this {
    this.draft.diagnosis = [...this.draft.diagnosis, diagnosis];
    return this;
  }

  public addEpisodeOfCare(reference: Reference): this {
    this.draft.episodeOfCare = [...(this.draft.episodeOfCare ?? []), reference];
    return this;
  }

  public addIdentifier(identifier: EncounterIdentifier): this {
    this.draft.identifier = [...this.draft.identifier, identifier];
    return this;
  }

  public addLocation(location: EncounterLocation): this {
    this.draft.location = [...this.draft.location, location];
    return this;
  }

  public addParticipant(participant: EncounterParticipant): this {
    this.draft.participant = [...(this.draft.participant ?? []), participant];
    return this;
  }

  public addReasonCode(reasonCode: EncounterCreateInput["reasonCode"][number]): this {
    this.draft.reasonCode = [...this.draft.reasonCode, reasonCode];
    return this;
  }

  public addReasonReference(reference: Reference): this {
    this.draft.reasonReference = [...(this.draft.reasonReference ?? []), reference];
    return this;
  }

  public addStatusHistory(statusHistory: EncounterStatusHistory): this {
    this.draft.statusHistory = [...this.draft.statusHistory, statusHistory];
    return this;
  }

  public addClassHistory(classHistory: EncounterClassHistory): this {
    this.draft.classHistory = [...this.draft.classHistory, classHistory];
    return this;
  }

  public addType(type: NonNullable<EncounterCreateInput["type"]>[number]): this {
    this.draft.type = [...(this.draft.type ?? []), type];
    return this;
  }

  public merge(input: Partial<Omit<EncounterCreateInput, "resourceType">>): this {
    this.draft = EncounterCreateSchema.parse({
      ...this.draft,
      ...input,
    });
    return this;
  }

  public setClass(value: EncounterClass): this {
    this.draft.class = value;
    return this;
  }

  public setHospitalization(value: EncounterHospitalization): this {
    this.draft.hospitalization = value;
    return this;
  }

  public setLength(value: NonNullable<EncounterCreateInput["length"]>): this {
    this.draft.length = value;
    return this;
  }

  public setPartOf(reference: Reference): this {
    this.draft.partOf = reference;
    return this;
  }

  public setPeriod(value: EncounterCreateInput["period"]): this {
    this.draft.period = value;
    return this;
  }

  public setPreset(preset: EncounterBuilderPreset): this {
    this.draft.class = cloneEncounterClass(ENCOUNTER_CLASS_PRESETS[preset]);
    return this;
  }

  public setPriority(value: NonNullable<EncounterCreateInput["priority"]>): this {
    this.draft.priority = value;
    return this;
  }

  public setServiceProvider(reference: Reference): this {
    this.draft.serviceProvider = reference;
    return this;
  }

  public setServiceType(value: NonNullable<EncounterCreateInput["serviceType"]>): this {
    this.draft.serviceType = value;
    return this;
  }

  public setStatus(value: EncounterStatus): this {
    this.draft.status = value;
    return this;
  }

  public setSubject(reference: Reference): this {
    this.draft.subject = reference;
    return this;
  }

  public build(): EncounterCreateInput {
    return EncounterCreateSchema.parse(this.draft);
  }
}

export function createEncounterBuilder(input: EncounterBuilderInput): EncounterBuilder {
  return new EncounterBuilder(input);
}
