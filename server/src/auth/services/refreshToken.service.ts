import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from 'src/user/services/users.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async refreshToken(req, res: Response) {
    const cookies = req.cookies;
    const aTpayload = req.user;

    if (!cookies?.jwt) {
      throw new HttpException('No cookies', HttpStatus.UNAUTHORIZED);
    }

    const refreshToken = cookies.jwt;
    const foundUser = await this.usersService.findByRefreshToken(refreshToken);
    if (!foundUser) {
      throw new HttpException('Unauthorized user', HttpStatus.FORBIDDEN);
    }

    try {
      const rTpayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
      if (!(rTpayload.email === aTpayload.email)) {
        throw new HttpException(
          'Token payloads do not match',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const { sub, email, username } = rTpayload;
      const newPayload = {
        sub: sub,
        email: email,
        username: username,
      };
      const newAccessToken = await this.jwtService.signAsync(newPayload);
      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '1d',
      });

      this.usersService.updateRefreshToken(aTpayload.sub, newRefreshToken);

      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return {
        access_token: newAccessToken,
      };
    } catch {
      throw new HttpException('Bad token', HttpStatus.UNAUTHORIZED);
    }
  }
}
