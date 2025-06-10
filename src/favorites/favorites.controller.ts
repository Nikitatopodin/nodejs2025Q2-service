import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UUIDValidationPipe } from '../common/pipes/uuid-validation.pipe';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('favs')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':entity/:id')
  @ApiOperation({ summary: 'Add an entity to favorites by id' })
  @ApiResponse({ status: 201, description: '{entity} added to favorites' })
  create(
    @Param('entity') entity: string,
    @Param('id', UUIDValidationPipe) id: string,
  ) {
    return this.favoritesService.create(id, entity);
  }

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({ status: 200, description: 'List of favorites' })
  findAll() {
    return this.favoritesService.findAll();
  }

  @Delete(':entity/:id')
  @ApiOperation({ summary: 'Delete {entity} from favorites by id' })
  @ApiResponse({ status: 204, description: '{entity} deleted from favorites' })
  @HttpCode(204)
  remove(
    @Param('entity') entity: string,
    @Param('id', UUIDValidationPipe) id: string,
  ) {
    return this.favoritesService.remove(id, entity);
  }
}
