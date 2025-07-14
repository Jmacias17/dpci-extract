// ImagePreview.jsx
// A reusable card component that displays an uploaded image preview,
// shows its current page number, and optionally includes a delete button.
// Part of the v0.1.1 "Image Uploader Complete" milestone for the DPCI Extractor App.

import React from 'react';
import { Card, Button } from 'react-bootstrap';

/**
 * @component ImagePreview
 * @description Displays a single image card with its preview, page number, and delete button.
 * @param {Object} props
 * @param {boolean} props.isDraggable - Whether image can be reordered (enables delete button).
 * @param {Function} props.handleRemoveImage - Function to remove image by index.
 * @param {Object} props.image - Image object (must include previewUrl and pageNumber).
 * @param {number} props.index - Position of the image in the array (used only for removal).
 */
const ImagePreview = ({ isDraggable, handleRemoveImage, image, index }) => {
  return (
    <Card className="shadow-sm">
      {/* Header with delete button (only when draggable) */}
      <Card.Header>
        {isDraggable && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleRemoveImage(index)}
          >
            Delete
          </Button>
        )}
      </Card.Header>

      {/* Image preview with consistent sizing */}
      <Card.Img
        variant="top"
        src={image.previewUrl}
        alt={`Uploaded preview ${image.pageNumber}`}
        style={{ height: '160px', objectFit: 'cover' }}
      />

      {/* Footer with current page number */}
      <Card.Body className="text-center py-2">
        <strong>Page: {image.pageNumber}</strong>
      </Card.Body>
    </Card>
  );
};

export default ImagePreview;
