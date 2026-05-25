import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const extractTextFromUpload = async (filePath: string, mimeType: string) => {
  if (mimeType === 'application/pdf') {
    const buffer = await fs.readFile(filePath);
    const parsed = await pdfParse(buffer);
    return parsed.text.trim();
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    path.extname(filePath).toLowerCase() === '.docx'
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.trim();
  }

  return fs.readFile(filePath, 'utf8');
};
