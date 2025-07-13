import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentMethod } from '../../entities/payment-method.entity';
import { Repository } from 'typeorm';

describe('PaymentsService', () => {
  let paymentsService: PaymentService;
  let paymentsRepository: Repository<PaymentMethod>;

  const paymentsRepositoryMock = {
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    select: jest.fn(),
    where: jest.fn(),
    getRawOne: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(PaymentMethod),
          useValue: paymentsRepositoryMock,
        },
      ],
    }).compile();
    paymentsService = moduleRef.get(PaymentService);
    paymentsRepository = moduleRef.get(getRepositoryToken(PaymentMethod));
  });

  it('should return payment methods', async () => {
    jest.spyOn(paymentsRepository, 'find').mockResolvedValue([]);

    expect(await paymentsService.getPaymentMethods()).toEqual([]);
  });

  it('should return id for payment method', async () => {
    jest
      .spyOn(paymentsRepository, 'createQueryBuilder')
      .mockImplementation(() => {
        return {
          select: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getRawOne: jest.fn().mockReturnValue(1),
        } as any;
      });

    expect(await paymentsService.getPaymentMethodID('')).toEqual(1);
  });
});
