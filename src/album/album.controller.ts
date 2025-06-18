import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { UUIDValidationPipe } from '../common/pipes/uuid-validation.pipe';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('album')
@UseGuards(JwtAuthGuard)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({ summary: 'Create an album' })
  @ApiResponse({ status: 201, description: 'Album created' })
  @ApiBadRequestResponse({ description: 'Missing required fields' })
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({ status: 200, description: 'List of albums' })
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album by id' })
  @ApiResponse({ status: 200, description: 'Album' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Album not found' })
  findById(@Param('id', UUIDValidationPipe) id: string) {
    return this.albumService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update album by id' })
  @ApiResponse({ status: 200, description: 'Album updated' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Album not found' })
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete album by id' })
  @ApiResponse({ status: 204, description: 'Album deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Album not found' })
  @HttpCode(204)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    return this.albumService.remove(id);
  }
}
