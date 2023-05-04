import { MemberControllerMixin } from '../member.controller.mixin';
import { HttpStatus, Inject } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import { ResponseDto } from 'src/app/interfaces/common/http.response.dto';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';
import { MemberService } from '../../service/member.service';
import { Members } from 'src/app/schemas/members.schema';
import * as validator from 'src/app/helper/validator.helper';
import { ObjectId } from 'mongodb';

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

  async getAllMembers(): Promise<ResponseDto<Members[]>> {
    try {
      return {
        message: this.errorDictionaryService.getErrorDescription(HttpStatus.OK),
        data: await this.memberService.findAll(),
      };
    } catch (error) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          error.status == 500
            ? HttpStatus.INTERNAL_SERVER_ERROR
            : HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(error.status),
        },
        error.status == 500
          ? HttpStatus.INTERNAL_SERVER_ERROR
          : HttpStatus.BAD_REQUEST,
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
        {
          desc: this.errorDictionaryService.getErrorDescription(error.status),
        },
        error.status,
      );
    }
  }
}
