// useImageHandler.js
// Custom React hook for managing image uploads, preview generation, and state cleanup.
// Introduced in v0.1.1 ("Image Uploader Complete") to encapsulate logic for handling 
// file input, image preview URLs, clearing, and single-image removal in the DPCI Extractor App.
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
    const files = Array.from(e.target.files);
    e.target.value = null; // <-- resets input for repeat uploads

    const newImageData = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prevImages) => {
      // Build a Set of existing identifiers
      const existingKeys = new Set(prevImages.map((img) => `${img.file.name}_${img.file.size}`));

      // Filter new images to only include truly new files
      const filteredNew = newImageData.filter(
        (img) => !existingKeys.has(`${img.file.name}_${img.file.size}`)
      );

      // Set page numbers sequentially
      const updatedList = [...prevImages, ...filteredNew].map((img, idx) => ({
        ...img,
        pageNumber: idx + 1,
      }));

      // Revoke previews of duplicates (if any)
      newImageData
        .filter((img) => existingKeys.has(`${img.file.name}_${img.file.size}`))
        .forEach((dup) => URL.revokeObjectURL(dup.previewUrl));

      onImagesReady(updatedList);
      return updatedList;
    });
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
