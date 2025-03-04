import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: 'f8a1d3b0-9a72-4c33-8c66-a4f6a5b7a7d4' })
  id: string | undefined;

  @ApiProperty({ example: 'user@example.com' })
  email: string | undefined;
}
