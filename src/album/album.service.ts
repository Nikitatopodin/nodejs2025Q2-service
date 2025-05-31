import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { db } from 'src/db';
import { randomUUID } from 'crypto';
import { AlbumEntity } from './entities/album.entity';
import { TrackEntity } from 'src/track/entities/track.entity';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };

    db.Albums.push(newAlbum);

    return newAlbum;
  }

  findAll() {
    return db.Albums;
  }

  findOne(id: string) {
    const foundAlbum = db.Albums.find((album) => album?.id === id);

    if (!foundAlbum)
      throw new NotFoundException(`Album with ID ${id} is not found`);

    return foundAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const updatedAlbumIndex = db.Albums.findIndex(
      (album: AlbumEntity) => album?.id === id,
    );

    if (updatedAlbumIndex === -1)
      throw new NotFoundException(`Album with ID ${id} is not found`);

    const albumToUpdate = db.Albums[updatedAlbumIndex];

    const updatedAlbum: AlbumEntity = {
      id: albumToUpdate.id,
      name: updateAlbumDto.name,
      year: updateAlbumDto.year,
      artistId: updateAlbumDto.artistId,
    };

    db.Albums[updatedAlbumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string) {
    const removedAlbumIndex = db.Albums.findIndex((album) => album?.id === id);

    if (removedAlbumIndex === -1)
      throw new NotFoundException(`Album with ID ${id} is not found`);

    const tracksWithRemovedAlbum = db.Tracks.filter(
      (track: TrackEntity) => track.albumId === id,
    );

    if (tracksWithRemovedAlbum.length > 0) {
      tracksWithRemovedAlbum.forEach((track) => {
        track.albumId = null;
      });
    }

    const removedAlbumIndexInFavs = db.Favorites.albums.findIndex(
      (album) => album?.id === id,
    );

    if (removedAlbumIndexInFavs !== -1) {
      db.Favorites.albums.splice(1, removedAlbumIndexInFavs);
    }
    db.Albums.splice(1, removedAlbumIndex);
  }
}
