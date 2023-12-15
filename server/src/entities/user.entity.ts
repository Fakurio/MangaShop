import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cart } from './cart.entity';
import { Review } from './review.entity';
import { Order } from './order.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('varchar', { length: 30, unique: true })
  email: string;

  @Column('varchar', { length: 200 })
  password: string;

  @OneToMany(() => Cart, (cart) => cart.user_id, { cascade: true })
  carts?: Cart[];

  @OneToMany(() => Review, (review) => review.user_id, { cascade: true })
  reviews?: Review[];

  @OneToMany(() => Order, (order) => order.user_id, { cascade: true })
  orders?: Order[];
}
