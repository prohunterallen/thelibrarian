import { HttpStatus, Inject } from '@nestjs/common';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';

import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { BooksServiceMixin } from 'src/app/modules/books/service/books.service.mixin';
import { Books } from 'src/app/schemas/books.schema';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import { PaginationDTO } from 'src/app/interfaces/common/pagination.dto';

export class BooksGetServiceHandlers extends BooksServiceMixin {
  constructor(
    @Inject(ErrorDictionaryService)
    private readonly errorDictionaryService: ErrorDictionaryService,
    @Inject(HttpErrorDictionaryService)
    private readonly httpErrorDictionaryService: HttpErrorDictionaryService,

    @InjectModel(Books.name)
    protected booksModel: mongoose.Model<Books>,
  ) {
    super(booksModel);
  }

  //get all books list => GET /api/books or GET /api/books?keyword=keyword
  async getAllBooks(query: ExpressQuery): Promise<any> {
    const keyword = query.keyword
      ? {
          $or: [
            {
              title: {
                $regex: query.keyword,
                $options: 'i', // case insensitive
              },
            },
            //isbn
            {
              isbn: {
                $regex: query.keyword,
                $options: 'i', // case insensitive
              },
            },
            //author
            {
              author: {
                $regex: query.keyword,
                $options: 'i', // case insensitive
              },
            },
          ],
        }
      : {};

    const sorting = query.sorting || 'desc';
    const whichSortings = sorting === 'asc' ? 1 : -1;
    const orderBy = query.orderBy || 'stock';
    const whichOrderBy = orderBy === 'price' ? 'price' : 'stock';

    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;

    const skip = (page - 1) * pageSize;

    try {
      const booksList: Books[] = await this.booksModel
        .find({ ...keyword })
        .sort({ [whichOrderBy as keyof Document]: whichSortings })
        .limit(pageSize)
        .skip(skip)
        .exec();

      //get pagination data
      const pagination: PaginationDTO = {
        currentPage: page,
        pageSize: pageSize,
        allRecord: await this.booksModel.countDocuments({ ...keyword }),
        totalPage: Math.ceil(
          (await this.booksModel.countDocuments({ ...keyword })) / pageSize,
        ),
      };

      return { pagination, result: booksList };
    } catch (error) {
      console.log(error.message);
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        {
          desc: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
