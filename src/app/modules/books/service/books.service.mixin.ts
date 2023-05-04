import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Books } from 'src/app/schemas/books.schema';

@Injectable()
export class BooksServiceMixin {
  constructor(
    @InjectModel(Books.name)
    protected readonly booksModel: mongoose.Model<Books>,
  ) {}
}
