// useImageHandler.js
// Custom hook for managing image uploads, preview generation, page assignment, and cleanup.
// Introduced in v0.1.1 ("Image Uploader Complete") to encapsulate logic for handling 
// Used in the DPCI Extractor App to provide drag-and-drop-ready image handling.

import { useState } from 'react';

/**
 * useImageHandler
 * Manages uploaded image state, including file input, preview URL creation,
 * page number assignment, cleanup, and drag-based reordering.
 *
 * @param {Function} onImagesReady - Callback to send updated image list (with page numbers) to parent
 * @returns {Object} Image state and handlers
 */
const useImageHandler = (onImagesReady) => {
  const [images, setImages] = useState([]);

  /**
   * Handles new file uploads from <input type="file" />
   * - Prevents duplicate uploads
   * - Assigns sequential page numbers
   * - Creates local preview URLs
   */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    e.target.value = null; // Allow re-uploading the same file

    const newImageData = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prevImages) => {
      const existingKeys = new Set(
        prevImages.map((img) => `${img.file.name}_${img.file.size}`)
      );

      // Only keep files that aren’t duplicates
      const uniqueNew = newImageData.filter(
        (img) => !existingKeys.has(`${img.file.name}_${img.file.size}`)
      );

      // Revoke previews for duplicates (cleanup)
      newImageData
        .filter((img) => existingKeys.has(`${img.file.name}_${img.file.size}`))
        .forEach((dup) => URL.revokeObjectURL(dup.previewUrl));

      // Merge and assign page numbers
      const updatedList = [...prevImages, ...uniqueNew].map((img, idx) => ({
        ...img,
        pageNumber: idx + 1,
      }));

      onImagesReady(updatedList);
      return updatedList;
    });
  };

  /**
   * Removes a single image by index.
   * Cleans up preview URL and updates page numbers.
   */
  const handleRemoveImage = (index) => {
    const updated = [...images];
    const [removed] = updated.splice(index, 1);

    if (removed) {
      URL.revokeObjectURL(removed.previewUrl);
    }

    const reindexed = updated.map((img, idx) => ({
      ...img,
      pageNumber: idx + 1,
    }));

    setImages(reindexed);
    onImagesReady(reindexed);
  };

  /**
   * Clears all images and revokes preview URLs.
   */
  const handleClear = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    onImagesReady([]);
  };

  /**
   * Safe setter for images.
   * Ensures correct page ordering and notifies parent component.
   * Used for drag-and-drop reordering via setImages prop.
   */
  const safeSetImages = (newImages) => {
    const updatedList = newImages.map((img, idx) => ({
      ...img,
      pageNumber: idx + 1,
    }));
    setImages(updatedList);
    onImagesReady(updatedList);
  };

  return {
    images,
    setImages: safeSetImages,
    handleFileChange,
    handleRemoveImage,
    handleClear,
  };
};

export default useImageHandler;
