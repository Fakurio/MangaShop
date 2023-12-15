import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenService {
  constructor(private jwtService: JwtService) {}

  async refreshToken(user: { sub: string; email: string }) {
    const payload = { sub: user.sub, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
