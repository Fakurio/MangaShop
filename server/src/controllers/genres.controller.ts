import { Controller, Get } from '@nestjs/common';
import { Genre } from 'src/entities/genre.entity';
import { GenresService } from 'src/services/genres.service';

@Controller('/genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  getAllGenres(): Promise<Genre[]> {
    return this.genresService.getAllGenres();
  }
}
