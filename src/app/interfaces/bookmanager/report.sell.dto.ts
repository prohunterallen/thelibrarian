import { BookDTO } from 'src/app/interfaces/bookmanager/book.dto';
import { CategoryReportDTO } from 'src/app/interfaces/bookmanager/report.category.dto';

export interface SellReportDTO {
  bestSellerCategory: CategoryReportDTO[];
  bestSellerBook: BookDTO;
  lowStockBooks: BookDTO[];
}
