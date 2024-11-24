import {Injectable} from '@nestjs/common';
import {Genre} from '../../entities/genre.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class GenresService {
  constructor(
      @InjectRepository(Genre)
      private genresRepository: Repository<Genre>
  ) {}

  async getAllGenres(): Promise<Genre[]> {
    return await this.genresRepository
        .createQueryBuilder('genre')
        .select(['genre.genre_id', 'genre.name'])
        .getMany();
  }
}
