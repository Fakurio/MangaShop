import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrdersTable1703420729514 implements MigrationInterface {
    name = 'UpdateOrdersTable1703420729514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(512) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(512) NULL`);
    }

}
