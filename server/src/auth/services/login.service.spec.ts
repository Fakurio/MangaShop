import { Test } from '@nestjs/testing';
import { UsersService } from '../../user/services/users.service';
import { HashService } from './hash.service';
import { UpdateResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { HttpException } from '@nestjs/common';
import { LoginService } from './login.service';
import { JwtService } from '@nestjs/jwt';
import { CartsService } from '../../cart/services/carts.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CartItem } from '../../entities/cart-item.entity';
import { Cart } from '../../entities/cart.entity';
import { Role, RoleEnum } from '../../entities/role.entity';

describe('LoginService', () => {
  let loginService: LoginService;
  let usersService: UsersService;
  let hashService: HashService;
  let cartService: CartsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginService,
        UsersService,
        HashService,
        CartsService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(CartItem), useValue: {} },
        { provide: getRepositoryToken(Cart), useValue: {} },
        { provide: getRepositoryToken(Role), useValue: {} },
      ],
    }).compile();
    loginService = moduleRef.get(LoginService);
    usersService = moduleRef.get(UsersService);
    hashService = moduleRef.get(HashService);
    cartService = moduleRef.get(CartsService);
  });

  it('should login user -> valid dto', async () => {
    const dto = {
      email: 'kamil.zel1@gmai.com',
      password: '123456',
    };
    const user = {
      name: 'Kamil',
      roles: [{ role_id: 1, name: RoleEnum.USER }],
    } as User;
    const response = {
      cookie: jest.fn(),
    } as unknown as Response;
    jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
    jest.spyOn(hashService, 'verifyPassword').mockResolvedValue(true);
    jest
      .spyOn(cartService, 'getUserCart')
      .mockResolvedValue([] as unknown as Cart);
    jest
      .spyOn(usersService, 'updateRefreshToken')
      .mockResolvedValue({} as UpdateResult);

    expect(await loginService.loginUser(dto, response)).toEqual({
      username: 'Kamil',
      roles: [RoleEnum.USER],
      access_token: undefined,
      new_cart: undefined,
    });
  });

  it("shouldn't login user -> invalid email in dto", async () => {
    const dto = {
      email: 'kamil.zel',
      password: '123456',
    };
    const response = {} as unknown as Response;

    try {
      await loginService.loginUser(dto, response);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect login data');
    }
  });

  it("shouldn't login user -> invalid password in dto", async () => {
    const dto = {
      email: 'kamil.zel1@gmail.com',
      password: '',
    };
    const response = {} as unknown as Response;

    try {
      await loginService.loginUser(dto, response);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect login data');
    }
  });

  it("shouldn't login user -> user doesn't exist", async () => {
    const dto = {
      email: 'kamil.zel',
      password: '123456',
    };
    const response = {} as unknown as Response;
    jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

    try {
      await loginService.loginUser(dto, response);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect login data');
    }
  });

  it("shouldn't login user -> passwords don't match", async () => {
    const dto = {
      email: 'kamil.zel',
      password: '123456',
    };
    const response = {} as unknown as Response;
    jest.spyOn(usersService, 'findOne').mockResolvedValue({} as User);
    jest.spyOn(hashService, 'verifyPassword').mockResolvedValue(false);

    try {
      await loginService.loginUser(dto, response);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect login data');
    }
  });
});
