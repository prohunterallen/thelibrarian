import { MemberControllerMixin } from '../member.controller.mixin';
import { HttpStatus, Inject } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import {
  ResponseDto,
  ResponseWithTokenDto,
} from 'src/app/interfaces/common/http.response.dto';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';
import { MemberService } from '../../service/member.service';
import { Members } from 'src/app/schemas/members.schema';
import * as validator from 'src/app/helper/validator.helper';
import * as argon2 from 'argon2';
import { LoginDto } from 'src/app/interfaces/member/login.member.dto';
import { TokenDto } from 'src/app/interfaces/member/token.dto';
import { NewMembersDto } from 'src/app/interfaces/member/create.member.dto';
import { UserStatus } from 'src/app/shared/variable.share';

export class MemberPostHandlers extends MemberControllerMixin {
  constructor(
    @Inject(ErrorDictionaryService)
    private readonly errorDictionaryService: ErrorDictionaryService,
    @Inject(HttpErrorDictionaryService)
    private readonly httpErrorDictionaryService: HttpErrorDictionaryService,
    private readonly memberService: MemberService,
  ) {
    super();
  }

  async createMember(body: any): Promise<ResponseWithTokenDto<Members>> {
    // const { username, password, name, email } = body;

    // Check for missing fields
    if (!body.username || !body.password || !body.name || !body.email) {
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
    // Check for invalid fields  password, email
    if (body.password.length < 8 || !validator.IsValidEmail(body.email)) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(805),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    // check for invalid value of username
    if (body.username.length < 4 || !validator.isValidUsername(body.username)) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(806),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    // Check if member already exists
    if (
      await this.memberService.checkIfDuplucateExists(body.username, body.email)
    ) {
      throw createHttpException(
        this.httpErrorDictionaryService.getStatusDescription(
          HttpStatus.BAD_REQUEST,
        ),
        {
          desc: this.errorDictionaryService.getErrorDescription(809),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      // Hash the password with Argon2
      const hashedPassword = await argon2.hash(body.password);

      // Create a new member object with the hashed password
      body.password = hashedPassword;

      // Create the member
      const member = await this.memberService.createMember(body);

      //then create token
      const token: TokenDto = {
        refreshToken: 'aasdfasdf',
        refreshTokenExpireDate: new Date(),
        accessToken: 'asdfasdfasdfadsf',
        accessTokenExpireDate: new Date(),
      };
      return {
        message: this.errorDictionaryService.getErrorDescription(HttpStatus.OK),
        token: token,
        data: member,
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

  //Login member POST => /api/member/login
  async loginMember(body: LoginDto): Promise<ResponseWithTokenDto<Members>> {
    try {
      const member = await this.memberService.loginMember(body);

      // Check if member exists
      if (!member) {
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.NOT_FOUND,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(705),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Check if password is correct
      if (!(await argon2.verify(member.password, body.password))) {
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.BAD_REQUEST,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(812),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (member.status == UserStatus.SUSPENDED) {
        throw createHttpException(
          this.httpErrorDictionaryService.getStatusDescription(
            HttpStatus.FORBIDDEN,
          ),
          {
            desc: this.errorDictionaryService.getErrorDescription(813),
          },
          HttpStatus.FORBIDDEN,
        );
      }

      //create token

      const token: TokenDto = {
        refreshToken: 'aasdfasdf',
        refreshTokenExpireDate: new Date(),
        accessToken: 'asdfasdfasdfadsf',
        accessTokenExpireDate: new Date(),
      };
      return {
        message: this.errorDictionaryService.getErrorDescription(HttpStatus.OK),
        token: token,
        data: member,
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
