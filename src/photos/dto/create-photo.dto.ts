import { IsNotEmpty, IsUrl, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreatePhotoDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @MinLength(3)
  filename: string;

  @IsNotEmpty()
  @MinLength(3)
  key: string;

  user: User;
}
