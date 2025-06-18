import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { randomUUID } from 'crypto';
import { ArtistEntity } from './entities/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
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

  async findByIds(ids: string[]) {
    return this.artistRepository.find({ where: { id: In(ids) } });
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

    await this.artistRepository.delete(artistToRemove.id);
  }
}
