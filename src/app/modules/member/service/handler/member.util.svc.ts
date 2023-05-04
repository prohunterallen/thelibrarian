import { HttpStatus, Inject } from '@nestjs/common';
import { createHttpException } from 'src/app/helper/http-exception-helper';
import { MemberServiceMixin } from 'src/app/modules/member/service/member.service.mixin';
import { Members } from 'src/app/schemas/members.schema';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';

import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as argon2 from 'argon2';

export class MemberUtilServiceHandlers extends MemberServiceMixin {
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

  //check exist user or email
  async checkIfDuplucateExists(
    username: string,
    email: string,
  ): Promise<boolean> {
    const user = await this.membersModel
      .findOne({ $or: [{ username }, { email }] })
      .exec();
    return !!user;
  }

  //check exist user or email
  async checkIfUsernameExists(username: string): Promise<boolean> {
    const user = await this.membersModel
      .findOne({ $or: [{ username }] })
      .exec();
    return !!user;
  }

  //check exist user by id
  async checkIfUserExistsById(id: string): Promise<boolean> {
    const user = await this.membersModel
      .findOne({ _id: new mongoose.Types.ObjectId(id) })
      .exec();
    return !!user;
  }

  //check password match
  async checkPasswordMatch(
    username: string,
    password: string,
  ): Promise<boolean> {
    // find the member by username
    const member: Members = await this.membersModel
      .findOne({ username: username })
      .select('+password')
      .exec();

    const passwordsMatch = await argon2.verify(member.password, password);

    // check if member exists and if the passwords match
    return !!member && !!passwordsMatch;
  }
}
