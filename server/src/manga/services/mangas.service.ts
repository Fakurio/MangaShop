import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Manga} from '../../entities/manga.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class MangasService {
  constructor(
      @InjectRepository(Manga)
      private mangasRepository: Repository<Manga>
  ) {}

  async getAll(): Promise<Manga[]> {
    const mangas = await this.mangasRepository
      .createQueryBuilder('manga')
      .select(['manga.title', 'manga.manga_id', 'manga.price', 'manga.img_url'])
      .where('manga.stock_quantity > 0')
      .getMany();

    if (!mangas) {
      throw new HttpException('Mangas not found', HttpStatus.NOT_FOUND);
    }

    return mangas;
  }

  async getOne(id: number) {
    return await this.mangasRepository
        .createQueryBuilder('manga')
        .select(['manga.manga_id', 'manga.description', 'manga.author', 'manga.stock_quantity'])
        .innerJoinAndSelect('manga.genres', 'genres')
        .leftJoinAndSelect('manga.reviews', 'reviews')
        .where('manga.manga_id = :id', {id: id})
        .getOne();
  }
}
