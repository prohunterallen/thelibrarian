import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as serveStatic from 'serve-static';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve static files from the 'uploads' directory
  app.use('/contents', serveStatic(join(__dirname, '..', 'contents')));

  // Other configurations, such as setting a global prefix or enabling CORS
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
