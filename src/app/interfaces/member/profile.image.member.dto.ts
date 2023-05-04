import { Members } from 'src/app/schemas/members.schema';

export class ProfileImageMemberDto {
  id: string;
  update: Partial<Members>;
  options?: Record<string, any>;
}
