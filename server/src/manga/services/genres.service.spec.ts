import { Test } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from '../../entities/genre.entity';
import { Repository } from 'typeorm';

describe('GenresService', () => {
  let genresService: GenresService;
  let genresRepository: Repository<Genre>;

  const genresRepositoryMock = {
    createQueryBuilder: jest.fn(),
    select: jest.fn(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GenresService,
        { provide: getRepositoryToken(Genre), useValue: genresRepositoryMock },
      ],
    }).compile();
    genresService = moduleRef.get(GenresService);
    genresRepository = moduleRef.get(getRepositoryToken(Genre));
  });

  it('should return all genres', async () => {
    jest
      .spyOn(genresRepository, 'createQueryBuilder')
      .mockImplementation(() => {
        return {
          select: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockReturnValue([]),
        } as any;
      });

    expect(await genresService.getAllGenres()).toEqual([]);
  });
});
