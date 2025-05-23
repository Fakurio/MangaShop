import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from '../../user/services/users.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  private async validateToken(req: any, res: any) {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      throw new HttpException('No cookies', HttpStatus.UNAUTHORIZED);
    }

    const refreshToken = cookies.jwt;

    const foundUser = await this.usersService.findByRefreshToken(refreshToken);
    if (!foundUser) {
      throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
    }

    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch {
      res.clearCookie('jwt', {
        httpOnly: true,
        maxAge: this.configService.get('COOKIE_MAX_AGE'),
      });
      throw new HttpException('Bad token', HttpStatus.FORBIDDEN);
    }
  }

  private async generateTokens(token: {
    sub: string;
    email: string;
    username: string;
    roles: string[];
  }) {
    const { sub, email, username, roles } = token;
    const newPayload = {
      sub: sub,
      email: email,
      username: username,
      roles: roles,
    };
    const newAccessToken = await this.jwtService.signAsync(newPayload);
    const newRefreshToken = await this.jwtService.signAsync(newPayload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return { newAccessToken, newRefreshToken };
  }

  async refreshToken(req, res: Response) {
    const token = await this.validateToken(req, res);
    const { newAccessToken, newRefreshToken } =
      await this.generateTokens(token);

    await this.usersService.updateRefreshToken(token.sub, newRefreshToken);

    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      maxAge: this.configService.get('COOKIE_MAX_AGE'),
    });

    return {
      username: token.username,
      roles: token.roles,
      access_token: newAccessToken,
    };
  }
}
