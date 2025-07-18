import { Test } from '@nestjs/testing';
import { GenresController } from './genres.controller';
import { GenresService } from '../services/genres.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from '../../entities/genre.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('GenresController', () => {
  let controller: GenresController;
  let genresService: GenresService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GenresService,
        GenresController,
        JwtService,
        ConfigService,
        { provide: getRepositoryToken(Genre), useValue: {} },
      ],
    }).compile();
    controller = moduleRef.get(GenresController);
    genresService = moduleRef.get(GenresService);
  });

  it('should return all genres', async () => {
    jest.spyOn(genresService, 'getAllGenres').mockResolvedValue([]);

    expect(await controller.getAllGenres()).toEqual([]);
  });
});
