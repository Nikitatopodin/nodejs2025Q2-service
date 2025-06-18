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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UUIDValidationPipe } from '../common/pipes/uuid-validation.pipe';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('artist')
@UseGuards(JwtAuthGuard)
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiOperation({ summary: 'Create an artist' })
  @ApiResponse({ status: 201, description: 'Artist created' })
  @ApiBadRequestResponse({ description: 'Missing required fields' })
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({ status: 200, description: 'List of artists' })
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by id' })
  @ApiResponse({ status: 200, description: 'Artist' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  findById(@Param('id', UUIDValidationPipe) id: string) {
    return this.artistService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artist by id' })
  @ApiResponse({ status: 200, description: 'Artist updated' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete artist by id' })
  @ApiResponse({ status: 204, description: 'Artist deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  @HttpCode(204)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    return this.artistService.remove(id);
  }
}
