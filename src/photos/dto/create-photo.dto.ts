import { User } from 'src/users/entities/user.entity';

export class CreatePhotoDto {
  url: string;
  filename: string;
  key: string;
  user: User;
}
