import React from 'react';
import { Card } from 'react-bootstrap';
import ImageUploader from './components/ImageUploader';

/**
 * App Component
 * Serves as the main layout and wrapper for image input + preview.
 */
function App() {
  return (
    <div style={styles.fullscreen}>
      <div style={styles.centeredWrapper}>
        <Card className="shadow" style={styles.card}>
          <h2 className="text-center mb-4">📸 DPCI Extractor</h2>
          <ImageUploader onImagesReady={() => {}} />
        </Card>
      </div>
    </div>
  );
}

export default App;


//STYLE
const styles = {
  fullscreen: {
    width: '100vw',
    height: '100vh',
  },
  centeredWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to right, #cc0000, #ff1a1a)', // Target red vibe
    boxSizing: 'border-box',
    overflowX: 'hidden',
    padding: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    padding: '2rem',
  },
};