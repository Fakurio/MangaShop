import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1752600503482 implements MigrationInterface {
  name = 'AddRoleTables1752600503482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`role_id\` int NOT NULL AUTO_INCREMENT, \`name\` enum ('admin', 'user') NOT NULL DEFAULT 'user', PRIMARY KEY (\`role_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_role\` (\`user_id\` int NOT NULL, \`role_id\` int NOT NULL, INDEX \`IDX_d0e5815877f7395a198a4cb0a4\` (\`user_id\`), INDEX \`IDX_32a6fc2fcb019d8e3a8ace0f55\` (\`role_id\`), PRIMARY KEY (\`user_id\`, \`role_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_d0e5815877f7395a198a4cb0a46\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_32a6fc2fcb019d8e3a8ace0f55f\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`role_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`
      INSERT INTO role (role_id, name) VALUES
      (1, 'admin'),
      (2, 'user')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_32a6fc2fcb019d8e3a8ace0f55f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_d0e5815877f7395a198a4cb0a46\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_32a6fc2fcb019d8e3a8ace0f55\` ON \`user_role\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d0e5815877f7395a198a4cb0a4\` ON \`user_role\``,
    );
    await queryRunner.query(`DROP TABLE \`user_role\``);
    await queryRunner.query(`DROP TABLE \`role\``);
  }
}
