import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { addReviewDto } from '../dto/add-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get(':id')
  getReview(@Param('id', ParseIntPipe) manga_id: number) {
    return this.reviewService.getReview(manga_id);
  }

  @Post()
  @UseGuards(JwtGuard)
  addReview(@Request() req, @Body() review: addReviewDto) {
    return this.reviewService.addReview(req.user.sub, review);
  }
}
