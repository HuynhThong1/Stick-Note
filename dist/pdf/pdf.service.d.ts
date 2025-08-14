/**
 * Service providing PDF annotation functionality. Uses the annotpdf library to
 * add a sticky note annotation to an existing PDF. The input is a Buffer
 * containing the PDF file, and the output is a Uint8Array containing the
 * modified PDF. All coordinates are expressed in PDF points and measured
 * from the bottom-left corner of the page.
 */
export declare class PdfService {
    addStickyNote(pdfBuffer: Buffer, page: number, x: number, y: number, width: number, height: number, noteText: string, author?: string, fileName?: string): Promise<Uint8Array>;
}
