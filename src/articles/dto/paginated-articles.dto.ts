import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleDto } from './article.dto';

export class PaginatedArticlesDto {
  @ApiProperty({
    description: 'Список статей',
    type: [ArticleDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleDto)
  articles!: ArticleDto[];

  @ApiProperty({
    example: 42,
    description: 'Общее количество статей',
  })
  @IsInt()
  total!: number;
}