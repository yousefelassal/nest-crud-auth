import { IsEnum, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  username: string;

  @MinLength(8)
  password: string;

  @IsEnum(['active', 'inactive'], {
    message: 'Status must be either active or inactive',
  })
  status: string;
}
