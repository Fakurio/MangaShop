import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MangasService } from './mangas.service';
import { Manga } from '../../entities/manga.entity';
import { ReviewService } from './review.service';
import { Review } from '../../entities/review.entity';
import { addReviewDto } from '../dto/add-review.dto';
import { HttpException } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Genre } from '../../entities/genre.entity';

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let reviewsRepository: Repository<Review>;
  let mangasService: MangasService;

  const reviewsRepositoryMock = {
    createQueryBuilder: jest.fn(),
    select: jest.fn(),
    innerJoin: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    getMany: jest.fn(),
    save: jest.fn(),
  };

  const reviews: Review[] = [
    {
      review_id: 1,
      manga_id: 1,
      content: '',
      created_at: new Date(),
      user_id: 1,
      rating: 1,
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReviewService,
        MangasService,
        GenresService,
        {
          provide: getRepositoryToken(Review),
          useValue: reviewsRepositoryMock,
        },
        { provide: getRepositoryToken(Manga), useValue: {} },
        { provide: getRepositoryToken(Genre), useValue: {} },
      ],
    }).compile();
    reviewService = moduleRef.get(ReviewService);
    reviewsRepository = moduleRef.get(getRepositoryToken(Review));
    mangasService = moduleRef.get(MangasService);
  });

  it('should return reviews for manga', async () => {
    jest
      .spyOn(reviewsRepository, 'createQueryBuilder')
      .mockImplementation(() => {
        return {
          select: jest.fn().mockReturnThis(),
          innerJoin: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockReturnValue(reviews),
        } as any;
      });

    expect(await reviewService.getReview(1)).toEqual(reviews);
  });

  it('should add review', async () => {
    const dto: addReviewDto = {
      manga_id: 2,
      content: 'good',
      rating: 5,
      created_at: new Date(),
    };
    jest
      .spyOn(mangasService, 'getOne')
      .mockResolvedValue({ manga_id: 2 } as Manga);
    jest.spyOn(reviewsRepository, 'save').mockImplementation(() => {
      reviews.push({ review_id: 2, user_id: 1, ...dto });
      return Promise.resolve({ review_id: 2, user_id: 1, ...dto });
    });

    expect(await reviewService.addReview(1, dto)).toEqual({
      message: 'Review added',
    });
    expect(reviews.length).toEqual(2);
    expect(reviews[1]).toEqual({ review_id: 2, user_id: 1, ...dto });
  });

  it("shouldn't add review -> invalid review content", async () => {
    const dto: addReviewDto = {
      manga_id: 2,
      content: '',
      rating: 5,
      created_at: new Date(),
    };

    try {
      await reviewService.addReview(1, dto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Invalid review data');
    }
  });

  it("shouldn't add review -> invalid review rating", async () => {
    const dto: addReviewDto = {
      manga_id: 2,
      content: 'good',
      rating: 10,
      created_at: new Date(),
    };

    try {
      await reviewService.addReview(1, dto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Invalid review data');
    }
  });

  it("shouldn't add review -> invalid review manga_id", async () => {
    const dto: addReviewDto = {
      manga_id: 3.5,
      content: 'good',
      rating: 5,
      created_at: new Date(),
    };

    try {
      await reviewService.addReview(1, dto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Invalid review data');
    }
  });

  it("shouldn't add review -> manga not found", async () => {
    const dto: addReviewDto = {
      manga_id: 2,
      content: 'good',
      rating: 5,
      created_at: new Date(),
    };
    jest.spyOn(mangasService, 'getOne').mockResolvedValue(null);

    try {
      await reviewService.addReview(1, dto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Manga not found');
    }
  });
});
