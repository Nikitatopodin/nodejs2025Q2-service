import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ArtistEntity } from '../artist/entities/artist.entity';
import { TrackEntity } from '../track/entities/track.entity';
import { AlbumEntity } from '../album/entities/album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEntity } from './entities/favorite.entity';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { JwtService } from '@nestjs/jwt';

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
  providers: [
    FavoritesService,
    TrackService,
    AlbumService,
    ArtistService,
    JwtService,
  ],
})
export class FavoritesModule {}
