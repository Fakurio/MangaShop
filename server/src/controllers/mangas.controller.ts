import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Manga } from 'src/entities/manga.entity';
import { MangasService } from 'src/services/mangas.service';

@Controller('mangas')
export class MangasController {
  constructor(private mangasService: MangasService) {}

  @Get()
  getAll(): Promise<Manga[]> {
    return this.mangasService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Manga> {
    return this.mangasService.getOne(id);
  }
}
