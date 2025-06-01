import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @ApiProperty({
    example: 'Michael Jackson',
    description: 'Artist name',
    type: 'string',
  })
  name: string;
  @IsBoolean()
  @ApiProperty({
    example: 'True',
    description: 'Shows if artist have ever won a Grammy Award',
    type: 'boolean',
  })
  grammy: boolean;
}
