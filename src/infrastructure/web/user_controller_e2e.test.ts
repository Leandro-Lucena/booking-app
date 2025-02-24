import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { UserService } from "../../application/services/user_service";
import { UserController } from "./user_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let userRepository: TypeORMUserRepository;
let userService: UserService;
let userController: UserController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  userRepository = new TypeORMUserRepository(
    dataSource.getRepository(UserEntity)
  );

  userService = new UserService(userRepository);

  userController = new UserController(userService);

  app.post("/user", (req, res, next) => {
    userController.createUser(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("UserController", () => {
  it("Should create a user", async () => {
    const response = await request(app).post("/user").send({
      name: "John Doe",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  });

  it("Should return 400 when name is not provided", async () => {
    const response = await request(app).post("/user").send({ name: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Field name is required");
  });
});
