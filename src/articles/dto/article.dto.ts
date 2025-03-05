import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  ArrayUnique,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AuthorDto } from './author.dto';

export class ArticleDto {
  @ApiProperty({
    example: '935bb130-2caf-4f27-b691-3df6b1c26fbe',
    description: 'Идентификатор статьи',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    example: 'Название статьи',
    description: 'Заголовок статьи',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 'Текст статьи...',
    description: 'Содержание статьи',
  })
  @IsString()
  content!: string;

  @ApiProperty({
    example: true,
    description: 'Флаг публичности статьи',
  })
  @IsBoolean()
  isPublic!: boolean;

  @ApiProperty({
    description: 'Автор статьи',
    type: AuthorDto,
  })
  @ValidateNested()
  @Type(() => AuthorDto)
  author!: AuthorDto;

  @ApiProperty({
    example: '2025-03-05T00:46:24.282Z',
    description: 'Дата публикации статьи',
  })
  @IsString()
  createdAt!: string;

  @ApiProperty({
    example: ['NestJS', 'Prisma', 'Backend'],
    description: 'Теги статьи',
    type: [String],
    required: false,
  })
  @IsString({ each: true })
  @ArrayUnique()
  @IsOptional()
  tags?: string[] = [];
}