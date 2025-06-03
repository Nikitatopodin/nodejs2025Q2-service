import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { db } from 'src/db';
import { randomUUID } from 'crypto';
import { AlbumEntity } from './entities/album.entity';
import { TrackEntity } from 'src/track/entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = this.albumRepository.create({
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    });

    await this.albumRepository.save(newAlbum);

    return newAlbum;
  }

  async findAll() {
    return await this.albumRepository.find();
  }

  async findById(id: string) {
    const foundAlbum = await this.albumRepository.findOne({ where: { id } });

    if (!foundAlbum)
      throw new NotFoundException(`Album with ID ${id} is not found`);

    return foundAlbum;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const albumToUpdate = await this.findById(id);

    const updatedAlbum: AlbumEntity = {
      id: albumToUpdate.id,
      name: updateAlbumDto.name,
      year: updateAlbumDto.year,
      artistId: updateAlbumDto.artistId,
    };

    await this.albumRepository.save(updatedAlbum);
    return updatedAlbum;
  }

  async remove(id: string) {
    const albumToRemove = await this.findById(id);

    await this.trackRepository.update({ albumId: id }, { albumId: null });

    const removedAlbumIndexInFavs = db.Favorites.albums.findIndex(
      (album) => album?.id === id,
    );

    if (removedAlbumIndexInFavs !== -1) {
      db.Favorites.albums.splice(removedAlbumIndexInFavs, 1);
    }
    await this.albumRepository.delete(albumToRemove?.id);
  }
}
