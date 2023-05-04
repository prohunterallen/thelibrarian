import { Module } from '@nestjs/common';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';

@Module({
  providers: [ErrorDictionaryService, HttpErrorDictionaryService],
  exports: [ErrorDictionaryService, HttpErrorDictionaryService],
})
export class SharedModule {}
