import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  login: string;
  @Column()
  version: number;
  @Column()
  createdAt: number;
  @Column()
  updatedAt: number;

  @Exclude()
  @Column()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
