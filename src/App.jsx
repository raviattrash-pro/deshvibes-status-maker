import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import TemplateGallery from './components/TemplateGallery';
import CanvasEditor from './components/CanvasEditor';
import ImageCropperModal from './components/ImageCropper';
import LanguageSelector from './components/LanguageSelector';
import slogansData from './data/slogans';
import './App.css';

const OCCASIONS = ['independenceDay', 'republicDay', 'nationalDay'];
const FONTS = ['Playfair Display', 'Outfit', 'Teko', 'Yatra One', 'Rozha One'];
const THEMES = [
  { id: 'tricolor', name: 'Tricolor', colors: 'linear-gradient(90deg, #FF9933, #fff, #138808)' },
  { id: 'gold', name: 'Gold', colors: 'linear-gradient(135deg, #FFD700, #DAA520, #8B6508)' },
  { id: 'neon', name: 'Neon', colors: 'linear-gradient(135deg, #FF1493, #00FFFF, #00FF00)' },
  { id: 'vintage', name: 'Vintage', colors: 'linear-gradient(135deg, #D2B48C, #8B5A2B, #3D220A)' }
];
const STICKER_LIST = ['🇮🇳', '🎖️', '🦁', '🦚', '🐯', '✈️', '🎈', '🏵️', '⚔️', '🛡️', '🕌', '🏰', '✨', '🔥', '❤️'];

function App() {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [occasion, setOccasion] = useState('independenceDay');
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);

  // Layout & Multi-Photo states
  const [croppedImages, setCroppedImages] = useState([null, null, null]);
  const [activeCropSlot, setActiveCropSlot] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [customBgImage, setCustomBgImage] = useState(null);

  // Canva Pro Feature States
  const [canvasFormat, setCanvasFormat] = useState('status'); // 'status' (9:16), 'square' (1:1), 'landscape' (16:9)
  const [textEffect, setTextEffect] = useState('shadow'); // 'none', 'shadow', 'neon', 'hollow', 'glitch'
  const [photoBrightness, setPhotoBrightness] = useState(100);
  const [photoContrast, setPhotoContrast] = useState(100);
  const [photoSaturation, setPhotoSaturation] = useState(100);
  const [curveTextEnabled, setCurveTextEnabled] = useState(false);

  // Shared AudioContext Ref (Solves Chrome Autoplay Blocks)
  const audioCtxRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [statusDuration, setStatusDuration] = useState(25);
  const [audioEffect, setAudioEffect] = useState('normal');

  // Text contents
  const [badge, setBadge] = useState('');
  const [heading, setHeading] = useState('');
  const [userName, setUserName] = useState('');
  const [patrioticMsg, setPatrioticMsg] = useState('');
  const [watermarkText, setWatermarkText] = useState('');
  const [fontFamily, setFontFamily] = useState('Playfair Display');

  // Interactive overlays
  const [stickers, setStickers] = useState([]);
  const [signatureImage, setSignatureImage] = useState(null);

  // FX & Themes
  const [particleCount, setParticleCount] = useState(80);
  const [particleSpeed, setParticleSpeed] = useState(1.0);
  const [particleSize, setParticleSize] = useState(1.0);
  const [colorTheme, setColorTheme] = useState('tricolor');

  // Milestones Achievement counters
  const [createdCount, setCreatedCount] = useState(0);
  const [milestones, setMilestones] = useState({
    designer: false,
    master: false,
    creator: false,
    musician: false,
  });

  // Accordion UI state
  const [activeAccordion, setActiveAccordion] = useState('templates');

  // Signature Wish Pad Canvas ref
  const sigCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  // Pre-fill text overlays dynamically unless user typed their own custom strings
  const [isBadgeDirty, setIsBadgeDirty] = useState(false);
  const [isHeadingDirty, setIsHeadingDirty] = useState(false);
  const [isMsgDirty, setIsMsgDirty] = useState(false);

  useEffect(() => {
    if (!isBadgeDirty) setBadge(t(`occasions.${occasion}`));
    if (!isHeadingDirty) setHeading(t(`${occasion}.subtitle`));
    if (!isMsgDirty) setPatrioticMsg(t(`${occasion}.quote`));
  }, [occasion, i18n.language, t]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setView('editor');
    // Reset dirty flags
    setIsBadgeDirty(false);
    setIsHeadingDirty(false);
    setIsMsgDirty(false);
    setBadge(t(`occasions.${occasion}`));
    setHeading(t(`${occasion}.subtitle`));
    setUserName('');
    setPatrioticMsg(t(`${occasion}.quote`));
    setCustomBgImage(null);
    setCroppedImages([null, null, null]);
    setSignatureImage(null);
    setStickers([]);
    setCanvasFormat('status');
    setTextEffect('shadow');
    setPhotoBrightness(100);
    setPhotoContrast(100);
    setPhotoSaturation(100);
    setCurveTextEnabled(false);
  };

  const handleSlotImageUpload = (slotIndex, e) => {
    if (e.target.files && e.target.files.length > 0) {
      setActiveCropSlot(slotIndex);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUserImage(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCustomBgUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomBgImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAudioUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAudioFile(file);
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const audioCtx = audioCtxRef.current;
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = await audioCtx.decodeAudioData(arrayBuffer);
        setAudioBuffer(buffer);
        setAudioDuration(buffer.duration);
        setTrimStart(0);
        setMusicEnabled(true);
        setMilestones(prev => ({ ...prev, musician: true }));
      } catch (err) {
        console.error(err);
        alert('Could not decode audio file.');
      }
    }
  };

  const handleCropComplete = (croppedUrl) => {
    setCroppedImages(prev => {
      const next = [...prev];
      next[activeCropSlot] = croppedUrl;
      return next;
    });
    setShowCropper(false);
    setMilestones(prev => ({ ...prev, creator: true }));
  };

  const handleBack = () => {
    setSelectedTemplate(null);
    setView('gallery');
    setAudioFile(null);
    setAudioBuffer(null);
    setAudioDuration(0);
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  const handleOccasionChange = (val) => {
    setOccasion(val);
    if (!isBadgeDirty) setBadge(t(`occasions.${val}`));
    if (!isHeadingDirty) setHeading(t(`${val}.subtitle`));
    if (!isMsgDirty) setPatrioticMsg(t(`${val}.quote`));
  };

  // Direct click gesture Audio Toggle
  const handleMusicToggle = (e) => {
    const checked = e.target.checked;
    setMusicEnabled(checked);
    if (checked) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(err => console.warn('Audio resume failed:', err));
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    }
  };

  // ─── DRAW PAD EVENTS ──────────────────────────────────────────
  const startDrawing = (e) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#FFFFFF';
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearDrawing = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureImage(null);
  };

  const saveDrawing = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    setSignatureImage(canvas.toDataURL());
  };

  // ─── STICKER HANDLERS ─────────────────────────────────────────
  const addSticker = (emoji) => {
    setStickers(prev => [
      ...prev,
      {
        id: Date.now(),
        emoji,
        x: 0.2 + Math.random() * 0.6,
        y: 0.3 + Math.random() * 0.4,
        size: 80
      }
    ]);
  };

  const removeSticker = (id) => {
    setStickers(prev => prev.filter(s => s.id !== id));
  };

  // ─── LAYER MANAGER ────────────────────────────────────────────
  const [layersOrder, setLayersOrder] = useState(['bg', 'particles', 'photos', 'stickers', 'drawings', 'text', 'border']);

  const moveLayer = (index, dir) => {
    const nextIndex = index + dir;
    if (nextIndex < 0 || nextIndex >= layersOrder.length) return;
    setLayersOrder(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[nextIndex];
      next[nextIndex] = temp;
      return next;
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('app.title'),
          text: t('app.tagline'),
          url: window.location.href,
        });
      } catch (err) {
        console.warn('Share error:', err);
      }
    } else {
      alert('Sharing is not supported on this browser. You can download the video directly instead!');
    }
  };

  const handleStatusExportFinished = () => {
    setCreatedCount(prev => {
      const count = prev + 1;
      setMilestones(m => ({
        ...m,
        designer: count >= 1,
        master: count >= 3
      }));
      return count;
    });
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
          {view === 'editor' && navigator.share && (
            <button className="btn-secondary" style={{ padding: '10px 14px' }} onClick={handleNativeShare}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          )}
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
                customBgImage={customBgImage}
                userImages={croppedImages}
                occasion={occasion}
                badge={badge}
                heading={heading}
                userName={userName}
                patrioticMsg={patrioticMsg}
                musicEnabled={musicEnabled}
                audioBuffer={audioBuffer}
                trimStart={trimStart}
                statusDuration={statusDuration}
                audioEffect={audioEffect}
                fontFamily={fontFamily}
                watermarkText={watermarkText}
                stickers={stickers}
                signatureImage={signatureImage}
                particleCount={particleCount}
                particleSpeed={particleSpeed}
                particleSize={particleSize}
                colorTheme={colorTheme}
                layersOrder={layersOrder}
                onExportComplete={handleStatusExportFinished}
                canvasFormat={canvasFormat}
                textEffect={textEffect}
                photoBrightness={photoBrightness}
                photoContrast={photoContrast}
                photoSaturation={photoSaturation}
                curveTextEnabled={curveTextEnabled}
                audioCtx={audioCtxRef.current}
              />
            </div>
            <aside className="editor-sidebar glass">
              
              {/* ADVANCED MODE TOGGLE HEADER */}
              <div className="mode-toggle-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.5px' }}>✨ {t('editor.customize').toUpperCase()} (PRO)</span>
                <label className="toggle-switch">
                  <input type="checkbox" checked={advancedMode} onChange={e => setAdvancedMode(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Accordion 1: Templates & Bg */}
              <div className={`accordion-item ${activeAccordion === 'templates' ? 'open' : ''}`}>
                <div className="accordion-header" onClick={() => setActiveAccordion('templates')}>
                  <span className="accordion-title">{t('editor.occasion')} / Templates</span>
                  <svg className="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div className="accordion-content">
                  <div className="sidebar-field">
                    <label className="field-label">{t('editor.occasion')}</label>
                    <select className="field-select" value={occasion} onChange={(e) => handleOccasionChange(e.target.value)}>
                      {OCCASIONS.map(o => (
                        <option key={o} value={o}>{t(`occasions.${o}`)}</option>
                      ))}
                    </select>
                  </div>
                  {advancedMode && (
                    <div className="sidebar-field">
                      <label className="field-label">Custom Template Photo</label>
                      <input className="field-input" type="file" accept="image/*" onChange={handleCustomBgUpload} />
                    </div>
                  )}
                </div>
              </div>

              {/* Accordion 2: Canva Pro Magic Tools */}
              <div className={`accordion-item ${activeAccordion === 'pro' ? 'open' : ''}`}>
                <div className="accordion-header" onClick={() => setActiveAccordion('pro')}>
                  <span className="accordion-title" style={{ color: 'var(--gold)' }}>👑 Canva Pro Magic Tools</span>
                  <svg className="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div className="accordion-content">
                  <div className="sidebar-field">
                    <label className="field-label">Magic Canvas Resizer</label>
                    <select className="field-select" value={canvasFormat} onChange={e => setCanvasFormat(e.target.value)}>
                      <option value="status">📱 Vertical Story (9:16)</option>
                      <option value="square">🟩 Instagram Square (1:1)</option>
                      <option value="landscape">🖥️ Landscape Banner (16:9)</option>
                    </select>
                  </div>

                  <div className="sidebar-field">
                    <label className="field-label">Premium Text Effect</label>
                    <select className="field-select" value={textEffect} onChange={e => setTextEffect(e.target.value)}>
                      <option value="none">Standard Plain</option>
                      <option value="shadow">Drop Shadow 3D</option>
                      <option value="neon">Neon Magic Glow</option>
                      <option value="hollow">Hollow Outline Style</option>
                      <option value="glitch">Glitch Cyber-Patriot</option>
                    </select>
                  </div>

                  <div className="music-toggle" style={{ margin: '14px 0' }}>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={curveTextEnabled} onChange={e => setCurveTextEnabled(e.target.checked)} />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label" style={{ fontSize: '13px' }}>
                      ↪️ Arc Curved Badge Text
                    </span>
                  </div>

                  <div className="sidebar-field" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '12px' }}>
                    <label className="field-label">Photo Brightness ({photoBrightness}%)</label>
                    <input type="range" className="trim-slider" min="50" max="150" value={photoBrightness} onChange={e => setPhotoBrightness(Number(e.target.value))} />
                  </div>
                  <div className="sidebar-field">
                    <label className="field-label">Photo Contrast ({photoContrast}%)</label>
                    <input type="range" className="trim-slider" min="50" max="150" value={photoContrast} onChange={e => setPhotoContrast(Number(e.target.value))} />
                  </div>
                  <div className="sidebar-field">
                    <label className="field-label">Photo Saturation ({photoSaturation}%)</label>
                    <input type="range" className="trim-slider" min="50" max="150" value={photoSaturation} onChange={e => setPhotoSaturation(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              {/* Accordion 3: Personal Photos */}
              <div className={`accordion-item ${activeAccordion === 'photos' ? 'open' : ''}`}>
                <div className="accordion-header" onClick={() => setActiveAccordion('photos')}>
                  <span className="accordion-title">{t('editor.yourPhoto')} {advancedMode && '(Max 3)'}</span>
                  <svg className="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div className="accordion-content">
                  {advancedMode ? (
                    <div className="multi-photo-grid">
                      {[0, 1, 2].map(slotIndex => (
                        <div key={slotIndex} className={`photo-slot ${croppedImages[slotIndex] ? 'has-image' : ''}`}>
                          {croppedImages[slotIndex] ? (
                            <>
                              <img src={croppedImages[slotIndex]} alt={`Slot ${slotIndex+1}`} />
                              <button className="slot-remove-btn" onClick={() => setCroppedImages(prev => {
                                const next = [...prev]; next[slotIndex] = null; return next;
                              })}>×</button>
                            </>
                          ) : (
                            <label htmlFor={`slot-upload-${slotIndex}`} style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                              <span className="photo-slot-label">Slot {slotIndex+1}</span>
                              <input id={`slot-upload-${slotIndex}`} type="file" accept="image/*" onChange={(e) => handleSlotImageUpload(slotIndex, e)} hidden />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="sidebar-field">
                      <label className="upload-area" htmlFor="photo-upload-simple">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span>{t('editor.uploadPhoto')}</span>
                        <input id="photo-upload-simple" type="file" accept="image/*" onChange={(e) => handleSlotImageUpload(0, e)} hidden />
                      </label>
                      {croppedImages[0] && (
                        <div className="uploaded-preview">
                          <img src={croppedImages[0]} alt="Your photo" />
                          <button className="btn-danger" onClick={() => setCroppedImages([null, null, null])}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            {t('editor.removePhoto')}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Accordion 4: Text & Typography */}
              <div className={`accordion-item ${activeAccordion === 'text' ? 'open' : ''}`}>
                <div className="accordion-header" onClick={() => setActiveAccordion('text')}>
                  <span className="accordion-title">{t('editor.textContent')}</span>
                  <svg className="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div className="accordion-content">
                  {advancedMode && (
                    <div className="sidebar-field">
                      <label className="field-label">Typography Font</label>
                      <select className="field-select" value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
                        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="sidebar-field">
                    <label className="field-label">{t('editor.badge')}</label>
                    <input className="field-input" type="text" value={badge} onChange={e => { setBadge(e.target.value); setIsBadgeDirty(true); }} placeholder={t(`occasions.${occasion}`)} />
                  </div>
                  <div className="sidebar-field">
                    <label className="field-label">{t('editor.heading')}</label>
                    <input className="field-input" type="text" value={heading} onChange={e => { setHeading(e.target.value); setIsHeadingDirty(true); }} />
                  </div>
                  <div className="sidebar-field">
                    <label className="field-label">{t('editor.yourName')}</label>
                    <input className="field-input" type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder={t('editor.namePlaceholder')} />
                  </div>
                  <div className="sidebar-field">
                    <label className="field-label">{t('editor.patrioticMessage')}</label>
                    <textarea className="field-textarea" value={patrioticMsg} onChange={e => { setPatrioticMsg(e.target.value); setIsMsgDirty(true); }} rows={3} />
                  </div>
                  {advancedMode && (
                    <>
                      <div className="sidebar-field">
                        <label className="field-label">Quick Patriotic Slogans</label>
                        <div className="slogan-quick-list">
                          {(slogansData[i18n.language] || slogansData.en).map((slogan, i) => (
                            <button key={i} className="slogan-btn" onClick={() => { setPatrioticMsg(slogan); setIsMsgDirty(true); }}>
                              {slogan}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="sidebar-field">
                        <label className="field-label">Creator Watermark Handle</label>
                        <input className="field-input" type="text" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} placeholder="@username" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Accordion 5: Patriotic Stickers (ADVANCED ONLY) */}
              {advancedMode && (
                <div className={`accordion-item ${activeAccordion === 'stickers' ? 'open' : ''}`}>
                  <div className="accordion-header" onClick={() => setActiveAccordion('stickers')}>
                    <span className="accordion-title">Patriotic Stickers</span>
                    <svg className="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <div className="accordion-content">
                    <div className="sticker-grid">
                      {STICKER_LIST.map((emoji, idx) => (
                        <div key={idx} className="sticker-item" onClick={() => addSticker(emoji)}>
                          {emoji}
                        </div>
                      ))}
                    </div>
                    {stickers.length > 0 && (
                      <div className="active-stickers-list">
                        {stickers.map((s, idx) => (
                          <div key={s.id} className="active-sticker-card">
                            <span>Sticker {idx+1}: {s.emoji}</span>
                            <button className="btn-danger" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => removeSticker(s.id)}>Remove</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Accordion 6: Draw Signature (ADVANCED ONLY) */}
              {advancedMode && (
                <div className={`accordion-item ${activeAccordion === 'signature' ? 'open' : ''}`}>
                  <div className="accordion-header" onClick={() => setActiveAccordion('signature')}>
                    <span className="accordion-title">Handwritten Wishes</span>
                    <svg className="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <div className="accordion-content">
                    <div className="draw-pad-container">
                      <canvas
                        ref={sigCanvasRef}
                        className="draw-canvas"
                        width={280}
                        height={140}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                      <div className="draw-controls">
                        <button className="btn-secondary" onClick={clearDrawing}>Clear</button>
                        <button className="btn-primary" onClick={saveDrawing}>Apply signature</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Accordion 7: FX, Particles & Themes (ADVANCED ONLY) */}
              {advancedMode && (
                <div className={`accordion-item ${activeAccordion === 'fx' ? 'open' : ''}`}>
                  <div className="accordion-header" onClick={() => setActiveAccordion('fx')}>
                    <span className="accordion-title">FX, Particles & Themes</span>
                    <svg className="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <div className="accordion-content">
                    <div className="sidebar-field">
                      <label className="field-label">Color Theme Preset</label>
                      <div className="palette-grid">
                        {THEMES.map(theme => (
                          <div
                            key={theme.id}
                            className={`palette-item ${colorTheme === theme.id ? 'selected' : ''}`}
                            style={{ background: theme.colors }}
                            onClick={() => setColorTheme(theme.id)}
                          >
                            {theme.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="sidebar-field">
                      <label className="field-label">Particle Count ({particleCount})</label>
                      <input type="range" className="trim-slider" min="20" max="150" step="5" value={particleCount} onChange={e => setParticleCount(Number(e.target.value))} />
                    </div>
                    <div className="sidebar-field">
                      <label className="field-label">Animation Speed ({particleSpeed}x)</label>
                      <input type="range" className="trim-slider" min="0.5" max="3.0" step="0.1" value={particleSpeed} onChange={e => setPhotoContrast(Number(e.target.value))} />
                    </div>
                    <div className="sidebar-field">
                      <label className="field-label">Particle Size ({particleSize}x)</label>
                      <input type="range" className="trim-slider" min="0.5" max="2.5" step="0.1" value={particleSize} onChange={e => setParticleSize(Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              )}

              {/* Accordion 8: Music & Timing */}
              <div className={`accordion-item ${activeAccordion === 'music' ? 'open' : ''}`}>
                <div className="accordion-header" onClick={() => setActiveAccordion('music')}>
                  <span className="accordion-title">{t('editor.music')}</span>
                  <svg className="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div className="accordion-content">
                  <div className="music-toggle">
                    <label className="toggle-switch">
                      <input type="checkbox" checked={musicEnabled} onChange={handleMusicToggle} />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">
                      🎵 {t('editor.musicLabel')}
                    </span>
                  </div>

                  {advancedMode && (
                    <>
                      <div className="local-audio-field">
                        <label className="audio-upload-btn" htmlFor="audio-upload">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                          <span>{t('editor.localMusic')}</span>
                          <input id="audio-upload" type="file" accept="audio/*" onChange={handleAudioUpload} hidden />
                        </label>
                        {audioFile && <div className="audio-file-name">{audioFile.name}</div>}
                      </div>

                      {audioDuration > statusDuration && (
                        <div className="audio-trimmer">
                          <label className="field-label">{t('editor.musicTrim')}</label>
                          <div className="trimmer-control">
                            <input
                              type="range"
                              min="0"
                              max={Math.max(0, audioDuration - statusDuration)}
                              step="1"
                              value={trimStart}
                              onChange={e => setTrimStart(Number(e.target.value))}
                              className="trim-slider"
                            />
                            <div className="trim-values">
                              <span>{t('editor.musicStart')}: {trimStart}s</span>
                              <span>End: {trimStart + statusDuration}s</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="sidebar-field" style={{ marginTop: '16px' }}>
                        <label className="field-label">Status Duration</label>
                        <select className="field-select" value={statusDuration} onChange={e => setStatusDuration(Number(e.target.value))}>
                          <option value={15}>15 Seconds (Snappy / Reels)</option>
                          <option value={25}>25 Seconds (Standard / Status)</option>
                          <option value={35}>35 Seconds (Extended Story)</option>
                        </select>
                      </div>

                      <div className="sidebar-field">
                        <label className="field-label">Audio Effects (Lo-fi / Reverb)</label>
                        <select className="field-select" value={audioEffect} onChange={e => setAudioEffect(e.target.value)}>
                          <option value="normal">Normal</option>
                          <option value="slowed">Slowed & Reverb</option>
                          <option value="chiptune">8-Bit Retro Chiptune</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Accordion 9: Layer Ordering Manager (ADVANCED ONLY) */}
              {advancedMode && (
                <div className={`accordion-item ${activeAccordion === 'layers' ? 'open' : ''}`}>
                  <div className="accordion-header" onClick={() => setActiveAccordion('layers')}>
                    <span className="accordion-title">Layer Manager</span>
                    <svg className="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <div className="accordion-content">
                    <div className="layers-list">
                      {layersOrder.map((layer, idx) => (
                        <div key={layer} className="layer-item">
                          <span className="layer-name">{layer === 'bg' ? 'Background template' : layer === 'photos' ? 'User circular photos' : layer === 'drawings' ? 'Handwritten wishes' : layer}</span>
                          <div className="layer-actions">
                            <button className="layer-btn" disabled={idx === 0} onClick={() => moveLayer(idx, -1)}>▲</button>
                            <button className="layer-btn" disabled={idx === layersOrder.length - 1} onClick={() => moveLayer(idx, 1)}>▼</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Accordion 10: Milestone Achievements (ADVANCED ONLY) */}
              {advancedMode && (
                <div className={`accordion-item ${activeAccordion === 'milestones' ? 'open' : ''}`}>
                  <div className="accordion-header" onClick={() => setActiveAccordion('milestones')}>
                    <span className="accordion-title">Milestones (Achievements)</span>
                    <svg className="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <div className="accordion-content">
                    <div className="milestones-grid">
                      <div className={`milestone-card ${milestones.designer ? 'unlocked' : ''}`}>
                        <div className="milestone-icon">🎨</div>
                        <div className="milestone-title">Designer</div>
                      </div>
                      <div className={`milestone-card ${milestones.master ? 'unlocked' : ''}`}>
                        <div className="milestone-icon">👑</div>
                        <div className="milestone-title">Master Creator</div>
                      </div>
                      <div className={`milestone-card ${milestones.creator ? 'unlocked' : ''}`}>
                        <div className="milestone-icon">👤</div>
                        <div className="milestone-title">Personalized</div>
                      </div>
                      <div className={`milestone-card ${milestones.musician ? 'unlocked' : ''}`}>
                        <div className="milestone-icon">🎵</div>
                        <div className="milestone-title">Audio Composer</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
