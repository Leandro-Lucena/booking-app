import { Property } from "../../../domain/entities/property";
import { Booking } from "../../../domain/entities/booking";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "./booking_mapper";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";

describe("BookingMapper", () => {
  const propertyEntity = new PropertyEntity();
  propertyEntity.id = "1";
  propertyEntity.name = "Property 1";
  propertyEntity.description = "Description 1";
  propertyEntity.maxGuests = 5;
  propertyEntity.basePricePerNight = 100;

  const userEntity = new UserEntity();
  userEntity.id = "1";
  userEntity.name = "User 1";

  let bookingEntity = new BookingEntity();
  beforeEach(() => {
    bookingEntity.id = "1";
    bookingEntity.property = propertyEntity;
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = new Date("2024-12-20");
    bookingEntity.endDate = new Date("2024-12-25");
    bookingEntity.guestCount = 2;
    bookingEntity.totalPrice = 200;
    bookingEntity.status = "CONFIRMED";
  });
  it("Should map a BookingEntity to a Booking", () => {
    const result = BookingMapper.toDomain(bookingEntity);

    expect(result).toBeInstanceOf(Booking);
  });

  it("Should throw an error if the BookingEntity is missing the required 'id' field", () => {
    bookingEntity.id = "";

    expect(() => BookingMapper.toDomain(bookingEntity)).toThrow(
      "BookingEntity is missing the required 'id' field"
    );
  });

  it("Should throw an error if the BookingEntity is missing the required 'guest' field", () => {
    bookingEntity.guest = new UserEntity();

    expect(() => BookingMapper.toDomain(bookingEntity)).toThrow(
      "BookingEntity is missing the required 'guest' field"
    );
  });

  it("Should throw an error if the BookingEntity is missing the required 'guestCount' field", () => {
    bookingEntity.guestCount = 0;

    expect(() => BookingMapper.toDomain(bookingEntity)).toThrow(
      "BookingEntity 'guestCount' field is required and must be greater than zero"
    );
  });

  it("Should map a Booking to a BookingEntity", () => {
    const property = new Property("1", "Property 1", "Description 1", 5, 100);
    const user = new User("1", "User 1");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );
    const booking = new Booking("1", property, user, dateRange, 4);

    const result = BookingMapper.toPersistence(booking);

    expect(result).toBeInstanceOf(BookingEntity);
  });
});
