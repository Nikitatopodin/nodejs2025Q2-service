import { Entity, PrimaryColumn, Column } from 'typeorm';

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
}
