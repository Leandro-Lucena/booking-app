import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyService } from "../../application/services/property_service";
import { PropertyController } from "./property_controller";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [PropertyEntity, BookingEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );

  propertyService = new PropertyService(propertyRepository);

  propertyController = new PropertyController(propertyService);

  app.post("/properties", (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("PropertyController", () => {
  it("Should create a property", async () => {
    const response = await request(app).post("/properties").send({
      name: "House",
      description: "A beautiful house",
      maxGuests: 5,
      basePricePerNight: 100,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Property created successfully");
  });

  it("Should return 400 when name of property is not provided", async () => {
    const response = await request(app).post("/properties").send({
      name: "",
      description: "A beautiful house",
      maxGuests: 5,
      basePricePerNight: 100,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Property name is required");
  });

  it("Should return 400 if maxGuests is zero or negative", async () => {
    const response = await request(app).post("/properties").send({
      name: "House",
      description: "A beautiful house",
      maxGuests: 0,
      basePricePerNight: 100,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Max guests must be greater than 0");
  });

  it("Should return 400 if basePricePerNight is not provided", async () => {
    const response = await request(app).post("/properties").send({
      name: "House",
      description: "A beautiful house",
      maxGuests: 5,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Base price per night is required");
  });
});
