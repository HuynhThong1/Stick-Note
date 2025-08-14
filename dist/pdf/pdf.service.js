"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const annotpdf_1 = require("annotpdf");
/**
 * Service providing PDF annotation functionality. Uses the annotpdf library to
 * add a sticky note annotation to an existing PDF. The input is a Buffer
 * containing the PDF file, and the output is a Uint8Array containing the
 * modified PDF. All coordinates are expressed in PDF points and measured
 * from the bottom-left corner of the page.
 */
let PdfService = class PdfService {
    async addStickyNote(pdfBuffer, page, x, y, width, height, noteText, author = 'System', fileName = 'annotated.pdf') {
        // The annotpdf library accepts the document data as an Int8Array when
        // constructing a new AnnotationFactory.
        const data = new Uint8Array(pdfBuffer);
        const factory = new annotpdf_1.AnnotationFactory(data);
        // Create a text annotation (sticky note) at the specified location.
        factory.createTextAnnotation({
            page,
            rect: [x, y, x + width, y + height],
            contents: noteText,
            author,
            color: { r: 255, g: 255, b: 0 },
            icon: annotpdf_1.AnnotationIcon.Note,
            open: false,
            fileName,
        });
        // Return the modified PDF as a Uint8Array
        return factory.write();
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map