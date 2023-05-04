import { PaginationDTO } from 'src/app/interfaces/common/pagination.dto';

export interface FilterBooksDTO {
  pagination: PaginationDTO;
  category?: string;
  title?: string;
  isbn?: string;
  qrCode?: string;
  barcode?: string;
  orderBy?: string; // 'stockAsc', 'stockDesc', 'priceAsc', 'priceDesc'
}
