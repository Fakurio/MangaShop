import { Module } from '@nestjs/common';
import { MangasController } from './controllers/mangas.controller';
import { MangasService } from './services/mangas.service';
import { CartsService } from './cart/services/carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { GenresController } from './controllers/genres.controller';
import { GenresService } from './services/genres.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';

@Module({
  controllers: [MangasController, GenresController],
  providers: [MangasService, CartsService, GenresService],
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CartModule,
  ],
})
export class AppModule {}
