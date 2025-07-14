import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = process.env.CORS_WHITELIST_ORIGINS
    ? process.env.CORS_WHITELIST_ORIGINS.split(',').map((origin) =>
        origin.trim(),
      )
    : [];
  app.enableCors({
    origin: (origin, callback) => {
      return allowedOrigins.includes(origin)
        ? callback(null, true)
        : callback(new Error('Origin not allowed'));
    },
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(process.env.SERVER_PORT || 3000);
}
bootstrap();
