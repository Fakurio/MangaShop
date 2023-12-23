import { Injectable } from '@nestjs/common';
import type { CartItemT } from '../types/cart-item.ts';
import { Cart, Status } from 'src/entities/cart.entity';
import { DataSource } from 'typeorm';
import { CartItem } from 'src/entities/cart-item.entity';

@Injectable()
export class CartsService {
  constructor(private dataSource: DataSource) {}

  async getUserCart(user_id: number) {
    const cart = await this.dataSource.getRepository(Cart).findOne({
      where: { user_id: user_id, status: Status.ACTIVE },
      relations: ['cartItems'],
    });

    return cart;
  }

  removeCartID(cart: CartItemT[] | undefined) {
    return cart?.map((item) => ({
      manga_id: item.manga_id,
      quantity: item.quantity,
    }));
  }

  mergeCarts(cart: CartItemT[] | undefined, cartDB: Cart) {
    let mergedCart = cart?.reduce((acc, item) => {
      let existingItem = acc.find(
        (i: CartItem) => i.manga_id === item.manga_id,
      );
      if (existingItem) {
        existingItem.quantity = existingItem.quantity + item.quantity;
      } else {
        acc.push({ cart_id: cartDB.cart_id, ...item });
      }
      return acc;
    }, cartDB.cartItems);
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
    } else {
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

      await this.dataSource.getRepository(Cart).save(newCart);
    }
  }
}
