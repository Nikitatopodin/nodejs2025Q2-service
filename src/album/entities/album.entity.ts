import { Column, Entity, PrimaryColumn } from 'typeorm';

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
}
