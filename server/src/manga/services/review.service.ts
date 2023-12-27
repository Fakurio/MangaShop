import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { addReviewDto, addReviewDtoSchema } from '../dto/add-review.dto';
import { Review } from 'src/entities/review.entity';
import { Manga } from 'src/entities/manga.entity';

@Injectable()
export class ReviewService {
  constructor(private dataSource: DataSource) {}

  async getReview(manga_id: number) {
    let reviews = await this.dataSource
      .getRepository(Review)
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

    return reviews;
  }

  async addReview(user_id: number, review: addReviewDto) {
    if (!addReviewDtoSchema.safeParse(review).success) {
      throw new HttpException('Invalid review data', HttpStatus.BAD_REQUEST);
    }

    let manga = await this.dataSource.getRepository(Manga).findOne({
      where: { manga_id: review.manga_id },
      relations: ['reviews'],
    });

    if (!manga) {
      throw new HttpException('Manga not found', HttpStatus.NOT_FOUND);
    }

    let newReview = new Review();
    newReview.content = review.content;
    newReview.rating = review.rating;
    newReview.created_at = new Date(review.created_at);
    newReview.user_id = user_id;
    manga.reviews.push(newReview);

    await this.dataSource.getRepository(Manga).save(manga);

    return { message: 'Review added' };
  }
}
