import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Login supposed to be a string' })
  @IsNotEmpty({ message: 'Login can not be empty' })
  @ApiProperty({
    example: '12345',
    description: 'Previous user password',
  })
  oldPassword: string;
  @IsString({ message: 'Password supposed to be a string' })
  @IsNotEmpty({ message: 'Password can not be empty' })
  @ApiProperty({ example: 'new_password', description: 'New user password' })
  newPassword: string;
}
