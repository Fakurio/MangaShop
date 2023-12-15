import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { RegisterService } from '../services/register.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { LoginService } from '../services/login.service';
import { RefreshTokenService } from '../services/refreshToken.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private registerService: RegisterService,
    private loginService: LoginService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.registerService.registerUser(registerUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.loginService.loginUser(loginUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.refreshTokenService.refreshToken(req.user);
  }
}
