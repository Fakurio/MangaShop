import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersController,
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(Role), useValue: {} },
      ],
    }).compile();
    controller = moduleRef.get(UsersController);
    usersService = moduleRef.get(UsersService);
  });

  it("should return user's username", async () => {
    jest
      .spyOn(usersService, 'getUserName')
      .mockResolvedValue({ name: 'Kamil' } as User);

    expect(await controller.getUserName(1)).toEqual({ name: 'Kamil' });
  });
});
