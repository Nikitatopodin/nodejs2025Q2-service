import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { ArtistEntity } from './entities/artist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from 'src/track/entities/track.entity';
import { AlbumEntity } from 'src/album/entities/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity, TrackEntity, AlbumEntity])],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
