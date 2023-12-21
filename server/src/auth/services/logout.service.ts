import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CartsService } from 'src/cart/services/carts.service';
import { CartItemT } from 'src/cart/types/cart-item';
import { UsersService } from 'src/user/services/users.service';

@Injectable()
export class LogoutService {
  constructor(
    private usersService: UsersService,
    private cartsService: CartsService,
  ) {}

  async logoutUser(req, res: Response, cart: CartItemT[]) {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      throw new HttpException('No cookies', HttpStatus.UNAUTHORIZED);
    }

    const refreshToken = cookies.jwt;
    const foundUser = await this.usersService.findByRefreshToken(refreshToken);
    if (!foundUser) {
      res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      throw new HttpException('Unauthorized user', HttpStatus.FORBIDDEN);
    }

    await this.usersService.updateRefreshToken(req.user.sub, '');
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    await this.cartsService.saveCart(cart, req.user.sub);
  }
}
