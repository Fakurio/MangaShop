import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';

export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  cart_id: number;

  @ManyToOne(() => User, (user) => user.user_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column('enum', { enum: Status, default: Status.ACTIVE })
  status: Status;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart_id, { cascade: true })
  cartItems: CartItem[];
}
