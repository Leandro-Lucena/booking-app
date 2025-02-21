import { PropertyRepository } from "../../domain/repositories/property_repository";
import { Property } from "../../domain/entities/property";

export class FakePropertyRepository implements PropertyRepository {
  private properties: Property[] = [
    new Property("1", "Property Name1", "Property Description1", 4, 150),
    new Property("2", "Property Name2", "Property Description2", 4, 150),
  ];
  async save(property: Property): Promise<void> {
    this.properties.push(property);
  }
  async findById(id: string): Promise<Property | null> {
    return this.properties.find((property) => property.getId() === id) || null;
  }
}
