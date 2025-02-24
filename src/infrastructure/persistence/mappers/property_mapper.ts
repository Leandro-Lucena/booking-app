import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";

export class PropertyMapper {
  static toDomain(entity: PropertyEntity): Property {
    if (!entity.id) {
      throw new Error("PropertyEntity is missing the required 'id' field");
    }
    if (!entity.name) {
      throw new Error("PropertyEntity is missing the required 'name' field");
    }
    if (!entity.description) {
      throw new Error(
        "PropertyEntity is missing the required 'description' field"
      );
    }
    if (!entity.maxGuests || entity.maxGuests <= 0) {
      throw new Error(
        "PropertyEntity 'maxGuests' field is required and must be greater than zero"
      );
    }
    if (!entity.basePricePerNight || entity.basePricePerNight <= 0) {
      throw new Error(
        "PropertyEntity 'basePricePerNight' field is required and must be greater than zero"
      );
    }
    return new Property(
      entity.id,
      entity.name,
      entity.description,
      entity.maxGuests,
      Number(entity.basePricePerNight)
    );
  }

  static toPersistence(domain: Property): PropertyEntity {
    const entity = new PropertyEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.description = domain.getDescription();
    entity.maxGuests = domain.getMaxGuests();
    entity.basePricePerNight = domain.getBasePricePerNight();
    return entity;
  }
}
