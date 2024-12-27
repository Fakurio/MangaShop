import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Manga } from '../../entities/manga.entity';
import { MangasService } from '../services/mangas.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleEnum } from '../../entities/role.entity';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { MangaDTO } from '../dto/add-manga.dto';

@Controller('mangas')
export class MangasController {
  constructor(private mangasService: MangasService) {}

  @Get()
  getAll(): Promise<Manga[]> {
    return this.mangasService.getAll();
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtGuard)
  @Get('admin')
  getAllForAdmin(): Promise<Manga[]> {
    return this.mangasService.getAllForAdmin();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Manga | null> {
    return this.mangasService.getOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtGuard)
  @Post()
  addManga(@Body() addMangaDTO: MangaDTO) {
    return this.mangasService.addManga(addMangaDTO);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtGuard)
  @Put(':id')
  updateManga(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMangaDto: MangaDTO,
  ) {
    return this.mangasService.updateManga(id, updateMangaDto);
  }
}
