import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1749732985498 implements MigrationInterface {
  name = 'Migration1749732985498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" character varying NOT NULL, "login" character varying NOT NULL, "version" integer NOT NULL, "createdAt" integer NOT NULL, "updatedAt" integer NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artist_entity" ("id" character varying NOT NULL, "name" character varying NOT NULL, "grammy" boolean NOT NULL, CONSTRAINT "PK_c6ec16b57b60c8096406808021d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "album_entity" ("id" character varying NOT NULL, "name" character varying NOT NULL, "year" integer NOT NULL, "artistId" character varying, CONSTRAINT "PK_319a74c2085b42849b15412a3bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "track_entity" ("id" character varying NOT NULL, "name" character varying NOT NULL, "artistId" character varying, "albumId" character varying, "duration" integer NOT NULL, CONSTRAINT "PK_9cc0e8a743e689434dac0130098" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favorite_entity" ("id" character varying NOT NULL, "trackId" character varying, "artistId" character varying, "albumId" character varying, CONSTRAINT "PK_05ae9b9abba1cbe21e1cfc879f7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "album_entity" ADD CONSTRAINT "FK_4aea5943406bd89eced202b012b" FOREIGN KEY ("artistId") REFERENCES "artist_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track_entity" ADD CONSTRAINT "FK_3cfbf55ef8a58b6447c226d2260" FOREIGN KEY ("artistId") REFERENCES "artist_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track_entity" ADD CONSTRAINT "FK_f75df6098780938c05b7a65d2ca" FOREIGN KEY ("albumId") REFERENCES "album_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_entity" ADD CONSTRAINT "FK_ae3db37fc900b325f2dc8c18962" FOREIGN KEY ("trackId") REFERENCES "track_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_entity" ADD CONSTRAINT "FK_f3cfa5798fa863063e8ebc90561" FOREIGN KEY ("artistId") REFERENCES "artist_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_entity" ADD CONSTRAINT "FK_7971b4e05f4b4962613b98b71e5" FOREIGN KEY ("albumId") REFERENCES "album_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorite_entity" DROP CONSTRAINT "FK_7971b4e05f4b4962613b98b71e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_entity" DROP CONSTRAINT "FK_f3cfa5798fa863063e8ebc90561"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_entity" DROP CONSTRAINT "FK_ae3db37fc900b325f2dc8c18962"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track_entity" DROP CONSTRAINT "FK_f75df6098780938c05b7a65d2ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track_entity" DROP CONSTRAINT "FK_3cfbf55ef8a58b6447c226d2260"`,
    );
    await queryRunner.query(
      `ALTER TABLE "album_entity" DROP CONSTRAINT "FK_4aea5943406bd89eced202b012b"`,
    );
    await queryRunner.query(`DROP TABLE "favorite_entity"`);
    await queryRunner.query(`DROP TABLE "track_entity"`);
    await queryRunner.query(`DROP TABLE "album_entity"`);
    await queryRunner.query(`DROP TABLE "artist_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
  }
}
