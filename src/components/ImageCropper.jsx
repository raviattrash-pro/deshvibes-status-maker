import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import './ImageCropper.css';

export default function ImageCropperModal({ image, onComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = image;
      await new Promise(resolve => { img.onload = resolve; });

      const size = Math.min(croppedAreaPixels.width, croppedAreaPixels.height);
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0, 0, size, size
      );

      const croppedUrl = canvas.toDataURL('image/png', 1.0);
      onComplete(croppedUrl);
    } catch (e) {
      console.error('Crop error:', e);
    }
  };

  return (
    <div className="crop-backdrop" onClick={onCancel}>
      <div className="crop-modal glass-strong" onClick={e => e.stopPropagation()}>
        <div className="crop-header">
          <h3>Crop Your Photo</h3>
          <button className="crop-close" onClick={onCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="crop-area">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="crop-controls">
          <label className="zoom-label">Zoom</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.05}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="zoom-range"
          />
        </div>

        <div className="crop-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={createCroppedImage}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Crop & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
