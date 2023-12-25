import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
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

  @UseGuards(JwtGuard)
  @Get('status')
  getOrderStauts() {
    return this.orderService.getOrderStatus();
  }

  @UseGuards(JwtGuard)
  @Get('all')
  getAllOrders(@Request() req) {
    return this.orderService.getAllOrders(req.user.sub);
  }
}
