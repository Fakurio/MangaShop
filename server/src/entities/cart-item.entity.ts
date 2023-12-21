import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Manga } from './manga.entity';

@Entity()
export class CartItem {
  @PrimaryColumn()
  @ManyToOne(() => Cart, (cart) => cart.cart_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id' })
  cart_id: number;

  @PrimaryColumn()
  @ManyToOne(() => Manga, (manga) => manga.manga_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'manga_id' })
  manga_id: number;

  @Column('int')
  quantity: number;
}
