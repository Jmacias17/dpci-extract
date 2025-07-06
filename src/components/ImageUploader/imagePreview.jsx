import React from 'react';
import { Card, Button} from 'react-bootstrap';



const ImagePreview = ({handleRemoveImage, image, index }) => {
  return (
    // Card represents a Image Preview based on what is uploaded, Shadow for effect.
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
        style={{ height: '160px', objectFit: 'cover' }}
      />
      <Card.Body className="text-center py-2">
        <strong>Page: {index + 1}</strong>
      </Card.Body>
    </Card>
  );
};

export default ImagePreview;
