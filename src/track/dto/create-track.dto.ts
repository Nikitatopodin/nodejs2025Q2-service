import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  id: string;
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  artistId: string | null;
  @IsString()
  @IsOptional()
  albumId: string | null;
  @IsInt()
  duration: number;
}
