import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MangadexImageProxyService {
  constructor(private configService: ConfigService) {}

  async streamImage(imageUrl: string, response: Response) {
    const mangadexRegex =
      /^https:\/\/uploads\.mangadex\.org\/covers\/[a-f0-9-]+\/[a-f0-9-]+\.(jpg|png)(\.\d+\.jpg)?$/i;
    if (!mangadexRegex.test(imageUrl)) {
      throw new BadRequestException(
        'Provided image URL is not for manga cover from mangadex',
      );
    }

    try {
      const mangadexResponse = await axios.get(imageUrl, {
        responseType: 'stream',
        headers: {
          'User-Agent':
            'MangaShopProxy/1.0 (https://github.com/Fakurio/MangaShop)',
        },
      });

      response.set({
        'Content-Type': mangadexResponse.headers['content-type'],
        'Cache-Control': mangadexResponse.headers['cache-control'],
        'Content-Length': mangadexResponse.headers['content-length'],
      });

      mangadexResponse.data.pipe(response);
    } catch (error) {
      if (error.response) {
        console.error(`Mangadex api error: ${error.response.data}`);
        return response
          .status(error.response.status)
          .send('Mangadex api error');
      }
      console.error(`Failed to proxy image: ${error.message}`);
      throw new InternalServerErrorException('Failed to proxy image');
    }
  }
}
