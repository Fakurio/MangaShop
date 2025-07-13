import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization || authorization.trim() === '') {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }

    const token = authorization.replace(/bearer/gim, '').trim();
    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch {
      throw new HttpException('Bad token', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
