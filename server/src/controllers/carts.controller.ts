import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreateCartDto, CreateCartSchema } from '../dto/create-cart.dto';
import { CartsService } from 'src/services/carts.service';
import { CartValidationPipe } from 'src/pipes/CartValidationPipe';

@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Get(':user_id')
  getUserCart(@Param('user_id', ParseIntPipe) user_id: number): string {
    return this.cartsService.getUserCart(user_id);
  }

  @Post()
  @UsePipes(new CartValidationPipe(CreateCartSchema))
  createCart(@Body() cart: CreateCartDto) {
    return this.cartsService.createCart(cart);
  }
}
