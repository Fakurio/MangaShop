import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { CartModule } from 'src/cart/cart.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "../entities/order.entity";
import {PaymentMethod} from "../entities/payment-method.entity";

@Module({
  controllers: [PaymentController, OrderController],
  providers: [PaymentService, OrderService],
  imports: [CartModule, TypeOrmModule.forFeature([Order, PaymentMethod])],
})
export class OrderModule {}
