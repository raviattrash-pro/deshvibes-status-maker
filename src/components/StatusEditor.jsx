import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import RecordRTC from 'recordrtc';
import { Download, ArrowLeft, Square } from 'lucide-react';
import './StatusEditor.css';

export default function StatusEditor({ template, userImage, onBack }) {
  const { t } = useTranslation();
  const editorRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);

  // Confetti particles for real animation
  const particles = Array.from({ length: 40 });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { preferCurrentTab: true },
        audio: false
      });
      
      const recorder = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm'
      });
      
      recorderRef.current = recorder;
      recorder.startRecording();
      setIsRecording(true);
      
      // Auto stop after 6 seconds for a perfect short status
      setTimeout(() => {
        stopRecording(stream);
      }, 6000);
      
    } catch (err) {
      console.error("Recording failed", err);
      alert("Please allow screen recording to export the premium animated status.");
    }
  };

  const stopRecording = (stream) => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        RecordRTC.invokeSaveAsDialog(blob, 'national-day-status.webm');
        setIsRecording(false);
        if(stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      });
    }
  };

  return (
    <div className="status-editor-container">
      <div className="editor-header">
        <button className="icon-btn" onClick={onBack}><ArrowLeft size={20} /> Back</button>
        <button 
          className={`export-btn ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? () => stopRecording() : startRecording}
        >
          {isRecording ? <Square size={20} /> : <Download size={20} />}
          {isRecording ? 'Recording...' : 'Export MP4'}
        </button>
      </div>

      <div className="editor-canvas-wrapper">
        <div 
          className="status-preview" 
          ref={editorRef} 
          style={{ backgroundImage: `url(${template.url})` }}
        >
          {/* Animated Overlay Layers */}
          <div className="animation-layer">
             {particles.map((_, i) => (
               <motion.div 
                 key={i}
                 className="particle"
                 initial={{ y: -50, x: Math.random() * 400, opacity: 0 }}
                 animate={{ 
                   y: 800, 
                   x: Math.random() * 400 + Math.sin(i) * 50,
                   opacity: [0, 1, 1, 0],
                   rotate: Math.random() * 360
                 }}
                 transition={{ 
                   duration: Math.random() * 3 + 2, 
                   repeat: Infinity,
                   ease: "linear",
                   delay: Math.random() * 2
                 }}
                 style={{ 
                   backgroundColor: i % 3 === 0 ? '#ff9933' : i % 3 === 1 ? '#ffffff' : '#138808'
                 }}
               />
             ))}
          </div>

          {userImage && (
            <motion.div 
              drag
              dragConstraints={editorRef}
              className="user-image-overlay"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 1.05 }}
            >
              <img src={userImage} alt="User" draggable="false" />
            </motion.div>
          )}

          <div className="content-layer">
            <motion.div 
               className="text-glass-panel"
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.8, type: 'spring' }}
            >
              <h1 className="patriotic-title">{t('greeting')}</h1>
              <p className="patriotic-subtitle">{t('subtitle')}</p>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
