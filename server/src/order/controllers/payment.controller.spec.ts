import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {PaymentService} from "../services/payment.service";
import {PaymentController} from "./payment.controller";
import {PaymentMethod} from "../../entities/payment-method.entity";


describe('PaymentsController', () => {
    let controller: PaymentController;
    let paymentsService: PaymentService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                PaymentService,
                PaymentController,
                { provide: getRepositoryToken(PaymentMethod), useValue: {} },
            ],
        }).compile();
        controller = moduleRef.get(PaymentController)
        paymentsService = moduleRef.get(PaymentService);
    });

    it("should return payment methods", async () => {
       jest.spyOn(paymentsService, "getPaymentMethods").mockResolvedValue([]);

       expect(await controller.getPaymentMethods()).toEqual([]);
    })
});