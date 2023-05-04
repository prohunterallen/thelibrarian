import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { BooksGetHandlers } from './handler/books.get.ctl';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AddBookDTO } from 'src/app/interfaces/bookmanager/add.book.dto';
import { BooksPostHandlers } from './handler/books.post.ctl';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksGetHandlers: BooksGetHandlers,
    private readonly booksPostHandlers: BooksPostHandlers,
  ) {}

  ///#######################
  ///##### GET METHOD ######
  ///#######################
  @Get('/')
  @HttpCode(HttpStatus.OK)
  getAllBooks(@Query() query: ExpressQuery) {
    return this.booksGetHandlers.getAllBooks(query);
  }

  ///#######################
  ///##### POST METHOD #####
  ///#######################

  //add book to database POST => /books/add
  @Post('/add')
  @HttpCode(HttpStatus.CREATED)
  addBook(@Body() addBookDTO: AddBookDTO) {
    return this.booksPostHandlers.addBook(addBookDTO);
  }
}
