import { Module } from '@nestjs/common';
import { MangasController } from './controllers/mangas.controller';
import { CartsController } from './controllers/carts.controller';
import { MangasService } from './services/mangas.service';
import { CartsService } from './services/carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { GenresController } from './controllers/genres.controller';
import { GenresService } from './services/genres.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  controllers: [MangasController, CartsController, GenresController],
  providers: [MangasService, CartsService, GenresService],
  imports: [TypeOrmModule.forRoot(dataSourceOptions), AuthModule, UserModule],
})
export class AppModule {}
