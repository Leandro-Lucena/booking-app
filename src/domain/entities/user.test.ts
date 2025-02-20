import { User } from "./user";

describe("User Entity", () => {
  it("Should create a new User instance with ID and name", () => {
    const user = new User("1", "John Doe");
    expect(user.getId()).toBe("1");
    expect(user.getName()).toBe("John Doe");
  });

  it("Should throw error if name is not provided", () => {
    expect(() => new User("1", "")).toThrow("User name is required");
  });

  it("Should throw error if ID is not provided", () => {
    expect(() => new User("", "John Doe")).toThrow("ID is required");
  });
});
