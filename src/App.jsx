// App.jsx
// Main application entry point and layout wrapper.
// Introduced in v0.1.1 ("Image Uploader Complete") as the initial interface 
// for the DPCI Extractor App, featuring a centered Card layout with gradient 
// background and the ImageUploader component.

import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Nav, ProgressBar} from 'react-bootstrap';
import ImageUploader from './components/ImageUploader';
import DPCITable from './components/DPCITable';
import ProgressHandler from './components/ProgressHandler';
import { useDpciExtraction } from './hooks/useDpciExtraction';
import { exportDPCIsToExcel } from './utils/excelUtils';
import styles from './App.module.css';

/**
 * App Component
 * Manages image uploads, triggers OCR extraction, and displays DPCI results.
 */
function App() {
  const [images, setImages] = useState([]);                // Uploaded image list
  const [currStage, setCurrStage] = useState('Upload')     // Current Stage of Process
  const [dpciResults, setDpciResults] = useState([]);      // OCR result per image
  const [processingStatus, setProcessingStatus] = useState({}); // Per-page loading/progress
  const [loading, setLoading] = useState(false);           // Global spinner control
  const [hasExtracted, setHasExtracted] = useState(false); // Flag for completed extraction
  const [error, setError] = useState(null);                // Error messaging

  const { extractFromImages } = useDpciExtraction();

  /**
   * Callback from ImageUploader when new images are uploaded or reordered.
   * Resets all relevant state.
   */
  const handleImagesReady = (updatedImages) => {
    setCurrStage("UploadAck")
    setImages(updatedImages);
    setDpciResults([]);
    setProcessingStatus({});
    setHasExtracted(false);
    setError(null);
  };

  /**
   * Runs OCR extraction on the uploaded images using custom hook logic.
   */
  const handleExtractDPCI = async () => {
    try {
      setLoading(true);
      setHasExtracted(true);
      setDpciResults([]);
      setProcessingStatus({});
      setError(null);

      await extractFromImages(images, setProcessingStatus, setDpciResults);
    } catch (err) {
      console.error('❌ DPCI extraction failed:', err);
      setError('Something went wrong while extracting DPCI numbers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset stage to 'Upload' when all images are removed
  useEffect(() => {
    if (images.length === 0 && currStage !== 'Upload') {
      setCurrStage('Upload');
    }
  }, [images, currStage]);

  useEffect(() => {
    if (hasExtracted) {
      setCurrStage('Extract');
    }
    if (dpciResults.length > 0) {
      setCurrStage('ExtractAck')
    }

    const firstKey = Object.keys(processingStatus)[0];
    if (!firstKey) return; // empty object

    const firstEntry = processingStatus[firstKey];

    if (firstEntry.progress === 100) {
      setCurrStage("Convert")
    }

    
  }, [hasExtracted, dpciResults]);

  return (
    <div className={styles.fullscreen}>
      <div className={styles.centeredWrapper}>
        <Card className={`shadow ${styles.card}`}>
          <h2 className="text-center mb-3">📸 DPCI Extractor</h2>
          <ProgressHandler currentStage={currStage} />

          {/* Image Upload Interface */}
          <ImageUploader
            onImagesReady={handleImagesReady}
            isDraggable={!hasExtracted}
          />

          {/* Extract Button (only shown when images exist) */}
          {images.length > 0 && (
            <div className="text-center mt-3">
              <Button
                variant={dpciResults.length > 0 && !hasExtracted? 'success' : 'primary'}
                onClick={dpciResults.length > 0 ? () => exportDPCIsToExcel(setCurrStage, dpciResults) : handleExtractDPCI}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Extracting...
                  </>
                ) : dpciResults.length > 0 ? (
                  'Convert To Excel'
                ) : (
                  'Extract DPCI List'
                )}
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          

          {/* DPCI Results Table */}
          {hasExtracted && images.length > 0 && (
            <div className="text-center mt-4">
              <h5>🧠 DPCI Results by Page</h5>
              <DPCITable
                images={images}
                dpciResults={dpciResults}
                processingStatus={processingStatus}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;