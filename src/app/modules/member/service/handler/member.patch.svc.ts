import { HttpStatus, Inject } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import { MemberServiceMixin } from 'src/app/modules/member/service/member.service.mixin';
import { Members } from 'src/app/schemas/members.schema';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';

import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ProfileImageMemberDto } from 'src/app/interfaces/member/profile.image.member.dto';

export class MemberPatchServiceHandlers extends MemberServiceMixin {
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

  //update profile image by id => PUT /api/member/:id/profile-image
  async updateProfileImage(pfimg: ProfileImageMemberDto): Promise<Members> {
    {
      const { id, update, options } = pfimg;
      const updateOptions = options || { new: true }; // Set the default value for options here

      try {
        const updatedMember = await this.membersModel.findByIdAndUpdate(
          id,
          update,
          updateOptions,
        );

        if (!updatedMember) {
          throw new Error('Member not found');
        }

        return updatedMember;
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
}
