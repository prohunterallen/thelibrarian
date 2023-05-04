import { HttpException, HttpStatus } from '@nestjs/common';

//This Create a new HttpException with a custom message and status code
export function createHttpException(
  message: string,
  data: any,
  statusCode: HttpStatus,
): never {
  throw new HttpException(
    {
      message,
      data,
    },
    statusCode,
  );
}
