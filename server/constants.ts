
export const FILE_ERROR_MESSAGES = {
  INVALID_TYPE: 'Please upload PDF, DOCX, or TXT files only',
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  EXTRACTION_FAILED: 'Could not read file content. Please ensure the file is not corrupted',
  NO_CONTENT: 'File appears to be empty or unreadable',
  GENERATION_FAILED: 'Failed to generate documents. Please try again'
};

export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

export const FILE_EXTENSIONS = {
  pdf: '.pdf',
  docx: '.docx',
  txt: '.txt'
};
/**
 * Generation speed configuration
 * Pro users: Instant generation (no delay)
 * Free users: Artificial delay to demonstrate Pro value
 */
export const GENERATION_SPEED = {
  FREE_USER_DELAY_MS: 4000, // 4 seconds delay for Free users
  PRO_USER_DELAY_MS: 0,     // No delay for Pro users
} as const;
