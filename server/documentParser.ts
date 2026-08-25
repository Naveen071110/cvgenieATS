// ============================================================
// CRITICAL — DO NOT MODIFY THIS FILE WITHOUT EXPLICIT INSTRUCTION
// This file handles resume file parsing (PDF, DOCX, TXT uploads).
// It extracts plain text from uploaded resumes before AI generation.
// Changes here can break the file upload flow for all users.
// Any edits must be tested end-to-end before deploying.
// ============================================================

import mammoth from 'mammoth';
import fs from 'fs';
import { promisify } from 'util';
import PDFParser from 'pdf2json';

const readFile = promisify(fs.readFile);

interface ParsedContent {
  content: string;
  wordCount: number;
  isValid: boolean;
}

class DocumentParser {
  // Main file parsing dispatcher. Routes uploaded files to the correct extractor.
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
  
  // DOCX text extraction. Used for all .docx resume uploads.
  async extractFromDOCX(filePath: string): Promise<ParsedContent> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      const content = result.value;
      return {
        content: content,
        wordCount: content.split(/\s+/).filter(Boolean).length,
        isValid: content.length > 50
      };
    } catch (error) {
      throw new Error(`Failed to extract DOCX content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // TXT text extraction. Used for all .txt resume uploads.
  async extractFromTXT(filePath: string): Promise<ParsedContent> {
    try {
      const content = await readFile(filePath, 'utf-8');
      return {
        content: content,
        wordCount: content.split(/\s+/).filter(Boolean).length,
        isValid: content.length > 50
      };
    } catch (error) {
      throw new Error(`Failed to read TXT file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // PDF text extraction using pure Node.js (pdf2json) for reliable cross-platform execution.
  async extractFromPDF(filePath: string): Promise<ParsedContent> {
    try {
      return await new Promise<ParsedContent>((resolve, reject) => {
        const pdfParser = new (PDFParser as any)(null, 1);

        pdfParser.on("pdfParser_dataError", (errData: any) => {
          reject(new Error(`PDF extraction failed: ${errData.parserError || JSON.stringify(errData)}`));
        });

        pdfParser.on("pdfParser_dataReady", () => {
          try {
            const raw = pdfParser.getRawTextContent() || "";
            // Clean up page break markers and trailing whitespace
            const cleanContent = raw
              .replace(/----------------Page \(\d+\) Break----------------/g, "\n")
              .replace(/\r\n/g, "\n")
              .trim();

            resolve({
              content: cleanContent,
              wordCount: cleanContent.split(/\s+/).filter(Boolean).length,
              isValid: cleanContent.length > 50
            });
          } catch (e) {
            reject(e);
          }
        });

        pdfParser.loadPDF(filePath);
      });
    } catch (error) {
      throw new Error(`Failed to extract PDF content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new DocumentParser();
