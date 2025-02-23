import { DataSource } from "typeorm";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { Property } from "../../domain/entities/property";
import { DateRange } from "../../domain/value_objects/date_range";
import { User } from "../../domain/entities/user";
import { Booking } from "../../domain/entities/booking";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { TypeORMBookingRepository } from "./typeorm_booking_repository";

describe("TypeORMBookingRepository", () => {
  let dataSource: DataSource;
  let bookingRepository: TypeORMBookingRepository;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [BookingEntity, PropertyEntity, UserEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    bookingRepository = new TypeORMBookingRepository(
      dataSource.getRepository(BookingEntity)
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("Should save a booking", async () => {
    const propertyRepository = dataSource.getRepository(PropertyEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    const propertyEntity = propertyRepository.create({
      id: "1",
      name: "New York",
      description: "Sea view",
      maxGuests: 6,
      basePricePerNight: 100,
    });
    await propertyRepository.save(propertyEntity);
    const property = new Property("1", "New York", "Sea view", 6, 100);

    const userEntity = userRepository.create({
      id: "1",
      name: "John Doe",
    });
    await userRepository.save(userEntity);
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2025-12-20"),
      new Date("2025-12-25")
    );

    const booking = new Booking("1", property, user, dateRange, 4);
    await bookingRepository.save(booking);

    const savedBooking = await bookingRepository.findById("1");

    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getId()).toBe("1");
    expect(savedBooking?.getProperty().getId()).toBe("1");
    expect(savedBooking?.getGuest().getId()).toBe("1");
  });

  it("Should return null if booking is not found", async () => {
    const savedBooking = await bookingRepository.findById("2");
    expect(savedBooking).toBeNull();
  });

  it("Should save a booking and make cancel after", async () => {
    const propertyRepository = dataSource.getRepository(PropertyEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    const propertyEntity = propertyRepository.create({
      id: "1",
      name: "New York",
      description: "Sea view",
      maxGuests: 6,
      basePricePerNight: 100,
    });
    await propertyRepository.save(propertyEntity);
    const property = new Property("1", "New York", "Sea view", 6, 100);

    const userEntity = userRepository.create({
      id: "1",
      name: "John Doe",
    });
    await userRepository.save(userEntity);
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2025-12-20"),
      new Date("2025-12-25")
    );

    const booking = new Booking("1", property, user, dateRange, 4);
    await bookingRepository.save(booking);

    booking.cancel(new Date("2024-12-15"));
    await bookingRepository.save(booking);

    const updatedBooking = await bookingRepository.findById("1");

    expect(updatedBooking).not.toBeNull();
    expect(updatedBooking?.getStatus()).toBe("CANCELLED");
  });
});
