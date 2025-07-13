import { PaymentMethod } from '../../entities/payment-method.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Method } from '../../entities/payment-method.entity';

export class InsertPaymentMethods1700433979043 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const item of Object.values(Method)) {
      const paymentMethod = new PaymentMethod();
      paymentMethod.name = item;
      await queryRunner.manager.save<PaymentMethod>(paymentMethod);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM payment_method`);
  }
}
