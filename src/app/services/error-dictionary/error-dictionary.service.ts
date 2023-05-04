import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorDictionaryService {
  private readonly errorDict = new Map<number, string>([
    [200, 'SUCCESS'],
    [401, 'UNAUTHORIZED'],
    [403, 'FORBIDDEN'],
    [404, 'NOT_FOUND'],
    [500, 'OPS_SOMETHING_WENT_WRONG'],
    [701, 'EMAIL_ALREADY_EXIST'],
    [702, 'ACCOUNT_BLOCKED'],
    [703, 'INVALID_NUMBER'],
    [704, 'RECORD_NOT_FOUND'],
    [705, 'INVALID_PARAMETER'],
    [706, 'INVALID_PARAMETER_OR_VALUE'],
    [707, 'MISSING_PARAMETER'],
    [710, 'INVALID_REFERENCE_ID'],
    [711, 'INVALID_FILE_TYPE'],
    [712, 'INVALID_FILE_SIZE'],
    //MEMBER
    [800, 'USER_NOT_FOUND'],
    [801, 'USER_ALREADY_EXIST'],
    [802, 'PASSWORD_NOT_MATCH'],
    [803, 'INVALID_EMAIL'],
    [804, 'INVALID_USERNAME'],
    [805, 'INVALID_EMAIL_OR_PASSWORD'],
    [806, 'USER_CONTAINS_INVALID_CHARACTERS_OR_TOO_SHORT'],
    [807, 'USER_CONTAINS_INVALID_CHARACTERS_OR_TOO_LONG'],
    [808, 'NEW_PASSWORD_IS_SAME_AS_CURRENT_PASSWORD'],
    [809, 'USER_OR_EMAIL_ALREADY_EXIST'],
    [810, 'CURRENT_PASSWORD_NOT_MATCH'],
    [811, 'INVALID_PASSWORD'],
    //PURCHASE
    [830, 'PURCHASE_NOT_FOUND'],
    [831, 'PURCHASE_ALREADY_EXIST'],
    [832, 'PURCHASE_DENIED'],
    //BOOK
    [850, 'BOOK_NOT_FOUND'],
    [851, 'BOOK_OUT_OF_STOCK'],
    [852, 'INVALID_BOOK_QUANTITY'],
    [853, 'INVALID_BOOK_PRICE'],
    [854, 'INVALID_BOOK_NAME'],
    [855, 'INVALID_BOOK_ID'],
    [856, 'ISBM_ALREADY_EXIST'],
  ]);

  getErrorDescription(exception: number): string {
    return this.errorDict.get(exception) || 'OPS_SOMETHING_WENT_WRONG';
  }
}
