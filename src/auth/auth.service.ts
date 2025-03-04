import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser({ email, password }: LoginDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException(
        'Пользователь не найден!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new HttpException('Неверный пароль!', HttpStatus.UNAUTHORIZED);
    }

    return { id: user.id };
  }

  async login(userId: string): Promise<LoginResponseDto> {
    return await this.generateTokens(userId);
  }

  async register({
    email,
    password,
    username,
  }: RegisterDto): Promise<RegisterResponseDto> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new HttpException(
        'Пользователь с таким email уже существует',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await argon2.hash(password);

    return this.userService.create({
      email: email,
      username: username,
      password: hashedPassword,
    });
  }

  async refreshToken(userId: string): Promise<LoginResponseDto> {
    return await this.generateTokens(userId);
  }

  async generateTokens(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload),
      this.jwtService.sign(payload, this.refreshTokenConfig),
    ]);
    //записывать рефреш токен в редис
    return { accessToken, refreshToken };
  }

  // async validateRefreshToken(userId: number, refreshToken: string) {
  //   //получать токен из редиса и сравнивать его с переданным и если не равны, кидать ошибку
  //
  //   return { id: userId };
  // }
  //
  // async signOut(){
  //   //удалять рефреш токен из редиса
  // }
}
