import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Books } from 'src/app/schemas/books.schema';
import { BooksGetServiceHandlers } from './handler/book.get.svc';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { BooksPostServiceHandlers } from './handler/book.post.svc';

@Injectable()
export class BooksService {
  private booksGetServiceHandlers: BooksGetServiceHandlers;
  private booksPostServiceHandlers: BooksPostServiceHandlers;

  constructor(
    private readonly errorDictionaryService: ErrorDictionaryService,
    private readonly httpErrorDictionaryService: HttpErrorDictionaryService,

    @InjectModel(Books.name)
    private booksModel: mongoose.Model<Books>,
  ) {
    this.booksGetServiceHandlers = new BooksGetServiceHandlers(
      errorDictionaryService,
      httpErrorDictionaryService,
      booksModel,
    );
    this.booksPostServiceHandlers = new BooksPostServiceHandlers(
      errorDictionaryService,
      httpErrorDictionaryService,
      booksModel,
    );
  }

  ///#####################
  //## Member Get Handlers
  ///#####################

  //find all books GET => /api/books or /api/books?title=booktitle
  async findAllBooks(query: ExpressQuery): Promise<any> {
    return this.booksGetServiceHandlers.getAllBooks(query);
  }

  ///#####################
  //## Member Post Handlers
  ///#####################

  //add book to database POST => /books/add
  async addBook(body: any): Promise<any> {
    return this.booksPostServiceHandlers.addBook(body);
  }
}
