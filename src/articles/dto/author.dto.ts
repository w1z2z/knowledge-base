import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AuthorDto {
  @ApiProperty({
    example: 'a22acc89-9d08-4e26-b9c1-9cfdcf8cdfa9',
    description: 'Идентификатор автора',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    example: 'Vitaly',
    description: 'Имя пользователя автора',
  })
  @IsString()
  username!: string;
}