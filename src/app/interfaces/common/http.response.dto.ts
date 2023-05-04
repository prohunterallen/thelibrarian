import { PaginationDTO } from './pagination.dto';

//ResponseDto is a generic interface that will be used to return a response from the server
export interface ResponseDto<T> {
  message: string;
  data: T;
}

export interface ResponseWithPaginationDto<T> {
  message: string;
  data: {
    pagination: PaginationDTO;
    result: T;
  };
}
