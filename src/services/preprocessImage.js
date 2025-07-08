// imagePreprocessing.js
// Enhances contrast and brightness to improve OCR accuracy

export const preprocessImage = (file) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Enhance contrast and brightness
      for (let i = 0; i < data.length; i += 4) {
        const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];

        // Apply thresholding to boost contrast
        const value = avg > 140 ? 255 : 0;

        data[i] = data[i + 1] = data[i + 2] = value;
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    };
  });
