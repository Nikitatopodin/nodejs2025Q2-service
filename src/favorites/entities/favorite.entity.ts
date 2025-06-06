import { AlbumEntity } from 'src/album/entities/album.entity';
import { ArtistEntity } from 'src/artist/entities/artist.entity';
import { TrackEntity } from 'src/track/entities/track.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
@Entity()
export class FavoriteEntity {
  @PrimaryColumn()
  id: string;
  @ManyToOne(() => TrackEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'trackId' })
  track: TrackEntity | null;

  @Column({ nullable: true })
  trackId: string | null;

  @ManyToOne(() => ArtistEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistEntity | null;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => AlbumEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'albumId' })
  album: AlbumEntity | null;

  @Column({ nullable: true })
  albumId: string | null;
}
