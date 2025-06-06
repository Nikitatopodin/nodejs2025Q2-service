import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/album/entities/album.entity';
import { ArtistEntity } from 'src/artist/entities/artist.entity';
import { TrackEntity } from 'src/track/entities/track.entity';
import { Repository } from 'typeorm';
import { FavoriteEntity } from './entities/favorite.entity';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private FavoriteRepository: Repository<FavoriteEntity>,
    private trackService: TrackService,
    private artistService: ArtistService,
    private albumService: AlbumService,
  ) {}

  async create(id: string, entity: string) {
    const foundEntity = await this.findById(id, entity);
    const newFavorite = new FavoriteEntity();
    newFavorite.id = randomUUID();

    newFavorite[entity] = foundEntity;
    newFavorite[`${entity}Id`] = foundEntity.id;

    await this.FavoriteRepository.save(newFavorite);
  }

  async findAll() {
    const favorites = await this.FavoriteRepository.find({
      relations: ['track', 'artist', 'album'],
    });

    return {
      tracks: favorites.filter((f) => f.track).map((f) => f.track),
      artists: favorites.filter((f) => f.artist).map((f) => f.artist),
      albums: favorites.filter((f) => f.album).map((f) => f.album),
    };
  }

  async findById(
    id: string,
    entity: string,
  ): Promise<AlbumEntity | TrackEntity | ArtistEntity> {
    let foundEntity;

    try {
      foundEntity = await this[`${entity}Service`].findById(id);
    } catch {
      throw new UnprocessableEntityException(
        `${entity} with ID ${id} is not found`,
      );
    }

    return foundEntity;
  }

  async remove(entityId: string, entity: string) {
    const foundEntity = await this.FavoriteRepository.findOne({
      where: { [`${entity}Id`]: entityId },
    });

    if (!foundEntity)
      throw new NotFoundException(
        `Favorite ${entity} with ID ${entityId} is not found`,
      );
    await this.FavoriteRepository.delete({ [`${entity}Id`]: entityId });
  }
}
