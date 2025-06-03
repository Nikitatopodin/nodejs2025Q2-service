import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { db } from 'src/db';
import { randomUUID } from 'crypto';
import { ArtistEntity } from './entities/artist.entity';
import { TrackEntity } from 'src/track/entities/track.entity';
import { AlbumEntity } from 'src/album/entities/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const newArtist = this.artistRepository.create({
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    });

    await this.artistRepository.save(newArtist);

    return newArtist;
  }

  async findAll() {
    return await this.artistRepository.find();
  }

  async findById(id: string) {
    const foundArtist = await this.artistRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundArtist)
      throw new NotFoundException(`Artist with ID ${id} is not found`);

    return foundArtist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artistToUpdate = await this.findById(id);

    const updatedArtist: ArtistEntity = {
      id: artistToUpdate.id,
      name: updateArtistDto.name,
      grammy: updateArtistDto.grammy,
    };

    await this.artistRepository.save(updatedArtist);
    return updatedArtist;
  }

  async remove(id: string) {
    const artistToRemove = await this.findById(id);

    await this.trackRepository.update({ artistId: id }, { artistId: null });

    await this.albumRepository.update({ artistId: id }, { artistId: null });

    const removedArtistIndexInFavs = db.Favorites.artists.findIndex(
      (artist) => artist?.id === id,
    );

    if (removedArtistIndexInFavs !== -1) {
      db.Favorites.artists.splice(removedArtistIndexInFavs, 1);
    }

    await this.artistRepository.delete(artistToRemove.id);
  }
}
