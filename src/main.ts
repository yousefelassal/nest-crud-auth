import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000).then(() => {
    console.log(`Server is running on http://localhost:3000`);
  });
}
bootstrap();
