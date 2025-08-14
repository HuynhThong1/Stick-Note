import { Response } from 'express';
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
export declare class PdfController {
    private readonly pdfService;
    constructor(pdfService: PdfService);
    annotateUpload(file: Express.Multer.File, body: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
