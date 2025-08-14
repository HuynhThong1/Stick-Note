import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as multer from 'multer';
import { PdfService } from './pdf.service';

/**
 * Controller for handling PDF annotation requests. Exposes a single POST
 * endpoint that accepts a PDF file and annotation metadata and returns
 * the annotated PDF. The request must be multipart/form-data. The file
 * input field should be named `file` and other fields should include:
 *   - page: number (0-based index)
 *   - x: number (lower-left x coordinate in points)
 *   - y: number (lower-left y coordinate in points)
 *   - width: number (width of the annotation)
 *   - height: number (height of the annotation)
 *   - noteText: string (contents of the sticky note)
 *   - author: string (optional author name)
 */
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('annotate-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async annotateUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const page = parseInt(body.page, 10) || 0;
    const x = parseFloat(body.x) || 0;
    const y = parseFloat(body.y) || 0;
    const width = parseFloat(body.width) || 30;
    const height = parseFloat(body.height) || 30;
    const noteText = body.noteText || 'Important note';
    const author = body.author || 'System';
    const fileName = body.fileName || 'annotated.pdf';
    // Annotate the PDF using the PdfService
    const updatedPdf = await this.pdfService.addStickyNote(
      file.buffer,
      page,
      x,
      y,
      width,
      height,
      noteText,
      author,
      fileName,
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(Buffer.from(updatedPdf));
  }
}