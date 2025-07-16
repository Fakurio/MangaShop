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
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log(`CORS blocked request from origin: ${origin}`);
        return callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(process.env.SERVER_PORT || 3000);
}
bootstrap();
