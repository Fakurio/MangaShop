import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateOrderT } from '../dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Post('create')
  createOrder(@Request() req, @Body() order: CreateOrderT) {
    return this.orderService.createOrder(req, order);
  }
}
