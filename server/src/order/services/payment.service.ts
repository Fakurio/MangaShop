import { Injectable } from '@nestjs/common';
import { PaymentMethod } from 'src/entities/payment-method.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(private dataSource: DataSource) {}

  async getPaymentMethods() {
    return await this.dataSource
      .getRepository(PaymentMethod)
      .createQueryBuilder('paymentMethod')
      .getMany();
  }

  async getPaymentMethodID(value: string) {
    return await this.dataSource
      .getRepository(PaymentMethod)
      .createQueryBuilder('paymentMethod')
      .select('payment_method_id')
      .where('paymentMethod.name = :name', { name: value })
      .getRawOne();
  }
}
