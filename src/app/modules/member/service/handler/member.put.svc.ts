import { HttpStatus, Inject } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import { MemberServiceMixin } from 'src/app/modules/member/service/member.service.mixin';
import { Members } from 'src/app/schemas/members.schema';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';

import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UpdateMembersDto } from 'src/app/interfaces/member/update.member.dto';

export class MemberPutServiceHandlers extends MemberServiceMixin {
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

  //update member by id => PUT /api/member/:id
  async updateMemberById(body: UpdateMembersDto): Promise<Members> {
    try {
      // const memberData = await this.membersModel.findByIdAndUpdate(
      //   new mongoose.Types.ObjectId(id),
      //   member,
      //   { new: true, runValidators: true },
      // );
      const { id, name, email } = body;
      const update = { name, email };
      const options = { new: true, runValidators: true };

      const memberData = await this.membersModel
        .findByIdAndUpdate(id, update, options)
        .exec();

      ///throw 404 if not found
      if (!memberData)
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.NOT_FOUND,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(704),
          },
          HttpStatus.NOT_FOUND,
        );

      return memberData;
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
