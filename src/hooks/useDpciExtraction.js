// useDpciExtraction.js
// Custom hook to handle OCR extraction from uploaded images.
// Sends images one-by-one to the backend, tracks progress, and collects DPCI results.

import { extractTextFromImage } from '../services/ocrService';

/**
 * useDpciExtraction
 * Provides a function to extract DPCI numbers from uploaded images using OCR.
 * Handles per-image progress tracking and page-based grouping.
 *
 * @returns {Object} extractFromImages - Function to run OCR on all images
 */
export const useDpciExtraction = () => {
  /**
   * extractFromImages
   * Iterates over each image, extracts DPCI list, and maps results to page numbers.
   *
   * @param {Object[]} images - Array of image objects with `.file` and `.pageNumber`
   * @param {Function} setProcessingStatus - Callback to update loading/progress state per page
   * @param {Function} setDpciResults - Callback to store OCR results [{ page, dpciList }]
   */
  const extractFromImages = async (images, setProcessingStatus, setDpciResults) => {
    const total = images.length;

    for (let i = 0; i < total; i++) {
      const img = images[i];
      const page = img.pageNumber;

      // 🔄 Mark this page as loading
      setProcessingStatus(prev => ({
        ...prev,
        [page]: {
          loading: true,
          progress: Math.round(((i + 1) / total) * 100),
        },
      }));

      // 🧠 Perform OCR
      const matches = await extractTextFromImage(img.file); // should return an array of dpci strings

      // ✅ Save results for this page
      setDpciResults(prev => [
        ...prev,
        {
          page,
          dpciList: matches || [], // ensure safe fallback
          error: matches.error || null,
        },
      ]);

      // ✅ Mark this page as complete
      setProcessingStatus(prev => ({
        ...prev,
        [page]: {
          loading: false,
          progress: 100,
        },
      }));
    }
  };

  return { extractFromImages };
};
