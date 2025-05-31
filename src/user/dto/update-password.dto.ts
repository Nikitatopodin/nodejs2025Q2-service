import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Login supposed to be a string' })
  @IsNotEmpty({ message: 'Login can not be empty' })
  oldPassword: string;
  @IsString({ message: 'Password supposed to be a string' })
  @IsNotEmpty({ message: 'Password can not be empty' })
  newPassword: string;
}
