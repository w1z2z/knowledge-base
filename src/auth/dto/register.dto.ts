import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'User' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password!: string;
}
