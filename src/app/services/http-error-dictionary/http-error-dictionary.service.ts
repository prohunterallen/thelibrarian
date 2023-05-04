import { Injectable } from '@nestjs/common';
import { STATUS_CODES } from 'http';

@Injectable()
export class HttpErrorDictionaryService {
  getStatusDescription(exception: number): string | undefined {
    return `${exception} - ${STATUS_CODES[exception]}`;
  }
}
