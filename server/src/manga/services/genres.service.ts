import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Genre } from '../../entities/genre.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import genreDTOSchema, { GenreDTO } from '../dto/add-genre.dto';
import { getErrorsFromZod } from '../../utils/getErrorsFromZod';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genresRepository: Repository<Genre>,
  ) {}

  async getAllGenres(): Promise<Genre[]> {
    return await this.genresRepository
      .createQueryBuilder('genre')
      .select(['genre.genre_id', 'genre.name'])
      .getMany();
  }

  async addGenre(genreDTO: GenreDTO) {
    const parsedDTO = this.validateGenreDTO(genreDTO);
    await this.checkIfGenreExistsForAdding(parsedDTO.name);
    const newGenre = new Genre();
    newGenre.name = parsedDTO.name;
    await this.genresRepository.save(newGenre);
    return {
      message: 'Genre added successfully',
    };
  }

  async updateGenre(id: number, genreDTO: GenreDTO) {
    const found = await this.checkIfGenreExists(id);
    const parsedDTO = this.validateGenreDTO(genreDTO);
    await this.checkIfGenreExistsForUpdate(parsedDTO.name, id);
    found.name = parsedDTO.name;
    await this.genresRepository.save(found);
    return {
      message: 'Genre updated successfully',
    };
  }

  async deleteGenre(id: number) {
    await this.checkIfGenreExists(id);
    await this.checkIfGenreReferenceAnyManga(id);
    await this.genresRepository.delete({ genre_id: id });
  }

  private async checkIfGenreReferenceAnyManga(id: number) {
    const count = await this.genresRepository
      .createQueryBuilder('genre')
      .innerJoin('genre.mangas', 'manga')
      .where('genre.genre_id = :genreId', { genreId: id })
      .getCount();
    if (count > 0) {
      throw new BadRequestException({
        message: 'Genre is related to one or more mangas',
      });
    }
  }

  private validateGenreDTO(genreDTO: GenreDTO) {
    const parsedDTO = genreDTOSchema.safeParse(genreDTO);
    if (!parsedDTO.success) {
      const errors = getErrorsFromZod(parsedDTO);
      throw new BadRequestException(errors);
    } else {
      return parsedDTO.data;
    }
  }

  private async checkIfGenreExistsForUpdate(name: string, id: number) {
    const isExist = await this.genresRepository.exist({
      where: { name, genre_id: Not(id) },
    });
    if (isExist) {
      throw new BadRequestException({
        name: 'Genre already exists',
      });
    }
  }

  private async checkIfGenreExistsForAdding(name: string) {
    const found = await this.genresRepository.findOne({
      where: { name },
    });
    if (found) {
      throw new BadRequestException({
        name: 'Genre already exists',
      });
    }
  }

  private async checkIfGenreExists(id: number) {
    const found = await this.genresRepository.findOne({
      where: { genre_id: id },
    });
    if (!found) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return found;
  }
}
