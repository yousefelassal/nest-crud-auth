import { IsEnum, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  firstName: string;

  @MinLength(3)
  lastName: string;

  @IsEnum(['active', 'inactive'], {
    message: 'Status must be either active or inactive',
  })
  status: string;
}
