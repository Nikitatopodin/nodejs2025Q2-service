import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ArtistEntity } from 'src/artist/entities/artist.entity';
import { TrackEntity } from 'src/track/entities/track.entity';
import { AlbumEntity } from 'src/album/entities/album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEntity } from './entities/favorite.entity';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavoriteEntity,
      ArtistEntity,
      TrackEntity,
      AlbumEntity,
    ]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService, TrackService, AlbumService, ArtistService],
})
export class FavoritesModule {}
