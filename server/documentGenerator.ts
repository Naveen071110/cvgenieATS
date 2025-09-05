
// PDF imports removed
import officegen from 'officegen';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);

interface ExportFiles {
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

  // generatePDF function removed as requested
  
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
    formats: string[] = ['docx']
  ): Promise<ExportFiles> {
    const tempDir = await this.ensureTempDir();
    const outputs: ExportFiles = {};
    
    try {
      // PDF generation removed as requested
      
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
