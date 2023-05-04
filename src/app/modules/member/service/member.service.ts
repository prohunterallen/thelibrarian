import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorDictionaryService } from 'src/app/services/error-dictionary/error-dictionary.service';
import { HttpErrorDictionaryService } from 'src/app/services/http-error-dictionary/http-error-dictionary.service';

import * as mongoose from 'mongoose';
import { Members } from 'src/app/schemas/members.schema';
import { MemberPostServiceHandlers } from 'src/app/modules/member/service/handler/member.post.svc';
import { MemberGetServiceHandlers } from 'src/app/modules/member/service/handler/member.get.svc';
import { MemberPutServiceHandlers } from 'src/app/modules/member/service/handler/member.put.svc';
import { MemberPatchServiceHandlers } from 'src/app/modules/member/service/handler/member.patch.svc';
import { MemberUtilServiceHandlers } from 'src/app/modules/member/service/handler/member.util.svc';
import { MemberDeleteServiceHandlers } from 'src/app/modules/member/service/handler/member.delete.svc';
import { UpdateMembersDto } from 'src/app/interfaces/member/update.member.dto';
import { ProfileImageMemberDto } from 'src/app/interfaces/member/profile.image.member.dto';
import { LoginDto } from 'src/app/interfaces/member/login.member.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MemberService {
  private memberGetServiceHandlers: MemberGetServiceHandlers;
  private memberPostServiceHandlers: MemberPostServiceHandlers;
  private memberPutServiceHandlers: MemberPutServiceHandlers;
  private memberPatchServiceHandlers: MemberPatchServiceHandlers;
  private memberUtilServiceHandlers: MemberUtilServiceHandlers;
  private memberDeleteServiceHandlers: MemberDeleteServiceHandlers;

  constructor(
    private readonly errorDictionaryService: ErrorDictionaryService,
    private readonly httpErrorDictionaryService: HttpErrorDictionaryService,

    @InjectModel(Members.name)
    private membersModel: mongoose.Model<Members>, //inject the Members Schema and Name private class
    private jwtService: JwtService,
  ) {
    this.memberGetServiceHandlers = new MemberGetServiceHandlers(
      errorDictionaryService,
      httpErrorDictionaryService,
      membersModel,
    );
    this.memberPostServiceHandlers = new MemberPostServiceHandlers(
      errorDictionaryService,
      httpErrorDictionaryService,
      membersModel,
    );
    this.memberPutServiceHandlers = new MemberPutServiceHandlers(
      errorDictionaryService,
      httpErrorDictionaryService,
      membersModel,
    );
    this.memberPatchServiceHandlers = new MemberPatchServiceHandlers(
      errorDictionaryService,
      httpErrorDictionaryService,
      membersModel,
    );
    this.memberUtilServiceHandlers = new MemberUtilServiceHandlers(
      errorDictionaryService,
      httpErrorDictionaryService,
      membersModel,
      jwtService,
    );
    this.memberDeleteServiceHandlers = new MemberDeleteServiceHandlers(
      errorDictionaryService,
      httpErrorDictionaryService,
      membersModel,
    );
  }

  ///#####################
  //## Member Get Handlers
  ///#####################

  //get all members list => GET /api/member
  async findAll(query: ExpressQuery): Promise<any> {
    return this.memberGetServiceHandlers.findAll(query);
  }

  //get member by id => GET /api/member/:id
  async getMemberById(id: string): Promise<Members> {
    return this.memberGetServiceHandlers.getMemberById(id);
  }

  ///#####################
  //## Member Post Handlers
  ///#####################

  //create new member => POST /api/member
  async createMember(member: Members): Promise<Members> {
    return this.memberPostServiceHandlers.createMember(member);
  }

  //get member by id with password
  async getMemberByIdWithPwd(id: string): Promise<Members> {
    return this.memberGetServiceHandlers.getMemberByIdWithPwd(id);
  }

  //login member => POST /api/member/login
  async loginMember(login: LoginDto): Promise<Members> {
    return this.memberPostServiceHandlers.loginMember(login);
  }

  ///#####################
  //## Member Put Handlers
  ///#####################

  //update member by id => PUT /api/member/:id
  async updateMemberById(m: UpdateMembersDto): Promise<Members> {
    return this.memberPutServiceHandlers.updateMemberById(m);
  }

  ///#####################
  //## Member Delete Handlers
  ///#####################

  //delete deleteMember by id => DELETE /api/member/delete/:id
  async deleteMember(id: string): Promise<Members> {
    return this.memberDeleteServiceHandlers.deleteMember(id);
  }

  ///#####################
  //## Member Patch Handlers
  ///#####################

  //update profile image by id => PUT /api/member/:id/profile-image
  async updateProfileImage(pfimg: ProfileImageMemberDto): Promise<Members> {
    return this.memberPatchServiceHandlers.updateProfileImage(pfimg);
  }

  ///#####################
  ///## Member Utilities Handlers
  ///#####################

  async checkIfDuplucateExists(
    username: string,
    email: string,
  ): Promise<boolean> {
    return this.memberUtilServiceHandlers.checkIfDuplucateExists(
      username,
      email,
    );
  }

  //check exist user or email
  async checkIfUsernameExists(username: string): Promise<boolean> {
    return this.memberUtilServiceHandlers.checkIfUsernameExists(username);
  }

  //check exist user by id
  async checkIfUserExistsById(id: string): Promise<boolean> {
    return this.memberUtilServiceHandlers.checkIfUserExistsById(id);
  }

  //check password match
  async checkPasswordMatch(login: LoginDto): Promise<boolean> {
    return this.memberUtilServiceHandlers.checkPasswordMatch(
      login.username,
      login.password,
    );
  }

  //create token
  async createToken(uid: string): Promise<string> {
    return this.memberUtilServiceHandlers.createToken(uid);
  }
}
