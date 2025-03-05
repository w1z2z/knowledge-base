import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../database/prisma.service';
import { CreateArticleResponseDto } from './dto/create-article-response.dto';
import { Prisma } from '@prisma/client';
import { FindOneDto } from './dto/find-one.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createArticleDto: CreateArticleDto,
    userId: string,
  ): Promise<CreateArticleResponseDto> {
    return this.prismaService.$transaction(async (prisma) => {
      const tags = createArticleDto.tags || [];
      const article = await prisma.article.create({
        data: {
          title: createArticleDto.title,
          content: createArticleDto.content,
          isPublic: createArticleDto.isPublic,
          authorId: userId,
          tags: {
            create: tags.map((tagName) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName },
                },
              },
            })),
          },
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return {
        ...article,
        createdAt: article.createdAt.toISOString(),
        tags: article.tags.map((t) => t.tag.name),
      };
    });
  }

  async findAll(tags: string[] = [], isPublic?: boolean) {
    const normalizedTags = tags
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    const where: Prisma.ArticleWhereInput = {
      // @ts-ignore
      AND: [
        isPublic !== undefined ? { isPublic } : {},

        normalizedTags.length > 0 ? { tags: { some: {} } } : {},

        ...normalizedTags.map((tag) => ({
          tags: {
            some: {
              tag: {
                name: {
                  equals: tag,
                  mode: 'insensitive',
                },
              },
            },
          },
        })),
      ].filter((condition) => condition !== undefined),
    };

    const articles = await this.prismaService.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        isPublic: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    console.log(articles.length);

    return articles.map((article) => ({
      ...article,
      createdAt: article.createdAt.toISOString(),
      tags: article.tags.map((t) => t.tag.name),
    }));
  }

  async findOne(id: string, isPublic?: boolean): Promise<FindOneDto> {
    const article = await this.prismaService.article.findUnique({
      where: {
        id,
        ...(isPublic !== undefined && { isPublic }),
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!article) {
      throw new HttpException('Статья не найдена!', HttpStatus.NOT_FOUND);
    }

    return {
      ...article,
      createdAt: article.createdAt.toISOString(),
      tags: article.tags.map((t) => t.tag.name),
    };
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    userId: string,
  ): Promise<UpdateArticleDto> {
    const article = await this.prismaService.article.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
    if (!article) throw new NotFoundException('Article not found');
    if (article.authorId !== userId) throw new ForbiddenException();

    const tags = updateArticleDto.tags || [];

    const result = await this.prismaService.article.update({
      where: { id },
      data: {
        title: updateArticleDto.title ?? article.title,
        content: updateArticleDto.content ?? article.content,
        isPublic: updateArticleDto.isPublic ?? article.isPublic,
        tags: {
          deleteMany: {
            articleId: id,
          },
          create: await Promise.all(
            tags.map(async (tagName) => {
              const tag = await this.prismaService.tag.upsert({
                where: { name: tagName },
                create: { name: tagName },
                update: {},
              });
              return { tagId: tag.id };
            }),
          ),
        },
      },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });

    return {
      ...result,
      createdAt: result.createdAt.toISOString(),
      tags: result.tags.map((t) => t.tag.name),
    };
  }

  async remove(id: string, userId: string) {
    const article = await this.prismaService.article.findUnique({
      where: { id },
      include: { tags: true }, // Включаем теги, чтобы потом вернуть удалённую статью
    });

    if (!article) {
      throw new HttpException('Статья не найдена!', HttpStatus.NOT_FOUND);
    }

    if (article.authorId !== userId) {
      throw new HttpException(
        'Вы не являетесь автором статьи!',
        HttpStatus.FORBIDDEN,
      );
    }

    const [, deletedArticle] = await this.prismaService.$transaction([
      this.prismaService.articleTag.deleteMany({
        where: { articleId: id },
      }),
      this.prismaService.article.delete({
        where: { id },
        include: { tags: true },
      }),
    ]);

    return deletedArticle;
  }
}
