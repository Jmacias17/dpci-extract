// useImageHandler.js
import { useState } from 'react';

/**
 * useImageHandler
 * Custom hook for managing image upload, preview generation, and page ordering.
 * 
 * @param {Function} onImagesReady - Callback to send updated image list to parent
 * @returns {Object} handlers and image state
 */
const useImageHandler = (onImagesReady) => {
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    // Revoke existing previews
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));

    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      pageNumber: index + 1,
    }));

    setImages(newImages);
    onImagesReady(newImages);
  };

  const handleClear = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl)); // Clean up object URLs
    setImages([]);
    onImagesReady([]);
  };

  /**
   * Removes a single image by index.
   * Revokes its object URL and updates state.
   */
  const handleRemoveImage = (index) => {
    const updated = [...images];
    const [removed] = updated.splice(index, 1);

    if (removed) {
      URL.revokeObjectURL(removed.previewUrl);
    }

    setImages(updated);
    onImagesReady(updated);
  };

  return {
    images,
    setImages, // (optional) exposed for direct control if needed
    handleFileChange,
    handleClear,
    handleRemoveImage, // <- new function
  };
};

export default useImageHandler;
