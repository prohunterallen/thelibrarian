import { Module } from '@nestjs/common';
import { BooksController } from './controller/books.controller';
import { BooksService } from './service/books.service';
import { BooksGetHandlers } from './controller/handler/books.get.ctl';
import { SharedModule } from 'src/app/shared/share/shared.module';
import { BooksSchema } from 'src/app/schemas/books.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { multerConfig } from 'src/app/configuration/multer.config';
import { MulterModule } from '@nestjs/platform-express';
import { BooksPostHandlers } from './controller/handler/books.post.ctl';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([{ name: 'Books', schema: BooksSchema }]),
    MulterModule.register(multerConfig),
  ],
  controllers: [BooksController],
  providers: [BooksService, BooksGetHandlers, BooksPostHandlers],
})
export class BooksModule {}
