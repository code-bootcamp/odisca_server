import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(graphqlUploadExpress());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
