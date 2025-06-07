import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ArtistEntity } from '../../artist/entities/artist.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class AlbumEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  year: number;
  @Column({
    nullable: true,
  })
  artistId: string | null;
  @ManyToOne(() => ArtistEntity, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  @Exclude()
  @IsOptional()
  artist: ArtistEntity | null;
}
