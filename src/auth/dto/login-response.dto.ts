import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzhmZDJjZS1jZGQyLTRjNjktODdiOS0xN2Q5NzQyNGEwY2EiLCJpYXQiOjE3NDExMjA3OTcsImV4cCI6MTc0MTIwNzE5N30.I8Iz3Gv38jQ6q96BVe8KdLaaGEVhJYepLNsovrEaLk8',
  })
  accessToken!: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzhmZDJjZS1jZGQyLTRjNjktODdiOS0xN2Q5NzQyNGEwY2EiLCJpYXQiOjE3NDExMjA3OTcsImV4cCI6MTc0MTIwNzE5N30.I8Iz3Gv38jQ6q96BVe8KdLaaGEVhJYepLNsovrEaLk8',
  })
  refreshToken!: string;
}
