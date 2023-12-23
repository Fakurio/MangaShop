import { Controller, Get } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/')
  async getPaymentMethods() {
    return await this.paymentService.getPaymentMethods();
  }
}
