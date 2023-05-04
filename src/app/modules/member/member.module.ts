import { Module } from '@nestjs/common';
import { MemberController } from './controller/member.controller';
import { SharedModule } from 'src/app/shared/share/shared.module';
import { MemberService } from './service/member.service';

import { MembersSchema } from 'src/app/schemas/members.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberGetHandlers } from './controller/handler/member.get.ctl';
import { MemberPostHandlers } from './controller/handler/member.post.ctl';
import { MemberPutHandlers } from './controller/handler/member.put.ctl';
import { MemberPatchHandlers } from './controller/handler/member.patch.ctl';
import { MemberDeleteHandlers } from './controller/handler/member.delete.ctl';
import { multerConfig } from 'src/app/configuration/multer.config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([{ name: 'Members', schema: MembersSchema }]),
    MulterModule.register(multerConfig),
  ],
  controllers: [MemberController],
  providers: [
    MemberService,
    MemberGetHandlers,
    MemberPostHandlers,
    MemberPutHandlers,
    MemberPatchHandlers,
    MemberDeleteHandlers,
  ],
})
export class MemberModule {}
