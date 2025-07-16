import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { MangadexImageProxyService } from '../services/mangadex-image-proxy.service';
import { Response } from 'express';

@Controller('proxy')
export class MangadexImageProxyController {
  constructor(private readonly proxyService: MangadexImageProxyService) {}

  @Get()
  streamImage(
    @Query('url') imageUrl: string,
    @Res() response: Response,
  ): Promise<any> {
    if (!imageUrl) {
      throw new BadRequestException('No image URL');
    }

    return this.proxyService.streamImage(imageUrl, response);
  }
}
