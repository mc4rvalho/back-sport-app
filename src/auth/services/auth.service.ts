import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { Bcrypt } from '../bcrypt/bcrypt';

export interface UsuarioValidado {
  id: string;
  email: string;
  name: string;
  role: string;
  photoUrl: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(email: string, pass: string): Promise<UsuarioValidado> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    const matchPassword = await this.bcrypt.comparePasswords(
      pass,
      user.password,
    );

    if (matchPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result as UsuarioValidado;
    }

    throw new HttpException(
      'E-mail ou Senha inválidos!',
      HttpStatus.UNAUTHORIZED,
    );
  }

  login(user: UsuarioValidado) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
