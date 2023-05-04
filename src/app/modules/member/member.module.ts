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
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([{ name: 'Members', schema: MembersSchema }]),
    MulterModule.register(multerConfig),
    //JWT
    PassportModule.register({ defaultStrategy: 'jwt' }), //register the passport module
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), //get the secret key from the .env file
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
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
