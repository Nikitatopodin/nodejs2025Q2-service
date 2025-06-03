import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './entities/album.entity';
import { TrackEntity } from 'src/track/entities/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity, TrackEntity])],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
