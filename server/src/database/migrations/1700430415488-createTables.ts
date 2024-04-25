import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1700430415488 implements MigrationInterface {
  name = 'CreateTables1700430415488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`genre\` (\`genre_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL, UNIQUE INDEX \`IDX_dd8cd9e50dd049656e4be1f7e8\` (\`name\`), PRIMARY KEY (\`genre_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`manga\` (\`manga_id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(50) NOT NULL, \`img_url\` varchar(255) NOT NULL, \`price\` decimal(5,2) NOT NULL, \`stock_quantity\` int NOT NULL, \`author\` varchar(50) NOT NULL, \`description\` text NOT NULL, UNIQUE INDEX \`IDX_34e4f0d3e489ceb36d48a73881\` (\`title\`), PRIMARY KEY (\`manga_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`review\` (\`review_id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`rating\` int NOT NULL, \`created_at\` date NOT NULL, \`user_id\` int NULL, \`manga_id\` int NULL, PRIMARY KEY (\`review_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`payment_method\` (\`payment_method_id\` int NOT NULL AUTO_INCREMENT, \`name\` enum ('Card', 'Paypal', 'Bank Transfer') NOT NULL DEFAULT 'Card', PRIMARY KEY (\`payment_method_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order\` (\`order_id\` int NOT NULL AUTO_INCREMENT, \`order_date\` date NOT NULL, \`order_status\` enum ('Pending', 'Completed') NOT NULL DEFAULT 'Pending', \`total_price\` decimal(6,2) NOT NULL, \`user_id\` int NULL, \`payment_method_id\` int NULL, PRIMARY KEY (\`order_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NOT NULL, \`email\` varchar(30) NOT NULL, \`password\` varchar(200) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), \`refresh_token\` varchar(512) NULL, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cart\` (\`cart_id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('Active', 'Inactive') NOT NULL DEFAULT 'Active', \`user_id\` int NULL, PRIMARY KEY (\`cart_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cart_item\` (\`cart_id\` int NOT NULL, \`manga_id\` int NOT NULL, \`quantity\` int NOT NULL, PRIMARY KEY (\`cart_id\`, \`manga_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_detail\` (\`order_id\` int NOT NULL, \`manga_id\` int NOT NULL, \`quantity\` int NOT NULL, PRIMARY KEY (\`order_id\`, \`manga_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`manga_genre\` (\`manga_id\` int NOT NULL, \`genre_id\` int NOT NULL, INDEX \`IDX_3f5aa9794cff8b488d3d9ccaff\` (\`manga_id\`), INDEX \`IDX_561b393cce72f83c0ff0be3010\` (\`genre_id\`), PRIMARY KEY (\`manga_id\`, \`genre_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_81446f2ee100305f42645d4d6c2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_809cdf8dc7115f31d2a5440d425\` FOREIGN KEY (\`manga_id\`) REFERENCES \`manga\`(\`manga_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_199e32a02ddc0f47cd93181d8fd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_451b11cb12bc07db00d19c5a511\` FOREIGN KEY (\`payment_method_id\`) REFERENCES \`payment_method\`(\`payment_method_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_f091e86a234693a49084b4c2c86\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_b6b2a4f1f533d89d218e70db941\` FOREIGN KEY (\`cart_id\`) REFERENCES \`cart\`(\`cart_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_a30691b1f8d7dc54f4a9a4c48db\` FOREIGN KEY (\`manga_id\`) REFERENCES \`manga\`(\`manga_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_detail\` ADD CONSTRAINT \`FK_a6ac5c99b8c02bd4ee53d3785be\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`order_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_detail\` ADD CONSTRAINT \`FK_f67d6a0a5db6691ea7ac7db0be4\` FOREIGN KEY (\`manga_id\`) REFERENCES \`manga\`(\`manga_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`manga_genre\` ADD CONSTRAINT \`FK_3f5aa9794cff8b488d3d9ccaff1\` FOREIGN KEY (\`manga_id\`) REFERENCES \`manga\`(\`manga_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`manga_genre\` ADD CONSTRAINT \`FK_561b393cce72f83c0ff0be30109\` FOREIGN KEY (\`genre_id\`) REFERENCES \`genre\`(\`genre_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`manga_genre\` DROP FOREIGN KEY \`FK_561b393cce72f83c0ff0be30109\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`manga_genre\` DROP FOREIGN KEY \`FK_3f5aa9794cff8b488d3d9ccaff1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_detail\` DROP FOREIGN KEY \`FK_f67d6a0a5db6691ea7ac7db0be4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_detail\` DROP FOREIGN KEY \`FK_a6ac5c99b8c02bd4ee53d3785be\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_a30691b1f8d7dc54f4a9a4c48db\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_b6b2a4f1f533d89d218e70db941\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_f091e86a234693a49084b4c2c86\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_451b11cb12bc07db00d19c5a511\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_199e32a02ddc0f47cd93181d8fd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_809cdf8dc7115f31d2a5440d425\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_81446f2ee100305f42645d4d6c2\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_561b393cce72f83c0ff0be3010\` ON \`manga_genre\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3f5aa9794cff8b488d3d9ccaff\` ON \`manga_genre\``,
    );
    await queryRunner.query(`DROP TABLE \`manga_genre\``);
    await queryRunner.query(`DROP TABLE \`order_detail\``);
    await queryRunner.query(`DROP TABLE \`cart_item\``);
    await queryRunner.query(`DROP TABLE \`cart\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`order\``);
    await queryRunner.query(`DROP TABLE \`payment_method\``);
    await queryRunner.query(`DROP TABLE \`review\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_34e4f0d3e489ceb36d48a73881\` ON \`manga\``,
    );
    await queryRunner.query(`DROP TABLE \`manga\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_dd8cd9e50dd049656e4be1f7e8\` ON \`genre\``,
    );
    await queryRunner.query(`DROP TABLE \`genre\``);
  }
}
