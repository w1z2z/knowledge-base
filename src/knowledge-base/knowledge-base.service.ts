import { Injectable } from '@nestjs/common';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge-base.dto';

@Injectable()
export class KnowledgeBaseService {
  create(createKnowledgeBaseDto: CreateKnowledgeBaseDto, userId: string) {
    return { userId, createKnowledgeBaseDto };
  }

  findAll() {
    return `This action returns all knowledgeBase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} knowledgeBase`;
  }

  update(id: number, updateKnowledgeBaseDto: UpdateKnowledgeBaseDto) {
    return `This action updates a #${id} knowledgeBase`;
  }

  remove(id: number) {
    return `This action removes a #${id} knowledgeBase`;
  }
}
