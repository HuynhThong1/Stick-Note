import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS so you can call this API from your HTML/JS client
  app.enableCors();
  await app.listen(3000);
  console.log(`Server is running on http://localhost:3000`);
}

bootstrap().catch((err) => {
  console.error('Error starting Nest application', err);
});