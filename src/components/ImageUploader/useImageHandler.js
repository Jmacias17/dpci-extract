import { useState } from 'react';

const useImageHandler = (onImagesReady) => {
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      pageNumber: images.length + index + 1,
    }));

    const updated = [...images, ...newImages];
    setImages(updated);
    onImagesReady(updated);
  };

  const handlePageChange = (index, value) => {
    const updated = [...images];
    updated[index].pageNumber = parseInt(value) || 1;
    setImages(updated);
    onImagesReady(updated);
  };

  const handleClear = () => {
    setImages([]);
    onImagesReady([]);
  };

  return {
    images,
    handleFileChange,
    handlePageChange,
    handleClear,
  };
};

export default useImageHandler;
