
import mammoth from 'mammoth';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

interface ParsedContent {
  content: string;
  wordCount: number;
  isValid: boolean;
}

class DocumentParser {
  async extractText(filePath: string, mimeType: string): Promise<ParsedContent> {
    switch (mimeType) {
      case 'application/pdf':
        return await this.extractFromPDF(filePath);
        
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await this.extractFromDOCX(filePath);
        
      case 'text/plain':
        return await this.extractFromTXT(filePath);
        
      default:
        throw new Error('Unsupported file format');
    }
  }
  
  async extractFromDOCX(filePath: string): Promise<ParsedContent> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      const content = result.value;
      return {
        content: content,
        wordCount: content.split(/\s+/).length,
        isValid: content.length > 100
      };
    } catch (error) {
      throw new Error(`Failed to extract DOCX content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async extractFromTXT(filePath: string): Promise<ParsedContent> {
    try {
      const content = await readFile(filePath, 'utf-8');
      return {
        content: content,
        wordCount: content.split(/\s+/).length,
        isValid: content.length > 50
      };
    } catch (error) {
      throw new Error(`Failed to read TXT file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async extractFromPDF(filePath: string): Promise<ParsedContent> {
    // Use existing PDF extraction logic from pdf_extractor.py
    try {
      const { spawn } = require('child_process');
      
      return new Promise((resolve, reject) => {
        const python = spawn('python3', ['pdf_extractor.py', filePath]);
        let output = '';
        let error = '';
        
        python.stdout.on('data', (data: Buffer) => {
          output += data.toString();
        });
        
        python.stderr.on('data', (data: Buffer) => {
          error += data.toString();
        });
        
        python.on('close', (code: number) => {
          if (code !== 0) {
            reject(new Error(`PDF extraction failed: ${error}`));
          } else {
            const content = output.trim();
            resolve({
              content: content,
              wordCount: content.split(/\s+/).length,
              isValid: content.length > 100
            });
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to extract PDF content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new DocumentParser();
