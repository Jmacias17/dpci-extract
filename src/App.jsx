// App.jsx
// Main application entry point and layout wrapper.
// Introduced in v0.1.1 ("Image Uploader Complete") as the initial interface 
// for the DPCI Extractor App, featuring a centered Card layout with gradient 
// background and the ImageUploader component.

import React, { useState } from 'react';
import { Card, Button, Spinner, ListGroup } from 'react-bootstrap';
import ImageUploader from './components/ImageUploader';
import styles from './App.module.css';
import { extractTextFromImage, extractFormattedNumbers } from './services/ocrService';

function App() {
  const [images, setImages] = useState([]); // image objects with file + pageNumber
  const [dpciResults, setDpciResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImagesReady = (updatedImages) => {
    setImages(updatedImages);
    setDpciResults([]);
  };

const handleExtractDPCI = async () => {
  console.log('🚀 Starting OCR on images:', images.map(img => img.file.name));

  const results = [];

  for (const img of images) {
    const text = await extractTextFromImage(img.file);
    const matches = extractFormattedNumbers(text);

    results.push({
      page: img.pageNumber,
      dpciList: matches,
    });
  }

  console.log('✅ Final Results:', results);

  setDpciResults(results);
  setLoading(false);
};

  return (
    <div className={styles.fullscreen}>
      <div className={styles.centeredWrapper}>
        <Card className={`shadow ${styles.card}`}>
          <h2 className="text-center mb-4">📸 DPCI Extractor</h2>

          <ImageUploader onImagesReady={handleImagesReady} />

          {images.length > 0 && (
            <div className="text-center">
              <Button onClick={handleExtractDPCI} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Extracting...
                  </>
                ) : (
                  'Extract DPCI from Pages'
                )}
              </Button>
            </div>
          )}

          {dpciResults.length > 0 && (
            <div className="mt-4">
              <h5>🧠 DPCI Results by Page</h5>
              <ListGroup>
                {dpciResults.map((res, idx) => (
                  <ListGroup.Item key={idx}>
                    <strong>Page {res.page}:</strong>{' '}
                    {res.dpciList.length > 0
                      ? res.dpciList.join(', ')
                      : 'No DPCI found'}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;
