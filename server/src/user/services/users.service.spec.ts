import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { Role } from '../../entities/role.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  const usersRepositoryMock = {
    createQueryBuilder: jest.fn(),
    select: jest.fn(),
    where: jest.fn(),
    getOne: jest.fn(),
    exist: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };
  const roleRepositoryMock = {
    find: jest.fn(),
  };
  const mockUser: User = {
    user_id: 1,
    name: 'Kamil',
    email: 'test@test.pl',
    password: '124',
    refresh_token: 'abc123',
    roles: [],
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepositoryMock },
        { provide: getRepositoryToken(Role), useValue: roleRepositoryMock },
      ],
    }).compile();
    usersService = moduleRef.get(UsersService);
    usersRepository = moduleRef.get(getRepositoryToken(User));
  });

  it("should return user's username", async () => {
    jest.spyOn(usersRepository, 'createQueryBuilder').mockImplementation(() => {
      return {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue({ name: 'Kamil' }),
      } as any;
    });

    expect(await usersService.getUserName(1)).toEqual({ name: 'Kamil' });
  });

  it("should throw exception -> user doesn't exist", async () => {
    jest.spyOn(usersRepository, 'createQueryBuilder').mockImplementation(() => {
      return {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(null),
      } as any;
    });

    try {
      await usersService.getUserName(1);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('User does not exist');
    }
  });

  it('should return user by email', async () => {
    jest.spyOn(usersRepository, 'createQueryBuilder').mockImplementation(() => {
      return {
        where: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(mockUser),
      } as any;
    });

    expect(await usersService.findOne('test@test.pl')).toEqual(mockUser);
  });

  it('should return user by refresh token', async () => {
    jest.spyOn(usersRepository, 'createQueryBuilder').mockImplementation(() => {
      return {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(mockUser),
      } as any;
    });

    expect(await usersService.findByRefreshToken('abc123')).toEqual(mockUser);
  });

  it('should check if user exist', async () => {
    jest.spyOn(usersRepository, 'exist').mockResolvedValue(true);

    expect(await usersService.checkUser('test@test.pl')).toEqual(true);
  });

  it('should save user', async () => {
    jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);
    jest.spyOn(roleRepositoryMock, 'find').mockResolvedValue([]);

    expect(
      await usersService.addNewUser(
        mockUser.name,
        mockUser.email,
        mockUser.password,
      ),
    ).toEqual({ ...mockUser, roles: [] });
    expect(usersRepository.save).toHaveBeenCalledWith({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      roles: [],
    });
  });

  it("should update user's refresh token", async () => {
    await usersService.updateRefreshToken(1, 'abc');

    expect(usersRepository.update).toHaveBeenCalledWith(
      { user_id: 1 },
      { refresh_token: 'abc' },
    );
  });
});
