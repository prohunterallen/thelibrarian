import { MemberControllerMixin } from '../member.controller.mixin';
import { HttpStatus, Inject, Query } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import {
  ResponseDto,
  ResponseWithPaginationDto,
} from 'src/app/interfaces/common/http.response.dto';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';
import { MemberService } from '../../service/member.service';
import { Members } from 'src/app/schemas/members.schema';
import * as validator from 'src/app/helper/validator.helper';
import { ObjectId } from 'mongodb';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { isNumeric } from 'src/app/helper/validator.helper';

export class MemberGetHandlers extends MemberControllerMixin {
  constructor(
    @Inject(ErrorDictionaryService)
    private readonly errorDictionaryService: ErrorDictionaryService,
    @Inject(HttpErrorDictionaryService)
    private readonly httpErrorDictionaryService: HttpErrorDictionaryService,
    private readonly memberService: MemberService,
  ) {
    super();
  }

  //get all members list => GET /api/member or GET /api/member?keyword=keyword&page=1&pageSize=10
  async getAllMembers(
    @Query() query: ExpressQuery,
  ): Promise<ResponseWithPaginationDto<Members[]>> {
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
        data: await this.memberService.findAll(query),
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

  //new route get by id with path /member/:id (i.e. /member/e0e000e0011231d)
  async getMemberById(id: string): Promise<ResponseDto<Members>> {
    //check param id valid only integer number and not empty or include string or charecter
    if (id === '' || id.includes(' ')) {
      //error with http status 400 bad request and message
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

    //check is numberic
    if (!validator.isValidId(id)) {
      //error with http status 400 bad request and message
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
    const isValidObjectId = ObjectId.isValid(id);
    if (!isValidObjectId) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(710),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return {
        message: this.errorDictionaryService.getErrorDescription(HttpStatus.OK),
        data: await this.memberService.getMemberById(id),
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
