
import PDFDocument from 'pdfkit';
import officegen from 'officegen';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);

interface ExportFiles {
  resumePDF?: string;
  coverLetterPDF?: string;
  resumeDOCX?: string;
  coverLetterDOCX?: string;
}

class DocumentGenerator {
  private async ensureTempDir(): Promise<string> {
    const tempDir = path.join(process.cwd(), 'tmp');
    try {
      await mkdir(tempDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
    return tempDir;
  }

  async generatePDF(content: string, outputPath: string): Promise<string> {
    await this.ensureTempDir();
    
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        });
        
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);
        
        // Parse and format the content
        const lines = content.split('\n').filter(line => line.trim());
        let yPosition = 50;
        
        lines.forEach((line, index) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return;
          
          // Check if this looks like a header (all caps, short line, etc.)
          if (trimmedLine.length < 50 && (trimmedLine.toUpperCase() === trimmedLine || trimmedLine.includes(':'))) {
            doc.fontSize(14).font('Helvetica-Bold');
          } else {
            doc.fontSize(11).font('Helvetica');
          }
          
          // Add some spacing before sections
          if (trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length < 50 && index > 0) {
            yPosition += 10;
          }
          
          doc.text(trimmedLine, 50, yPosition, {
            width: 500,
            align: 'left'
          });
          
          yPosition += doc.heightOfString(trimmedLine, { width: 500 }) + 5;
          
          // Add page if needed
          if (yPosition > 750) {
            doc.addPage();
            yPosition = 50;
          }
        });
        
        doc.end();
        
        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async generateDOCX(content: string, outputPath: string): Promise<string> {
    await this.ensureTempDir();
    
    return new Promise((resolve, reject) => {
      try {
        const docx = officegen('docx');
        
        // Split content into paragraphs and format
        const lines = content.split('\n').filter(line => line.trim());
        
        lines.forEach(line => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return;
          
          const pObj = docx.createP();
          
          // Check if this looks like a header
          if (trimmedLine.length < 50 && (trimmedLine.toUpperCase() === trimmedLine || trimmedLine.includes(':'))) {
            pObj.addText(trimmedLine, { bold: true, font_size: 14 });
          } else {
            pObj.addText(trimmedLine, { font_size: 11 });
          }
        });
        
        const out = fs.createWriteStream(outputPath);
        
        out.on('error', reject);
        out.on('close', () => resolve(outputPath));
        
        docx.generate(out);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async generateMultipleFormats(
    resumeContent: string, 
    coverLetterContent: string, 
    baseFilename: string,
    formats: string[] = ['pdf', 'docx']
  ): Promise<ExportFiles> {
    const tempDir = await this.ensureTempDir();
    const outputs: ExportFiles = {};
    
    try {
      if (formats.includes('pdf')) {
        outputs.resumePDF = await this.generatePDF(
          resumeContent, 
          path.join(tempDir, `${baseFilename}_resume.pdf`)
        );
        outputs.coverLetterPDF = await this.generatePDF(
          coverLetterContent, 
          path.join(tempDir, `${baseFilename}_cover_letter.pdf`)
        );
      }
      
      if (formats.includes('docx')) {
        outputs.resumeDOCX = await this.generateDOCX(
          resumeContent, 
          path.join(tempDir, `${baseFilename}_resume.docx`)
        );
        outputs.coverLetterDOCX = await this.generateDOCX(
          coverLetterContent, 
          path.join(tempDir, `${baseFilename}_cover_letter.docx`)
        );
      }
      
      return outputs;
    } catch (error) {
      throw new Error(`Failed to generate documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new DocumentGenerator();
