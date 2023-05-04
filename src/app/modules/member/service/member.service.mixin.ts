import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Members } from 'src/app/schemas/members.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class MemberServiceMixin {
  constructor(
    @InjectModel(Members.name)
    protected readonly memberModel: mongoose.Model<Members>,
  ) {}
}
