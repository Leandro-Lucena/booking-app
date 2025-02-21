import { PropertyService } from "./property_service";
import { FakePropertyRepository } from "../infrastructure/repositories/fake_property_repository";
import { Property } from "../domain/entities/property";

describe("PropertyService", () => {
  let propertyService: PropertyService;
  let fakePropertyRepository: FakePropertyRepository;

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(fakePropertyRepository);
  });

  it("Should return null if an invalid ID is provided", async () => {
    const property = await propertyService.findPropertyById("999");
    expect(property).toBeNull();
  });

  it("Should return a property if a valid ID is provided", async () => {
    const property = await propertyService.findPropertyById("1");
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("1");
    expect(property?.getName()).toBe("Property Name1");
  });

  it("Should save a new property", async () => {
    const newProperty = new Property(
      "3",
      "Property Name3",
      "Property Description3",
      4,
      150
    );
    await fakePropertyRepository.save(newProperty);

    const property = await propertyService.findPropertyById("3");
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("3");
    expect(property?.getName()).toBe("Property Name3");
  });
});
