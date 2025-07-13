import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { Order, OrderStatus } from '../../entities/order.entity';
import { CartsService } from '../../cart/services/carts.service';
import { PaymentService } from './payment.service';
import { CreateOrderDTO } from '../dto/create-order.dto';
import { PaymentMethod } from '../../entities/payment-method.entity';
import { Cart } from '../../entities/cart.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

describe('OrdersService', () => {
  let ordersService: OrderService;
  let paymentService: PaymentService;
  let cartService: CartsService;
  let ordersRepository: Repository<Order>;

  const ordersRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderService,
        CartsService,
        PaymentService,
        { provide: getRepositoryToken(Order), useValue: ordersRepositoryMock },
        { provide: getRepositoryToken(PaymentMethod), useValue: {} },
        { provide: getRepositoryToken(Cart), useValue: {} },
        { provide: getRepositoryToken(CartItem), useValue: {} },
      ],
    }).compile();
    ordersService = moduleRef.get(OrderService);
    paymentService = moduleRef.get(PaymentService);
    cartService = moduleRef.get(CartsService);
    ordersRepository = moduleRef.get(getRepositoryToken(Order));
  });

  it('should create order', async () => {
    const dto: CreateOrderDTO = {
      cart: [
        {
          manga_id: 1,
          quantity: 1,
        },
      ],
      payment_method: '',
      total: 10,
    };
    const request = {
      user: {
        sub: 1,
      },
    };
    jest.spyOn(cartService, 'updateCartStatus').mockResolvedValue();
    jest
      .spyOn(paymentService, 'getPaymentMethodID')
      .mockResolvedValue({ payment_method_id: 1 });
    jest.spyOn(ordersRepository, 'save').mockImplementation((order) => {
      return Promise.resolve({ ...order } as Order);
    });

    expect(await ordersService.createOrder(request, dto)).toEqual(
      JSON.stringify('Order created'),
    );
    expect(ordersRepository.save).toHaveBeenCalledWith({
      payment_method_id: 1,
      total_price: 10,
      user_id: 1,
      order_status: OrderStatus.PENDING,
      order_date: expect.any(Date),
      orderItems: [{ manga_id: 1, quantity: 1 }],
    });
  });

  it("shouldn't create order -> invalid manga_id", async () => {
    const dto: CreateOrderDTO = {
      cart: [
        {
          manga_id: 1.1,
          quantity: 1,
        },
      ],
      payment_method: '',
      total: 10,
    };
    const request = {
      user: {
        sub: 1,
      },
    };

    try {
      await ordersService.createOrder(request, dto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Invalid order data');
    }
  });

  it("shouldn't create order -> invalid quantity", async () => {
    const dto: CreateOrderDTO = {
      cart: [
        {
          manga_id: 1,
          quantity: 1.1,
        },
      ],
      payment_method: '',
      total: 10,
    };
    const request = {
      user: {
        sub: 1,
      },
    };

    try {
      await ordersService.createOrder(request, dto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Invalid order data');
    }
  });

  it('should return order statues', () => {
    expect(ordersService.getOrderStatuses()).toEqual(
      Object.keys(OrderStatus).map((key) => OrderStatus[key]),
    );
  });

  it("should return user's orders", async () => {
    jest.spyOn(ordersRepository, 'find').mockResolvedValue([]);

    expect(await ordersService.getAllOrders(1)).toEqual([]);
  });
});
