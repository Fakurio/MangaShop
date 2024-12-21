import { AuthController } from './auth.controller';
import { RegisterService } from '../services/register.service';
import { LoginService } from '../services/login.service';
import { RefreshTokenService } from '../services/refreshToken.service';
import { LogoutService } from '../services/logout.service';
import { Test } from '@nestjs/testing';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UsersService } from '../../user/services/users.service';
import { HashService } from '../services/hash.service';
import { JwtService } from '@nestjs/jwt';
import { CartsService } from '../../cart/services/carts.service';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from '../dto/login-user.dto';
import { Response } from 'express';
import { CartItemT } from '../../cart/types/cart-item';

describe('AuthController', () => {
  let authController: AuthController;
  let registerService: RegisterService;
  let refreshTokenService: RefreshTokenService;
  let loginService: LoginService;
  let logoutService: LogoutService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        RegisterService,
        LoginService,
        LogoutService,
        RefreshTokenService,
        { provide: UsersService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: CartsService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: HashService, useValue: {} },
      ],
    }).compile();

    authController = moduleRef.get(AuthController);
    registerService = moduleRef.get(RegisterService);
    refreshTokenService = moduleRef.get(RefreshTokenService);
    loginService = moduleRef.get(LoginService);
    logoutService = moduleRef.get(LogoutService);
  });

  it('should register user', async () => {
    const dto = {} as RegisterUserDto;
    jest.spyOn(registerService, 'registerUser').mockResolvedValue({
      message: 'Done',
    });

    expect(await authController.registerUser(dto)).toEqual({ message: 'Done' });
  });

  it('should login user', async () => {
    const dto = {} as LoginUserDto;
    const response = {} as Response;
    jest.spyOn(loginService, 'loginUser').mockResolvedValue({
      username: 'Kamil',
      roles: [],
      new_cart: [] as LoginUserDto['cart'],
      access_token: '',
    });

    expect(await authController.loginUser(dto, response)).toEqual({
      username: 'Kamil',
      new_cart: [] as LoginUserDto['cart'],
      roles: [],
      access_token: '',
    });
  });

  it('should refresh token', async () => {
    const request = {} as any;
    const response = {} as Response;
    jest.spyOn(refreshTokenService, 'refreshToken').mockResolvedValue({
      username: 'Kamil',
      roles: [],
      access_token: '',
    });

    expect(await authController.refreshToken(request, response)).toEqual({
      username: 'Kamil',
      roles: [],
      access_token: '',
    });
  });

  it('should logout user', async () => {
    const request = {} as any;
    const response = {} as Response;
    const cart = {} as CartItemT[];
    jest.spyOn(logoutService, 'logoutUser').mockImplementation(() => {
      return Promise.resolve();
    });

    await authController.logoutUser(request, response, cart);

    expect(logoutService.logoutUser).toHaveBeenCalledTimes(1);
  });
});
