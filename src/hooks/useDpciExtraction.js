// useDpciExtraction.js
// Custom hook to handle OCR extraction from uploaded images.
// Sends images one-by-one to the backend, tracks progress, and collects DPCI results.

import { extractTextFromImage } from '../services/ocrService';

/**
 * useDpciExtraction
 * Provides a function to extract DPCI numbers from uploaded images using OCR.
 * Handles per-image progress tracking and page-based grouping.
 *
 * @returns {{ extractFromImages: Function }}
 */
export const useDpciExtraction = () => {
  /**
   * extractFromImages
   * Iterates over each image, calls backend OCR endpoint, and maps results to page numbers.
   *
   * @param {Object[]} images - Array of image objects with `.file` and `.pageNumber`.
   * @param {Function} setProcessingStatus - Updates loading/progress state per page.
   * @param {Function} setDpciResults - Stores OCR results as [{ page, dpciList }].
   */
  const extractFromImages = async (images, setProcessingStatus, setDpciResults) => {
    if (!images || images.length === 0) return;

    const total = images.length;

    for (let i = 0; i < total; i++) {
      const img = images[i];
      const page = img.pageNumber;

      // 🔄 Mark this page as loading with progress
      setProcessingStatus(prev => ({
        ...prev,
        [page]: {
          loading: true,
          progress: Math.round(((i + 1) / total) * 100),
        },
      }));

      try {
        // 🧠 Perform OCR on this single image
        const matches = await extractTextFromImage(img.file);

        // ✅ Save results for this page
        setDpciResults(prev => [
          ...prev,
          {
            page,
            dpciList: Array.isArray(matches) ? matches : [],
            error: null,
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
      } catch (err) {
        console.error(`❌ OCR failed for page ${page}:`, err);

        // Mark this page as failed
        setProcessingStatus(prev => ({
          ...prev,
          [page]: {
            loading: false,
            progress: 0,
            error: true,
          },
        }));

        // Record an error entry for this page
        setDpciResults(prev => [
          ...prev,
          {
            page,
            dpciList: [],
            error: 'Extraction failed',
          },
        ]);
      }
    }
  };

  return { extractFromImages };
};
