import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe("PropertyMapper", () => {
  let propertyEntity = new PropertyEntity();

  beforeEach(() => {
    propertyEntity.id = "123";
    propertyEntity.name = "My Property";
    propertyEntity.description = "A beautiful property";
    propertyEntity.maxGuests = 4;
    propertyEntity.basePricePerNight = 100;
  });

  it("Should map a PropertyEntity to a Property", () => {
    const result = PropertyMapper.toDomain(propertyEntity);

    expect(result).toBeInstanceOf(Property);
  });

  it("Should throw an error if the PropertyEntity is missing the required 'id' field", () => {
    propertyEntity.id = "";

    expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow(
      "PropertyEntity is missing the required 'id' field"
    );
  });

  it("Should throw an error if the PropertyEntity is missing the required 'name' field", () => {
    propertyEntity.name = "";

    expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow(
      "PropertyEntity is missing the required 'name' field"
    );
  });

  it("Should throw an error if the PropertyEntity is missing the required 'description' field", () => {
    propertyEntity.description = "";

    expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow(
      "PropertyEntity is missing the required 'description' field"
    );
  });

  it("Should throw an error if the PropertyEntity required 'maxGuests' field is missing or less than 1", () => {
    propertyEntity.maxGuests = 0;

    expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow(
      "PropertyEntity 'maxGuests' field is required and must be greater than zero"
    );
  });

  it("Should throw an error if the PropertyEntity required 'basePricePerNight' field is missing or less than 1", () => {
    propertyEntity.basePricePerNight = 0;

    expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow(
      "PropertyEntity 'basePricePerNight' field is required and must be greater than zero"
    );
  });

  it("Should map a Property to a PropertyEntity", () => {
    const property = new Property(
      "123",
      "My Property",
      "A beautiful property",
      4,
      100
    );

    const result = PropertyMapper.toPersistence(property);

    expect(result).toBeInstanceOf(PropertyEntity);
  });
});
