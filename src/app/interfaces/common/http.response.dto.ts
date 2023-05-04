//ResponseDto is a generic interface that will be used to return a response from the server
export interface ResponseDto<T> {
  message: string;
  data: T;
}
