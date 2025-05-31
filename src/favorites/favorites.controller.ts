import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':entity/:id')
  create(
    @Param('entity') entity: string,
    @Param('id', UUIDValidationPipe) id: string,
  ) {
    return this.favoritesService.create(id, entity);
  }

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  remove(
    @Param('entity') entity: string,
    @Param('id', UUIDValidationPipe) id: string,
  ) {
    return this.favoritesService.remove(id, entity);
  }
}
