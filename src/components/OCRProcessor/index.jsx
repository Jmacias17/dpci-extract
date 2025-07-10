// OCRProcessor Component 
import React, { useEffect, useState } from 'react';
import { Spinner, ListGroup, Alert } from 'react-bootstrap';
import { extractTextFromImage } from '../../services/ocrService';

const OCRProcessor = ({ images }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!images.length) return;

    setLoading(true);
    console.log("🚀 Starting OCR processing...");

    const runOCR = async () => {
      const output = [];

      for (const img of images) {
        const dpciList = await extractTextFromImage(img.file); // already filtered
        output.push({ page: img.pageNumber, dpciList });
      }

      setResults(output);
      setLoading(false);
    };

    runOCR();
  }, [images]);

  if (loading) {
    return <Spinner animation="border" role="status" className="mt-3" />;
  }

  return (
    <div className="mt-4">
      <h5>🧠 OCR Results</h5>
      {results.length === 0 ? (
        <Alert variant="info">No results yet. Upload images to begin.</Alert>
      ) : (
        <ListGroup>
          {results.map((res, idx) => (
            <ListGroup.Item key={idx}>
              <strong>Page {res.page}:</strong>{' '}
              {res.dpciList.length > 0
                ? res.dpciList.join(', ')
                : 'No DPCI found'}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default OCRProcessor;
