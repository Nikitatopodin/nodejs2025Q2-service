import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto);

    return plainToInstance(UserEntity, user, {
      enableImplicitConversion: true,
    });
  }

  @Get()
  findAll() {
    const users = this.userService.findAll();

    return plainToInstance(UserEntity, users, {
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  findById(@Param('id', UUIDValidationPipe) id: string) {
    const foundUser = this.userService.findOne(id);

    return plainToInstance(UserEntity, foundUser, {
      enableImplicitConversion: true,
    });
  }

  @Put(':id')
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const updatedUser = this.userService.update(id, updatePasswordDto);

    return plainToInstance(UserEntity, updatedUser, {
      enableImplicitConversion: true,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    return this.userService.remove(id);
  }
}
