import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsArray, IsISO8601, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AuthorDto {
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

export class FindOneDto {
  @ApiProperty({
    example: '935bb130-2caf-4f27-b691-3df6b1c26fbe',
    description: 'Идентификатор статьи',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    example: '123',
    description: 'Заголовок статьи',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: '123',
    description: 'Содержание статьи',
  })
  @IsString()
  content!: string;

  @ApiProperty({
    example: '2025-03-05T01:26:40.062Z',
    description: 'Дата создания статьи',
  })
  @IsISO8601()
  createdAt!: string;

  @ApiProperty({
    example: ['IT'],
    description: 'Теги статьи',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @ApiProperty({
    description: 'Автор статьи',
    type: AuthorDto,
  })
  @ValidateNested()
  @Type(() => AuthorDto)
  author!: AuthorDto;
}