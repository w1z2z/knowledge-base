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

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: CustomRequest,
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<CreateArticleResponseDto> {
    return this.articlesService.create(createArticleDto, req.user.id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: CustomRequest,
    @Query('tags') tags?: string,
    @Query('isPublic') isPublic?: boolean,
  ) {
    const tagsArray = tags ? tags.split(',').map((t) => t.trim()) : [];

    let finalIsPublic = isPublic;
    if (!req.user) {
      finalIsPublic = true;
    }

    return this.articlesService.findAll(tagsArray, finalIsPublic);
  }

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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req: CustomRequest,
  ) {
    return this.articlesService.update(id, updateArticleDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.articlesService.remove(id, req.user.id);
  }
}
