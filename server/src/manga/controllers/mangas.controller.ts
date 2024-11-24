import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Manga } from '../../entities/manga.entity';
import { MangasService } from '../services/mangas.service';

@Controller('mangas')
export class MangasController {
  constructor(private mangasService: MangasService) {}

  @Get()
  getAll(): Promise<Manga[]> {
    return this.mangasService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Manga | null> {
    return this.mangasService.getOne(id);
  }
}
