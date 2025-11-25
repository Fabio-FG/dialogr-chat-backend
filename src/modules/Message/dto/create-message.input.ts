import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  senderId: string;

  @Field()
  receiverId: string;

  @Field()
  content: string;
}
