import { User } from "../../../domain/entities/user";
import { UserEntity } from "../entities/user_entity";

export class UserMapper {
  static toDomain(user: UserEntity): User {
    return new User(user.id, user.name);
  }

  static toPersistence(user: User): UserEntity {
    const userEntity = new UserEntity();
    userEntity.id = user.getId();
    userEntity.name = user.getName();
    return userEntity;
  }
}
