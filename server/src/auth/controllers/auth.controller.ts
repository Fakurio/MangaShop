import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from '../services/register.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { LoginService } from '../services/login.service';

@Controller('auth')
export class AuthController {
  constructor(
    private registerService: RegisterService,
    private loginService: LoginService,
  ) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.registerService.registerUser(registerUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.loginService.loginUser(loginUserDto);
  }
}
