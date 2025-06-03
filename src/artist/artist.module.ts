import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { ArtistEntity } from './entities/artist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from 'src/track/entities/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity, TrackEntity])],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
