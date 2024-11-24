import { Module } from '@nestjs/common';
import { MangasController } from './controllers/mangas.controller';
import { GenresController } from './controllers/genres.controller';
import { GenresService } from './services/genres.service';
import { MangasService } from './services/mangas.service';
import { ReviewController } from './controllers/review.controller';
import { ReviewService } from './services/review.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Genre} from "../entities/genre.entity";
import {Manga} from "../entities/manga.entity";
import {Review} from "../entities/review.entity";

@Module({
  controllers: [MangasController, GenresController, ReviewController],
  providers: [GenresService, MangasService, ReviewService],
  imports: [TypeOrmModule.forFeature([Genre, Manga, Review])]
})
export class MangaModule {}
