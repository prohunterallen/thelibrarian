import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ type: String, select: false })
  password: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

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

export const MembersSchema = SchemaFactory.createForClass(Members);
