import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Get,
} from '@nestjs/common';
import { RegisterService } from '../services/register.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { LoginService } from '../services/login.service';
import { RefreshTokenService } from '../services/refreshToken.service';
import { JwtGuard } from '../guards/jwt.guard';
import { Response } from 'express';
import { LogoutService } from '../services/logout.service';
import { CartItemT } from '../../cart/types/cart-item';

@Controller('auth')
export class AuthController {
  constructor(
    private registerService: RegisterService,
    private loginService: LoginService,
    private refreshTokenService: RefreshTokenService,
    private logoutService: LogoutService,
  ) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.registerService.registerUser(registerUserDto);
  }

  @Post('login')
  loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.loginService.loginUser(loginUserDto, response);
  }

  @Get('refresh')
  refreshToken(@Request() req, @Res({ passthrough: true }) res: Response) {
    return this.refreshTokenService.refreshToken(req, res);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  logoutUser(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
    @Body() cart: CartItemT[],
  ) {
    return this.logoutService.logoutUser(req, res, cart);
  }
}
