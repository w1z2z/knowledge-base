import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CustomRequest } from './types/custom-request';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterDto, description: 'Register payload' })
  @ApiResponse({ type: RegisterResponseDto, description: 'Register response' })
  @Post('register')
  register(@Body() payload: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(payload);
  }

  @ApiOperation({ summary: 'Авторизоваться' })
  @ApiBody({ type: LoginDto, description: 'Auth payload' })
  @ApiResponse({ type: LoginResponseDto, description: 'Access-token' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: CustomRequest): Promise<LoginResponseDto> {
    return await this.authService.login(req.user.id);
  }

  @ApiOperation({ summary: 'Обновление токена доступа' })
  @ApiResponse({ type: LoginResponseDto, description: 'New access-token' })
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Req() req: CustomRequest): Promise<LoginResponseDto> {
    return await this.authService.refreshToken(req.user.id);
  }
}
