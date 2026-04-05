import { ReferenceSchema } from "../schemas/common";
import { MedicationCreateSchema } from "../schemas/medication";
import type { Reference } from "../schemas/common";
import type {
  MedicationBatch,
  MedicationCreateInput,
  MedicationIdentifier,
  MedicationIngredient,
  MedicationRatio,
  MedicationStatus,
  MedicationTypeExtension,
} from "../schemas/medication";

const MEDICATION_TYPE_EXTENSION_URL =
  "https://fhir.kemkes.go.id/r4/StructureDefinition/MedicationType";

type MedicationMutableInput = Partial<Omit<MedicationCreateInput, "resourceType" | "extension">>;
type MedicationCodeableConcept = NonNullable<MedicationCreateInput["code"]>;

export interface EncounterMedicationBuilderInput {
  medication: Pick<MedicationCreateInput, "extension"> & MedicationMutableInput;
}

export interface EncounterMedicationReferenceBuildInput {
  medicationId?: string;
  medicationReference?: Reference;
  display?: string;
}

export class EncounterMedicationBuilder {
  private medicationDraft: MedicationCreateInput;

  public constructor(input: EncounterMedicationBuilderInput) {
    this.medicationDraft = MedicationCreateSchema.parse({
      resourceType: "Medication",
      ...input.medication,
    });
  }

  public mergeMedication(input: MedicationMutableInput): this {
    this.medicationDraft = MedicationCreateSchema.parse({
      ...this.medicationDraft,
      ...input,
    });
    return this;
  }

  public addIdentifier(identifier: MedicationIdentifier): this {
    this.medicationDraft.identifier = [...(this.medicationDraft.identifier ?? []), identifier];
    return this;
  }

  public setCode(code: MedicationCodeableConcept): this {
    this.medicationDraft.code = code;
    return this;
  }

  public setStatus(status: MedicationStatus): this {
    this.medicationDraft.status = status;
    return this;
  }

  public setManufacturer(
    manufacturer: NonNullable<MedicationCreateInput["manufacturer"]>,
  ): this {
    this.medicationDraft.manufacturer = manufacturer;
    return this;
  }

  public setForm(form: MedicationCodeableConcept): this {
    this.medicationDraft.form = form;
    return this;
  }

  public setAmount(amount: MedicationRatio): this {
    this.medicationDraft.amount = amount;
    return this;
  }

  public addIngredient(ingredient: MedicationIngredient): this {
    this.medicationDraft.ingredient = [...(this.medicationDraft.ingredient ?? []), ingredient];
    return this;
  }

  public setBatch(batch: MedicationBatch): this {
    this.medicationDraft.batch = batch;
    return this;
  }

  public addExtension(extension: MedicationTypeExtension): this {
    this.medicationDraft.extension = [...(this.medicationDraft.extension ?? []), extension];
    return this;
  }

  public setMedicationType(
    valueCodeableConcept: MedicationTypeExtension["valueCodeableConcept"],
  ): this {
    this.medicationDraft.extension = [
      {
        url: MEDICATION_TYPE_EXTENSION_URL,
        valueCodeableConcept,
      },
    ];
    return this;
  }

  public buildMedication(): MedicationCreateInput {
    return MedicationCreateSchema.parse(this.medicationDraft);
  }

  public buildMedicationReference(
    links: EncounterMedicationReferenceBuildInput = {},
  ): Reference {
    if (links.medicationReference) {
      return ReferenceSchema.parse(links.medicationReference);
    }

    if (!links.medicationId) {
      throw new Error(
        "Medication link is required. Provide medicationId or medicationReference before building Medication reference.",
      );
    }

    const display = links.display ?? this.resolveMedicationDisplay();

    return ReferenceSchema.parse({
      reference: `Medication/${links.medicationId}`,
      ...(display ? { display } : {}),
    });
  }

  private resolveMedicationDisplay(): string | undefined {
    return this.medicationDraft.code?.coding.find((coding) => coding.display)?.display;
  }
}

export function createEncounterMedicationBuilder(
  input: EncounterMedicationBuilderInput,
): EncounterMedicationBuilder {
  return new EncounterMedicationBuilder(input);
}
