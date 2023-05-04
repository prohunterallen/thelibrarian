import { PurchaseHistoryDTO } from 'src/app/interfaces/purchase/purchase.history.dto';

//profile interface dto
export class ProfileDTO {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  roleId: number;
  status: string;
  registrationDate: Date;
  failedLoginAttempts: number;
  lastFailedLoginAttempt: Date;
  purchaseHistories: PurchaseHistoryDTO[];

  // constructor(data: Partial<ProfileDTO>) {
  //   Object.assign(this, data);
  // }

  // static fromJson(json: string): ProfileDTO {
  //   const data = JSON.parse(json);
  //   return new ProfileDTO(data);
  // }

  // toJson(): string {
  //   return JSON.stringify(this);
  // }
}
