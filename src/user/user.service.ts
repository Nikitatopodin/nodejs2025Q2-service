import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from './entities/user.entity';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      login: createUserDto.login,
      password: createUserDto.password,
      id: randomUUID(),
      version: 1,
      createdAt: new Date().getTime() - 1748000000000,
      updatedAt: new Date().getTime() - 1748000000000,
    });

    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundUser)
      throw new NotFoundException(`User with ID ${id} is not found`);

    return foundUser;
  }

  async update(id: string, updateUserDto: UpdatePasswordDto) {
    const userToUpdate = await this.findOne(id);

    if (userToUpdate.password === updateUserDto.oldPassword) {
      const updatedUser: UserEntity = {
        login: userToUpdate.login,
        password: updateUserDto.newPassword,
        id: userToUpdate.id,
        version: userToUpdate.version + 1,
        updatedAt: new Date().getTime() - 1748000000000,
        createdAt: userToUpdate.createdAt,
      };

      await this.userRepository.save(updatedUser);

      return updatedUser;
    }
    throw new ForbiddenException('Current password does not match');
  }

  async remove(id: string) {
    const userToRemove = await this.findOne(id);

    await this.userRepository.delete(userToRemove.id);
  }
}
