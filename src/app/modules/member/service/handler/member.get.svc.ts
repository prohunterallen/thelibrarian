import { HttpStatus, Inject } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import { MemberServiceMixin } from 'src/app/modules/member/service/member.service.mixin';
import { Members } from 'src/app/schemas/members.schema';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';

import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export class MemberGetServiceHandlers extends MemberServiceMixin {
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

  //get all members list => GET /api/member
  async findAll(): Promise<Members[]> {
    try {
      const memberListData: Members[] = await this.membersModel.find().exec();
      return memberListData;
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

  //get member by id => GET /api/member/:id
  async getMemberById(id: string): Promise<Members> {
    try {
      const member = await this.membersModel.findById(
        new mongoose.Types.ObjectId(id),
      );

      ///throw 404 if not found
      if (!member)
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.NOT_FOUND,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(704),
          },
          HttpStatus.NOT_FOUND,
        );

      return member;
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

  //Get member by id with password
  async getMemberByIdWithPwd(id: string): Promise<Members> {
    try {
      const member = await this.membersModel
        .findById(new mongoose.Types.ObjectId(id))
        .select('+password')
        .exec();

      ///throw 404 if not found
      if (!member)
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.NOT_FOUND,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(704),
          },
          HttpStatus.NOT_FOUND,
        );

      return member;
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
