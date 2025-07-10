// services/ocrService.js

export const extractTextFromImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('http://localhost:5000/ocr', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.dpci; // This should be an array of DPCI strings
};

export const extractFormattedNumbers = (textArray) => {
  // Return as-is if already filtered by backend
  return textArray;
};