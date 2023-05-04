import { MemberControllerMixin } from '../member.controller.mixin';
import { HttpStatus, Inject } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import { ResponseDto } from 'src/app/interfaces/common/http.response.dto';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';
import { MemberService } from '../../service/member.service';
import { Members } from 'src/app/schemas/members.schema';
import { ObjectId } from 'mongodb';
import * as validator from 'src/app/helper/validator.helper';
import {
  resizeAndSaveImages,
  deleteExistingImages,
} from 'src/app/shared/utilities/images.resize.util';
import { ProfileImageMemberDto } from 'src/app/interfaces/member/profile.image.member.dto';

export class MemberPatchHandlers extends MemberControllerMixin {
  constructor(
    @Inject(ErrorDictionaryService)
    private readonly errorDictionaryService: ErrorDictionaryService,
    @Inject(HttpErrorDictionaryService)
    private readonly httpErrorDictionaryService: HttpErrorDictionaryService,
    private readonly memberService: MemberService,
  ) {
    super();
  }

  // Update member profile image PATCH => /api/member/:id/profile-image
  async uploadProfileImage(
    id: string,
    file: any,
  ): Promise<ResponseDto<Members>> {
    //check valiud id
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

    // Check for missing fields
    if (!file) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(707),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //check file
    if (validator.validateImageFile(file)) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(711),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //check file size
    if (validator.validateFileSize(file)) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(712),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      //check member exists
      const profile = await this.memberService.getMemberById(id);
      if (!!!profile) {
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

      // Delete existing profile images
      await deleteExistingImages(profile.profileImages);

      //resize and save images
      const profileImages = await resizeAndSaveImages(file);

      // Create a ProfileImageMemberDto object
      const profileImageMemberDto = new ProfileImageMemberDto();
      profileImageMemberDto.id = id;
      profileImageMemberDto.update = { profileImages: profileImages };
      profileImageMemberDto.options = { new: true };

      // update the member in the database
      const member = await this.memberService.updateProfileImage(
        profileImageMemberDto,
      );

      if (!member) {
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.BAD_REQUEST,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(800),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        message: this.errorDictionaryService.getErrorDescription(HttpStatus.OK),
        data: member,
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
