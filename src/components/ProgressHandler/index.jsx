// ProgressHandler.jsx
import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import './ProgressHandler.css';

const ProgressHandler = ({ currentStage }) => {
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

  const getVariant = (step) => {
    const stage = rules[step];
    if (stage.success.includes(currentStage)) return 'success';
    if (stage.warning.includes(currentStage)) return 'warning';
    if (stage.primary.includes(currentStage)) return 'primary';
    return 'secondary';
  };

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
        label={<span className="outlined-text">Upload</span>}
        animated={shouldAnimate('Upload')}
        striped
        variant={getVariant('Upload')}
        now={25}
        key={1}
      />
      <ProgressBar
        label={<span className="outlined-text">Extract</span>}
        animated={shouldAnimate('Extract')}
        striped
        variant={getVariant('Extract')}
        now={25}
        key={2}
      />
      <ProgressBar
        label={<span className="outlined-text">GetInfo</span>}
        animated={shouldAnimate('GetInfo')}
        striped
        variant={getVariant('GetInfo')}
        now={25}
        key={3}
      />
      <ProgressBar
        label={<span className="outlined-text">Convert</span>}
        animated={shouldAnimate('Convert')}
        striped
        variant={getVariant('Convert')}
        now={25}
        key={4}
      />
    </ProgressBar>
  );
};

export default ProgressHandler;
