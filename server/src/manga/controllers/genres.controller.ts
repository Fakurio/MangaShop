import { Controller, Get } from '@nestjs/common';
import { Genre } from '../../entities/genre.entity';
import { GenresService } from '../services/genres.service';

@Controller('/genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  getAllGenres(): Promise<Genre[]> {
    return this.genresService.getAllGenres();
  }
}
