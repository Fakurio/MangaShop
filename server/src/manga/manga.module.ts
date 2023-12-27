import { Module } from '@nestjs/common';
import { MangasController } from './controllers/mangas.controller';
import { GenresController } from './controllers/genres.controller';
import { GenresService } from './services/genres.service';
import { MangasService } from './services/mangas.service';
import { ReviewController } from './controllers/review.controller';
import { ReviewService } from './services/review.service';

@Module({
  controllers: [MangasController, GenresController, ReviewController],
  providers: [GenresService, MangasService, ReviewService],
})
export class MangaModule {}
