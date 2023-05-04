import {
  Post,
  Controller,
  Get,
  Param,
  Body,
  HttpStatus,
  HttpCode,
  Put,
  Patch,
  UseInterceptors,
  UploadedFile,
  Delete,
  Query,
} from '@nestjs/common';

import { MemberGetHandlers } from './handler/member.get.ctl';
import { MemberPostHandlers } from './handler/member.post.ctl';
import { MemberPutHandlers } from './handler/member.put.ctl';
import { MemberDeleteHandlers } from './handler/member.delete.ctl';
import { MemberPatchHandlers } from './handler/member.patch.ctl';

import { NewMembersDto } from 'src/app/interfaces/member/create.member.dto';
import { ResetPwdMemberDto } from 'src/app/interfaces/member/reset.pwd.member.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseDto } from 'src/app/interfaces/common/http.response.dto';
import { UpdateMembersDto } from 'src/app/interfaces/member/update.member.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('member')
export class MemberController {
  constructor(
    private readonly memberGetHandlers: MemberGetHandlers,
    private readonly memberPostHandlers: MemberPostHandlers,
    private readonly memberPutHandlers: MemberPutHandlers,
    private readonly MemberPatchHandlers: MemberPatchHandlers,
    private readonly memberDeleteHandlers: MemberDeleteHandlers,
  ) {}

  ///#######################
  ///##### GET METHOD ######
  ///#######################
  // Use the route handlers with the `use` method
  // useGetHandlers() {
  //   this.memberGetHandlers.getAllMembers();
  // }

  // Route handler for GET /member
  @Get('/')
  @HttpCode(HttpStatus.OK)
  getAllMembers(@Query() query: ExpressQuery) {
    return this.memberGetHandlers.getAllMembers(query);
  }

  // Route handler for GET /member/:id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  //TODO: id Param type should be number
  getMemberById(@Param('id') id: string) {
    return this.memberGetHandlers.getMemberById(id);
  }

  ///
  ///#####END GET METHOD#####
  ///

  ///#######################
  ///##### POST METHOD #####
  ///#######################
  // Route handler for POST /member/add
  @Post('/add')
  @HttpCode(HttpStatus.CREATED)
  //TODO: change any to DTO
  createMember(@Body() body: NewMembersDto) {
    return this.memberPostHandlers.createMember(body);
  }

  ///
  ///#####END POST METHOD#####
  ///

  ///#######################
  ///##### PUT METHOD ######
  ///#######################

  //update member profile PUT => /member/:id
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateMember(@Param('id') id: string, @Body() body: UpdateMembersDto) {
    body.id = id;
    return this.memberPutHandlers.updateMemberProfile(body);
  }

  //update member password
  @Put('/password/reset/:id')
  @HttpCode(HttpStatus.OK)
  updateMemberPassword(
    @Param('id') id: string,
    @Body() body: ResetPwdMemberDto,
  ) {
    return this.memberPutHandlers.updateMemberPassword(id, body);
  }

  ///
  ///#####END PUT METHOD#####
  ///

  ///#######################
  ///#### PATCH METHOD #####
  ///#######################
  @Patch(':id/profile-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.MemberPatchHandlers.uploadProfileImage(id, image);
  }

  ///
  ///#####END PATCH METHOD#####
  ///

  ///#######################
  ///#### DELETE METHOD ####
  ///#######################

  //delete member
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteMember(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<ResponseDto<any>> {
    return await this.memberDeleteHandlers.deleteMember(id, body);
  }
  ///
  ///#####END DELETE METHOD#####
  ///
}
