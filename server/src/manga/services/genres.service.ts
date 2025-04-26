import { BadRequestException, Injectable } from '@nestjs/common';
import { Genre } from '../../entities/genre.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import genreDTOSchema, { GenreDTO } from '../dto/add-genre.dto';
import { MangaDTO, mangaDtoSchema } from '../dto/add-manga.dto';
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
    const newGenre = new Genre();
    newGenre.name = parsedDTO.name;
    await this.genresRepository.save(newGenre);
    return {
      message: 'Genre added successfully',
    };
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
}
