import { Module } from '@nestjs/common';
import { MangasController } from './controllers/mangas.controller';
import { CartsController } from './controllers/carts.controller';
import { MangasService } from './services/mangas.service';
import { CartsService } from './services/carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';

@Module({
  controllers: [MangasController, CartsController],
  providers: [MangasService, CartsService],
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
})
export class AppModule {}
