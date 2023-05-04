import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewMembersDto {
  // @IsNotEmpty()
  readonly username: string;

  // @IsNotEmpty()
  // @IsString()
  // @MinLength(8)
  password: string;

  // @IsNotEmpty()
  // @IsString()
  readonly name: string;

  // @IsNotEmpty()
  // @IsString()
  // @IsEmail()
  readonly email: string;
}
