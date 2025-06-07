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
import { UUIDValidationPipe } from '../common/pipes/uuid-validation.pipe';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiBadRequestResponse({ description: 'Missing required fields' })
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto);

    return plainToInstance(UserEntity, user, {
      enableImplicitConversion: true,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll() {
    const users = this.userService.findAll();

    return plainToInstance(UserEntity, users, {
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  findById(@Param('id', UUIDValidationPipe) id: string) {
    const foundUser = this.userService.findOne(id);

    return plainToInstance(UserEntity, foundUser, {
      enableImplicitConversion: true,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: "Previous password doesn't match" })
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
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(204)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    return this.userService.remove(id);
  }
}
