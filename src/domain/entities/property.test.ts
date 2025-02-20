import { Property } from "./property";
import { DateRange } from "../value_objects/date_range";

describe("Property Entity", () => {
  it("Should create a new Property instance with all attributes", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      4,
      150
    );
    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe("Property Name");
    expect(property.getDescription()).toBe("Property Description");
    expect(property.getMaxGuests()).toBe(4);
    expect(property.getBasePricePerNight()).toBe(150);
  });

  it("Should throw error if name is not provided", () => {
    expect(() => new Property("1", "", "Property Description", 4, 150)).toThrow(
      "Property name is required"
    );
  });

  it("Should throw error if maxGuests is negative or zero", () => {
    expect(
      () => new Property("1", "Property Name", "Property Description", 0, 150)
    ).toThrow("Property max guests must be greater than zero");
    expect(
      () => new Property("1", "Property Name", "Property Description", -1, 150)
    ).toThrow("Property max guests must be greater than zero");
  });

  it("Should validate the maxGuests number", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      5,
      150
    );
    expect(() => {
      property.validateGuestCount(6);
    }).toThrow("Property can't accommodate more than 5 guests");
  });

  it("Does not apply discount for stays shorter than 7 nights", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      5,
      150
    );
    const dateRange = new DateRange(
      new Date("2021-01-01"),
      new Date("2021-01-07")
    );
    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(6 * 150);
  });

  it("Should apply discount for stays longer than 7 nights or more", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      5,
      150
    );
    const dateRange = new DateRange(
      new Date("2021-01-01"),
      new Date("2021-01-08")
    );
    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(7 * 150 * 0.9);
  });
});
