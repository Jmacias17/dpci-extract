// ImageUploader.jsx
// Main upload interface for the DPCI Extractor App.
// Handles file input, displays preview cards, and supports optional drag-and-drop reordering.
// Introduced in v0.1.1 ("Image Uploader Complete") as the main upload interface 

import React from 'react';
import { Form, Button } from 'react-bootstrap';
import useImageHandler from './useImageHandler';
import ImagePreviewGrid from './ImagePreviewGrid';

/**
 * @component ImageUploader
 * @description Uploads image files, renders previews, and supports reordering if enabled.
 *
 * @param {Function} onImagesReady - Callback to return updated image list (with page numbers) to parent
 * @param {boolean} isDraggable - Whether drag-and-drop reordering is enabled
 */
const ImageUploader = ({ onImagesReady, isDraggable }) => {
  const {
    images,
    handleFileChange,
    handleRemoveImage,
    handleClear,
    setImages, // passed to preview grid for drag ordering
  } = useImageHandler(onImagesReady);

  return (
    <Form className="text-center mt-3">
      {/* 🔼 File Upload Section */}
      <Form.Group controlId="imageUpload" className="mb-3">
        <Form.Label className="fw-bold">Start By Uploading Images Below</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <Form.Text className="p-2" muted>
          Accepted formats: .jpg, .png
        </Form.Text>
      </Form.Group>

      {/* 🖼️ Previews & Controls */}
      {images.length > 0 && (
        <>
          <h5 className="mt-4">🖼️ Previews & Page Numbers</h5>
          <ImagePreviewGrid
            images={images}
            setImages={setImages}
            handleRemoveImage={handleRemoveImage}
            isDraggable={isDraggable}
          />

          {/* ❌ Clear All button (only when drag is enabled) */}
          {isDraggable && (
            <div className="mt-3">
              <Button variant="danger" size="sm" onClick={handleClear}>
                Clear All
              </Button>
            </div>
          )}
        </>
      )}
    </Form>
  );
};

export default ImageUploader;
