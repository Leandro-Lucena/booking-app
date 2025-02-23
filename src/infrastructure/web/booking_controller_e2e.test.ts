import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { UserService } from "../../application/services/user_service";
import { BookingService } from "../../application/services/booking_service";
import { PropertyService } from "../../application/services/property_service";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { TypeORMBookingRepository } from "../repositories/typeorm_booking_repository";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { BookingController } from "./booking_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let bookingRepository: TypeORMBookingRepository;
let propertyRepository: TypeORMPropertyRepository;
let userRepository: TypeORMUserRepository;
let bookingService: BookingService;
let propertyService: PropertyService;
let userService: UserService;
let bookingController: BookingController;

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
  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );
  userRepository = new TypeORMUserRepository(
    dataSource.getRepository(UserEntity)
  );

  propertyService = new PropertyService(propertyRepository);
  userService = new UserService(userRepository);
  bookingService = new BookingService(
    bookingRepository,
    propertyService,
    userService
  );

  bookingController = new BookingController(bookingService);

  app.post("/bookings", (req, res, next) => {
    bookingController.createBooking(req, res).catch((err) => next(err));
  });

  app.post("/bookings/:id/cancel", (req, res, next) => {
    bookingController.cancelBooking(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("BookingController", () => {
  beforeEach(async () => {
    const propertyRepository = dataSource.getRepository(PropertyEntity);
    const userRepository = dataSource.getRepository(UserEntity);
    const bookingRepository = dataSource.getRepository(BookingEntity);

    await bookingRepository.clear();
    await propertyRepository.clear();
    await userRepository.clear();

    await propertyRepository.save({
      id: "1",
      name: "Property 1",
      description: "Description 1",
      maxGuests: 5,
      basePricePerNight: 100,
    });

    await userRepository.save({
      id: "1",
      name: "User 1",
    });
  });

  it("Should create a booking", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "2024-12-25",
      guestCount: 2,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Booking created successfully");
    expect(response.body.booking).toHaveProperty("id");
    expect(response.body.booking).toHaveProperty("totalPrice");
  });
  it("Should return 400 when trying to create a booking with start date invalid", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "invalid-date",
      endDate: "2024-12-25",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Date format is invalid");
  });
  it("Should return 400 when trying to create a booking with end date invalid", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "invalid-date",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Date format is invalid");
  });
  it("Should return 400 when trying to create a booking with guest count invalid", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "2024-12-25",
      guestCount: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Number of guests must be greater than zero"
    );
  });

  it("Should cancel a booking", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "2024-12-25",
      guestCount: 2,
    });

    const bookingId = response.body.booking.id;

    const cancelResponse = await request(app).post(
      `/bookings/${bookingId}/cancel`
    );

    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.message).toBe("Booking canceled successfully");
  });
  it("Should return error when trying to cancel a non-existent booking", async () => {
    const cancelResponse = await request(app).post(`/bookings/999/cancel`);

    expect(cancelResponse.status).toBe(400);
    expect(cancelResponse.body.message).toBe("Booking not found");
  });
});
