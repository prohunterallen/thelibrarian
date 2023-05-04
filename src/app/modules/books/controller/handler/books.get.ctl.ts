import { HttpStatus, Inject, Query } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import {
  ResponseDto,
  ResponseWithPaginationDto,
} from 'src/app/interfaces/common/http.response.dto';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';
import { Members } from 'src/app/schemas/members.schema';
import * as validator from 'src/app/helper/validator.helper';
import { ObjectId } from 'mongodb';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { isNumeric } from 'src/app/helper/validator.helper';
import { BooksService } from '../../service/books.service';
import { BooksControllerMixin } from '../books.controller.mixin';
import { Books } from 'src/app/schemas/books.schema';

export class BooksGetHandlers extends BooksControllerMixin {
  constructor(
    @Inject(ErrorDictionaryService)
    private readonly errorDictionaryService: ErrorDictionaryService,
    @Inject(HttpErrorDictionaryService)
    private readonly httpErrorDictionaryService: HttpErrorDictionaryService,
    private readonly booksService: BooksService,
  ) {
    super();
  }

  //get all book GET => /api/books or /api/books?keyword=keyword&page=1&pageSize=10
  async getAllBooks(
    @Query() query: ExpressQuery,
  ): Promise<ResponseWithPaginationDto<Books[]>> {
    //check query param page and pageSize
    if (!query.hasOwnProperty('page') || !query.hasOwnProperty('pageSize')) {
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

    if (!query.page || query.page == '' || !isNumeric(query.page)) {
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

    if (!query.pageSize || query.pageSize == '' || !isNumeric(query.pageSize)) {
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
      return {
        message: this.errorDictionaryService.getErrorDescription(HttpStatus.OK),
        data: await this.booksService.findAllBooks(query),
      };
    } catch (error) {
      console.log(error.message);
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
