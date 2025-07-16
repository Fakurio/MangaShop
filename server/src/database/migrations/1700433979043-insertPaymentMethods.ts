import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertPaymentMethods1700433979043 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO payment_method (payment_method_id, name) VALUES
      (1, 'Card'),
      (2, 'Paypal'),
      (3, 'Bank Transfer')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM payment_method`);
  }
}
