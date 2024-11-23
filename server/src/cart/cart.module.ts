import { Module } from '@nestjs/common';
import { CartsService } from './services/carts.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Cart} from "../entities/cart.entity";
import {CartItem} from "../entities/cart-item.entity";

@Module({
  controllers: [],
  providers: [CartsService],
  exports: [CartsService],
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
})
export class CartModule {}
