import { HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Books } from 'src/app/schemas/books.schema';

import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';
import { BooksServiceMixin } from '../books.service.mixin';
import { createHttpException } from 'src/app/helper/http-exception-helper';

export class BooksPostServiceHandlers extends BooksServiceMixin {
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

  //add book to database POST => /books/add
  async addBook(body: any): Promise<any> {
    const book = new this.booksModel({
      title: body.title,
      author: body.author,
      isbn: body.isbn,
      qrCode: body.qrCode,
      barcode: body.barcode,
      price: body.price,
      stock: body.stock,
      category: body.category,
    });

    try {
      const createdBook = await this.booksModel.create(book);
      return createdBook;
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
