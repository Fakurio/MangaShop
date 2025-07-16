import { Module } from '@nestjs/common';
import { MangadexImageProxyController } from './controllers/mangadex-image-proxy.controller';
import { MangadexImageProxyService } from './services/mangadex-image-proxy.service';

@Module({
  controllers: [MangadexImageProxyController],
  providers: [MangadexImageProxyService],
})
export class ProxyModule {}
