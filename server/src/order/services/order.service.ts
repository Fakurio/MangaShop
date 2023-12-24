import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateOrderT } from '../dto/create-order.dto';
import { createOrderSchema } from '../dto/create-order.dto';
import { CartsService } from 'src/cart/services/carts.service';
import { Order, OrderStatus } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { PaymentService } from './payment.service';
import { Cart, Status } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/cart-item.entity';

@Injectable()
export class OrderService {
  constructor(
    private dataSource: DataSource,
    private cartsService: CartsService,
    private paymentService: PaymentService,
  ) {}

  async createOrder(req, order: CreateOrderT) {
    if (!createOrderSchema.safeParse(order).success) {
      throw new HttpException('Invalid order data', HttpStatus.BAD_REQUEST);
    }

    let userCart = await this.cartsService.getUserCart(req.user.user_id);

    if (userCart) {
      userCart.status = Status.INACTIVE;
      await this.dataSource.getRepository(CartItem).delete({
        cart_id: userCart.cart_id,
      });
      await this.dataSource.getRepository(Cart).save(userCart);
    }

    let newOrder = new Order();
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
    let paymentMethod = await this.paymentService.getPaymentMethodID(
      order.payment_method,
    );
    if (paymentMethod) {
      newOrder.payment_method_id = paymentMethod.payment_method_id;
    }
    newOrder.total_price = order.total;
    await this.dataSource.getRepository(Order).save(newOrder);

    return JSON.stringify('Order created');
  }
}
