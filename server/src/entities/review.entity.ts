import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { User } from './user.entity';
import { Manga } from './manga.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.user_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => Manga, (manga) => manga.manga_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'manga_id' })
  manga_id: number;

  @Column('int')
  @Check('rating >= 0 AND rating <= 5')
  rating: number;

  @Column('date')
  created_at: Date;
}
