import { IsBoolean, IsString } from 'class-validator';

export class CreateArtistDto {
  id: string;
  @IsString()
  name: string;
  @IsBoolean()
  grammy: boolean;
}
