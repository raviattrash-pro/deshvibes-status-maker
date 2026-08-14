import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './CanvasEditor.css';

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOut(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }

// ─── INITIALIZE PARTICLE SYSTEMS ──────────────────────────────────
function initParticles(type, count, sizeMultiplier, W, H) {
  const size = sizeMultiplier || 1.0;
  
  switch(type) {
    case 'confetti':
      return Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H * 2 - H,
        w: (8 + Math.random() * 10) * size, h: (12 + Math.random() * 16) * size,
        vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2, rs: (Math.random() - 0.5) * 0.1,
        alpha: 0.7 + Math.random() * 0.3, phase: Math.random() * Math.PI * 2, ps: 0.01 + Math.random() * 0.02
      }));

    case 'confetti_slow':
      return Array.from({ length: Math.floor(count / 2) }, () => ({
        x: Math.random() * W, y: Math.random() * H * 2 - H,
        w: (16 + Math.random() * 12) * size, h: (16 + Math.random() * 12) * size,
        vx: (Math.random() - 0.5) * 0.8, vy: 1 + Math.random() * 1.5,
        rot: Math.random() * Math.PI * 2, rs: (Math.random() - 0.5) * 0.03,
        alpha: 0.5 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2, ps: 0.005 + Math.random() * 0.01
      }));

    case 'diyas':
      return Array.from({ length: Math.floor(count / 2) }, () => ({
        x: Math.random() * W, y: H + Math.random() * 200,
        radius: (4 + Math.random() * 6) * size, vy: -(0.5 + Math.random() * 1.5), vx: (Math.random() - 0.5) * 0.4,
        alpha: Math.random(), ad: 0.01 + Math.random() * 0.02, dir: 1,
        hue: 15 + Math.random() * 30, flicker: Math.random() * Math.PI * 2
      }));

    case 'lotus_diyas':
      return Array.from({ length: Math.floor(count * 0.4) }, () => ({
        x: Math.random() > 0.5 ? Math.random() * 200 : W - Math.random() * 200,
        y: H + Math.random() * 100,
        radius: (3 + Math.random() * 5) * size,
        vy: -(0.8 + Math.random() * 1.8),
        vx: (Math.random() - 0.5) * 0.6,
        alpha: 0.3 + Math.random() * 0.7,
        hue: 20 + Math.random() * 20
      }));

    case 'sparkleRain':
      return Array.from({ length: count }, () => ({
        x: Math.random() * W, y: -Math.random() * H,
        radius: (1.5 + Math.random() * 3.5) * size, vy: 1 + Math.random() * 2.5, vx: (Math.random() - 0.5) * 0.6,
        alpha: Math.random(), ad: 0.01 + Math.random() * 0.03, dir: 1,
      }));

    case 'sparkleRain_dense':
      return Array.from({ length: count * 1.5 }, () => ({
        x: Math.random() * W, y: -Math.random() * H,
        radius: (1 + Math.random() * 2.5) * size, vy: 1.5 + Math.random() * 3.5, vx: (Math.random() - 0.5) * 0.4,
        alpha: Math.random(), ad: 0.02 + Math.random() * 0.04, dir: 1,
      }));

    case 'jets':
      return Array.from({ length: 3 }, (_, i) => ({
        x: -150 - i * 150, y: 300 + i * 100,
        vx: 4.5, vy: 0.2,
        trail: [], maxTrail: 120,
        size: 7 * size
      }));

    case 'jets_cross':
      return [
        { x: -100, y: 200, vx: 5, vy: 1.5, trail: [], maxTrail: 100, size: 8 * size },
        { x: W + 100, y: 200, vx: -5, vy: 1.5, trail: [], maxTrail: 100, size: 8 * size }
      ];

    case 'rays':
      return Array.from({ length: 16 }, () => ({
        angle: Math.random() * Math.PI * 2, length: (0.4 + Math.random() * 0.6) * size,
        width: 0.02 + Math.random() * 0.03, alpha: 0.03 + Math.random() * 0.07,
        speed: 0.003 + Math.random() * 0.006,
      }));

    case 'rays_gold':
      return Array.from({ length: 24 }, () => ({
        angle: Math.random() * Math.PI * 2, length: (0.3 + Math.random() * 0.5) * size,
        width: 0.01 + Math.random() * 0.02, alpha: 0.04 + Math.random() * 0.06,
        speed: -0.002 - Math.random() * 0.004,
      }));

    case 'balloons_float':
      return Array.from({ length: Math.floor(count * 0.3) }, () => ({
        x: Math.random() * W, y: H + Math.random() * 300,
        radius: (20 + Math.random() * 25) * size, vy: -(1 + Math.random() * 1.5),
        vx: (Math.random() - 0.5) * 0.5,
        alpha: 0.6 + Math.random() * 0.3,
        swayPhase: Math.random() * Math.PI * 2, swaySpeed: 0.01
      }));

    default:
      return [];
  }
}

// Get particle colors based on current theme selection
function getThemeColors(theme) {
  switch(theme) {
    case 'gold': return ['#FFD700', '#DAA520', '#B8860B', '#FFF8DC'];
    case 'neon': return ['#FF1493', '#00FFFF', '#00FF00', '#FFFF00'];
    case 'vintage': return ['#D2B48C', '#8B5A2B', '#CD853F', '#F5F5DC'];
    default: return ['#FF9933', '#FFFFFF', '#138808', '#FFD700']; // standard
  }
}

// ─── AUDIO SYNTHESIZER WITH EFFECTS & DURATION & FADES ───────────
function playSynthesizedStyle(audioCtx, style, duration, effect, destinationNode = null) {
  if (!audioCtx || audioCtx.state === 'closed') return;
  const dest = destinationNode || audioCtx.destination;
  const time = audioCtx.currentTime + 0.1;

  let oscType = 'sine';
  let playbackRate = 1.0;
  let applyReverb = false;

  if (effect === 'slowed') {
    playbackRate = 0.82;
    applyReverb = true;
  } else if (effect === 'chiptune') {
    oscType = 'square';
  }

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, time);
  masterGain.gain.linearRampToValueAtTime(0.08, time + 1.5);
  masterGain.gain.setValueAtTime(0.08, time + duration - 1.5);
  masterGain.gain.linearRampToValueAtTime(0, time + duration);

  let finalNode = masterGain;
  if (applyReverb) {
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1100;
    masterGain.connect(filter);
    finalNode = filter;
  }
  finalNode.connect(dest);

  if (style === 'march') {
    const notes = [
      { f: 293.7, d: 0.25 }, { f: 293.7, d: 0.25 }, { f: 329.6, d: 0.5 },
      { f: 392.0, d: 0.5 }, { f: 392.0, d: 0.25 }, { f: 440.0, d: 0.25 },
      { f: 392.0, d: 0.5 }, { f: 329.6, d: 0.5 }, { f: 293.7, d: 1.0 }
    ];
    let noteTime = time;
    const loops = Math.ceil(duration / (3.75 * playbackRate)) + 1;
    for (let l = 0; l < loops; l++) {
      notes.forEach(note => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = oscType === 'sine' ? 'triangle' : oscType;
        osc.frequency.value = note.f * (1 / playbackRate);
        
        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.06, noteTime + 0.03);
        gain.gain.linearRampToValueAtTime(0, noteTime + note.d * playbackRate);
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(noteTime);
        osc.stop(noteTime + note.d * playbackRate + 0.01);

        const bufferSize = audioCtx.sampleRate * note.d * playbackRate;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 1000;
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.015, noteTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.d * playbackRate);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noise.start(noteTime);
        noise.stop(noteTime + note.d * playbackRate);

        noteTime += note.d * playbackRate;
      });
    }
  } else if (style === 'ambient') {
    const notes = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3];
    let droneTime = time;
    const step = 0.8 * playbackRate;
    const loops = Math.ceil(duration / step) + 1;
    for (let l = 0; l < loops; l++) {
      const f = notes[Math.floor(Math.random() * notes.length)] * (1 / playbackRate);
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = oscType === 'sine' ? 'sawtooth' : oscType;
      osc.frequency.value = f;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = f * 2;
      filter.Q.value = 8;
      filter.gain.value = 12;

      gain.gain.setValueAtTime(0, droneTime);
      gain.gain.linearRampToValueAtTime(0.04, droneTime + 0.3 * playbackRate);
      gain.gain.linearRampToValueAtTime(0, droneTime + step * 2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start(droneTime);
      osc.stop(droneTime + step * 2 + 0.01);
      droneTime += step;
    }
  } else {
    const notes = [
      { f: 261.6, d: 0.5 }, { f: 293.7, d: 0.5 }, { f: 329.6, d: 0.5 }, { f: 392.0, d: 1.0 },
      { f: 440.0, d: 0.5 }, { f: 392.0, d: 0.5 }, { f: 329.6, d: 0.5 }, { f: 293.7, d: 0.5 }
    ];
    let noteTime = time;
    const loops = Math.ceil(duration / (4.5 * playbackRate)) + 1;
    for (let l = 0; l < loops; l++) {
      notes.forEach(note => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = oscType;
        osc.frequency.value = note.f * (1 / playbackRate);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.07, noteTime + 0.05 * playbackRate);
        gain.gain.linearRampToValueAtTime(0, noteTime + note.d * playbackRate);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(noteTime);
        osc.stop(noteTime + note.d * playbackRate + 0.01);
        noteTime += note.d * playbackRate;
      });
    }
  }
}

export default function CanvasEditor({
  template, customBgImage, userImages, occasion, badge, heading, userName, patrioticMsg,
  musicEnabled, audioBuffer, trimStart, statusDuration, audioEffect, fontFamily, watermarkText,
  stickers, signatureImage, particleCount, particleSpeed, particleSize, colorTheme, layersOrder, onExportComplete,
  canvasFormat, textEffect, photoBrightness, photoContrast, photoSaturation, curveTextEnabled, audioCtx
}) {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  
  // Background images loading
  const bgImgRef = useRef(null);
  const customBgImgRef = useRef(null);
  
  // User photo image loaders
  const userImgRefs = useRef([null, null, null]);
  const signatureImgRef = useRef(null);
  
  const startTimeRef = useRef(performance.now());

  const animType = template.animation || 'confetti';
  const musicStyle = template.musicStyle || 'anthem';
  
  // Interactive Fireworks bursts
  const fireworksRef = useRef([]);
  const timeRef = useRef(0);
  
  const [bgLoaded, setBgLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Dynamic Sizing based on aspect ratio format selection
  let W = 1080;
  let H = 1920;
  if (canvasFormat === 'square') { W = 1080; H = 1080; }
  else if (canvasFormat === 'landscape') { W = 1920; H = 1080; }

  const particlesRef = useRef(initParticles(animType, particleCount, particleSize, W, H));

  // Sync particle systems
  useEffect(() => {
    particlesRef.current = initParticles(animType, particleCount, particleSize, W, H);
  }, [animType, particleCount, particleSize, W, H]);

  // Load standard background
  useEffect(() => {
    setBgLoaded(false);
    const img = new Image(); img.crossOrigin = 'anonymous';
    img.onload = () => { bgImgRef.current = img; setBgLoaded(true); };
    img.src = template.image;
  }, [template]);

  // Load custom background
  useEffect(() => {
    if (!customBgImage) { customBgImgRef.current = null; return; }
    const img = new Image();
    img.onload = () => { customBgImgRef.current = img; };
    img.src = customBgImage;
  }, [customBgImage]);

  // Load multiple user photos
  useEffect(() => {
    userImages.forEach((imgUrl, i) => {
      if (!imgUrl) { userImgRefs.current[i] = null; return; }
      const img = new Image();
      img.onload = () => { userImgRefs.current[i] = img; };
      img.src = imgUrl;
    });
  }, [userImages]);

  // Load signature overlay image
  useEffect(() => {
    if (!signatureImage) { signatureImgRef.current = null; return; }
    const img = new Image();
    img.onload = () => { signatureImgRef.current = img; };
    img.src = signatureImage;
  }, [signatureImage]);

  // Live Preview Audio Node Coordinator
  useEffect(() => {
    if (!musicEnabled || !audioCtx || audioCtx.state === 'closed') {
      return;
    }

    let source = null;
    const play = () => {
      if (audioCtx.state === 'closed') return;
      if (audioBuffer) {
        source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        if (audioEffect === 'slowed') source.playbackRate.value = 0.82;
        source.connect(gain);
        gain.connect(audioCtx.destination);
        source.start(0, trimStart, statusDuration);
      } else {
        playSynthesizedStyle(audioCtx, musicStyle, statusDuration, audioEffect);
      }
    };

    play();

    return () => {
      if (source) {
        try { source.stop(); } catch(e) {}
      }
    };
  }, [musicEnabled, audioCtx, audioBuffer, trimStart, musicStyle, audioEffect, statusDuration]);

  // Handle click fireworks
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * W;
    const clickY = ((e.clientY - rect.top) / rect.height) * H;

    const sparks = Array.from({ length: 45 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      const colorChoices = ['#FF9933', '#FFFFFF', '#138808', '#FFD700'];
      return {
        x: clickX, y: clickY,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 4,
        alpha: 1.0, dec: 0.015 + Math.random() * 0.015,
        color: colorChoices[Math.floor(Math.random() * colorChoices.length)]
      };
    });

    fireworksRef.current.push(...sparks);
  };

  // ─── DIRECT DRAW LAYER FUNCTIONS (SOLVES REACT CLOSURES) ────────
  const drawLayer = (layerId, ctx, elapsed, themeColors, pFade) => {
    const pTemplate = easeOut(clamp(elapsed / 1.5, 0, 1));
    const pBadge    = easeOut(clamp((elapsed - 1.5) / 1.5, 0, 1));
    const pHeading  = easeOut(clamp((elapsed - 3.5) / 2, 0, 1));
    const pParticles= clamp((elapsed - 2) / 2, 0, 1);
    const pPhoto    = easeOut(clamp((elapsed - 6) / 2, 0, 1));
    const pName     = easeOut(clamp((elapsed - 9) / 1.5, 0, 1));
    const pQuote    = easeOut(clamp((elapsed - 11) / 2, 0, 1));

    const textY = template.text?.y || 0.82;
    const isTop = textY < 0.5;

    const isSquare = canvasFormat === 'square';
    const isLandscape = canvasFormat === 'landscape';

    switch(layerId) {
      case 'bg':
        ctx.save();
        ctx.globalAlpha = pTemplate * pFade;
        const bgImg = customBgImgRef.current || bgImgRef.current;
        if (bgImg) {
          const ir = bgImg.width / bgImg.height, cr = W / H;
          let sx = 0, sy = 0, sw = bgImg.width, sh = bgImg.height;
          if (ir > cr) { sw = bgImg.height * cr; sx = (bgImg.width - sw) / 2; }
          else { sh = bgImg.width / cr; sy = (bgImg.height - sh) / 2; }
          ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, W, H);
        } else {
          ctx.fillStyle = '#0a0a14'; ctx.fillRect(0, 0, W, H);
        }
        ctx.restore();
        break;

      case 'particles':
        const p = particlesRef.current;
        if (p && pParticles > 0) {
          ctx.save();
          ctx.globalAlpha = pParticles * pFade;
          
          if (animType === 'confetti' || animType === 'confetti_slow') {
            p.forEach(c => {
              c.y += c.vy * particleSpeed; c.phase += c.ps; c.x += c.vx + Math.sin(c.phase) * 1.2; c.rot += c.rs * particleSpeed;
              if (c.y > H + 40) { c.y = -40; c.x = Math.random() * W; }
              ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot); ctx.globalAlpha = c.alpha * pParticles * pFade;
              ctx.fillStyle = themeColors[Math.floor(Math.random() * themeColors.length)];
              ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 6;
              if (animType === 'confetti') ctx.fillRect(-c.w/2, -c.h/2, c.w, c.h);
              else { ctx.beginPath(); ctx.ellipse(0, 0, c.w/2, c.h/2, 0, 0, Math.PI*2); ctx.fill(); }
              ctx.restore();
            });
          }
          
          else if (animType === 'diyas' || animType === 'lotus_diyas') {
            p.forEach(d => {
              d.y += d.vy * particleSpeed; d.x += d.vx;
              if (d.y < -30) { d.y = H + 30; d.x = Math.random() * W; }
              ctx.save(); ctx.globalAlpha = d.alpha * pParticles * pFade;
              const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius * 4);
              grad.addColorStop(0, `rgba(255,180,60,0.3)`); grad.addColorStop(1, 'transparent');
              ctx.fillStyle = grad; ctx.fillRect(d.x - d.radius * 4, d.y - d.radius * 4, d.radius * 8, d.radius * 8);
              ctx.beginPath(); ctx.arc(d.x, d.y, d.radius, 0, Math.PI*2);
              ctx.fillStyle = themeColors[2] || '#FFD700'; ctx.shadowBlur = 12; ctx.shadowColor = '#FF9933';
              ctx.fill(); ctx.restore();
            });
          }

          else if (animType === 'sparkleRain' || animType === 'sparkleRain_dense') {
            p.forEach(s => {
              s.y += s.vy * particleSpeed; s.x += s.vx; s.alpha += s.ad * s.dir;
              if (s.alpha >= 1) s.dir = -1; if (s.alpha <= 0.1) s.dir = 1;
              if (s.y > H + 20) { s.y = -20; s.x = Math.random() * W; }
              ctx.save(); ctx.globalAlpha = Math.max(0, s.alpha) * pParticles * pFade;
              ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2);
              ctx.fillStyle = themeColors[Math.floor(Math.random() * themeColors.length)];
              ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10; ctx.fill(); ctx.restore();
            });
          }

          else if (animType === 'jets' || animType === 'jets_cross') {
            p.forEach(j => {
              j.x += j.vx * particleSpeed; j.y += j.vy * particleSpeed;
              j.trail.push({ x: j.x, y: j.y });
              if (j.trail.length > j.maxTrail) j.trail.shift();
              if (j.x > W + 200) { j.x = -150; j.trail = []; }
              j.trail.forEach((pt, idx) => {
                const a = (idx / j.trail.length) * 0.5 * pParticles * pFade;
                ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(pt.x, pt.y, j.size * (idx / j.trail.length), 0, Math.PI*2);
                ctx.fillStyle = j.color || themeColors[0]; ctx.fill(); ctx.restore();
              });
            });
          }

          else if (animType === 'rays' || animType === 'rays_gold') {
            const cx = W / 2, cy = H * 0.4;
            p.forEach(r => {
              r.angle += r.speed * particleSpeed;
              ctx.save(); ctx.globalAlpha = r.alpha * pParticles * pFade;
              ctx.translate(cx, cy); ctx.rotate(r.angle);
              const grad = ctx.createLinearGradient(0, 0, W * r.length, 0);
              grad.addColorStop(0, r.color || themeColors[1]); grad.addColorStop(1, 'transparent');
              ctx.fillStyle = grad; ctx.fillRect(0, -W * r.width/2, W * r.length, W * r.width);
              ctx.restore();
            });
          }
          ctx.restore();
        }
        break;

      case 'photos':
        userImgRefs.current.forEach((imgRef, i) => {
          if (!imgRef || pPhoto <= 0) return;
          ctx.save();
          ctx.globalAlpha = pPhoto * pFade;

          // Magic Filter adjustments
          ctx.filter = `brightness(${photoBrightness}%) contrast(${photoContrast}%) saturate(${photoSaturation}%)`;

          const photoConfigs = [
            template.photo ? { x: template.photo.x, y: isSquare ? 0.35 : isLandscape ? 0.45 : template.photo.y, radius: isLandscape ? 120 : template.photo.radius } : { x: 0.5, y: 0.25, radius: 140 },
            { x: isLandscape ? 0.15 : 0.22, y: isSquare ? 0.48 : isLandscape ? 0.48 : 0.38, radius: isLandscape ? 90 : 110 },
            { x: isLandscape ? 0.85 : 0.78, y: isSquare ? 0.48 : isLandscape ? 0.48 : 0.38, radius: isLandscape ? 90 : 110 }
          ];

          const pc = photoConfigs[i];
          const cx = W * pc.x;
          const cy = H * pc.y;
          const r = pc.radius * (0.3 + pPhoto * 0.7);

          // Outer Gold Glow
          ctx.beginPath(); ctx.arc(cx, cy, r + 20, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,215,0,0.05)'; ctx.fill();

          // Golden hue border
          const hue = (timeRef.current * 1.5) % 360;
          const borderGrad = ctx.createLinearGradient(cx-r, cy-r, cx+r, cy+r);
          borderGrad.addColorStop(0, `hsl(${(hue+40)%360},80%,60%)`);
          borderGrad.addColorStop(0.5, '#FFD700');
          borderGrad.addColorStop(1, `hsl(${(hue+180)%360},80%,60%)`);

          ctx.beginPath(); ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = borderGrad; ctx.lineWidth = 5; ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 15;
          ctx.stroke();

          // aspect ratio preserve crop drawing (Cover fit!)
          const iw = imgRef.width;
          const ih = imgRef.height;
          const r2 = r * 2;
          let sx = 0, sy = 0, sw = iw, sh = ih;
          if (iw > ih) {
            sw = ih;
            sx = (iw - ih) / 2;
          } else {
            sh = iw;
            sy = (ih - iw) / 2;
          }

          ctx.save();
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
          ctx.drawImage(imgRef, sx, sy, sw, sh, cx-r, cy-r, r2, r2);
          ctx.restore();

          ctx.filter = 'none';

          if (i === 0 && curveTextEnabled && badge && pBadge > 0) {
            drawTextAlongArc(ctx, badge.toUpperCase(), cx, cy, r + 28, -Math.PI / 2, fontFamily);
          }

          if (i === 0 && userName && pName > 0) {
            ctx.save();
            ctx.globalAlpha = pName * pFade;
            
            const ry = cy + r + 30;
            const rw = r * 1.5;
            
            ctx.fillStyle = '#FF9933'; ctx.fillRect(cx - rw, ry, rw * 2, 10);
            ctx.fillStyle = '#FFFFFF'; ctx.fillRect(cx - rw, ry + 10, rw * 2, 10);
            ctx.fillStyle = '#138808'; ctx.fillRect(cx - rw, ry + 20, rw * 2, 10);
            
            ctx.fillStyle = '#000080'; ctx.textAlign = 'center'; ctx.font = 'bold 15px "Outfit"';
            const sashText = occasion === 'independenceDay' ? 'JAI HIND' : occasion === 'republicDay' ? 'JAI BHARAT' : 'VANDE MATARAM';
            ctx.fillText(sashText, cx, ry + 18);
            
            ctx.fillStyle = '#FFD700'; ctx.textAlign = 'center'; ctx.font = `bold 42px "${fontFamily}"`;
            ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 12;
            ctx.fillText(userName, cx, ry + 75);
            ctx.restore();
          }
        });
        break;

      case 'stickers':
        if (stickers.length > 0) {
          ctx.save();
          ctx.globalAlpha = pFade;
          stickers.forEach(s => {
            ctx.font = `${s.size}px "Outfit"`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(s.emoji, W * s.x, H * s.y);
          });
          ctx.restore();
        }
        break;

      case 'drawings':
        if (signatureImgRef.current) {
          ctx.save();
          ctx.globalAlpha = pQuote * pFade;
          ctx.drawImage(signatureImgRef.current, W/2 - 200, isSquare || isLandscape ? H * 0.74 : H * 0.65, 400, 200);
          ctx.restore();
        }
        break;

      case 'text':
        ctx.save();
        ctx.globalAlpha = pFade;

        if (!curveTextEnabled && badge && pBadge > 0) {
          ctx.save(); ctx.globalAlpha = pBadge * pFade;
          const badgeY = isTop ? H * 0.35 : isSquare || isLandscape ? 60 : 80;
          ctx.font = `600 36px "${fontFamily}"`;
          const mw = ctx.measureText(badge).width + 60;
          ctx.fillStyle = 'rgba(255,153,51,0.18)';
          ctx.beginPath(); ctx.roundRect(W/2 - mw/2, badgeY - 30, mw, 50, 25); ctx.fill();
          ctx.strokeStyle = '#FF9933'; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = '#FF9933'; ctx.fillText(badge, W / 2, badgeY + 5);
          ctx.restore();
        }

        if (heading && pHeading > 0) {
          ctx.save(); ctx.globalAlpha = pHeading * pFade;
          const adjustHeadingY = isSquare ? textY - 0.22 : isLandscape ? textY - 0.3 : textY - 0.06;
          drawPremiumText(ctx, heading, W / 2, H * adjustHeadingY, `bold 78px "${fontFamily}"`, textEffect, W * 0.85, 95);
          ctx.restore();
        }

        if (patrioticMsg && pQuote > 0) {
          ctx.save(); ctx.globalAlpha = pQuote * pFade;
          const adjustQuoteY = isSquare ? textY - 0.04 : isLandscape ? textY - 0.12 : textY + 0.08;
          drawPremiumText(ctx, `"${patrioticMsg}"`, W / 2, H * adjustQuoteY, `italic 34px "${fontFamily}"`, textEffect, W * 0.8, 44);
          ctx.restore();
        }

        if (watermarkText) {
          ctx.save(); ctx.globalAlpha = 0.4 * pFade;
          ctx.textAlign = 'right'; ctx.font = '300 24px "Outfit"'; ctx.fillStyle = '#FFFFFF';
          ctx.fillText(watermarkText, W - 40, H - 40);
          ctx.restore();
        }

        ctx.restore();
        break;

      case 'border':
        ctx.save();
        ctx.globalAlpha = pFade;
        const edgeOffset = (timeRef.current * 4) % 200;
        ctx.strokeStyle = themeColors[0];
        ctx.lineWidth = 8;
        ctx.shadowColor = themeColors[0]; ctx.shadowBlur = 15;
        
        ctx.setLineDash([100, 100]);
        ctx.lineDashOffset = -edgeOffset;
        
        ctx.beginPath();
        ctx.roundRect(10, 10, W - 20, H - 20, 24);
        ctx.stroke();
        ctx.restore();
        break;

      default:
        break;
    }
  };

  // ─── REACT LOOP RUNNER (SOLVES CLOSED CLOSURES) ─────────────────
  useEffect(() => {
    let animId;
    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const elapsed = ((performance.now() - startTimeRef.current) / 1000) % statusDuration;
      
      const themeColors = getThemeColors(colorTheme);
      const pFade = elapsed > (statusDuration - 2) ? easeInOut(clamp((statusDuration - elapsed) / 2, 0, 1)) : 1;

      ctx.clearRect(0, 0, W, H);
      timeRef.current++;

      layersOrder.forEach(layerId => {
        drawLayer(layerId, ctx, elapsed, themeColors, pFade);
      });

      const fireworks = fireworksRef.current;
      if (fireworks.length > 0) {
        ctx.save();
        for (let i = fireworks.length - 1; i >= 0; i--) {
          const s = fireworks[i];
          s.x += s.vx; s.y += s.vy; s.alpha -= s.dec;
          if (s.alpha <= 0) { fireworks.splice(i, 1); continue; }
          ctx.globalAlpha = s.alpha * pFade;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = s.color; ctx.shadowBlur = 10; ctx.shadowColor = s.color;
          ctx.fill();
        }
        ctx.restore();
      }

      if (musicEnabled) {
        ctx.save(); ctx.globalAlpha = 0.25 * pFade;
        ctx.strokeStyle = themeColors[2] || '#138808'; ctx.lineWidth = 4;
        ctx.beginPath();
        const waveY = H - 80;
        for (let x = 0; x < W; x += 15) {
          const waveScale = Math.sin((x * 0.01) + (timeRef.current * 0.08));
          const amplitude = 35 * Math.sin(timeRef.current * 0.05) * Math.sin(x * 0.002);
          const y = waveY + (waveScale * amplitude);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.restore();
      }

      animId = requestAnimationFrame(renderLoop);
    };

    startTimeRef.current = performance.now();
    animId = requestAnimationFrame(renderLoop);
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, [template, customBgImage, userImages, occasion, badge, heading, userName, patrioticMsg, musicEnabled, audioBuffer, trimStart, statusDuration, audioEffect, fontFamily, watermarkText, stickers, signatureImage, particleCount, particleSpeed, particleSize, colorTheme, layersOrder, canvasFormat, textEffect, photoBrightness, photoContrast, photoSaturation, curveTextEnabled, W, H]);

  // ─── EXPORT VIDEO ─────────────────────────────────────────────
  const handleExport = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isExporting) return;
    setIsExporting(true); setExportProgress(0);

    startTimeRef.current = performance.now();
    particlesRef.current = initParticles(animType, particleCount, particleSize, W, H);

    const videoStream = canvas.captureStream(30);
    const tracks = [...videoStream.getTracks()];

    let audioCtx2 = null;
    if (musicEnabled) {
      audioCtx2 = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx2.createMediaStreamDestination();

      if (audioBuffer) {
        const source = audioCtx2.createBufferSource();
        source.buffer = audioBuffer;
        if (audioEffect === 'slowed') source.playbackRate.value = 0.82;
        source.connect(dest);
        source.connect(audioCtx2.destination);
        source.start(0, trimStart, statusDuration);
      } else {
        playSynthesizedStyle(audioCtx2, musicStyle, statusDuration, audioEffect, dest);
      }

      dest.stream.getAudioTracks().forEach(t => tracks.push(t));
    }

    const combinedStream = new MediaStream(tracks);
    const chunks = [];
    let mime = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mime)) mime = 'video/webm;codecs=vp8,opus';
    if (!MediaRecorder.isTypeSupported(mime)) mime = 'video/webm';

    const recorder = new MediaRecorder(combinedStream, { mimeType: mime, videoBitsPerSecond: 8000000 });
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mime.split(';')[0] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `national-day-status-${Date.now()}.webm`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsExporting(false); setExportProgress(100);
      if (audioCtx2) audioCtx2.close();
      onExportComplete();
    };

    const duration = statusDuration * 1000;
    recorder.start(100);
    let el = 0;
    const pi = setInterval(() => {
      el += 100;
      setExportProgress(Math.min((el / duration) * 100, 99));
    }, 100);

    setTimeout(() => {
      clearInterval(pi);
      recorder.stop();
    }, duration);
  }, [isExporting, musicEnabled, audioBuffer, trimStart, animType, musicStyle, statusDuration, audioEffect, onExportComplete, particleCount, particleSize, W, H]);

  return (
    <div className="canvas-editor">
      <div 
        className="canvas-frame" 
        style={{ 
          cursor: 'pointer',
          aspectRatio: canvasFormat === 'square' ? '1/1' : canvasFormat === 'landscape' ? '16/9' : '9/16'
        }} 
        onClick={handleCanvasClick}
      >
        <canvas ref={canvasRef} width={W} height={H} className="status-canvas" />
      </div>
      <div className="canvas-actions">
        <button className="btn-export" onClick={handleExport} disabled={isExporting}>
          {isExporting ? (
            <>
              <svg className="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              {t('editor.exporting')} {Math.round(exportProgress)}%
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {t('editor.export')} ({statusDuration}s)
            </>
          )}
        </button>
        {isExporting && (
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${exportProgress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CANVA PRO PREMIUM TEXT STYLES DRAWER ───────────────────────
function drawPremiumText(ctx, text, x, y, font, effect, maxWidth, lineHeight) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = 'center';

  const drawLines = (fillTextFn, strokeTextFn) => {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const totalHeight = lines.length * lineHeight;
    const startY = y - (totalHeight / 2) + (lineHeight / 2);
    for (let i = 0; i < lines.length; i++) {
      const txt = lines[i].trim();
      if (fillTextFn) fillTextFn(txt, x, startY + (i * lineHeight));
      if (strokeTextFn) strokeTextFn(txt, x, startY + (i * lineHeight));
    }
  };

  switch (effect) {
    case 'shadow':
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#FFFFFF';
      drawLines((t, lx, ly) => ctx.fillText(t, lx, ly));
      break;

    case 'neon':
      ctx.shadowColor = '#FF9933';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#FFFFFF';
      drawLines((t, lx, ly) => {
        ctx.fillText(t, lx, ly);
        ctx.fillText(t, lx, ly);
      });
      break;

    case 'hollow':
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      drawLines(null, (t, lx, ly) => ctx.strokeText(t, lx, ly));
      break;

    case 'glitch':
      drawLines((t, lx, ly) => {
        ctx.fillStyle = '#FF0000';
        ctx.fillText(t, lx - 4, ly - 2);
        ctx.fillStyle = '#00FFFF';
        ctx.fillText(t, lx + 4, ly + 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(t, lx, ly);
      });
      break;

    default:
      ctx.fillStyle = '#FFFFFF';
      drawLines((t, lx, ly) => ctx.fillText(t, lx, ly));
      break;
  }
  ctx.restore();
}

// ─── CURVED ARC TEXT DRAWER ──────────────────────────────────────
function drawTextAlongArc(ctx, str, centerX, centerY, radius, startAngle, fontFamily) {
  ctx.save();
  ctx.font = `bold 24px "${fontFamily}"`;
  ctx.fillStyle = '#FFD700';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const totalAngle = 0.95;
  const len = str.length;
  
  ctx.translate(centerX, centerY);
  ctx.rotate(startAngle - totalAngle / 2);

  for (let i = 0; i < len; i++) {
    ctx.save();
    ctx.rotate((i / (len - 1 || 1)) * totalAngle);
    ctx.fillText(str[i], 0, -radius);
    ctx.restore();
  }
  ctx.restore();
}
