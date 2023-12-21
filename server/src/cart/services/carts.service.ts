import { Injectable } from '@nestjs/common';
import type { CartItemT } from '../types/cart-item.ts';
import { Cart } from 'src/entities/cart.entity';
import { DataSource } from 'typeorm';
import { CartItem } from 'src/entities/cart-item.entity';

@Injectable()
export class CartsService {
  constructor(private dataSource: DataSource) {}

  async getUserCart(user_id: number) {
    const cart = await this.dataSource
      .getRepository(Cart)
      .createQueryBuilder('cart')
      .innerJoinAndSelect('cart.user_id', 'user')
      .leftJoinAndSelect('cart.cartItems', 'cartItems')
      .where('user.user_id = :user_id', { user_id: user_id })
      .andWhere("cart.status = 'Active'")
      .getOne();

    return cart;
  }

  mergeCarts(cart: CartItemT[] | undefined, cartDB: Cart) {
    let mergedCart = cart?.reduce(
      (acc, item) => {
        let existingItem = acc.find((i: any) => i.manga_id === item.manga_id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push(item);
        }
        return acc;
      },
      cartDB.cartItems.map((item) => ({
        manga_id: item.manga_id,
        quantity: item.quantity,
      })),
    );

    return mergedCart;
  }

  async saveCart(cart: CartItemT[], user_id: number) {
    let userCart = await this.getUserCart(user_id);
    if (userCart) {
      await this.dataSource.getRepository(CartItem).delete({
        cart_id: userCart.cart_id,
      });

      let cartID = userCart.cart_id;
      userCart.cartItems = cart.map((item) => {
        return {
          cart_id: cartID,
          ...item,
        };
      });

      await this.dataSource.getRepository(Cart).save(userCart);
    }
  }
}
