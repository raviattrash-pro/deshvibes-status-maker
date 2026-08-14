import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import templates from '../data/templates';
import './TemplateGallery.css';

export default function TemplateGallery({ onSelect }) {
  const { t } = useTranslation();
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2 className="gallery-title">{t('gallery.title')}</h2>
        <p className="gallery-subtitle">{t('gallery.subtitle')}</p>
        <div className="tricolor-line">
          <span className="tri-saffron"></span>
          <span className="tri-white"></span>
          <span className="tri-green"></span>
        </div>
      </div>

      <div className="gallery-grid">
        {templates.map((template, index) => (
          <div
            key={template.id}
            className={`gallery-card ${loadedImages[template.id] ? 'loaded' : ''}`}
            onClick={() => onSelect(template)}
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <div className="card-inner">
              <img
                src={template.image}
                alt={template.name}
                loading="lazy"
                onLoad={() => handleImageLoad(template.id)}
              />
              <div className="card-overlay">
                <div className="card-info">
                  <span className="card-name">{template.name}</span>
                  <span className="card-action">{t('gallery.useTemplate')} →</span>
                </div>
              </div>
              <div className="card-glow"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
