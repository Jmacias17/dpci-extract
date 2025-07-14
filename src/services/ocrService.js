// services/ocrService.js
// Client-side service for sending an image to the backend OCR API and extracting DPCI numbers.

/**
 * extractTextFromImage
 * Sends an image file to the backend OCR endpoint and retrieves extracted DPCI numbers.
 *
 * @param {File} file - An image file (from input or drag/drop)
 * @returns {Promise<string[]>} - Array of extracted DPCI strings (e.g. ['123-45-6789'])
 */
export const extractTextFromImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://localhost:5000/extract-dpcis', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OCR request failed with status ${response.status}`);
    }

    const data = await response.json();

    console.log('🧠 OCR Response:', data);

    // Return an array of DPCI strings, or an empty array if none found
    return Array.isArray(data.dpci_list) ? data.dpci_list : [];

  } catch (error) {
    console.error('❌ Error extracting text from image:', error);
    return []; // Return empty list on error to avoid breaking the app
  }
};
