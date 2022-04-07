import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { dataSource } from './data-source';

const port = 3000;

async function bootstrap() {
  // dataSource.initialize()
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(port);
  console.log('Your application running on :' + port);
}
bootstrap();
