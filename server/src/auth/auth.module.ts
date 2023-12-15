import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { RegisterService } from './services/register.service';
import { UserModule } from 'src/user/user.module';
import { HashService } from './services/hash.service';
import { LoginService } from './services/login.service';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [RegisterService, HashService, LoginService],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
})
export class AuthModule {}
