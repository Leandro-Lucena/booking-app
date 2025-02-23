import { Property } from "../../domain/entities/property";
import { DataSource, Repository } from "typeorm";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

describe("TypeORMPropertyRepository", () => {
  let dataSource: DataSource;
  let propertyRepository: TypeORMPropertyRepository;
  let repository: Repository<PropertyEntity>;

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
    repository = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeORMPropertyRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("Should save a property", async () => {
    const property = new Property("1", "New York", "Sea view", 6, 100);
    await propertyRepository.save(property);

    const savedProperty = await repository.findOne({ where: { id: "1" } });

    expect(savedProperty).not.toBeNull();
    expect(savedProperty?.id).toBe("1");
  });
  it("Should return a property", async () => {
    const property = new Property("1", "New York", "Sea view", 6, 100);
    await propertyRepository.save(property);

    const savedProperty = await propertyRepository.findById("1");

    expect(savedProperty).not.toBeNull();
    expect(savedProperty?.getId()).toBe("1");
    expect(savedProperty?.getName()).toBe("New York");
  });
  it("Should return null if an invalid ID is provided", async () => {
    const property = await propertyRepository.findById("999");

    expect(property).toBeNull();
  });
});
