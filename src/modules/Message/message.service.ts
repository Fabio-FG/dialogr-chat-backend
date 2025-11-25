import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { CreateMessageInput } from './dto/create-message.input';
import { pubSub } from 'src/pubsub';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  findAll() {
    return this.messageRepo.find({
      order: { createdAt: 'ASC' },
    });
  }

  async create(input: CreateMessageInput): Promise<Message> {
    const message = this.messageRepo.create(input);
    const savedMessage = await this.messageRepo.save(message);

    console.log({ message, savedMessage });

    const res = await pubSub.publish('message added', {
      messageAdded: savedMessage,
    });
    console.log('res', res);

    return savedMessage;
  }

  getPubSub() {
    console.log({ pubSub });
    return pubSub;
  }
}
