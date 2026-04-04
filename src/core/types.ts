export type MaybePromise<T> = T | Promise<T>;

export type SatuSehatEnvironment = "sandbox" | "production";

export type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export type PrimitiveQueryValue = string | number | boolean | Date;

export type QueryParams = Record<
  string,
  PrimitiveQueryValue | PrimitiveQueryValue[] | null | undefined
>;

export type AccessTokenProvider = string | (() => MaybePromise<string>);

export interface StoredAccessToken {
  accessToken: string;
  tokenType: string;
  expiresAt: number;
  expiresIn: number;
  issuedAt: number;
}

export interface TokenStore {
  getToken(): MaybePromise<StoredAccessToken | undefined>;
  setToken(token: StoredAccessToken): MaybePromise<void>;
  clearToken?(): MaybePromise<void>;
}

export interface TokenExpiryCheckOptions {
  now?: number;
  safetyWindowMs?: number;
}

export interface OAuthClientCredentials {
  clientId: string;
  clientSecret: string;
}

export interface SatuSehatClientConfig {
  baseUrl?: string;
  authBaseUrl?: string;
  dicomBaseUrl?: string;
  environment?: SatuSehatEnvironment;
  accessToken?: AccessTokenProvider;
  credentials?: OAuthClientCredentials;
  tokenStore?: TokenStore;
  tokenExpiryWindowMs?: number;
  retryOnUnauthorized?: boolean;
  defaultHeaders?: HeadersInit;
  fetch?: FetchLike;
  validateResponse?: boolean;
}

export interface SatuSehatEnvSource {
  SATUSEHAT_ENV?: string;
  SATUSEHAT_BASE_URL?: string;
  SATUSEHAT_AUTH_BASE_URL?: string;
  SATUSEHAT_DICOM_BASE_URL?: string;
  SATUSEHAT_CLIENT_ID?: string;
  SATUSEHAT_CLIENT_SECRET?: string;
  SATUSEHAT_TOKEN_CACHE_FILE?: string;
  SATUSEHAT_TEST_PATIENT_BIRTHDATE?: string;
  SATUSEHAT_TEST_PATIENT_GENDER?: string;
  SATUSEHAT_TEST_PATIENT_IDENTIFIER?: string;
  SATUSEHAT_TEST_PATIENT_NIK?: string;
  SATUSEHAT_TEST_PATIENT_NAME?: string;
  [key: string]: string | undefined;
}

export interface PatientClient {
  getById(input: { id: string; signal?: AbortSignal }): Promise<import("../schemas/patient").Patient>;
  search(
    input: import("../schemas/patient").PatientSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/patient").PatientSearchResponse>;
}

export interface AllergyIntoleranceClient {
  create(
    input: import("../schemas/allergy-intolerance").AllergyIntoleranceCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/allergy-intolerance").AllergyIntolerance>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/allergy-intolerance").AllergyIntolerance>;
  search(
    input: import("../schemas/allergy-intolerance").AllergyIntoleranceSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/allergy-intolerance").AllergyIntoleranceSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/allergy-intolerance").AllergyIntolerancePatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/allergy-intolerance").AllergyIntolerance>;
  update(
    input: {
      id: string;
      body: import("../schemas/allergy-intolerance").AllergyIntoleranceCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/allergy-intolerance").AllergyIntolerance>;
}

export interface ClinicalImpressionClient {
  create(
    input: import("../schemas/clinical-impression").ClinicalImpressionCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/clinical-impression").ClinicalImpression>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/clinical-impression").ClinicalImpression>;
  search(
    input: import("../schemas/clinical-impression").ClinicalImpressionSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/clinical-impression").ClinicalImpressionSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/clinical-impression").ClinicalImpressionPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/clinical-impression").ClinicalImpression>;
  update(
    input: {
      id: string;
      body: import("../schemas/clinical-impression").ClinicalImpressionCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/clinical-impression").ClinicalImpression>;
}

export interface QuestionnaireResponseClient {
  create(
    input: import("../schemas/questionnaire-response").QuestionnaireResponseCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/questionnaire-response").QuestionnaireResponse>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/questionnaire-response").QuestionnaireResponse>;
  search(
    input: import("../schemas/questionnaire-response").QuestionnaireResponseSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/questionnaire-response").QuestionnaireResponseSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/questionnaire-response").QuestionnaireResponsePatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/questionnaire-response").QuestionnaireResponse>;
  update(
    input: {
      id: string;
      body: import("../schemas/questionnaire-response").QuestionnaireResponseCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/questionnaire-response").QuestionnaireResponse>;
}

export interface ConditionClient {
  create(
    input: import("../schemas/condition").ConditionCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/condition").Condition>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/condition").Condition>;
  search(
    input: import("../schemas/condition").ConditionSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/condition").ConditionSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/condition").ConditionPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/condition").Condition>;
  update(
    input: {
      id: string;
      body: import("../schemas/condition").ConditionCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/condition").Condition>;
}

export interface DicomRouterClient {
  downloadConfig(input?: { signal?: AbortSignal }): Promise<string>;
}

export interface DiagnosticReportClient {
  create(
    input: import("../schemas/diagnostic-report").DiagnosticReportCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/diagnostic-report").DiagnosticReport>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/diagnostic-report").DiagnosticReport>;
  search(
    input: import("../schemas/diagnostic-report").DiagnosticReportSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/diagnostic-report").DiagnosticReportSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/diagnostic-report").DiagnosticReportPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/diagnostic-report").DiagnosticReport>;
  update(
    input: {
      id: string;
      body: import("../schemas/diagnostic-report").DiagnosticReportCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/diagnostic-report").DiagnosticReport>;
}

export interface ObservationClient {
  create(
    input: import("../schemas/observation").ObservationCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/observation").Observation>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/observation").Observation>;
  search(
    input: import("../schemas/observation").ObservationSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/observation").ObservationSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/observation").ObservationPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/observation").Observation>;
  update(
    input: {
      id: string;
      body: import("../schemas/observation").ObservationCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/observation").Observation>;
}

export interface ProcedureClient {
  create(
    input: import("../schemas/procedure").ProcedureCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/procedure").Procedure>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/procedure").Procedure>;
  search(
    input: import("../schemas/procedure").ProcedureSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/procedure").ProcedureSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/procedure").ProcedurePatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/procedure").Procedure>;
  update(
    input: {
      id: string;
      body: import("../schemas/procedure").ProcedureCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/procedure").Procedure>;
}

export interface MedicationClient {
  create(
    input: import("../schemas/medication").MedicationCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/medication").Medication>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/medication").Medication>;
  patch(
    input: {
      id: string;
      body: import("../schemas/medication").MedicationPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/medication").Medication>;
  update(
    input: {
      id: string;
      body: import("../schemas/medication").MedicationCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/medication").Medication>;
}

export interface MedicationAdministrationClient {
  create(
    input: import("../schemas/medication-administration").MedicationAdministrationCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/medication-administration").MedicationAdministration>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/medication-administration").MedicationAdministration>;
  search(
    input: import("../schemas/medication-administration").MedicationAdministrationSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/medication-administration").MedicationAdministrationSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/medication-administration").MedicationAdministrationPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/medication-administration").MedicationAdministration>;
  update(
    input: {
      id: string;
      body: import("../schemas/medication-administration").MedicationAdministrationCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/medication-administration").MedicationAdministration>;
}

export interface MedicationRequestClient {
  create(
    input: import("../schemas/medication-request").MedicationRequestCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/medication-request").MedicationRequest>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/medication-request").MedicationRequest>;
  search(
    input: import("../schemas/medication-request").MedicationRequestSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/medication-request").MedicationRequestSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/medication-request").MedicationRequestPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/medication-request").MedicationRequest>;
  update(
    input: {
      id: string;
      body: import("../schemas/medication-request").MedicationRequestCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/medication-request").MedicationRequest>;
}

export interface NutritionOrderClient {
  create(
    input: import("../schemas/nutrition-order").NutritionOrderCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/nutrition-order").NutritionOrder>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/nutrition-order").NutritionOrder>;
  search(
    input: import("../schemas/nutrition-order").NutritionOrderSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/nutrition-order").NutritionOrderSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/nutrition-order").NutritionOrderPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/nutrition-order").NutritionOrder>;
  update(
    input: {
      id: string;
      body: import("../schemas/nutrition-order").NutritionOrderCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/nutrition-order").NutritionOrder>;
}

export interface ServiceRequestClient {
  create(
    input: import("../schemas/service-request").ServiceRequestCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/service-request").ServiceRequest>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/service-request").ServiceRequest>;
  search(
    input: import("../schemas/service-request").ServiceRequestSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/service-request").ServiceRequestSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/service-request").ServiceRequestPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/service-request").ServiceRequest>;
  update(
    input: {
      id: string;
      body: import("../schemas/service-request").ServiceRequestCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/service-request").ServiceRequest>;
}

export interface SpecimenClient {
  create(
    input: import("../schemas/specimen").SpecimenCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/specimen").Specimen>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/specimen").Specimen>;
  search(
    input: import("../schemas/specimen").SpecimenSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/specimen").SpecimenSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/specimen").SpecimenPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/specimen").Specimen>;
  update(
    input: {
      id: string;
      body: import("../schemas/specimen").SpecimenCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/specimen").Specimen>;
}

export interface EncounterClient {
  create(
    input: import("../schemas/encounter").EncounterCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/encounter").Encounter>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/encounter").Encounter>;
  search(
    input: import("../schemas/encounter").EncounterSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/encounter").EncounterSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/encounter").EncounterPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/encounter").Encounter>;
  update(
    input: {
      id: string;
      body: import("../schemas/encounter").EncounterCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/encounter").Encounter>;
}

export interface PractitionerClient {
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/practitioner").Practitioner>;
  search(
    input: import("../schemas/practitioner").PractitionerSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/practitioner").PractitionerSearchResponse>;
}

export interface PractitionerRoleClient {
  create(
    input: import("../schemas/practitioner-role").PractitionerRoleCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/practitioner-role").PractitionerRole>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/practitioner-role").PractitionerRole>;
  search(
    input: import("../schemas/practitioner-role").PractitionerRoleSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/practitioner-role").PractitionerRoleSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/practitioner-role").PractitionerRolePatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/practitioner-role").PractitionerRole>;
  update(
    input: {
      id: string;
      body: import("../schemas/practitioner-role").PractitionerRoleCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/practitioner-role").PractitionerRole>;
}

export interface OrganizationClient {
  create(
    input: import("../schemas/organization").OrganizationCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/organization").Organization>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/organization").Organization>;
  search(
    input: import("../schemas/organization").OrganizationSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/organization").OrganizationSearchResponse>;
  update(
    input: {
      id: string;
      body: import("../schemas/organization").OrganizationCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/organization").Organization>;
}

export interface LocationClient {
  create(
    input: import("../schemas/location").LocationCreateInput,
    signal?: AbortSignal,
  ): Promise<import("../schemas/location").Location>;
  getById(
    input: { id: string; signal?: AbortSignal },
  ): Promise<import("../schemas/location").Location>;
  search(
    input: import("../schemas/location").LocationSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/location").LocationSearchResponse>;
  patch(
    input: {
      id: string;
      body: import("../schemas/location").LocationPatchInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/location").Location>;
  update(
    input: {
      id: string;
      body: import("../schemas/location").LocationCreateInput;
      signal?: AbortSignal;
    },
  ): Promise<import("../schemas/location").Location>;
}

export interface SatuSehatClient {
  allergyIntolerance: AllergyIntoleranceClient;
  clinicalImpression: ClinicalImpressionClient;
  condition: ConditionClient;
  dicomRouter: DicomRouterClient;
  diagnosticReport: DiagnosticReportClient;
  encounter: EncounterClient;
  location: LocationClient;
  medicationAdministration: MedicationAdministrationClient;
  medication: MedicationClient;
  medicationRequest: MedicationRequestClient;
  nutritionOrder: NutritionOrderClient;
  observation: ObservationClient;
  organization: OrganizationClient;
  patient: PatientClient;
  practitioner: PractitionerClient;
  practitionerRole: PractitionerRoleClient;
  procedure: ProcedureClient;
  questionnaireResponse: QuestionnaireResponseClient;
  serviceRequest: ServiceRequestClient;
  specimen: SpecimenClient;
}
