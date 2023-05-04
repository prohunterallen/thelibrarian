import { HttpStatus, Inject } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import { MemberServiceMixin } from 'src/app/modules/member/service/member.service.mixin';
import { Members } from 'src/app/schemas/members.schema';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';

import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as argon2 from 'argon2';

export class MemberDeleteServiceHandlers extends MemberServiceMixin {
  constructor(
    @Inject(ErrorDictionaryService)
    private readonly errorDictionaryService: ErrorDictionaryService,
    @Inject(HttpErrorDictionaryService)
    private readonly httpErrorDictionaryService: HttpErrorDictionaryService,
    @InjectModel(Members.name)
    private membersModel: mongoose.Model<Members>, //inject the Members Schema and Name private class
  ) {
    super(membersModel);
  }

  //delete deleteMember by id => DELETE /api/member/delete/:id
  async deleteMember(id: string): Promise<Members> {
    try {
      // const result = await this.memberModel.findByIdAndDelete(id);
      // if (!result) {
      //   throw new InternalServerErrorException({ deleted: true });
      // }
      // return { deleted: true };

      return await this.membersModel.findByIdAndDelete(id);
    } catch (error) {
      console.log(error.message);
      if (error.status != 500) throw error;
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
