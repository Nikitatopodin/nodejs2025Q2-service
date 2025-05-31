import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { db } from 'src/db';
import { randomUUID } from 'crypto';
import { ArtistEntity } from './entities/artist.entity';
import { TrackEntity } from 'src/track/entities/track.entity';
import { AlbumEntity } from 'src/album/entities/album.entity';

@Injectable()
export class ArtistService {
  create(createArtistDto: CreateArtistDto) {
    const newArtist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    db.Artists.push(newArtist);

    return newArtist;
  }

  findAll() {
    return db.Artists;
  }

  findById(id: string) {
    const foundArtist = db.Artists.find((artist) => artist?.id === id);

    if (!foundArtist)
      throw new NotFoundException(`Artist with ID ${id} is not found`);

    return foundArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const updatedArtistIndex = db.Artists.findIndex(
      (artist: ArtistEntity) => artist?.id === id,
    );

    if (updatedArtistIndex === -1)
      throw new NotFoundException(`Artist with ID ${id} is not found`);

    const artistToUpdate = db.Artists[updatedArtistIndex];

    const updatedArtist: ArtistEntity = {
      id: artistToUpdate.id,
      name: updateArtistDto.name,
      grammy: updateArtistDto.grammy,
    };

    db.Artists[updatedArtistIndex] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string) {
    const removedArtistIndex = db.Artists.findIndex(
      (artist) => artist?.id === id,
    );

    if (removedArtistIndex === -1)
      throw new NotFoundException(`Album with ID ${id} is not found`);

    const tracksWithRemovedAlbum = db.Tracks.filter(
      (track: TrackEntity) => track.artistId === id,
    );

    const albumsWithRemovedArtist = db.Albums.filter(
      (album: AlbumEntity) => album.artistId === id,
    );

    if (tracksWithRemovedAlbum.length > 0) {
      tracksWithRemovedAlbum.forEach((track) => {
        track.artistId = null;
      });
    }

    if (albumsWithRemovedArtist.length > 0) {
      albumsWithRemovedArtist.forEach((album) => {
        album.artistId = null;
      });
    }

    const removedArtistIndexInFavs = db.Favorites.artists.findIndex(
      (artist) => artist?.id === id,
    );

    if (removedArtistIndexInFavs !== -1) {
      db.Favorites.artists.splice(1, removedArtistIndexInFavs);
    }

    db.Artists.splice(1, removedArtistIndex);
  }
}
