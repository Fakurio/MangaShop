import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User])]
})
export class UserModule {}
