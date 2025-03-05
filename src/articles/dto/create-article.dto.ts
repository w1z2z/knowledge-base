import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    example: 'Как использовать Prisma с NestJS',
    description: 'Заголовок статьи',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'В этой статье мы рассмотрим...',
    description: 'Содержание статьи',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    example: true,
    description: 'Флаг публичности статьи',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

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

  @ApiProperty({
    example: '2025-03-05T00:46:24.282Z',
    description: 'Дата выпуска статьи',
  })
  @IsString()
  @IsOptional()
  createdAt?: string;
}
