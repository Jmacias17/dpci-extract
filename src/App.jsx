import React, { useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import ImageUploader from './components/ImageUploader';
import ImagePreviewGrid from './components/ImageUploader/ImagePreviewGrid';

function App() {
  const [images, setImages] = useState([]);

  const handleImagesSelected = (files) => {
    const imageData = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages(imageData);
  };

  return (
    //Screen Full Size
    <div style={{ width: '100vw', height: '100vh' }}>
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to right, #cc0000, #ff1a1a)',
                boxSizing: 'border-box',
                overflowX: 'hidden',
                padding: '1rem'
            }}
        >
            <Card
                className="shadow"
                style={{
                width: '100%',
                maxWidth: '600px', // controls max width on desktop
                padding: '2rem',
                }}
            >
                <h2 className="text-center mb-4">📸 DPCI Extractor</h2>
                <ImageUploader onImagesReady={setImages} />
                {images.length > 0 && (
                <div className="mt-4">
                    <ImagePreviewGrid images={images} setImages={setImages} />
                </div>
                )}
            </Card>
        </div>
    </div>
  );
}

export default App;
