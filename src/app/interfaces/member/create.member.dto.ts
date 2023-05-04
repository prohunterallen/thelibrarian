import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NewMembersDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
