import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TemplateGallery from './components/TemplateGallery';
import CanvasEditor from './components/CanvasEditor';
import ImageCropperModal from './components/ImageCropper';
import LanguageSelector from './components/LanguageSelector';
import './App.css';

const OCCASIONS = ['independenceDay', 'republicDay', 'nationalDay'];

function App() {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [occasion, setOccasion] = useState('independenceDay');
  const [userImage, setUserImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Local music states
  const [audioFile, setAudioFile] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);

  // Custom text fields
  const [badge, setBadge] = useState('');
  const [heading, setHeading] = useState('');
  const [userName, setUserName] = useState('');
  const [patrioticMsg, setPatrioticMsg] = useState('');

  // Track if user manually changed fields so we don't overwrite their typing
  const [isBadgeDirty, setIsBadgeDirty] = useState(false);
  const [isHeadingDirty, setIsHeadingDirty] = useState(false);
  const [isMsgDirty, setIsMsgDirty] = useState(false);

  // Sync default texts when language or occasion changes, if user hasn't typed their own
  useEffect(() => {
    if (!isBadgeDirty) setBadge(t(`occasions.${occasion}`));
    if (!isHeadingDirty) setHeading(t(`${occasion}.subtitle`));
    if (!isMsgDirty) setPatrioticMsg(t(`${occasion}.quote`));
  }, [occasion, i18n.language, t]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setView('editor');
    // Reset dirty flags and populate values
    setIsBadgeDirty(false);
    setIsHeadingDirty(false);
    setIsMsgDirty(false);
    setBadge(t(`occasions.${occasion}`));
    setHeading(t(`${occasion}.subtitle`));
    setUserName('');
    setPatrioticMsg(t(`${occasion}.quote`));
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUserImage(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAudioUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAudioFile(file);
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = await file.arrayBuffer();
        const buffer = await audioCtx.decodeAudioData(arrayBuffer);
        setAudioBuffer(buffer);
        setAudioDuration(buffer.duration);
        setTrimStart(0);
        setMusicEnabled(true);
      } catch (err) {
        console.error('Error decoding audio:', err);
        alert('Could not load audio file. Please try another MP3/WAV.');
      }
    }
  };

  const handleCropComplete = (croppedUrl) => {
    setCroppedImage(croppedUrl);
    setShowCropper(false);
  };

  const handleBack = () => {
    setSelectedTemplate(null);
    setView('gallery');
    // Clear audio buffer on back to avoid memory leakage
    setAudioFile(null);
    setAudioBuffer(null);
    setAudioDuration(0);
  };

  return (
    <div className="app-shell">
      <div className="bg-decoration" />

      {/* HEADER */}
      <header className="app-header glass-strong">
        <div className="header-left">
          {view === 'editor' && (
            <button className="btn-back" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}
          <div className="logo">
            <h1 className="logo-text">{t('app.title')}</h1>
            <span className="logo-subtitle">{t('app.subtitle')}</span>
          </div>
        </div>
        <div className="header-right">
          <LanguageSelector />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="app-content">
        {view === 'gallery' && (
          <TemplateGallery onSelect={handleTemplateSelect} />
        )}
        {view === 'editor' && selectedTemplate && (
          <div className="editor-layout">
            <div className="editor-preview-area">
              <CanvasEditor
                template={selectedTemplate}
                userImage={croppedImage}
                occasion={occasion}
                badge={badge}
                heading={heading}
                userName={userName}
                patrioticMsg={patrioticMsg}
                musicEnabled={musicEnabled}
                audioBuffer={audioBuffer}
                trimStart={trimStart}
              />
            </div>
            <aside className="editor-sidebar glass">
              {/* Occasion */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">{t('editor.customize')}</h3>
                <div className="sidebar-field">
                  <label className="field-label">{t('editor.occasion')}</label>
                  <select className="field-select" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                    {OCCASIONS.map(o => (
                      <option key={o} value={o}>{t(`occasions.${o}`)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Text */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">{t('editor.textContent')}</h3>
                <div className="sidebar-field">
                  <label className="field-label">{t('editor.badge')}</label>
                  <input className="field-input" type="text" value={badge} onChange={e => { setBadge(e.target.value); setIsBadgeDirty(true); }} placeholder={t(`occasions.${occasion}`)} />
                </div>
                <div className="sidebar-field">
                  <label className="field-label">{t('editor.heading')}</label>
                  <input className="field-input" type="text" value={heading} onChange={e => { setHeading(e.target.value); setIsHeadingDirty(true); }} placeholder={t(`${occasion}.subtitle`)} />
                </div>
                <div className="sidebar-field">
                  <label className="field-label">{t('editor.yourName')}</label>
                  <input className="field-input" type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder={t('editor.namePlaceholder')} />
                </div>
                <div className="sidebar-field">
                  <label className="field-label">{t('editor.patrioticMessage')}</label>
                  <textarea className="field-textarea" value={patrioticMsg} onChange={e => { setPatrioticMsg(e.target.value); setIsMsgDirty(true); }} placeholder={t(`${occasion}.quote`)} rows={3} />
                </div>
              </div>

              {/* Music */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">{t('editor.music')}</h3>
                <div className="music-toggle">
                  <label className="toggle-switch">
                    <input type="checkbox" checked={musicEnabled} onChange={e => setMusicEnabled(e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">
                    🎵 {t('editor.musicLabel')} ({musicEnabled ? t('editor.musicOn') : t('editor.musicOff')})
                  </span>
                </div>

                <div className="local-audio-field">
                  <label className="audio-upload-btn" htmlFor="audio-upload">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                    <span>{t('editor.localMusic')}</span>
                    <input id="audio-upload" type="file" accept="audio/*" onChange={handleAudioUpload} hidden />
                  </label>
                  {audioFile && <div className="audio-file-name">{audioFile.name}</div>}
                </div>

                {audioDuration > 25 && (
                  <div className="audio-trimmer">
                    <label className="field-label">{t('editor.musicTrim')}</label>
                    <div className="trimmer-control">
                      <input
                        type="range"
                        min="0"
                        max={Math.max(0, audioDuration - 25)}
                        step="1"
                        value={trimStart}
                        onChange={e => setTrimStart(Number(e.target.value))}
                        className="trim-slider"
                      />
                      <div className="trim-values">
                        <span>{t('editor.musicStart')}: {trimStart}s</span>
                        <span>End: {trimStart + 25}s</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Photo Upload */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">{t('editor.yourPhoto')}</h3>
                <label className="upload-area" htmlFor="photo-upload">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>{t('editor.uploadPhoto')}</span>
                  <input id="photo-upload" type="file" accept="image/*" onChange={handleImageUpload} hidden />
                </label>
                {croppedImage && (
                  <div className="uploaded-preview">
                    <img src={croppedImage} alt="Your photo" />
                    <button className="btn-danger" onClick={() => setCroppedImage(null)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      {t('editor.removePhoto')}
                    </button>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      {showCropper && userImage && (
        <ImageCropperModal image={userImage} onComplete={handleCropComplete} onCancel={() => setShowCropper(false)} />
      )}
    </div>
  );
}

export default App;
