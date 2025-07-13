import { Test } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartItem } from '../../entities/cart-item.entity';
import { Cart, Status } from '../../entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItemT } from '../types/cart-item';

describe('CartsService', () => {
  let cartService: CartsService;
  let cartsRepository: Repository<Cart>;
  let cartItemsRepository: Repository<CartItem>;

  const cartsRepositoryMock = {
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const cartItemsRepositoryMock = {
    upsert: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: getRepositoryToken(CartItem),
          useValue: cartItemsRepositoryMock,
        },
        { provide: getRepositoryToken(Cart), useValue: cartsRepositoryMock },
      ],
    }).compile();
    cartService = moduleRef.get(CartsService);
    cartsRepository = moduleRef.get(getRepositoryToken(Cart));
    cartItemsRepository = moduleRef.get(getRepositoryToken(CartItem));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should return user cart from db', async () => {
    jest.spyOn(cartsRepository, 'findOne').mockResolvedValue({
      cart_id: 1,
    } as Cart);
    expect(await cartService.getUserCart(1)).toEqual({ cart_id: 1 });
  });

  it('should remove cart id from CartItem[] -> arr is defined', () => {
    const arr: CartItem[] = [
      { manga_id: 1, cart_id: 1, quantity: 1 },
      { manga_id: 2, cart_id: 1, quantity: 1 },
    ];
    expect(cartService.removeCartID(arr)).toEqual([
      { manga_id: 1, quantity: 1 },
      { manga_id: 2, quantity: 1 },
    ]);
  });

  it('should return undefined -> CartItem[] is undefined', () => {
    expect(cartService.removeCartID(undefined)).toBeUndefined();
  });

  it('should merge carts -> add quantities', () => {
    const dbCart = {
      cart_id: 1,
      cartItems: [
        { manga_id: 1, cart_id: 1, quantity: 1 },
        { manga_id: 2, cart_id: 1, quantity: 1 },
      ],
    } as Cart;
    const clientCart: CartItemT[] = [
      { manga_id: 1, quantity: 1 },
      { manga_id: 2, quantity: 1 },
    ];

    expect(cartService.mergeCarts(clientCart, dbCart)).toEqual([
      { manga_id: 1, cart_id: 1, quantity: 2 },
      { manga_id: 2, cart_id: 1, quantity: 2 },
    ]);
  });

  it('should merge carts -> different items', () => {
    const dbCart = {
      cart_id: 1,
      cartItems: [
        { manga_id: 1, cart_id: 1, quantity: 1 },
        { manga_id: 2, cart_id: 1, quantity: 1 },
      ],
    } as Cart;
    const clientCart: CartItemT[] = [{ manga_id: 3, quantity: 1 }];

    expect(cartService.mergeCarts(clientCart, dbCart)).toEqual([
      { manga_id: 1, cart_id: 1, quantity: 1 },
      { manga_id: 2, cart_id: 1, quantity: 1 },
      { manga_id: 3, cart_id: 1, quantity: 1 },
    ]);
  });

  it('should merge carts -> different items and db is empty', () => {
    const dbCart = {
      cart_id: 1,
      cartItems: [] as CartItem[],
    } as Cart;
    const clientCart: CartItemT[] = [{ manga_id: 3, quantity: 1 }];

    expect(cartService.mergeCarts(clientCart, dbCart)).toEqual([
      { manga_id: 3, cart_id: 1, quantity: 1 },
    ]);
  });

  it('should merge carts -> different items and client cart is empty', () => {
    const dbCart = {
      cart_id: 1,
      cartItems: [
        { manga_id: 1, cart_id: 1, quantity: 1 },
        { manga_id: 2, cart_id: 1, quantity: 1 },
      ],
    } as Cart;
    const clientCart: CartItemT[] = [];

    expect(cartService.mergeCarts(clientCart, dbCart)).toEqual([
      { manga_id: 1, cart_id: 1, quantity: 1 },
      { manga_id: 2, cart_id: 1, quantity: 1 },
    ]);
  });

  it('should return undefined when client cart is undefined', () => {
    const dbCart = {
      cart_id: 1,
      cartItems: [] as CartItem[],
    } as Cart;

    expect(cartService.mergeCarts(undefined, dbCart)).toBeUndefined();
  });

  it('should save cart -> user has cart in db', async () => {
    const cart: CartItemT[] = [
      { manga_id: 1, quantity: 1 },
      { manga_id: 2, quantity: 1 },
    ];
    jest.spyOn(cartService, 'getUserCart').mockResolvedValue({
      cart_id: 1,
    } as Cart);

    await cartService.saveCart(cart, 1);

    expect(cartItemsRepository.upsert).toHaveBeenCalledWith(
      [
        { manga_id: 1, cart_id: 1, quantity: 1 },
        { manga_id: 2, cart_id: 1, quantity: 1 },
      ],
      {
        conflictPaths: ['manga_id', 'cart_id'],
      },
    );
  });

  it("should save cart -> user doesn't have cart in db", async () => {
    const cart: CartItemT[] = [
      { manga_id: 1, quantity: 1 },
      { manga_id: 2, quantity: 1 },
    ];
    jest.spyOn(cartService, 'getUserCart').mockResolvedValue(null);

    await cartService.saveCart(cart, 1);

    expect(cartsRepository.save).toHaveBeenCalledWith({
      user_id: 1,
      status: Status.ACTIVE,
      cartItems: [
        { manga_id: 1, quantity: 1 },
        { manga_id: 2, quantity: 1 },
      ],
    });
  });

  it('should delete cart', async () => {
    await cartService.deleteCart(1);

    expect(cartsRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should update cart status', async () => {
    const request = {
      user: {
        user_id: 1,
      },
    };
    jest
      .spyOn(cartService, 'getUserCart')
      .mockResolvedValue({ status: Status.ACTIVE } as Cart);

    await cartService.updateCartStatus(request);

    expect(cartsRepository.save).toHaveBeenCalledWith({
      status: Status.INACTIVE,
    });
    expect(cartItemsRepository.delete).toHaveBeenCalledTimes(1);
  });

  it("shouldn't update cart status -> cart doesn't exist", async () => {
    const request = {
      user: {
        user_id: 1,
      },
    };
    jest.spyOn(cartService, 'getUserCart').mockResolvedValue(null);

    await cartService.updateCartStatus(request);

    expect(cartsRepository.save).toHaveBeenCalledTimes(0);
    expect(cartItemsRepository.delete).toHaveBeenCalledTimes(0);
  });
});
