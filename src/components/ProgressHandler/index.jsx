// ProgressHandler.jsx
// Displays a multi-step progress indicator for the extraction process
// Uses react-bootstrap ProgressBar segments with dynamic colors and animation.

import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import './ProgressHandler.css';

/**
 * ProgressHandler
 * Shows progress across four main stages:
 *  - Upload
 *  - Extract
 *  - GetInfo
 *  - Convert
 *
 * @param {string} currentStage - The current stage or acknowledgement (e.g., "UploadAck", "Extract", "ConvertAck").
 */
const ProgressHandler = ({ currentStage }) => {
  // Map each step to which currentStage values should be considered success/warning/primary
  const rules = {
    Upload: {
      success: ['Extract', 'ExtractAck', 'GetInfo', 'GetInfoAck', 'Convert', 'ConvertAck', 'Complete'],
      warning: ['UploadAck'],
      primary: ['Upload'],
    },
    Extract: {
      success: ['GetInfo', 'GetInfoAck', 'Convert', 'ConvertAck', 'Complete'],
      warning: ['ExtractAck'],
      primary: ['Extract'],
    },
    GetInfo: {
      success: ['Convert', 'ConvertAck', 'Complete'],
      warning: ['GetInfoAck'],
      primary: ['GetInfo'],
    },
    Convert: {
      success: ['Complete'],
      warning: ['ConvertAck'],
      primary: ['Convert'],
    },
  };

  /**
   * getVariant
   * Returns the Bootstrap variant color for a given step
   * based on currentStage and mapping in `rules`.
   */
  const getVariant = (step) => {
    const stage = rules[step];
    if (stage.success.includes(currentStage)) return 'success';   // ✅ Step is completed
    if (stage.warning.includes(currentStage)) return 'warning';   // ⚠️ Step is acknowledged but not complete
    if (stage.primary.includes(currentStage)) return 'primary';   // 🔵 Step is currently active
    return 'secondary';                                           // ⚫ Not reached yet
  };

  /**
   * shouldAnimate
   * Controls whether a segment should show animation (striped/animated)
   * based on the currentStage.
   */
  const shouldAnimate = (step) => {
    const stage = rules[step];
    return (
      currentStage === step ||
      currentStage === `${step}Ack` ||
      stage.success.includes(currentStage)
    );
  };

  return (
    <ProgressBar>
      <ProgressBar
        key="upload"
        label={<span className="outlined-text">Upload</span>}
        animated={shouldAnimate('Upload')}
        striped
        variant={getVariant('Upload')}
        now={25}
      />
      <ProgressBar
        key="extract"
        label={<span className="outlined-text">Extract</span>}
        animated={shouldAnimate('Extract')}
        striped
        variant={getVariant('Extract')}
        now={25}
      />
      <ProgressBar
        key="getinfo"
        label={<span className="outlined-text">GetInfo</span>}
        animated={shouldAnimate('GetInfo')}
        striped
        variant={getVariant('GetInfo')}
        now={25}
      />
      <ProgressBar
        key="convert"
        label={<span className="outlined-text">Convert</span>}
        animated={shouldAnimate('Convert')}
        striped
        variant={getVariant('Convert')}
        now={25}
      />
    </ProgressBar>
  );
};

export default ProgressHandler;
