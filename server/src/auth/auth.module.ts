import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { RegisterService } from './services/register.service';
import { UserModule } from 'src/user/user.module';
import { HashService } from './services/hash.service';

@Module({
  controllers: [AuthController],
  providers: [RegisterService, HashService],
  imports: [UserModule],
})
export class AuthModule {}
