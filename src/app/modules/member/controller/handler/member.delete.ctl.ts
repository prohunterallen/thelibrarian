import { MemberControllerMixin } from '../member.controller.mixin';
import { HttpStatus, Inject } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import { ResponseDto } from 'src/app/interfaces/common/http.response.dto';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';
import { MemberService } from '../../service/member.service';
import * as argon2 from 'argon2';
import { deleteExistingImages } from 'src/app/shared/utilities/images.resize.uitil';

export class MemberDeleteHandlers extends MemberControllerMixin {
  constructor(
    @Inject(ErrorDictionaryService)
    private readonly errorDictionaryService: ErrorDictionaryService,
    @Inject(HttpErrorDictionaryService)
    private readonly httpErrorDictionaryService: HttpErrorDictionaryService,
    private readonly memberService: MemberService,
  ) {
    super();
  }

  async deleteMember(
    id: string,
    body: any,
  ): Promise<ResponseDto<{ deleted: boolean }>> {
    //check user
    const member = await this.memberService.getMemberByIdWithPwd(id);
    if (!member) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(704),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    // Check password
    if (!(await argon2.verify(member.password, body.password))) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(811),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      // Delete existing profile images
      await deleteExistingImages(member.profileImages);

      const res = await this.memberService.deleteMember(id);
      return {
        message: this.errorDictionaryService.getErrorDescription(
          !!res ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        data: { deleted: !!res },
      };
    } catch (error) {
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
