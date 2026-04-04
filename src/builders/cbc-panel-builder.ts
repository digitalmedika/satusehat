import { createLaboratoryPanelBuilder, type LaboratoryPanelBuilder } from "./laboratory-panel-builder";
import type { ObservationCreateInput, ObservationQuantity } from "../schemas/observation";
import type { Reference } from "../schemas/common";
import type { DiagnosticReportCreateInput } from "../schemas/diagnostic-report";
import type { ServiceRequestCreateInput } from "../schemas/service-request";
import type { SpecimenCreateInput } from "../schemas/specimen";

export type CompleteBloodCountObservationKey =
  | "wbc"
  | "rbc"
  | "hemoglobin"
  | "hematocrit"
  | "mcv"
  | "mch"
  | "mchc"
  | "platelets"
  | "rdw"
  | "pdw"
  | "mpv";

export interface CompleteBloodCountPanelBuilderInput {
  subject: Reference;
  encounter: Reference;
  serviceRequest?: Partial<Omit<ServiceRequestCreateInput, "resourceType" | "subject" | "encounter" | "status" | "intent" | "code">>;
  specimen?: Partial<Omit<SpecimenCreateInput, "resourceType" | "subject" | "status" | "type">>;
  diagnosticReport?: Partial<
    Omit<DiagnosticReportCreateInput, "resourceType" | "subject" | "encounter" | "status" | "code">
  >;
  observationDefaults?: Partial<
    Omit<ObservationCreateInput, "resourceType" | "subject" | "encounter" | "status" | "code">
  >;
  results?: Partial<Record<CompleteBloodCountObservationKey, number | ObservationQuantity>>;
  includeOptionalObservations?: boolean;
}

interface CompleteBloodCountObservationPreset {
  key: CompleteBloodCountObservationKey;
  required: boolean;
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  quantity?: Omit<ObservationQuantity, "value">;
}

const CBC_PANEL_CODE = {
  coding: [
    {
      system: "http://loinc.org",
      code: "58410-2",
      display: "CBC panel - Blood by Automated count",
    },
  ],
};

const BLOOD_SPECIMEN_TYPE = {
  coding: [
    {
      system: "http://snomed.info/sct",
      code: "119297000",
      display: "Blood specimen",
    },
  ],
};

const LABORATORY_CATEGORY = [
  {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/observation-category",
        code: "laboratory",
        display: "Laboratory",
      },
    ],
  },
];

const CBC_OBSERVATION_PRESETS: CompleteBloodCountObservationPreset[] = [
  {
    key: "wbc",
    required: true,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "6690-2",
          display: "Leukocytes [#/volume] in Blood by Automated count",
        },
      ],
    },
    quantity: {
      unit: "10*3/uL",
      system: "http://unitsofmeasure.org",
      code: "10*3/uL",
    },
  },
  {
    key: "rbc",
    required: true,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "789-8",
          display: "Erythrocytes [#/volume] in Blood by Automated count",
        },
      ],
    },
    quantity: {
      unit: "10*6/uL",
      system: "http://unitsofmeasure.org",
      code: "10*6/uL",
    },
  },
  {
    key: "hemoglobin",
    required: true,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "718-7",
          display: "Hemoglobin [Mass/volume] in Blood",
        },
      ],
    },
    quantity: {
      unit: "g/dL",
      system: "http://unitsofmeasure.org",
      code: "g/dL",
    },
  },
  {
    key: "hematocrit",
    required: true,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "4544-3",
          display: "Hematocrit [Volume Fraction] of Blood by Automated count",
        },
      ],
    },
    quantity: {
      unit: "%",
      system: "http://unitsofmeasure.org",
      code: "%",
    },
  },
  {
    key: "mcv",
    required: true,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "787-2",
          display: "MCV [Entitic mean volume] in Red Blood Cells by Automated count",
        },
      ],
    },
    quantity: {
      unit: "fL",
      system: "http://unitsofmeasure.org",
      code: "fL",
    },
  },
  {
    key: "mch",
    required: true,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "785-6",
          display: "MCH [Entitic mass] by Automated count",
        },
      ],
    },
    quantity: {
      unit: "pg",
      system: "http://unitsofmeasure.org",
      code: "pg",
    },
  },
  {
    key: "mchc",
    required: true,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "786-4",
          display: "MCHC [Entitic Mass/volume] in Red Blood Cells by Automated count",
        },
      ],
    },
    quantity: {
      unit: "g/dL",
      system: "http://unitsofmeasure.org",
      code: "g/dL",
    },
  },
  {
    key: "platelets",
    required: true,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "777-3",
          display: "Platelets [#/volume] in Blood by Automated count",
        },
      ],
    },
    quantity: {
      unit: "10*3/uL",
      system: "http://unitsofmeasure.org",
      code: "10*3/uL",
    },
  },
  {
    key: "rdw",
    required: false,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "788-0",
          display: "Erythrocyte distribution width [Ratio] by Automated count",
        },
      ],
    },
    quantity: {
      unit: "%",
      system: "http://unitsofmeasure.org",
      code: "%",
    },
  },
  {
    key: "pdw",
    required: false,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "32207-3",
          display: "Platelet distribution width [Entitic volume] in Blood by Automated count",
        },
      ],
    },
    quantity: {
      unit: "fL",
      system: "http://unitsofmeasure.org",
      code: "fL",
    },
  },
  {
    key: "mpv",
    required: false,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "32623-1",
          display: "Platelet mean volume [Entitic volume] in Blood by Automated count",
        },
      ],
    },
    quantity: {
      unit: "fL",
      system: "http://unitsofmeasure.org",
      code: "fL",
    },
  },
];

export function createCompleteBloodCountPanelBuilder(
  input: CompleteBloodCountPanelBuilderInput,
): LaboratoryPanelBuilder {
  const builder = createLaboratoryPanelBuilder({
    subject: input.subject,
    encounter: input.encounter,
    serviceRequest: {
      status: "active",
      intent: "order",
      code: CBC_PANEL_CODE,
      category: LABORATORY_CATEGORY,
      ...input.serviceRequest,
    },
    specimen: {
      status: "available",
      type: BLOOD_SPECIMEN_TYPE,
      ...input.specimen,
    },
    diagnosticReport: {
      status: "final",
      code: CBC_PANEL_CODE,
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0074",
              code: "LAB",
              display: "Laboratory",
            },
          ],
        },
      ],
      ...input.diagnosticReport,
    },
    observationDefaults: {
      category: LABORATORY_CATEGORY,
      ...(input.observationDefaults ?? {}),
    },
  });

  for (const preset of CBC_OBSERVATION_PRESETS) {
    const hasProvidedResult = input.results?.[preset.key] !== undefined;

    if (!preset.required && !input.includeOptionalObservations && !hasProvidedResult) {
      continue;
    }

    builder.addObservation(preset.key, {
      status: "final",
      code: preset.code,
    });

    const resultValue = input.results?.[preset.key];

    if (resultValue === undefined) {
      continue;
    }

    builder.setObservationValueQuantity(preset.key, normalizeObservationQuantity(resultValue, preset.quantity));
  }

  return builder;
}

function normalizeObservationQuantity(
  value: number | ObservationQuantity,
  presetQuantity?: Omit<ObservationQuantity, "value">,
): ObservationQuantity {
  if (typeof value === "number") {
    return {
      value,
      ...(presetQuantity ?? {}),
    };
  }

  return value;
}
