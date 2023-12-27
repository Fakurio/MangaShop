import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Manga } from 'src/entities/manga.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class MangasService {
  constructor(private readonly dataSource: DataSource) {}

  async getAll(): Promise<Manga[]> {
    const mangas = await this.dataSource
      .getRepository(Manga)
      .createQueryBuilder('manga')
      .select(['manga.title', 'manga.manga_id', 'manga.price', 'manga.img_url'])
      .where('manga.stock_quantity > 0')
      .getMany();

    if (!mangas) {
      throw new HttpException('Mangas not found', HttpStatus.NOT_FOUND);
    }

    return mangas;
  }

  async getOne(id: number): Promise<Manga> {
    const manga = await this.dataSource
      .getRepository(Manga)
      .createQueryBuilder('manga')
      .select(['manga.description', 'manga.author', 'manga.stock_quantity'])
      .innerJoinAndSelect('manga.genres', 'genres')
      .leftJoinAndSelect('manga.reviews', 'reviews')
      .where('manga.manga_id = :id', { id: id })
      .getOne();

    if (!manga) {
      throw new HttpException('Manga not found', HttpStatus.NOT_FOUND);
    }

    return manga;
  }
}
