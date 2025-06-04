import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';
import { TrackEntity } from './entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const newTrack = this.trackRepository.create({
      name: createTrackDto.name,
      artistId: createTrackDto.artistId,
      id: randomUUID(),
      albumId: createTrackDto.albumId,
      duration: createTrackDto.duration,
    });

    return await this.trackRepository.save(newTrack);
  }

  async findAll() {
    return await this.trackRepository.find();
  }

  async findById(id: string) {
    const foundTrack = await this.trackRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundTrack)
      throw new NotFoundException(`Track with ID ${id} is not found`);

    return foundTrack;
  }

  async findByIds(ids: string[]) {
    return this.trackRepository.find({ where: { id: In(ids) } });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const trackToUpdate = await this.findById(id);

    const updatedTrack: TrackEntity = {
      name: updateTrackDto.name,
      artistId: updateTrackDto.artistId,
      id: trackToUpdate.id,
      albumId: updateTrackDto.albumId,
      duration: updateTrackDto.duration,
    };

    await this.trackRepository.save(updatedTrack);

    return updatedTrack;
  }

  async remove(id: string) {
    const trackToRemove = await this.findById(id);

    await this.trackRepository.delete(trackToRemove.id);
  }
}
