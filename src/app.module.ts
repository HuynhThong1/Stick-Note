import { Module } from '@nestjs/common';
import { PdfModule } from './pdf/pdf.module';
import { HealthController } from './health.controller';

@Module({
  imports: [PdfModule],
  controllers: [HealthController],
})
export class AppModule {}