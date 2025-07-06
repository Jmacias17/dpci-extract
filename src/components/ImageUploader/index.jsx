import React from 'react';
import { Form, Button } from 'react-bootstrap';
import useImageHandler from './useImageHandler';
import ImagePreviewGrid from './ImagePreviewGrid';

/**
 * ImageUploader Component
 * Handles image input, preview display, and drag-and-drop reordering.
 */
const ImageUploader = ({ onImagesReady }) => {
  const {
    images,
    handleFileChange,
    handlePageChange,
    handleRemoveImage,
    handleClear,
    setImages, // You'll need this for ImagePreviewGrid
  } = useImageHandler(onImagesReady);

  return (
    <Form className="text-center mb-4">
      <Form.Group controlId="imageUpload" className="mb-3">
        <Form.Label className="fw-bold">Upload or Capture Images</Form.Label>
        <Form.Control
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <Form.Text className='p-2' muted>Accepted formats: .jpg, .png</Form.Text>
      </Form.Group>

      {images.length > 0 && (
        <>
          <h5 className="mt-4">🖼️ Previews & Page Numbers</h5>
          <ImagePreviewGrid handleRemoveImage={handleRemoveImage} images={images} setImages={setImages} />

          <div className="mt-3 text-center">
            <Button
              variant="danger"
              size="sm"
              onClick={handleClear}
            >
              Clear All
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default ImageUploader;
