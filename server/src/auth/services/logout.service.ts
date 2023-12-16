import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/user/services/users.service';

@Injectable()
export class LogoutService {
  constructor(private usersService: UsersService) {}

  async logoutUser(req, res: Response) {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      throw new HttpException('No cookies', HttpStatus.UNAUTHORIZED);
    }

    const refreshToken = cookies.jwt;
    const foundUser = await this.usersService.findByRefreshToken(refreshToken);
    if (!foundUser) {
      res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      throw new HttpException('Unauthorized user', HttpStatus.FORBIDDEN);
    }

    await this.usersService.updateRefreshToken(req.user.sub, '');
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  }
}
