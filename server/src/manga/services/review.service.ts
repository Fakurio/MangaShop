import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { addReviewDto, addReviewDtoSchema } from '../dto/add-review.dto';
import { Review } from '../../entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MangasService } from './mangas.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private mangasService: MangasService,
  ) {}

  async getReview(manga_id: number) {
    return await this.reviewsRepository
      .createQueryBuilder('review')
      .select([
        'review.review_id',
        'review.content',
        'review.rating',
        'review.created_at',
        'user.name',
      ])
      .innerJoin('review.user_id', 'user')
      .where('review.manga_id = :manga_id', { manga_id: manga_id })
      .orderBy('review.created_at', 'DESC')
      .getMany();
  }

  async addReview(user_id: number, review: addReviewDto) {
    const manga = await this.validateReview(review);

    const newReview = new Review();
    newReview.content = review.content;
    newReview.rating = review.rating;
    newReview.created_at = new Date(review.created_at);
    newReview.user_id = user_id;
    newReview.manga_id = manga.manga_id;

    try {
      await this.reviewsRepository.save(newReview);
      return { message: 'Review added' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to add review');
    }
  }

  private async validateReview(review: addReviewDto) {
    if (!addReviewDtoSchema.safeParse(review).success) {
      throw new HttpException('Invalid review data', HttpStatus.BAD_REQUEST);
    }

    const manga = await this.mangasService.getOne(review.manga_id);

    if (!manga) {
      throw new HttpException('Manga not found', HttpStatus.NOT_FOUND);
    }

    return manga;
  }
}
