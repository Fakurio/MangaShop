import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MangasService } from './mangas.service';
import { Manga } from '../../entities/manga.entity';
import { HttpException } from '@nestjs/common';

describe('MangasService', () => {
  let mangasService: MangasService;
  let mangasRepository: Repository<Manga>;

  const mangasRepositoryMock = {
    createQueryBuilder: jest.fn(),
    select: jest.fn(),
    innerJoinAndSelect: jest.fn(),
    leftJoinAndSelect: jest.fn(),
    where: jest.fn(),
    getMany: jest.fn(),
    getOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MangasService,
        { provide: getRepositoryToken(Manga), useValue: mangasRepositoryMock },
      ],
    }).compile();
    mangasService = moduleRef.get(MangasService);
    mangasRepository = moduleRef.get(getRepositoryToken(Manga));
  });

  it('should return all mangas', async () => {
    jest
      .spyOn(mangasRepository, 'createQueryBuilder')
      .mockImplementation(() => {
        return {
          select: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockReturnValue([]),
        } as any;
      });

    expect(await mangasService.getAll()).toEqual([]);
  });

  it('should throw exception when mangas are not found', async () => {
    jest
      .spyOn(mangasRepository, 'createQueryBuilder')
      .mockImplementation(() => {
        return {
          select: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockReturnValue(null),
        } as any;
      });

    try {
      await mangasService.getAll();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Mangas not found');
    }
  });

  it('should return mangas by id', async () => {
    jest
      .spyOn(mangasRepository, 'createQueryBuilder')
      .mockImplementation(() => {
        return {
          select: jest.fn().mockReturnThis(),
          innerJoinAndSelect: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockReturnValue({ manga_id: 1 }),
        } as any;
      });

    expect(await mangasService.getOne(1)).toEqual({ manga_id: 1 });
  });

  it('should throw exception when manga is not found', async () => {
    jest
      .spyOn(mangasRepository, 'createQueryBuilder')
      .mockImplementation(() => {
        return {
          select: jest.fn().mockReturnThis(),
          innerJoinAndSelect: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockReturnValue(null),
        } as any;
      });

    try {
      await mangasService.getOne(1);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Manga not found');
    }
  });

  it('should return all mangas for admin', async () => {
    jest.spyOn(mangasRepository, 'find').mockResolvedValue([]);

    expect(await mangasService.getAllForAdmin()).toEqual([]);
  });
});
