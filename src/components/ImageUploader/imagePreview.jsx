// ImagePreview.js
// A reusable component that renders a preview card for an uploaded image,
// with a delete button and page number label.
// Part of the v0.1.1 "Image Uploader Complete" milestone for the DPCI Extractor App.
import React from 'react';
import { Card, Button } from 'react-bootstrap';

/**
 * @component ImagePreview
 * @description Renders an individual image preview card with delete functionality.
 * @param {Function} handleRemoveImage - Callback function to remove the image at a specific index.
 * @param {Object} image - Image object that includes a previewUrl key.
 * @param {number} index - Position of the image in the uploaded list.
 */
const ImagePreview = ({ handleRemoveImage, image, index }) => {
  return (
    // Display uploaded image in a styled Bootstrap card with shadow for visual depth
    <Card className="shadow-sm">
      <Card.Header>
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleRemoveImage(index)}
        >
          Delete
        </Button>
      </Card.Header>

      <Card.Img
        variant="top"
        src={image.previewUrl}
        alt={`Image ${index + 1}`}
        // Fixed height for consistent layout; 'cover' ensures full fill while maintaining aspect ratio
        style={{ height: '160px', objectFit: 'cover' }}
      />

      <Card.Body className="text-center py-2">
        {/* Display image page number starting from 1 */}
        <strong>Page: {index + 1}</strong>
      </Card.Body>
    </Card>
  );
};

export default ImagePreview;
