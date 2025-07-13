import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from '../services/order.service';
import { Order } from '../../entities/order.entity';
import { CartsService } from '../../cart/services/carts.service';
import { PaymentService } from '../services/payment.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDTO } from '../dto/create-order.dto';

describe('OrdersController', () => {
  let controller: OrderController;
  let ordersService: OrderService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderService,
        OrderController,
        { provide: getRepositoryToken(Order), useValue: {} },
        { provide: CartsService, useValue: {} },
        { provide: PaymentService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();
    controller = moduleRef.get(OrderController);
    ordersService = moduleRef.get(OrderService);
  });

  it('should create order', async () => {
    const dto = {} as CreateOrderDTO;
    const request = {};
    jest.spyOn(ordersService, 'createOrder').mockResolvedValue('Order created');

    expect(await controller.createOrder(request, dto)).toEqual('Order created');
  });

  it('should return order statuses', () => {
    jest.spyOn(ordersService, 'getOrderStatuses').mockReturnValue([]);

    expect(controller.getOrderStatuses()).toEqual([]);
  });

  it("should return user's orders", async () => {
    const request = {
      user: {
        sub: 1,
      },
    };
    jest.spyOn(ordersService, 'getAllOrders').mockResolvedValue([]);

    expect(await controller.getAllOrders(request)).toEqual([]);
  });
});
