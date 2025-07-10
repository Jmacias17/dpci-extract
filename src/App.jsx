// App.jsx
// Main application entry point and layout wrapper.
// Introduced in v0.1.1 ("Image Uploader Complete") as the initial interface 
// for the DPCI Extractor App, featuring a centered Card layout with gradient 
// background and the ImageUploader component.

// App.jsx
import React, { useState } from 'react';
import { Card, Button, Spinner, Table } from 'react-bootstrap';
import ImageUploader from './components/ImageUploader';
import styles from './App.module.css';
import { extractTextFromImage, extractFormattedNumbers } from './services/ocrService';

function App() {
  const [images, setImages] = useState([]); // image objects with file + pageNumber
  const [dpciResults, setDpciResults] = useState([]); // [{ page, dpciList }]
  const [loading, setLoading] = useState(false);
  const [hasExtracted, setHasExtracted] = useState(false);
  const [processingStatus, setProcessingStatus] = useState({}); // { pageNumber: { loading, progress } }

  const handleImagesReady = (updatedImages) => {
    setImages(updatedImages);
    setDpciResults([]);
    setProcessingStatus({});
    setHasExtracted(false); 
  };

  const handleExtractDPCI = async () => {
    setLoading(true);
    setHasExtracted(true); 
    setDpciResults([]);
    setProcessingStatus({});

    const results = [];
    const total = images.length;

    for (let i = 0; i < total; i++) {
      const img = images[i];
      const page = img.pageNumber;

      setProcessingStatus(prev => ({
        ...prev,
        [page]: { loading: true, progress: Math.round(((i + 1) / total) * 100) }
      }));

      const text = await extractTextFromImage(img.file);
      const matches = extractFormattedNumbers(text);

      results.push({ page, dpciList: matches });

      setProcessingStatus(prev => ({
        ...prev,
        [page]: { loading: false, progress: 100 }
      }));

      setDpciResults(prev => [...prev, { page, dpciList: matches }]);
    }

    setLoading(false);
  };

  const getStatusElement = (status, dpciList) => {
    if (status?.loading) {
      return (
        <>
          <Spinner animation="border" size="sm" /> {status.progress}%
        </>
      );
    } else if (dpciList?.length > 0) {
      return <span className="text-success">✅ Done</span>;
    } else {
      return <span className="text-muted">❌ No Matches</span>;
    }
  };

  return (
    <div className={styles.fullscreen}>
      <div className={styles.centeredWrapper}>
        <Card className={`shadow ${styles.card}`}>
          <h2 className="text-center mb-4">📸 DPCI Extractor</h2>

          <ImageUploader onImagesReady={handleImagesReady} />

          {images.length > 0 && (
            <div className="text-center mt-3">
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

          {hasExtracted && images.length > 0 && (
            <div className="text-center mt-4">
              <h5>🧠 DPCI Results by Page</h5>
              <Table
                responsive
                bordered
                className="mt-3 table-sm align-middle text-start"
                variant="light"
              >
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '10%' }}>Page</th>
                    <th style={{ width: '20%' }}>Status</th>
                    <th>DPCI(s)</th>
                  </tr>
                </thead>
                <tbody>
                  {images.flatMap((img, idx) => {
                    const page = img.pageNumber;
                    const status = processingStatus[page];
                    const result = dpciResults.find(r => r.page === page);
                    const dpciList = result?.dpciList || [];

                    if (status?.loading || dpciList.length === 0) {
                      return (
                        <tr key={`page-${page}`}>
                          <td><strong>{page}</strong></td>
                          <td>{getStatusElement(status, dpciList)}</td>
                          <td>{status?.loading ? '—' : 'No DPCI found'}</td>
                        </tr>
                      );
                    }

                    return dpciList.map((dpci, i) => (
                      <tr key={`page-${page}-dpci-${i}`}>
                        {i === 0 && (
                          <>
                            <td rowSpan={dpciList.length}><strong>{page}</strong></td>
                            <td rowSpan={dpciList.length}>{getStatusElement(status, dpciList)}</td>
                          </>
                        )}
                        <td>{dpci}</td>
                      </tr>
                    ));
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;
