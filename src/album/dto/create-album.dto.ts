import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @ApiProperty({ example: 'Led Zeppelin III', description: 'Album name' })
  name: string;
  @IsNumber()
  @ApiProperty({
    example: '1970',
    description: 'Album release date',
  })
  year: number;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '61f0c404-5cb3-11e7-907b-a6006ad3dba0',
    description: 'Artist id',
  })
  artistId: string | null;
}
