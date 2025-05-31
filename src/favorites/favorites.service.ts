import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { db } from 'src/db';

const dataBaseEntityNameMap = {
  artist: 'Artists',
  album: 'Albums',
  track: 'Tracks',
};

@Injectable()
export class FavoritesService {
  create(id: string, entity: string) {
    const dataBaseEntityName = dataBaseEntityNameMap[entity];

    const foundEntity = db[dataBaseEntityName].find((e) => e?.id === id);
    const foundEntityCopy = { ...foundEntity };

    if (!foundEntity)
      throw new UnprocessableEntityException(
        `${entity} with ID ${id} is not found`,
      );

    db.Favorites[`${entity}s`].push(foundEntityCopy);
  }

  findAll() {
    return db.Favorites;
  }

  remove(id: string, entity) {
    const dataBaseEntityName = dataBaseEntityNameMap[entity];
    const foundEntity = db[dataBaseEntityName].find((e) => e?.id === id);

    if (!foundEntity)
      throw new UnprocessableEntityException(
        `${entity}} with ID ${id} is not found`,
      );

    const foundEntityIndex = db.Favorites[`${entity}s`].findIndex(
      (e) => e?.id === id,
    );
    db.Favorites[`${entity}s`].splice(foundEntityIndex, 1);
  }
}
