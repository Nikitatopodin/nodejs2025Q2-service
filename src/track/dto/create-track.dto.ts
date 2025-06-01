import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @ApiProperty({
    example: 'The line',
    description: 'Track name',
    type: 'string',
  })
  name: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '61f0c404-5cb3-11e7-907b-a6006ad3dba0',
    description: 'Id of the artist to which the track belongs',
    type: 'string',
  })
  artistId: string | null;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '61f0c404-5cb3-11e7-907b-a6006ad3dba0',
    description: 'Id of the album to which the track belongs',
    type: 'string',
  })
  albumId: string | null;
  @IsInt()
  @ApiProperty({
    example: '192',
    description: 'Track duration',
    type: 'number',
  })
  duration: number;
}
