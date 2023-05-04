import { MemberControllerMixin } from '../member.controller.mixin';
import { HttpStatus, Inject } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import { ResponseDto } from 'src/app/interfaces/common/http.response.dto';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';
import { MemberService } from '../../service/member.service';
import { Members } from 'src/app/schemas/members.schema';
import * as validator from 'src/app/helper/validator.helper';
import * as argon2 from 'argon2';
import { ObjectId } from 'mongodb';
import { ResetPwdMemberDto } from 'src/app/interfaces/member/reset.pwd.member.dto';
import { UpdateMembersDto } from 'src/app/interfaces/member/update.member.dto';
import { UserStatus } from 'src/app/shared/variable.share';

export class MemberPutHandlers extends MemberControllerMixin {
  constructor(
    @Inject(ErrorDictionaryService)
    private readonly errorDictionaryService: ErrorDictionaryService,
    @Inject(HttpErrorDictionaryService)
    private readonly httpErrorDictionaryService: HttpErrorDictionaryService,
    private readonly memberService: MemberService,
  ) {
    super();
  }

  //update member profile PUT => /member/:id
  async updateMemberProfile(
    body: UpdateMembersDto,
  ): Promise<ResponseDto<Members>> {
    //check valiud id

    const { id, name, email } = body;

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
    if (!name || !email) {
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
    if (/^\s*$/.test(name) || /^\s*$/.test(email)) {
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
    // Check for invalid fields   email
    if (!validator.IsValidEmail(email)) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(803),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return {
        message: this.errorDictionaryService.getErrorDescription(HttpStatus.OK),
        data: await this.memberService.updateMemberById(body),
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

  //TODO: update member password
  async updateMemberPassword(
    id: string,
    resetPwdDto: ResetPwdMemberDto,
  ): Promise<Members> {
    try {
      const { current, new: newPassword, confirm } = resetPwdDto;

      //check missing fields
      if (!current || !newPassword || !confirm) {
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

      //check empty fields and length
      if (
        newPassword.length < 8 ||
        /^\s*$/.test(current) ||
        /^\s*$/.test(newPassword) ||
        /^\s*$/.test(confirm)
      ) {
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

      //check new password is different from current password
      if (current === newPassword) {
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.BAD_REQUEST,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(808),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      //check if new password and confirm password match
      if (newPassword !== confirm) {
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.BAD_REQUEST,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(802),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      //get member by id
      const member = await this.memberService.getMemberByIdWithPwd(id);

      //check if member exists
      if (!member) {
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.NOT_FOUND,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(704),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      //check if current password is correct
      const isPasswordMatch = await argon2.verify(member.password, current);

      if (!isPasswordMatch) {
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.BAD_REQUEST,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(810),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await argon2.hash(newPassword);

      member.password = hashedPassword;
      const updatedMember = await member.save();

      return updatedMember.toObject({
        getters: true,
        versionKey: false,
        transform: (doc, ret) => {
          delete ret.password;
          return ret;
        },
      });
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

  //Toggle Suspended PUT => /member/:id/suspended/toggle

  async toggleSuspendMember(id: string): Promise<ResponseDto<Members>> {
    //check valid id
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
      const member = await this.memberService.getMemberById(id);

      //check if member exists
      if (!member) {
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.NOT_FOUND,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(704),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      member.status =
        member.status == UserStatus.ACTIVE
          ? UserStatus.SUSPENDED
          : UserStatus.ACTIVE;
      const updatedMember = await member.save();

      return {
        message: this.errorDictionaryService.getErrorDescription(HttpStatus.OK),
        data: updatedMember,
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
