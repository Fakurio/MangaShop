import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { CartModule } from 'src/cart/cart.module';

@Module({
  controllers: [PaymentController, OrderController],
  providers: [PaymentService, OrderService],
  imports: [CartModule],
})
export class OrderModule {}
