import { HttpStatus, Inject } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import {
  ResponseDto,
  ResponseWithTokenDto,
} from 'src/app/interfaces/common/http.response.dto';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';

import { Members } from 'src/app/schemas/members.schema';
import * as validator from 'src/app/helper/validator.helper';

import { BooksService } from '../../service/books.service';
import { BooksControllerMixin } from '../books.controller.mixin';

export class BooksPostHandlers extends BooksControllerMixin {
  constructor(
    @Inject(ErrorDictionaryService)
    private readonly errorDictionaryService: ErrorDictionaryService,
    @Inject(HttpErrorDictionaryService)
    private readonly httpErrorDictionaryService: HttpErrorDictionaryService,
    private readonly booksService: BooksService,
  ) {
    super();
  }

  //add book to database POST => /books/add
  async addBook(body: any): Promise<ResponseDto<Members>> {
    // Check for missing fields
    if (
      !body.title ||
      !body.author ||
      !body.isbn ||
      !body.price ||
      !body.stock ||
      !body.category
    ) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(705),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //check price and stock are number
    if (!validator.isNumeric(body.price) || !validator.isNumeric(body.stock)) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(706),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const book = await this.booksService.addBook(body);
      return {
        message: this.errorDictionaryService.getErrorDescription(HttpStatus.OK),
        data: book,
      };
    } catch (error) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(error.status),
        error.response.data || {
          desc: this.errorDictionaryService.getErrorDescription(error.status),
        },
        error.status,
      );
    }
  }
}
