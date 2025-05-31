import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { db } from 'src/db';
import { randomUUID } from 'crypto';
import { TrackEntity } from './entities/track.entity';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto) {
    const newTrack = {
      name: createTrackDto.name,
      artistId: createTrackDto.artistId,
      id: randomUUID(),
      albumId: createTrackDto.albumId,
      duration: createTrackDto.duration,
    };

    db.Tracks.push(newTrack);

    return newTrack;
  }

  findAll() {
    return db.Tracks;
  }

  findOne(id: string) {
    const foundTrack = db.Tracks.find((track) => track?.id === id);

    if (!foundTrack)
      throw new NotFoundException(`Track with ID ${id} is not found`);

    return foundTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const updatedTrackIndex = db.Tracks.findIndex(
      (track: TrackEntity) => track?.id === id,
    );

    if (updatedTrackIndex === -1)
      throw new NotFoundException(`Track with ID ${id} is not found`);

    const trackToUpdate = db.Tracks[updatedTrackIndex];

    const updatedTrack: TrackEntity = {
      name: updateTrackDto.name,
      artistId: updateTrackDto.artistId,
      id: trackToUpdate.id,
      albumId: updateTrackDto.albumId,
      duration: updateTrackDto.duration,
    };

    db.Tracks[updatedTrackIndex] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string) {
    const updatedTrackIndex = db.Tracks.findIndex((track) => track?.id === id);
    const removedTrackIndexInFavs = db.Favorites.tracks.findIndex(
      (track) => track?.id === id,
    );

    if (updatedTrackIndex === -1)
      throw new NotFoundException(`Track with ID ${id} is not found`);

    if (removedTrackIndexInFavs !== -1) {
      db.Favorites.tracks.splice(1, removedTrackIndexInFavs);
    }

    db.Tracks.splice(1, updatedTrackIndex);
  }
}
