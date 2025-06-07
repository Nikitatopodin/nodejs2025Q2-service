import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { AlbumEntity } from '../../album/entities/album.entity';
import { ArtistEntity } from '../../artist/entities/artist.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class TrackEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column({
    nullable: true,
  })
  artistId: string | null;
  @Column({
    nullable: true,
  })
  albumId: string | null;
  @Column()
  duration: number;

  @ManyToOne(() => ArtistEntity, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  @Exclude()
  @IsOptional()
  artist: ArtistEntity | null;

  @ManyToOne(() => AlbumEntity, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'albumId' })
  @Exclude()
  @IsOptional()
  album: AlbumEntity | null;
}
