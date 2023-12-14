import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':user_id')
  getUserName(@Param('user_id', ParseIntPipe) user_id: number): Promise<User> {
    return this.usersService.getUserName(user_id);
  }
}
