import {
  createServiceRequestImagingStudyDiagnosticReportBuilder,
  type ServiceRequestImagingStudyDiagnosticReportBuilder,
} from "./service-request-imaging-study-diagnostic-report-builder";
import type { Reference } from "../schemas/common";
import type { DiagnosticReportCreateInput } from "../schemas/diagnostic-report";
import type { ImagingStudyCreateInput } from "../schemas/imaging-study";
import type { ServiceRequestCreateInput } from "../schemas/service-request";

export interface ChestXRayStudyBuilderInput {
  subject: Reference;
  encounter: Reference;
  organizationId: string;
  accessionNumber: string;
  identifierUse?: string;
  serviceRequest?: Partial<
    Omit<ServiceRequestCreateInput, "resourceType" | "subject" | "encounter" | "status" | "intent" | "code">
  >;
  imagingStudy?: Partial<
    Omit<
      ImagingStudyCreateInput,
      "resourceType" | "subject" | "encounter" | "basedOn" | "identifier" | "status" | "modality"
    >
  >;
  diagnosticReport?: Partial<
    Omit<DiagnosticReportCreateInput, "resourceType" | "subject" | "encounter" | "status" | "code">
  >;
}

const CHEST_XRAY_CODE = {
  coding: [
    {
      system: "http://loinc.org",
      code: "42272-5",
      display: "XR Chest PA and Lateral",
    },
  ],
};

const CHEST_XRAY_MODALITY = [
  {
    system: "http://dicom.nema.org/resources/ontology/DCM",
    code: "CR",
    display: "Computed Radiography",
  },
];

const RADIOLOGY_DIAGNOSTIC_REPORT_CATEGORY = [
  {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/v2-0074",
        code: "RAD",
        display: "Radiology",
      },
    ],
  },
];

export function createChestXRayStudyBuilder(
  input: ChestXRayStudyBuilderInput,
): ServiceRequestImagingStudyDiagnosticReportBuilder {
  return createServiceRequestImagingStudyDiagnosticReportBuilder({
    subject: input.subject,
    encounter: input.encounter,
    serviceRequest: {
      status: "active",
      intent: "order",
      code: CHEST_XRAY_CODE,
      ...input.serviceRequest,
    },
    imagingStudy: {
      identifier: [
        {
          system: `http://sys-ids.kemkes.go.id/acsn/${input.organizationId}`,
          use: input.identifierUse ?? "usual",
          value: input.accessionNumber,
        },
      ],
      status: "available",
      modality: CHEST_XRAY_MODALITY,
      description: "XR Chest PA and Lateral",
      ...input.imagingStudy,
    },
    diagnosticReport: {
      status: "final",
      code: CHEST_XRAY_CODE,
      category: RADIOLOGY_DIAGNOSTIC_REPORT_CATEGORY,
      ...input.diagnosticReport,
    },
  });
}
