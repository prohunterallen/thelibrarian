import { BookDTO } from 'src/app/interfaces/bookmanager/book.dto';

export interface CategoryReportDTO {
  category: string;
  bestSellerBook: BookDTO;
}
