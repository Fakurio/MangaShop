import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {Repository} from 'typeorm';
import { CreateOrderDTO } from '../dto/create-order.dto';
import { createOrderSchema } from '../dto/create-order.dto';
import { CartsService } from '../../cart/services/carts.service';
import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderDetail } from '../../entities/order-detail.entity';
import { PaymentService } from './payment.service';
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class OrderService {
  constructor(
      @InjectRepository(Order)
      private ordersRepository: Repository<Order>,
      private cartsService: CartsService,
      private paymentService: PaymentService,
  ) {}


  async createOrder(req, order: CreateOrderDTO) {
    if (!createOrderSchema.safeParse(order).success) {
      throw new HttpException('Invalid order data', HttpStatus.BAD_REQUEST);
    }

    await this.cartsService.updateCartStatus(req)

    const newOrder = new Order();
    newOrder.user_id = req.user.sub;
    newOrder.order_status = OrderStatus.PENDING;
    newOrder.orderItems = [];
    order.cart.forEach((item) => {
      let orderItem = new OrderDetail();
      orderItem.manga_id = item.manga_id;
      orderItem.quantity = item.quantity;
      newOrder.orderItems.push(orderItem);
    });
    newOrder.order_date = new Date();

    const paymentMethod = await this.paymentService.getPaymentMethodID(
      order.payment_method,
    );
    if (paymentMethod) {
      newOrder.payment_method_id = paymentMethod.payment_method_id;
    }

    newOrder.total_price = order.total;

    await this.ordersRepository.save(newOrder);

    return JSON.stringify('Order created');
  }

  getOrderStatuses() {
    return Object.keys(OrderStatus).map(key => OrderStatus[key]);
  }

  async getAllOrders(user_id: number) {
    return await this.ordersRepository.find({
      where: { user_id: user_id },
      relations: ['orderItems'],
    });
  }
}
