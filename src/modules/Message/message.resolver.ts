import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { CreateMessageInput } from './dto/create-message.input';
import { pubSub } from 'src/pubsub';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [Message])
  messages() {
    return this.messageService.findAll();
  }

  @Mutation(() => Message)
  sendMessage(@Args('input') input: CreateMessageInput) {
    return this.messageService.create(input);
  }

  @Subscription(() => Message, {
    resolve: (payload: Record<any, Message>) => payload.messageAdded,
  })
  messageAdded() {
    return pubSub.asyncIterableIterator('message added');
  }
}
