import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {ReviewController} from "./review.controller";
import {ReviewService} from "../services/review.service";
import {Review} from "../../entities/review.entity";
import {MangasService} from "../services/mangas.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {addReviewDto} from "../dto/add-review.dto";


describe('ReviewController', () => {
    let controller: ReviewController;
    let reviewService: ReviewService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ReviewService,
                ReviewController,
                { provide: getRepositoryToken(Review), useValue: {} },
                { provide: MangasService, useValue: {} },
                { provide: JwtService, useValue: {} },
                { provide: ConfigService, useValue: {} }
            ],
        }).compile();
        controller = moduleRef.get(ReviewController)
        reviewService = moduleRef.get(ReviewService);
    });

    it("should return reviews for manga", async () => {
        jest.spyOn(reviewService, "getReview").mockResolvedValue([])

        expect(await controller.getReview(1)).toEqual([])
    })

    it("should add review", async () => {
        const dto = {} as addReviewDto;
        const request = {
            user: {
                sub: 1
            }
        }
        jest.spyOn(reviewService, "addReview").mockResolvedValue({
            message: "Review added"
        })

        expect(await controller.addReview(request, dto)).toEqual({
            message: "Review added"
        })
    })
});