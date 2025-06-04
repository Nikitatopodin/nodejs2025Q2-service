import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity()
export class FavoriteEntity {
  @PrimaryColumn()
  id: string;
  @Column({
    nullable: true,
  })
  entity: string;
  @Column()
  entityId: string;
}
