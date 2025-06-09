import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { db } from 'src/db';
import { UserEntity } from './entities/user.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    const newUser = {
      login: createUserDto.login,
      password: createUserDto.password,
      id: randomUUID(),
      version: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };

    db.Users.push(newUser);

    return new UserEntity(newUser);
  }

  findAll() {
    return db.Users.map((user) => new UserEntity(user));
  }

  findOne(id: string) {
    const foundUser = db.Users.find((user) => user?.id === id);

    if (!foundUser)
      throw new NotFoundException(`User with ID ${id} is not found`);

    return new UserEntity(foundUser);
  }

  update(id: string, updateUserDto: UpdatePasswordDto) {
    const updatedUserIndex = db.Users.findIndex(
      (user: UserEntity) => user?.id === id,
    );

    if (updatedUserIndex === -1)
      throw new NotFoundException(`User with ID ${id} is not found`);

    const userToUpdate = db.Users[updatedUserIndex];

    if (userToUpdate.password === updateUserDto.oldPassword) {
      const updatedUser: UserEntity = {
        login: userToUpdate.login,
        password: updateUserDto.newPassword,
        id: userToUpdate.id,
        version: userToUpdate.version + 1,
        updatedAt: new Date().getTime(),
        createdAt: userToUpdate.createdAt,
      };

      const updatedUserEntity = new UserEntity(updatedUser);
      db.Users[updatedUserIndex] = updatedUserEntity;
      return updatedUserEntity;
    }
    throw new ForbiddenException('Current password does not match');
  }

  remove(id: string) {
    const removedUserIndex = db.Users.findIndex((user) => user?.id === id);

    if (removedUserIndex === -1)
      throw new NotFoundException(`User with ID ${id} is not found`);

    db.Users.splice(removedUserIndex, 1);
  }
}
