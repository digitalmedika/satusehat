import {
  EncounterClassSchema,
  EncounterAdmitSourceSchema,
  EncounterCreateSchema,
  EncounterDischargeDispositionSchema,
  EncounterHospitalizationSchema,
  EncounterIdentifierSchema,
  EncounterLocationSchema,
  EncounterLocationServiceClassExtensionSchema,
  EncounterParticipantSchema,
} from "../schemas/encounter";
import { ReferenceSchema } from "../schemas/common";
import { createEncounterDiagnosis } from "./encounter-condition-builder";
import type { Reference } from "../schemas/common";
import type {
  EncounterAdmitSource,
  EncounterClass,
  EncounterClassHistory,
  EncounterCreateInput,
  EncounterDischargeDisposition,
  EncounterDiagnosis,
  EncounterHospitalization,
  EncounterIdentifier,
  EncounterLocation,
  EncounterLocationServiceClassExtension,
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
  reasonCode?:
    | NonNullable<EncounterCreateInput["reasonCode"]>[number]
    | NonNullable<EncounterCreateInput["reasonCode"]>
    | undefined;
  reasonReference?: Reference[];
  diagnosis?: EncounterDiagnosis | EncounterDiagnosis[] | undefined;
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

export type EncounterHospitalizationHelperInput = Omit<
  EncounterHospitalization,
  "admitSource" | "dischargeDisposition"
> & {
  admitSource?: EncounterAdmitSource | string;
  dischargeDisposition?: EncounterDischargeDisposition | string;
};

export interface EmergencyEncounterStatusStageInput {
  status: EncounterStatus;
  start: string;
}

export type EmergencyEncounterClassStageInput =
  | {
      start: string;
      preset: EncounterBuilderPreset;
      encounterClass?: never;
    }
  | {
      start: string;
      preset?: never;
      encounterClass: EncounterClass;
    };

export interface EmergencyEncounterHistoryInput {
  statusStages: [
    EmergencyEncounterStatusStageInput,
    ...EmergencyEncounterStatusStageInput[],
  ];
  periodEnd: string;
  classStages?: [
    EmergencyEncounterClassStageInput,
    ...EmergencyEncounterClassStageInput[],
  ];
}

export interface EmergencyEncounterHistoryResult {
  status: EncounterStatus;
  period: EncounterCreateInput["period"];
  encounterClass: EncounterClass;
  statusHistory: EncounterStatusHistory[];
  classHistory: EncounterClassHistory[];
}

export type EncounterConsultationMethod =
  | "RAJAL"
  | "IGD"
  | "RANAP"
  | "HOMECARE"
  | "TELEKONSULTASI";

export interface EncounterParticipantHelperInput {
  practitionerId: string;
  display?: string;
  typeCode?: string;
  typeDisplay?: string;
  typeText?: string;
}

export interface EncounterLocationHelperInput {
  locationId: string;
  display?: string;
  status?: EncounterLocation["status"];
  period?: EncounterLocation["period"];
  physicalType?: EncounterLocation["physicalType"];
  extension?: EncounterLocation["extension"];
}

export interface EncounterStatusTimelineStageInput {
  status: EncounterStatus;
  start: string;
}

export interface EncounterStatusTimelineInput {
  stages: [
    EncounterStatusTimelineStageInput,
    ...EncounterStatusTimelineStageInput[],
  ];
  periodEnd: string;
}

export interface EncounterStatusTimelineResult {
  status: EncounterStatus;
  period: EncounterCreateInput["period"];
  statusHistory: EncounterStatusHistory[];
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

function cloneEncounterClass(value: EncounterClass): EncounterClass {
  return { ...value };
}

function parseIsoDateTime(value: string, label: string): number {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    throw new TypeError(`${label} must be a valid ISO date-time string`);
  }

  return timestamp;
}

function assertAscendingTimeline(
  label: string,
  starts: { start: string }[],
  periodEnd: string,
): void {
  const endTimestamp = parseIsoDateTime(periodEnd, `${label} periodEnd`);

  let previousTimestamp: number | undefined;

  starts.forEach((entry, index) => {
    const currentTimestamp = parseIsoDateTime(
      entry.start,
      `${label} stage ${index + 1} start`,
    );

    if (previousTimestamp !== undefined && currentTimestamp <= previousTimestamp) {
      throw new RangeError(`${label} stages must be sorted in strictly ascending order`);
    }

    if (currentTimestamp >= endTimestamp) {
      throw new RangeError(`${label} stage ${index + 1} must start before periodEnd`);
    }

    previousTimestamp = currentTimestamp;
  });
}

function resolveEncounterClass(input: EncounterBuilderInput): EncounterClass {
  if ("encounterClass" in input && input.encounterClass) {
    return cloneEncounterClass(input.encounterClass);
  }

  return cloneEncounterClass(ENCOUNTER_CLASS_PRESETS[input.preset]);
}

function resolveEncounterClassStage(
  input: EmergencyEncounterClassStageInput,
): EncounterClass {
  if ("encounterClass" in input && input.encounterClass) {
    return cloneEncounterClass(input.encounterClass);
  }

  return cloneEncounterClass(ENCOUNTER_CLASS_PRESETS[input.preset]);
}

function createStatusHistoryFromStages(
  stages:
    | EmergencyEncounterHistoryInput["statusStages"]
    | EncounterStatusTimelineInput["stages"],
  periodEnd: string,
): EncounterStatusHistory[] {
  return stages.map((stage, index) => ({
    status: stage.status,
    period: {
      start: stage.start,
      end: stages[index + 1]?.start ?? periodEnd,
    },
  }));
}

function createClassHistoryFromStages(
  stages: [
    EmergencyEncounterClassStageInput,
    ...EmergencyEncounterClassStageInput[],
  ],
  periodEnd: string,
): EncounterClassHistory[] {
  return stages.map((stage, index) => ({
    class: resolveEncounterClassStage(stage),
    period: {
      start: stage.start,
      end: stages[index + 1]?.start ?? periodEnd,
    },
  }));
}

function normalizeAdmitSource(
  admitSource: EncounterHospitalizationHelperInput["admitSource"],
): EncounterAdmitSource | undefined {
  if (!admitSource) {
    return undefined;
  }

  if (typeof admitSource === "string") {
    return EncounterAdmitSourceSchema.parse({
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/admit-source",
          code: admitSource,
        },
      ],
    });
  }

  return EncounterAdmitSourceSchema.parse(admitSource);
}

function normalizeDischargeDisposition(
  dischargeDisposition: EncounterHospitalizationHelperInput["dischargeDisposition"],
): EncounterDischargeDisposition | undefined {
  if (!dischargeDisposition) {
    return undefined;
  }

  if (typeof dischargeDisposition === "string") {
    return EncounterDischargeDispositionSchema.parse({
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/discharge-disposition",
          code: dischargeDisposition,
        },
      ],
    });
  }

  return EncounterDischargeDispositionSchema.parse(dischargeDisposition);
}

export function createEncounterIdentifier(
  organizationId: string,
  registrationId: string,
  use: EncounterIdentifier["use"] = "official",
): EncounterIdentifier {
  return EncounterIdentifierSchema.parse({
    system: `http://sys-ids.kemkes.go.id/encounter/${organizationId}`,
    use,
    value: registrationId,
  });
}

export function createEncounterServiceProviderReference(
  organizationId: string,
  display?: string,
): Reference {
  return ReferenceSchema.parse({
    reference: `Organization/${organizationId}`,
    ...(display ? { display } : {}),
  });
}

export function createEncounterParticipant(
  input: EncounterParticipantHelperInput,
): EncounterParticipant {
  return EncounterParticipantSchema.parse({
    type: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
            code: input.typeCode ?? "ATND",
            display: input.typeDisplay ?? "attender",
          },
        ],
        ...(input.typeText ? { text: input.typeText } : {}),
      },
    ],
    individual: {
      reference: `Practitioner/${input.practitionerId}`,
      ...(input.display ? { display: input.display } : {}),
    },
  });
}

export function createEncounterLocation(
  input: EncounterLocationHelperInput,
): EncounterLocation {
  return EncounterLocationSchema.parse({
    location: {
      reference: `Location/${input.locationId}`,
      ...(input.display ? { display: input.display } : {}),
    },
    ...(input.status ? { status: input.status } : {}),
    ...(input.period ? { period: input.period } : {}),
    ...(input.physicalType ? { physicalType: input.physicalType } : {}),
    ...(input.extension ? { extension: input.extension } : {}),
  });
}

export function createEncounterClassFromConsultationMethod(
  method: EncounterConsultationMethod,
): EncounterClass {
  const encounterClassByMethod = {
    RAJAL: ENCOUNTER_CLASS_PRESETS.outpatient,
    IGD: ENCOUNTER_CLASS_PRESETS.emergency,
    RANAP: ENCOUNTER_CLASS_PRESETS.inpatient,
    HOMECARE: {
      system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      code: "HH",
      display: "home health",
    },
    TELEKONSULTASI: {
      system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      code: "TELE",
      display: "teleconsultation",
    },
  } satisfies Record<EncounterConsultationMethod, EncounterClass>;

  return EncounterClassSchema.parse(encounterClassByMethod[method]);
}

export function createEncounterHospitalization(
  input: EncounterHospitalizationHelperInput,
): EncounterHospitalization {
  const hospitalization = {
    ...input,
    ...(input.admitSource ? { admitSource: normalizeAdmitSource(input.admitSource) } : {}),
    ...(input.dischargeDisposition
      ? {
          dischargeDisposition: normalizeDischargeDisposition(input.dischargeDisposition),
        }
      : {}),
  };

  return EncounterHospitalizationSchema.parse(hospitalization);
}

export function createEmergencyEncounterHistory(
  input: EmergencyEncounterHistoryInput,
): EmergencyEncounterHistoryResult {
  const [firstStatusStage] = input.statusStages;

  if (firstStatusStage.status !== "arrived") {
    throw new RangeError("Emergency encounter flow must start with status 'arrived'");
  }

  assertAscendingTimeline("Emergency encounter status", input.statusStages, input.periodEnd);

  const classStages = input.classStages ?? [
    {
      start: firstStatusStage.start,
      preset: "emergency",
    },
  ];

  assertAscendingTimeline("Emergency encounter class", classStages, input.periodEnd);

  if (classStages[0]?.start !== firstStatusStage.start) {
    throw new RangeError(
      "Emergency encounter class timeline must start at the same time as the first status stage",
    );
  }

  const statusHistory = createStatusHistoryFromStages(input.statusStages, input.periodEnd);
  const classHistory = createClassHistoryFromStages(classStages, input.periodEnd);
  const lastStatusStage = input.statusStages[input.statusStages.length - 1]!;
  const lastClassStage = classStages[classStages.length - 1]!;

  return {
    status: lastStatusStage.status,
    period: {
      start: firstStatusStage.start,
      end: input.periodEnd,
    },
    encounterClass: resolveEncounterClassStage(lastClassStage),
    statusHistory,
    classHistory,
  };
}

export function createEncounterStatusTimeline(
  input: EncounterStatusTimelineInput,
): EncounterStatusTimelineResult {
  const endTimestamp = parseIsoDateTime(input.periodEnd, "Encounter status periodEnd");
  let previousTimestamp: number | undefined;

  input.stages.forEach((stage, index) => {
    const currentTimestamp = parseIsoDateTime(
      stage.start,
      `Encounter status stage ${index + 1} start`,
    );

    if (previousTimestamp !== undefined && currentTimestamp <= previousTimestamp) {
      throw new RangeError("Encounter status stages must be sorted in strictly ascending order");
    }

    if (currentTimestamp > endTimestamp) {
      throw new RangeError(`Encounter status stage ${index + 1} must start on or before periodEnd`);
    }

    previousTimestamp = currentTimestamp;
  });

  const statusHistory = createStatusHistoryFromStages(input.stages, input.periodEnd);
  const firstStage = input.stages[0];
  const lastStage = input.stages[input.stages.length - 1]!;

  return {
    status: lastStage.status,
    period: {
      start: firstStage.start,
      end: input.periodEnd,
    },
    statusHistory,
  };
}

export function createEncounterLocationServiceClassExtension(
  valueCode: string,
): EncounterLocationServiceClassExtension {
  return EncounterLocationServiceClassExtensionSchema.parse({
    url: "https://fhir.kemkes.go.id/r4/StructureDefinition/serviceClass",
    extension: [
      {
        url: "valueCode",
        valueCode,
      },
    ],
  });
}

export function withEncounterLocationServiceClass(
  location: EncounterLocation,
  valueCode: string,
): EncounterLocation {
  return EncounterLocationSchema.parse({
    ...location,
    extension: [
      ...(location.extension ?? []).filter(
        (entry) =>
          !(
            typeof entry === "object" &&
            entry !== null &&
            "url" in entry &&
            entry.url === "https://fhir.kemkes.go.id/r4/StructureDefinition/serviceClass"
          ),
      ),
      createEncounterLocationServiceClassExtension(valueCode),
    ],
  });
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
      ...(input.reasonCode ? { reasonCode: toArray(input.reasonCode) } : {}),
      ...(input.reasonReference ? { reasonReference: input.reasonReference } : {}),
      ...(input.diagnosis ? { diagnosis: toArray(input.diagnosis) } : {}),
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
    this.draft.diagnosis = [...(this.draft.diagnosis ?? []), diagnosis];
    return this;
  }

  public addDiagnosisByCondition(
    conditionId: string,
    options?: {
      display?: string;
      use?: EncounterDiagnosis["use"];
      rank?: number;
    },
  ): this {
    return this.addDiagnosis(
      createEncounterDiagnosis({
        conditionReference: {
          reference: `Condition/${conditionId}`,
          ...(options?.display ? { display: options.display } : {}),
        },
        ...(options?.use ? { use: options.use } : {}),
        ...(options?.rank !== undefined ? { rank: options.rank } : {}),
      }),
    );
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

  public addReasonCode(reasonCode: NonNullable<EncounterCreateInput["reasonCode"]>[number]): this {
    this.draft.reasonCode = [...(this.draft.reasonCode ?? []), reasonCode];
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

  public setInpatientHospitalization(input: EncounterHospitalizationHelperInput): this {
    this.draft.hospitalization = createEncounterHospitalization(input);
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

  public setConsultationMethod(method: EncounterConsultationMethod): this {
    this.draft.class = createEncounterClassFromConsultationMethod(method);
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

  public setLocationServiceClass(locationIndex: number, valueCode: string): this {
    const location = this.draft.location[locationIndex];

    if (!location) {
      throw new RangeError(`Encounter location at index ${locationIndex} does not exist`);
    }

    this.draft.location[locationIndex] = withEncounterLocationServiceClass(location, valueCode);
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
