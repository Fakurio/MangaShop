import {Injectable} from '@nestjs/common';
import type {CartItemT} from '../types/cart-item.ts';
import {Cart, Status} from '../../entities/cart.entity';
import {In, Not, Repository} from 'typeorm';
import {CartItem} from '../../entities/cart-item.entity';
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class CartsService {
  constructor(
      @InjectRepository(Cart)
      private cartsRepository: Repository<Cart>,
      @InjectRepository(CartItem)
      private cartItemsRepository: Repository<CartItem>
  ) {}

  async getUserCart(user_id: number) {
    return await this.cartsRepository.findOne({
      where: {user_id: user_id, status: Status.ACTIVE},
      relations: ['cartItems'],
    });
  }

  removeCartID(cart: CartItemT[] | undefined) {
    return cart?.map((item) => ({
      manga_id: item.manga_id,
      quantity: item.quantity,
    }));
  }

  mergeCarts(cart: CartItemT[] | undefined, cartDB: Cart) {
    return cart?.reduce((acc, item) => {
      let existingItem = acc.find(
          (i: CartItem) => i.manga_id === item.manga_id,
      );
      if (existingItem) {
        existingItem.quantity = existingItem.quantity + item.quantity;
      } else {
        acc.push({cart_id: cartDB.cart_id, ...item});
      }
      return acc;
    }, cartDB.cartItems);
  }

  async saveCart(cart: CartItemT[], user_id: number) {
    let userCartFromDB = await this.getUserCart(user_id);
    if (userCartFromDB) {
      await this.updateCartInDatabase(cart, userCartFromDB);
    } else {
      const newCart = this.createCart(cart, user_id)
      await this.cartsRepository.save(newCart);
    }
  }

  async deleteCart(user_id: number) {
    await this.cartsRepository.delete({
      user_id: user_id,
      status: Status.ACTIVE,
    });
  }

  private async updateCartInDatabase(cart: CartItemT[], userCartFromDB: Cart) {
    const clientCurrentCart = cart.map(item => {
      const cartItem = new CartItem()
      cartItem.quantity = item.quantity;
      cartItem.manga_id = item.manga_id;
      cartItem.cart_id = userCartFromDB!.cart_id
      return cartItem;
    })
    await this.cartItemsRepository.upsert(clientCurrentCart, {
      conflictPaths: ["manga_id", "cart_id"]
    })
    const mangaIDs = cart.map(item => item.manga_id)
    await this.cartItemsRepository.remove(
        await this.cartItemsRepository.find({
          where: {
            cart_id: userCartFromDB!.cart_id,
            manga_id: Not(In(mangaIDs))
          }
        })
    )
  }

  private createCart(cart: CartItemT[], user_id: number) {
    let newCart = new Cart();
    newCart.user_id = user_id;
    newCart.status = Status.ACTIVE;
    newCart.cartItems = [];
    cart.forEach((item) => {
      let cartItem = new CartItem();
      cartItem.manga_id = item.manga_id;
      cartItem.quantity = item.quantity;
      newCart.cartItems.push(cartItem);
    });
    return newCart;
  }
}
