// App.jsx
// Main application entry point and layout wrapper.
// Introduced in v0.1.1 ("Image Uploader Complete") as the initial interface 
// for the DPCI Extractor App, featuring a centered Card layout with gradient 
// background and the ImageUploader component.

import React from 'react';
import { Card } from 'react-bootstrap';
import ImageUploader from './components/ImageUploader';
import styles from './App.module.css';

/**
 * App Component
 * Serves as the main layout and wrapper for image input + preview.
 */
function App() {
  return (
    <div className={styles.fullscreen}>
      <div className={styles.centeredWrapper}>
        <Card className={`shadow ${styles.card}`}>
          <h2 className="text-center mb-4">📸 DPCI Extractor</h2>
          <ImageUploader onImagesReady={() => {}} />
        </Card>
      </div>
    </div>
  );
}

export default App;