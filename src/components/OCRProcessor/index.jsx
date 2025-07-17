// OCRProcessor.jsx
// A standalone component that performs OCR on uploaded images and displays raw results by page.
// Useful for debugging or testing OCR output outside of main DPCITable flow.

import React, { useEffect, useState } from 'react';
import { Spinner, ListGroup, Alert } from 'react-bootstrap';
import { extractTextFromImage, extractTextFromImages } from '../../services/ocrService';

/**
 * OCRProcessor
 * Runs OCR on each image and displays individual DPCI results per page.
 * 
 * @param {Object[]} images - Array of image objects, each with .file and .pageNumber
 */
const OCRProcessor = ({ images }) => {
  const [results, setResults] = useState([]);   // Holds extracted DPCI results
  const [loading, setLoading] = useState(false); // Tracks OCR loading state

  // 🔄 Show spinner while processing
  if (loading) {
    return <Spinner animation="border" role="status" className="mt-3" />;
  }

  // 📋 Display raw OCR results after processing
  return (
    <div className="mt-4">
      <h5>🧠 Raw OCR Results</h5>

      {results.length === 0 ? (
        <Alert variant="info">No results yet. Upload images to begin.</Alert>
      ) : (
        <ListGroup>
          {results.map((res, idx) => (
            <ListGroup.Item key={idx}>
              <strong>Page {res.page}:</strong> {res.dpci}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default OCRProcessor;
