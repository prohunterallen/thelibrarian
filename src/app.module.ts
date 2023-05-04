import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './app/modules/member/member.module';
import { ErrorDictionaryService } from './app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from './app/services/http-error-dictionary/http-error-dictionary.service';
import { SharedModule } from './app/shared/share/shared.module';
import { ConfigModule } from '@nestjs/config';

//Mongoose Module
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './app/modules/books/books.module';

@Module({
  controllers: [AppController],
  providers: [AppService, ErrorDictionaryService, HttpErrorDictionaryService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`, //automatically load the .env file based on the NODE_ENV environment variable
      isGlobal: true, //make the configuration module global
    }),
    MongooseModule.forRoot(process.env.DSN), //connect to mongodb
    MemberModule,
    SharedModule,
    BooksModule,
  ],
})
export class AppModule {}
