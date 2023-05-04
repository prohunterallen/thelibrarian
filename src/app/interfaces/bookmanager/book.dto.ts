export interface BookDTO {
  id: string;
  title: string;
  author: string;
  isbn: string;
  qrCode?: string;
  barcode?: string;
  coverImage: string;
  examplePage: string;
  price: number;
  stock: number;
  category: string;
  createdDate: Date;
  updatedDate: Date;
}
