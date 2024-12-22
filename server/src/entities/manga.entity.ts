import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Genre } from './genre.entity';
import { Review } from './review.entity';

@Entity()
export class Manga {
  @PrimaryGeneratedColumn()
  manga_id: number;

  @Column('varchar', { length: 50, unique: true })
  title: string;

  @Column()
  img_url: string;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @Column('int')
  stock_quantity: number;

  @Column('varchar', { length: 50 })
  author: string;

  @Column('varchar', { length: 5000, default: '' })
  description: string;

  @ManyToMany(() => Genre, (genre) => genre.mangas)
  @JoinTable({
    name: 'manga_genre',
    joinColumn: { name: 'manga_id' },
    inverseJoinColumn: { name: 'genre_id' },
  })
  genres: Genre[];

  @OneToMany(() => Review, (review) => review.manga_id, { cascade: true })
  reviews: Review[];
}
