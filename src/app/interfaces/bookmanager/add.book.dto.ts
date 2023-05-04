import { BookCategory } from 'src/app/shared/variable.share';

export interface AddBookDTO {
  title: string;
  author: string;
  isbn: string;
  qrCode?: string;
  barcode?: string;
  price: number;
  stock: number;
  category: BookCategory;
}
