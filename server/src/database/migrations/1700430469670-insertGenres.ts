import { Genre } from '../../entities/genre.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { genres } from '../starting-data';

export class InsertGenres1700430469670 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const item of genres) {
      const genre = new Genre();
      genre.name = item;
      await queryRunner.manager.save<Genre>(genre);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM genre`);
  }
}
