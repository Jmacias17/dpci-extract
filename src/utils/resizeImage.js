import pica from 'pica';

/**
 * Detect yellow label regions with a black border,
 * crop them tightly, combine vertically with spacing, and mildly upscale if needed.
 */
export const resizeImage = async (
  file,
  maxWidth = 1600,
  maxHeight = 1600,
  applyThreshold = false,
  debug = false
) => {
  const img = await fileToImage(file);

  // --- Mild upscale only if very small ---
  let scale = 1;
  const minSide = Math.min(img.width, img.height);
  if (minSide < 800) {
    const factor = 800 / minSide;
    scale = Math.min(factor, 2); // never upscale more than 2×
  }

  const targetW = Math.round(img.width * scale);
  const targetH = Math.round(img.height * scale);

  const preCanvas = document.createElement('canvas');
  preCanvas.width = targetW;
  preCanvas.height = targetH;

  if (scale !== 1) {
    await pica().resize(imgToCanvas(img), preCanvas);
  } else {
    preCanvas.getContext('2d').drawImage(img, 0, 0);
  }

  // Preview of the scaled input
  if (debug) {
    const preview = document.createElement('canvas');
    preview.width = preCanvas.width;
    preview.height = preCanvas.height;
    preview.getContext('2d').drawImage(preCanvas, 0, 0);
    preview.style.border = '2px solid purple';
    preview.style.margin = '10px';
    document.body.appendChild(preview);
  }

  const imgW = preCanvas.width;
  const imgH = preCanvas.height;
  const tctx = preCanvas.getContext('2d');
  const imageData = tctx.getImageData(0, 0, imgW, imgH);
  const data = imageData.data;

  const isYellow = (r, g, b) => {
    const rgDiff = Math.abs(r - g);
    return r > 150 && g > 150 && b < 200 && r > b + 40 && g > b + 40 && rgDiff < 100;
  };
  const isBlack = (r, g, b) => r < 110 && g < 110 && b < 110;

  const visited = new Uint8Array(imgW * imgH);

  const floodFill = (sx, sy) => {
    let minX = sx, minY = sy, maxX = sx, maxY = sy;
    let blackEdgeCount = 0;
    const stack = [[sx, sy]];
    visited[sy * imgW + sx] = 1;

    while (stack.length) {
      const [x, y] = stack.pop();
      const idx = (y * imgW + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];

      if (isYellow(r, g, b)) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;

        // Count black edge pixels in neighborhood
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < imgW && ny < imgH) {
              const nidx = (ny * imgW + nx) * 4;
              if (isBlack(data[nidx], data[nidx + 1], data[nidx + 2])) blackEdgeCount++;
            }
          }
        }

        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx, dy]) => {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < imgW && ny < imgH) {
            const nidx = ny * imgW + nx;
            if (!visited[nidx]) {
              visited[nidx] = 1;
              stack.push([nx, ny]);
            }
          }
        });
      }
    }
    return { minX, minY, maxX, maxY, blackEdgeCount };
  };

  const boxes = [];
  for (let y = 0; y < imgH; y++) {
    for (let x = 0; x < imgW; x++) {
      const idx = y * imgW + x;
      if (!visited[idx]) {
        const i = idx * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (isYellow(r, g, b)) {
          const box = floodFill(x, y);
          const w = box.maxX - box.minX;
          const h = box.maxY - box.minY;
          const aspect = w / h;
          if (w > 25 && h > 8 && aspect > 2 && aspect < 8 && box.blackEdgeCount > 0) {
            boxes.push(box);
          }
        }
      }
    }
  }

  boxes.sort((a, b) => a.minY - b.minY); // top-to-bottom

  if (boxes.length === 0) {
    console.warn('⚠️ No yellow-label regions found.');
    return null;
  }

  // Optional debug overlay
  if (debug) {
    const overlay = document.createElement('canvas');
    overlay.width = imgW;
    overlay.height = imgH;
    const octx = overlay.getContext('2d');
    octx.drawImage(preCanvas, 0, 0);
    octx.strokeStyle = 'red';
    octx.lineWidth = 3;
    boxes.forEach(b => {
      octx.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
    });
    overlay.style.border = '2px solid blue';
    overlay.style.margin = '10px';
    document.body.appendChild(overlay);
  }

  // Crop and stack vertically with extra spacing
  const pad = 16;
  const gap = 50; // <--- extra spacing between each crop
  const crops = [];
  let totalHeight = 0;
  let maxCropWidth = 0;

  boxes.forEach(b => {
    const x = Math.max(b.minX - pad, 0);
    const y = Math.max(b.minY - pad, 0);
    const w = Math.min(b.maxX + pad, imgW) - x;
    const h = Math.min(b.maxY + pad, imgH) - y;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    c.getContext('2d').drawImage(preCanvas, x, y, w, h, 0, 0, w, h);
    crops.push(c);
    totalHeight += h;
    if (w > maxCropWidth) maxCropWidth = w;
  });

  // Add spacing between crops
  totalHeight += gap * (crops.length - 1);

  const combined = document.createElement('canvas');
  combined.width = maxCropWidth;
  combined.height = totalHeight;
  const cctx = combined.getContext('2d');
  cctx.fillStyle = 'white';
  cctx.fillRect(0, 0, combined.width, combined.height); // background
  let offsetY = 0;
  crops.forEach((c, i) => {
    cctx.drawImage(c, 0, offsetY);
    offsetY += c.height + gap;
  });

  // Mild upscale final if small
  let outW = combined.width;
  let outH = combined.height;
  if (outW < 1000 && outH < 1000) {
    outW = Math.round(outW * 1.5);
    outH = Math.round(outH * 1.5);
  }
  const outCanvas = document.createElement('canvas');
  outCanvas.width = outW;
  outCanvas.height = outH;
  await pica().resize(combined, outCanvas);

  // Post-processing (grayscale/threshold)
  const ctx = outCanvas.getContext('2d');
  const outData = ctx.getImageData(0, 0, outW, outH);
  const d = outData.data;
  for (let i = 0; i < d.length; i += 4) {
    let gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (applyThreshold) {
      const t = gray > 160 ? 255 : 0;
      d[i] = d[i + 1] = d[i + 2] = t;
    } else {
      let contrast = (gray - 128) * 1.4 + 128;
      contrast = Math.max(0, Math.min(255, contrast));
      d[i] = d[i + 1] = d[i + 2] = contrast;
    }
  }
  ctx.putImageData(outData, 0, 0);

  if (debug) {
    outCanvas.style.border = '2px solid green';
    outCanvas.style.margin = '10px';
    document.body.appendChild(outCanvas);
  }

  const blob = await pica().toBlob(outCanvas, 'image/png');
  return new File([blob], file.name.replace(/\.[^/.]+$/, '.png'), { type: 'image/png' });
};

// Helpers
function imgToCanvas(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0);
  return canvas;
}

const fileToImage = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { resolve(img); URL.revokeObjectURL(img.src); };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
