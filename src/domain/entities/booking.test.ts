import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";

describe("Booking Entity", () => {
  it("Should create a new Booking instance with all attributes", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      4,
      150
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2025-12-20"),
      new Date("2025-12-25")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    expect(booking.getId()).toBe("1");
    expect(booking.getProperty()).toBe(property);
    expect(booking.getUser()).toBe(user);
    expect(booking.getDateRange()).toBe(dateRange);
    expect(booking.getGuestCount()).toBe(2);
  });

  it("Should throw error if number of guests is negative or zero", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      4,
      150
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2025-12-20"),
      new Date("2025-12-25")
    );
    expect(() => new Booking("1", property, user, dateRange, 0)).toThrow(
      "Number of guests must be greater than zero"
    );
  });

  it("Should throw error if try to booking with guests number greater than maxGuests", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      4,
      150
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2025-12-20"),
      new Date("2025-12-25")
    );
    expect(() => new Booking("1", property, user, dateRange, 5)).toThrow(
      "Property can't accommodate more than 4 guests"
    );
  });

  it("Should calculate the total price with dicount", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      4,
      150
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2025-12-01"),
      new Date("2025-12-10")
    );
    const booking = new Booking("1", property, user, dateRange, 4);
    expect(booking.getTotalPrice()).toBe(150 * 9 * 0.9);
  });

  it("Does not allow booking when a property is not available", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      4,
      150
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2025-12-01"),
      new Date("2025-12-10")
    );
    const booking = new Booking("1", property, user, dateRange, 4);
    const dateRange2 = new DateRange(
      new Date("2025-12-02"),
      new Date("2025-12-08")
    );

    expect(() => new Booking("2", property, user, dateRange2, 4)).toThrow(
      "Cannot book property: it is unavailable for the selected dates"
    );
  });

  it("Should cancel a booking with no charge when less than 1 day to check-in", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      4,
      150
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2025-12-01"),
      new Date("2025-12-03")
    );
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2025-12-01");
    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(150 * 2);
  });

  it("Should cancel a booking with total charge when longer than 7 days to check-in", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      4,
      150
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2025-12-20"),
      new Date("2025-12-25")
    );
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2025-12-10");
    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(0);
  });

  it("Should cancel a booking with parcial charge when between in 1 and 7 days to check-in", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      4,
      150
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2025-12-20"),
      new Date("2025-12-25")
    );
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2025-12-15");
    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(150 * 5 * 0.5);
  });

  it("Should don't cancel a booking which already cancelled", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      4,
      150
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2025-12-20"),
      new Date("2025-12-25")
    );
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2025-12-15");
    booking.cancel(currentDate);

    expect(() => booking.cancel(currentDate)).toThrow(
      "Cannot cancel a booking which is already cancelled"
    );
  });
});
