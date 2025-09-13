
export const SUPPORTED_FORMATS = {
  display: "DOCX, TXT files",
  accept: ".docx,.txt",
  mimeTypes: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ],
  extensions: ["docx", "txt"],
  description: "Upload your resume in Word (DOCX) or text (TXT) format",
  maxSizeMB: 10,
  errorMessage: "Only DOCX and TXT files are supported"
};
