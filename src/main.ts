import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS so you can call this API from your HTML/JS client
  app.enableCors();
  
  // Cấu hình Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('PDF Annotation API')
    .setDescription('API để thêm sticky note và cắt PDF theo tọa độ')
    .setVersion('1.0')
    .addTag('pdf')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
  console.log(`Server is running on http://localhost:3000`);
  console.log(`Swagger API Documentation available at http://localhost:3000/api`);
}

bootstrap().catch((err) => {
  console.error('Error starting Nest application', err);
});