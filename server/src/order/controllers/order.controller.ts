import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { CreateOrderDTO } from '../dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Post()
  createOrder(@Request() req, @Body() order: CreateOrderDTO) {
    return this.orderService.createOrder(req, order);
  }

  @Get('status')
  getOrderStatuses() {
    return this.orderService.getOrderStatuses();
  }

  @UseGuards(JwtGuard)
  @Get()
  getAllOrders(@Request() req) {
    return this.orderService.getAllOrders(req.user.sub);
  }
}
