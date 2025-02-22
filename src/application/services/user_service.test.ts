import { User } from "../../domain/entities/user";
import { FakeUserRepository } from "../../infrastructure/repositories/fake_user_repository";
import { UserService } from "./user_service";

describe("UserService", () => {
  let userService: UserService;
  let fakeUserRepository: FakeUserRepository;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    userService = new UserService(fakeUserRepository);
  });

  it("Should return null if an invalid ID is provided", async () => {
    const user = await userService.findUserById("999");

    expect(user).toBeNull();
  });

  it("Should return an user if a valid ID is provided", async () => {
    const user = await userService.findUserById("1");

    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("1");
    expect(user?.getName()).toBe("John Doe");
  });

  it("Should save a new user", async () => {
    const newUser = new User("4", "John Doe");
    await fakeUserRepository.save(newUser);

    const user = await userService.findUserById("4");

    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("4");
    expect(user?.getName()).toBe("John Doe");
  });
});
