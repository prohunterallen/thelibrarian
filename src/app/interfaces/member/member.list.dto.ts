import { PurchaseHistoryDTO } from 'src/app/interfaces/purchase/purchase.history.dto';

export interface MemberListDTO {
  id: number;
  name: string;
  email: string;
  status: string; // 'active', 'banned', 'inactive'
  registrationDate: Date;
  purchaseHistories: PurchaseHistoryDTO[];
}
