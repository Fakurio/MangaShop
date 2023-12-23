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
}
