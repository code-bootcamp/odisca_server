import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { StudyCafesModule } from './apis/studyCafes/studyCafes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointTransactionsModule } from './apis/pointTransactions/pointTransactions.module';
import { UsersModule } from './apis/users/users.module';
import { ReviewsModule } from './apis/reviews/reviews.module';
import { AuthModule } from './apis/auth/auth.module';
import { AdministersModule } from './apis/administers/administers.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { MailerModule } from '@nest-modules/mailer';
import { VisitModule } from './apis/visit/visit.module';
import { ImagesModule } from './apis/images/images.module';
import { FilesModule } from './apis/files/files.module';
import { SeatsModule } from './apis/seats/seats.module';
import { PaymentsModule } from './apis/payments/payment.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    AdministersModule,
    AuthModule,
    FilesModule,
    ImagesModule,
    PaymentsModule,
    PointTransactionsModule,
    SeatsModule,
    StudyCafesModule,
    UsersModule,
    ReviewsModule,
    MailerModule,
    VisitModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
      context: ({ req, res }) => ({
        req,
        res,
      }),
    }),
    TypeOrmModule.forRoot({
      type:
        process.env.DATABASE_TYPE === 'mysql'
          ? process.env.DATABASE_TYPE
          : 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register({
      // redis 어디에 저장할래?
      store: redisStore,
      // redis 주소(ip주소) // docker로 실행하는 경우 도커주소
      url: 'redis://wisc-redis:6379',
      // 전역에서 한번에 주입시키는 법
      isGlobal: true,
    }),
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
