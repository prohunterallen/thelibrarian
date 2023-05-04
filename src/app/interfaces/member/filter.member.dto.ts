import { PaginationDTO } from 'src/app/interfaces/common/pagination.dto';

export interface FilterMemberDTO {
  pagination: PaginationDTO;
  username?: string;
  name?: string;
  memberId?: string;
}
