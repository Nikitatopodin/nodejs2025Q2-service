import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'uuid';

@Injectable()
export class UUIDValidationPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!validate(value)) {
      throw new BadRequestException('id is not valid');
    }
    return value;
  }
}
