import { Module } from '@nestjs/common';
import { CartsService } from './services/carts.service';

@Module({
  controllers: [],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartModule {}
