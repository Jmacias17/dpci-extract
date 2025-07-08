// ocrService.js
// Handles OCR using Tesseract.js with tuned options for better DPCI-style detection

import Tesseract from 'tesseract.js';
import { preprocessImage } from './preprocessImage.js';

export const extractTextFromImage = async (file) => {
  const processedBlob = await file;

  const { data } = await Tesseract.recognize(processedBlob, 'eng', {
    logger: (m) => console.log(m),
    tessedit_char_whitelist: '0123456789- ', // Focus on number formats like ###-##-####
    tessedit_pageseg_mode: 6, // Assume a single uniform block of text
  });
  console.log(data.text)

  return data.text;
};


export const extractFormattedNumbers = (text) => {
  const regex = /(?:\d{3}-\d{2}-\d{4})|(?:\d{4} \d{2} \d{4})|(?:\d{4}-\d{2}-\d{4})/g;
  return text.match(regex) || [];
};