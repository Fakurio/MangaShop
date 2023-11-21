import { Column, PrimaryGeneratedColumn, Entity, ManyToMany } from 'typeorm';
import { Manga } from './manga.entity';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  genre_id: number;

  @Column('varchar', { length: 20, unique: true })
  name: string;

  @ManyToMany(() => Manga, (manga) => manga.genres)
  mangas?: Manga[];
}
