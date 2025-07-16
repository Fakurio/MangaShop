import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertGenres1700430469670 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO genre (genre_id, name) VALUES
     (1, 'Action'),
     (2, 'Psychological'),
     (3, 'Monsters'),
     (4, 'Romance'),
     (5, 'Comedy'),
     (6, 'Thriller'),
     (7, 'Drama'),
     (8, 'Mafia')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM genre`);
  }
}
