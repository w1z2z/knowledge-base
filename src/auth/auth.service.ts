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
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    private readonly redisService: RedisService,
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

    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.redisService.set(userId, hashedRefreshToken, 604800);
    return { accessToken, refreshToken };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.redisService.get(userId);
    if (!hashedRefreshToken) {
      throw new HttpException(
        'Недействительный токен!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const refreshTokenMatches = await argon2.verify(
      hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new HttpException(
        'Недействительный токен!',
        HttpStatus.UNAUTHORIZED,
      );

    return { id: userId };
  }

  async signOut(userId: string) {
    await this.redisService.del(userId);
  }
}
