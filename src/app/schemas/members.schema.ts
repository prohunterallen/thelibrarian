import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as autoIncrement from 'mongoose-plugin-autoinc';

export enum ImageSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

@Schema()
export class Members extends Document {
  @Prop({ type: [{ size: String, path: String }], default: [] })
  profileImages: {
    size: ImageSize;
    path: string;
  }[];

  @Prop({ type: String })
  username: string;

  @Prop({ type: String, unique: true, select: false })
  password: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String, unique: true })
  memberNo: string;

  @Prop({ type: String, default: 'active' })
  status: string;

  @Prop({ type: [Object], default: [] })
  purchaseHistories: object[];

  @Prop({ type: Number, default: 1 })
  roleId: number;

  @Prop({ type: Number, default: 0 })
  failedLoginAttempts: number;

  @Prop({ type: Date, default: Date.now() })
  registrationDate: Date;

  @Prop({ type: Date, default: null })
  lastFailedLoginAttempt: Date;

  toJSON() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  }
}

const MembersSchema = SchemaFactory.createForClass(Members);

// Apply the auto-increment plugin
MembersSchema.plugin(autoIncrement.autoIncrement, {
  model: 'Members',
  field: 'memberNo',
  startAt: 1,
  incrementBy: 1,
});

export { MembersSchema };
