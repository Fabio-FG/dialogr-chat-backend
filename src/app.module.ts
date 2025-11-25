import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';

import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './modules/Message/message.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/User/user.module';

@Module({
  imports: [
    /* DB config */
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: config.get<number>('POSTGRES_PORT'),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),

    /* GraphQL config */
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
        'subscriptions-transport-ws': false,
      },
      introspection: true,
      installSubscriptionHandlers: true,
      playground: true, //for now
    }),
    MessageModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
