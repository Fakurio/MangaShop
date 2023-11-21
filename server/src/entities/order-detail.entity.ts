import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Manga } from './manga.entity';

@Entity()
export class OrderDetail {
  @PrimaryColumn()
  @ManyToOne(() => Order, (order) => order.order_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order_id: Order;

  @PrimaryColumn()
  @ManyToOne(() => Manga, (manga) => manga.manga_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'manga_id' })
  manga_id: Manga;

  @Column('int')
  quantity: number;
}
