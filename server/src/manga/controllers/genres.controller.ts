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
import { Genre } from '../../entities/genre.entity';
import { GenresService } from '../services/genres.service';
import { GenreDTO } from '../dto/add-genre.dto';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleEnum } from '../../entities/role.entity';
import { JwtGuard } from '../../auth/guards/jwt.guard';

@Controller('/genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  getAllGenres(): Promise<Genre[]> {
    return this.genresService.getAllGenres();
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtGuard)
  @Post()
  addGenre(@Body() genreDTO: GenreDTO) {
    return this.genresService.addGenre(genreDTO);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtGuard)
  @Put(':id')
  updateGenre(
    @Param('id', ParseIntPipe) id: number,
    @Body() genreDTO: GenreDTO,
  ) {
    return this.genresService.updateGenre(id, genreDTO);
  }
}
