import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge-base.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomRequest } from '../auth/types/custom-request';

@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createKnowledgeBaseDto: CreateKnowledgeBaseDto,
    @Req() req: CustomRequest,
  ) {
    return this.knowledgeBaseService.create(
      createKnowledgeBaseDto,
      req.user.id,
    );
  }

  @Get()
  findAll() {
    return this.knowledgeBaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.knowledgeBaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKnowledgeBaseDto: UpdateKnowledgeBaseDto) {
    return this.knowledgeBaseService.update(+id, updateKnowledgeBaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.knowledgeBaseService.remove(+id);
  }
}
