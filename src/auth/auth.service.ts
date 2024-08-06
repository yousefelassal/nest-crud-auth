import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    console.log(process.env.JWT_SECRET);
    const user = await this.userService.findOneByUsername(username);
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.id };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
