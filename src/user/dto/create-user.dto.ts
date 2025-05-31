import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Login supposed to be a string' })
  @IsNotEmpty({ message: 'Login can not be empty' })
  login: string;
  @IsString({ message: 'Password supposed to be a string' })
  @IsNotEmpty({ message: 'Password can not be empty' })
  password: string;
}
