import {
  ArgumentMetadata,
  PipeTransform,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ZodObject } from 'zod';

@Injectable()
export class CartValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
    } catch (e) {
      throw new BadRequestException(e);
    }
    return value;
  }
}
