import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { PaymentMethod } from './payment-method.entity';
import { OrderDetail } from './order-detail.entity';

export enum OrderStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => User, (user) => user.user_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column('date')
  order_date: Date;

  @Column('enum', { enum: OrderStatus, default: OrderStatus.PENDING })
  order_status: OrderStatus;

  @Column('decimal', { precision: 6, scale: 2 })
  total_price: number;

  @ManyToOne(
    () => PaymentMethod,
    (paymentMethod) => paymentMethod.payment_method_id,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'payment_method_id' })
  payment_method_id: number;

  @OneToMany(() => OrderDetail, (orderItem) => orderItem.order_id, {
    cascade: true,
  })
  orderItems: OrderDetail[];
}
