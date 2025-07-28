import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    const hardcoded = {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10), // for real, only hash once
    };

    const isMatch = await bcrypt.compare(password, hardcoded.password);
    if (username === hardcoded.username && isMatch) {
      return { username };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
