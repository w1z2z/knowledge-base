import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CustomRequest } from '../auth/types/custom-request';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateArticleResponseDto } from './dto/create-article-response.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import { FindOneDto } from './dto/find-one.dto';
import { PaginatedArticlesDto } from './dto/paginated-articles.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation, ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание новой статьи' })
  @ApiBody({ type: CreateArticleDto, description: 'Информация по статье' })
  @ApiResponse({ type: CreateArticleResponseDto, description: 'Новая статья' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: CustomRequest,
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<CreateArticleResponseDto> {
    return this.articlesService.create(createArticleDto, req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение списка статей' })
  @ApiQuery({
    name: 'tags',
    type: String,
    required: false,
    description:
      'Список тегов, разделенных запятыми (например: NestJS,Prisma,Backend)',
  })
  @ApiResponse({
    type: PaginatedArticlesDto,
    description: 'Список подходящих статей',
  })
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: CustomRequest,
    @Query('tags') tags?: string,
  ): Promise<PaginatedArticlesDto> {
    const tagsArray = tags ? tags.split(',').map((t) => t.trim()) : [];

    let isPublic;
    if (!req.user) {
      isPublic = true;
    }

    return this.articlesService.findAll(tagsArray, isPublic);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение статьи по ее идентификатору' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'Идентификатор статьи',
  })
  @ApiResponse({
    type: FindOneDto,
    description: 'Искомая статья',
  })
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(
    @Req() req: CustomRequest,
    @Param('id') id: string,
  ): Promise<FindOneDto> {
    const userIsAuthorized = req.user != null;
    let isPublic;

    if (!userIsAuthorized) {
      isPublic = true;
    }
    return this.articlesService.findOne(id, isPublic);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Редактирование статьи' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'Идентификатор статьи',
  })
  @ApiBody({ type: UpdateArticleDto, description: 'Информация по статье' })
  @ApiResponse({
    type: UpdateArticleDto,
    description: 'Искомая статья',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req: CustomRequest,
  ): Promise<UpdateArticleDto> {
    return this.articlesService.update(id, updateArticleDto, req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление статьи' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'Идентификатор статьи',
  })
  @ApiResponse({
    status: 200,
    description: 'Статья успешно удалена',
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: CustomRequest): Promise<string> {
    return this.articlesService.remove(id, req.user.id);
  }
}
