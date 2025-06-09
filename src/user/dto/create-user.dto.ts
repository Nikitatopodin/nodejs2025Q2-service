import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Login supposed to be a string' })
  @IsNotEmpty({ message: 'Login can not be empty' })
  @ApiProperty({
    example: 'SomeGreatLogin',
    description: 'User login',
    type: 'string',
  })
  login: string;
  @IsString({ message: 'Password supposed to be a string' })
  @IsNotEmpty({ message: 'Password can not be empty' })
  @ApiProperty({
    example: '12345',
    description: 'User password',
    type: 'string',
  })
  password: string;
}
