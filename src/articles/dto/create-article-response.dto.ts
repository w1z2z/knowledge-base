import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleResponseDto {
  @ApiProperty({
    example: '62ec710b-2610-4f4b-9c25-5d06926a9d54',
    description: 'Уникальный идентификатор статьи',
  })
  id!: string;

  @ApiProperty({
    example: 'Как использовать Prisma с NestJS',
    description: 'Заголовок статьи',
  })
  title!: string;

  @ApiProperty({
    example:
      'В этой статье мы рассмотрим, как интегрировать Prisma в NestJS...',
    description: 'Содержание статьи',
  })
  content!: string;

  @ApiProperty({
    example: false,
    description: 'Флаг публичности статьи',
  })
  isPublic!: boolean;

  @ApiProperty({
    example: 'a22acc89-9d08-4e26-b9c1-9cfdcf8cdfa9',
    description: 'ID автора статьи',
  })
  authorId!: string;

  @ApiProperty({
    example: '2025-03-05T00:46:24.282Z',
    description: 'Дата и время создания статьи',
  })
  createdAt!: string;

  @ApiProperty({
    example: ['Backend', 'IT'],
    description: 'Теги статьи',
    type: [String],
    required: false,
  })
  tags?: string[];
}