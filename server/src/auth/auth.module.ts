import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { RegisterService } from './services/register.service';
import { UserModule } from 'src/user/user.module';
import { HashService } from './services/hash.service';
import { LoginService } from './services/login.service';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenService } from './services/refreshToken.service';
import { ConfigService } from '@nestjs/config';
import { LogoutService } from './services/logout.service';

@Module({
  controllers: [AuthController],
  providers: [
    RegisterService,
    HashService,
    LoginService,
    LogoutService,
    RefreshTokenService,
  ],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '5m' },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
