import { OrganizationCreateSchema } from "../schemas/organization";
import type {
  OrganizationAddress,
  OrganizationContact,
  OrganizationCreateInput,
  OrganizationIdentifier,
  OrganizationReference,
  OrganizationTelecom,
  OrganizationType,
} from "../schemas/organization";

export interface OrganizationBuilderRequiredInput {
  active: boolean;
  identifier: OrganizationIdentifier;
  name: string;
  type: OrganizationType;
}

export class OrganizationBuilder {
  private draft: OrganizationCreateInput;

  public constructor(input: OrganizationBuilderRequiredInput) {
    this.draft = OrganizationCreateSchema.parse({
      resourceType: "Organization",
      active: input.active,
      identifier: [input.identifier],
      type: [input.type],
      name: input.name,
    });
  }

  public addAddress(address: OrganizationAddress): this {
    this.draft.address = [...(this.draft.address ?? []), address];
    return this;
  }

  public addAlias(alias: string): this {
    this.draft.alias = [...(this.draft.alias ?? []), alias];
    return this;
  }

  public addContact(contact: OrganizationContact): this {
    this.draft.contact = [...(this.draft.contact ?? []), contact];
    return this;
  }

  public addEndpoint(endpoint: OrganizationReference): this {
    this.draft.endpoint = [...(this.draft.endpoint ?? []), endpoint];
    return this;
  }

  public addIdentifier(identifier: OrganizationIdentifier): this {
    this.draft.identifier = [...this.draft.identifier, identifier];
    return this;
  }

  public addTelecom(telecom: OrganizationTelecom): this {
    this.draft.telecom = [...(this.draft.telecom ?? []), telecom];
    return this;
  }

  public addType(type: OrganizationType): this {
    this.draft.type = [...this.draft.type, type];
    return this;
  }

  public setPartOf(partOf: OrganizationReference): this {
    this.draft.partOf = partOf;
    return this;
  }

  public setActive(active: boolean): this {
    this.draft.active = active;
    return this;
  }

  public setName(name: string): this {
    this.draft.name = name;
    return this;
  }

  public build(): OrganizationCreateInput {
    return OrganizationCreateSchema.parse(this.draft);
  }
}

export function createOrganizationBuilder(input: OrganizationBuilderRequiredInput): OrganizationBuilder {
  return new OrganizationBuilder(input);
}
