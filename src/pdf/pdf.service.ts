import { Injectable } from '@nestjs/common';
import { AnnotationFactory, AnnotationIcon } from 'annotpdf';

/**
 * Service providing PDF annotation functionality. Uses the annotpdf library to
 * add a sticky note annotation to an existing PDF. The input is a Buffer
 * containing the PDF file, and the output is a Uint8Array containing the
 * modified PDF. All coordinates are expressed in PDF points and measured
 * from the bottom-left corner of the page.
 */
@Injectable()
export class PdfService {
  async addStickyNote(
    pdfBuffer: Buffer,
    page: number,
    x: number,
    y: number,
    width: number,
    height: number,
    noteText: string,
    author = 'System',
    fileName = 'annotated.pdf',
  ): Promise<Uint8Array> {
    // The annotpdf library accepts the document data as an Int8Array when
    // constructing a new AnnotationFactory.
    const data = new Uint8Array(pdfBuffer);
    const factory = new AnnotationFactory(data);
    // Create a text annotation (sticky note) at the specified location.
    factory.createTextAnnotation({
      page,
      rect: [x, y, x + width, y + height],
      contents: noteText,
      author,
      color: { r: 255, g: 255, b: 0 },
      icon: AnnotationIcon.Note,
      open: false,
      fileName,
    });
    // Return the modified PDF as a Uint8Array
    return factory.write();
  }

  async cutPdfFromCoordinates(pdfBuffer: Buffer, x: number, y: number): Promise<Buffer> {
    // Validation logic moved from controller
    if (isNaN(x) || isNaN(y)) {
      throw new Error('Coordinates must be valid numbers');
    }
    
    if (x < 0 || y < 0) {
      throw new Error('Coordinates must be positive numbers');
    }

    // Tìm trang chứa tọa độ
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer), useSystemFonts: true }).promise;
    let targetPage = -1;
    let cumulativeHeight = 0;
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const viewport = (await pdf.getPage(i)).getViewport({ scale: 1.0 });
      
      if (x < viewport.width && y >= cumulativeHeight && y < cumulativeHeight + viewport.height) {
        targetPage = i - 1;
        break;
      }
      cumulativeHeight += viewport.height;
    }
    
    if (targetPage === -1) {
      throw new Error(`No page found for coordinates (${x}, ${y}). Total height: ${cumulativeHeight}`);
    }

    if (targetPage === pdf.numPages - 1) {
      throw new Error(`No pages below coordinates (${x}, ${y}) on page ${targetPage}`);
    }

    // Tạo PDF mới với các trang sau trang đích
    const [pdfDoc, newPdf] = await Promise.all([PDFDocument.load(pdfBuffer), PDFDocument.create()]);
    const pagesToCopy = Array.from({ length: pdf.numPages - targetPage - 1 }, (_, i) => targetPage + 1 + i);
    const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
    
    copiedPages.forEach(page => newPdf.addPage(page));
    
    return Buffer.from(await newPdf.save());
  }
}