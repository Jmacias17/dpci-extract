import React from 'react';
import { Card } from 'react-bootstrap';

const ImagePreview = ({ image, index }) => {
  return (
    <Card className="shadow-sm">
      <Card.Img
        variant="top"
        src={image.previewUrl}
        alt={`Image ${index + 1}`}
        style={{ height: '160px', objectFit: 'cover' }}
      />
      <Card.Body className="text-center py-2">
        <strong>Page: {index + 1}</strong>
      </Card.Body>
    </Card>
  );
};

export default ImagePreview;
