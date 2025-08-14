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
}