import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BookCategory, ImageSize } from '../shared/variable.share';

@Schema()
export class Books extends Document {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  author: string;

  @Prop({ type: String })
  isbn: string;

  @Prop({ type: String })
  qrCode?: string;

  @Prop({ type: String })
  barcode?: string;

  @Prop({ type: [{ size: String, path: String }], default: [] })
  coverImage?: {
    size: ImageSize;
    path: string;
  }[];

  @Prop({ type: [{ size: String, path: String }], default: [] })
  examplePage?: {
    size: ImageSize;
    path: string;
  }[];

  @Prop({ type: Number, default: 0.0 })
  price: number;

  @Prop({ type: Number, default: 1 })
  stock: number;

  @Prop({ enum: BookCategory, default: BookCategory.OTHERS })
  category: BookCategory;

  @Prop({ type: Date, default: Date.now() })
  createdDate: Date;

  @Prop({ type: Date, default: null })
  updatedDate: Date;
}
export const BooksSchema = SchemaFactory.createForClass(Books);
