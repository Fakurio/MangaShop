import { Injectable } from '@nestjs/common';
import { CreateCartDto } from 'src/dto/create-cart.dto';

@Injectable()
export class CartsService {
  getUserCart(id: number): string {
    return `content of user ${id} cart`;
  }

  createCart(cart: CreateCartDto): string {
    return `create new cart ${cart.manga_id} ${cart.status}`;
  }
}
