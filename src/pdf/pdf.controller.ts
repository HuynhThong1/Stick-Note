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

  @Post('cut-pdf-from-coordinates')
  @ApiOperation({ 
    summary: 'Cắt PDF từ tọa độ x, y',
    description: 'Upload file PDF và chỉ định tọa độ x, y. Tọa độ y được tính là tổng chiều cao của tất cả các trang từ đầu đến trang chứa tọa độ. API sẽ cắt PDF từ tọa độ đó, chỉ giữ lại các trang phía dưới tọa độ.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File PDF và thông tin cắt theo tọa độ',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File PDF cần cắt'
        },
        x: {
          type: 'number',
          description: 'Tọa độ X góc trái trên (tính từ góc trái trên của trang)',
          example: 100
        },
        y: {
          type: 'number',
          description: 'Tọa độ Y (tổng chiều cao của tất cả trang từ đầu đến trang chứa tọa độ)',
          example: 1200
        },
        fileName: {
          type: 'string',
          description: 'Tên file PDF sau khi cắt',
          example: 'cut-from-coordinates.pdf'
        }
      },
      required: ['file', 'x', 'y']
    }
  })
  @ApiResponse({
    status: 200,
    description: 'File PDF đã được cắt từ tọa độ thành công',
    content: {
      'application/pdf': {
        schema: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Lỗi: Không có file được upload, tọa độ không hợp lệ hoặc dữ liệu không đúng'
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async cutPdfFromCoordinates(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const x = parseFloat(body.x);
    const y = parseFloat(body.y);
    const fileName = body.fileName || 'cut-from-coordinates.pdf';

    try {
      // Cắt PDF từ tọa độ sử dụng PdfService
      const croppedPdf = await this.pdfService.cutPdfFromCoordinates(
        file.buffer,
        x,
        y,
      );
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      return res.send(croppedPdf);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : String(error));
    }
  }
}