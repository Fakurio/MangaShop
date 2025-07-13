import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '../../entities/payment-method.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentsRepository: Repository<PaymentMethod>,
  ) {}

  async getPaymentMethods() {
    return await this.paymentsRepository.find();
  }

  async getPaymentMethodID(value: string) {
    return await this.paymentsRepository
      .createQueryBuilder('paymentMethod')
      .select('payment_method_id')
      .where('paymentMethod.name = :name', { name: value })
      .getRawOne();
  }
}
