
export const SUPPORTED_FORMATS = {
  display: "PDF, DOCX, TXT files",
  accept: ".pdf,.docx,.doc,.txt",
  mimeTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain"
  ],
  extensions: ["pdf", "docx", "doc", "txt"],
  description: "Upload your resume in PDF, Word (DOCX/DOC), or text (TXT) format",
  maxSizeMB: 10,
  errorMessage: "Only PDF, DOC, DOCX, and TXT files are supported"
};
