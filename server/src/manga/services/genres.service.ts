import { Injectable } from '@nestjs/common';
import { Genre } from 'src/entities/genre.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class GenresService {
  constructor(private readonly dataSource: DataSource) {}

  async getAllGenres(): Promise<Genre[]> {
    const genres = await this.dataSource
      .getRepository(Genre)
      .createQueryBuilder('genre')
      .select(['genre.genre_id', 'genre.name'])
      .getMany();

    return genres;
  }
}
