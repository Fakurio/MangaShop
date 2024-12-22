import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Manga } from '../../entities/manga.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddMangaDTO, addMangaDtoSchema } from '../dto/add-manga.dto';
import { getErrorsFromZod } from 'src/utils/getErrorsFromZod';
import { Genre } from 'src/entities/genre.entity';
import { GenresService } from './genres.service';

@Injectable()
export class MangasService {
  constructor(
    @InjectRepository(Manga)
    private mangasRepository: Repository<Manga>,
    private genresService: GenresService,
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

  async getAllForAdmin(): Promise<Manga[]> {
    return this.mangasRepository.find({
      relations: ['genres'],
      order: {
        stock_quantity: 'ASC',
        title: 'ASC',
      },
    });
  }

  async getOne(id: number) {
    return await this.mangasRepository
      .createQueryBuilder('manga')
      .select([
        'manga.manga_id',
        'manga.description',
        'manga.author',
        'manga.stock_quantity',
      ])
      .innerJoinAndSelect('manga.genres', 'genres')
      .leftJoinAndSelect('manga.reviews', 'reviews')
      .where('manga.manga_id = :id', { id: id })
      .getOne();
  }

  async addManga(addMangaDTO: AddMangaDTO) {
    const parsedDTO = this.validateMangaDTO(addMangaDTO);
    const parsedDTOWithGenres = await this.getGenres(parsedDTO);
    const newManga = new Manga();
    newManga.title = parsedDTOWithGenres.title;
    newManga.img_url = parsedDTOWithGenres.img_url;
    newManga.price = parseFloat(parsedDTOWithGenres.price);
    newManga.stock_quantity = parsedDTOWithGenres.stock_quantity;
    newManga.author = parsedDTOWithGenres.author;
    newManga.description = parsedDTOWithGenres.description;
    newManga.genres = parsedDTOWithGenres.genres;
    await this.mangasRepository.save(newManga);
    return {
      message: 'Manga added successfully',
    };
  }

  private validateMangaDTO(addMangaDTO: AddMangaDTO) {
    const parsedDTO = addMangaDtoSchema.safeParse(addMangaDTO);
    if (!parsedDTO.success) {
      const errors = getErrorsFromZod(parsedDTO);
      throw new BadRequestException(errors);
    } else {
      return parsedDTO.data;
    }
  }

  private async getGenres(addMangaDTO: AddMangaDTO) {
    const availableGenres = await this.genresService.getAllGenres();
    const genres = addMangaDTO.genres.map((genre) => {
      const found = availableGenres.find((g) => g.name === genre);
      if (!found) {
        throw new BadRequestException(`Genre ${genre} not found`);
      }
      return found;
    });
    return { ...addMangaDTO, genres };
  }
}
