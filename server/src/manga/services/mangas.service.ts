import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Manga } from '../../entities/manga.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MangaDTO, mangaDtoSchema } from '../dto/add-manga.dto';
import { getErrorsFromZod } from 'src/utils/getErrorsFromZod';
import { GenresService } from './genres.service';
import { ZodSchema } from 'zod';

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

  async updateManga(id: number, updateMangaDTO: MangaDTO) {
    const found = await this.mangasRepository.findOne({
      where: { manga_id: id },
    });

    if (!found) {
      throw new NotFoundException(`Manga with id ${id} not found`);
    }

    const parsedDTO = this.validateMangaDTO(updateMangaDTO);
    const parsedDTOWithGenres = await this.getGenres(parsedDTO);
    const updated = this.mangasRepository.merge(found, {
      ...parsedDTOWithGenres,
      price: parseFloat(parsedDTOWithGenres.price),
    });
    await this.mangasRepository.save(updated);
    return {
      message: 'Manga updated successfully',
    };
  }

  async addManga(addMangaDTO: MangaDTO) {
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

  private validateMangaDTO(mangaDTO: MangaDTO) {
    const parsedDTO = mangaDtoSchema.safeParse(mangaDTO);
    if (!parsedDTO.success) {
      const errors = getErrorsFromZod(parsedDTO);
      throw new BadRequestException(errors);
    } else {
      return parsedDTO.data;
    }
  }

  private async getGenres(mangaDTO: MangaDTO) {
    const availableGenres = await this.genresService.getAllGenres();
    const genres = mangaDTO.genres.map((genre) => {
      const found = availableGenres.find((g) => g.name === genre);
      if (!found) {
        throw new BadRequestException(`Genre ${genre} not found`);
      }
      return found;
    });
    return { ...mangaDTO, genres };
  }
}
