import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiOperation({ summary: 'Create a track' })
  @ApiResponse({ status: 201, description: 'Track created' })
  @ApiBadRequestResponse({ description: 'Missing required fields' })
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({ status: 200, description: 'List of tracks' })
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get track by id' })
  @ApiResponse({ status: 200, description: 'Track' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  findById(@Param('id', UUIDValidationPipe) id: string) {
    return this.trackService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update track by id' })
  @ApiResponse({ status: 200, description: 'Track updated' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete track by id' })
  @ApiResponse({ status: 204, description: 'Track deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  @HttpCode(204)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    return this.trackService.remove(id);
  }
}
