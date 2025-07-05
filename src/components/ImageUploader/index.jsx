//ImageUploader Component
// import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import useImageHandler from './useImageHandler';

const ImageUploader = ({ onImagesReady, }) => {
  const { images, handleFileChange, handlePageChange, handleClear } =
    useImageHandler(onImagesReady);

  return (
    <Form className="text-center mb-5">
      <Form.Group controlId="imageUpload" className="mb-3">
        <Form.Label className="fw-bold">📸 Upload or Capture Images</Form.Label>
        <Form.Control
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <Form.Text muted>Accepted formats: .jpg, .png</Form.Text>
      </Form.Group>

      {images.length > 0 && (
        <>
          <h5 className="mt-4">🖼️ Previews & Page Numbers</h5>

          <div className="mt-3">
            <Button variant="outline-danger" size="sm" onClick={handleClear}>
              Clear All
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default ImageUploader;
