import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './CanvasEditor.css';

const W = 1080;
const H = 1920;
const LOOP_DURATION = 25; // 25 seconds for the status

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOut(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }

// ─── INITIALIZE PARTICLE SYSTEMS ──────────────────────────────────
function initParticles(type) {
  const colors = ['#FF9933', '#FFFFFF', '#138808', '#FFD700'];
  
  switch(type) {
    case 'confetti':
      return Array.from({ length: 80 }, () => ({
        x: Math.random() * W, y: Math.random() * H * 2 - H,
        w: 8 + Math.random() * 10, h: 12 + Math.random() * 16,
        vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2, rs: (Math.random() - 0.5) * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.7 + Math.random() * 0.3, phase: Math.random() * Math.PI * 2, ps: 0.01 + Math.random() * 0.02
      }));

    case 'confetti_slow':
      return Array.from({ length: 40 }, () => ({
        x: Math.random() * W, y: Math.random() * H * 2 - H,
        w: 16 + Math.random() * 12, h: 16 + Math.random() * 12,
        vx: (Math.random() - 0.5) * 0.8, vy: 1 + Math.random() * 1.5,
        rot: Math.random() * Math.PI * 2, rs: (Math.random() - 0.5) * 0.03,
        color: colors[Math.floor(Math.random() * 3)], // Tricolor only
        alpha: 0.5 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2, ps: 0.005 + Math.random() * 0.01
      }));

    case 'diyas':
      return Array.from({ length: 40 }, () => ({
        x: Math.random() * W, y: H + Math.random() * 200,
        radius: 4 + Math.random() * 6, vy: -(0.5 + Math.random() * 1.5), vx: (Math.random() - 0.5) * 0.4,
        alpha: Math.random(), ad: 0.01 + Math.random() * 0.02, dir: 1,
        hue: 15 + Math.random() * 30, flicker: Math.random() * Math.PI * 2
      }));

    case 'diyas_ring':
      return Array.from({ length: 16 }, (_, i) => ({
        angle: (i / 16) * Math.PI * 2,
        radius: 6 + Math.random() * 3,
        flicker: Math.random() * Math.PI * 2
      }));

    case 'lotus_diyas':
      return Array.from({ length: 30 }, () => ({
        // Floating from corners
        x: Math.random() > 0.5 ? Math.random() * 200 : W - Math.random() * 200,
        y: H + Math.random() * 100,
        radius: 3 + Math.random() * 5,
        vy: -(0.8 + Math.random() * 1.8),
        vx: (Math.random() - 0.5) * 0.6,
        alpha: 0.3 + Math.random() * 0.7,
        hue: 20 + Math.random() * 20
      }));

    case 'sparkleRain':
      return Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: -Math.random() * H,
        radius: 1.5 + Math.random() * 3.5, vy: 1 + Math.random() * 2.5, vx: (Math.random() - 0.5) * 0.6,
        alpha: Math.random(), ad: 0.01 + Math.random() * 0.03, dir: 1,
        color: ['#FFD700', '#FFFFFF', '#FF9933'][Math.floor(Math.random() * 3)]
      }));

    case 'sparkleRain_dense':
      return Array.from({ length: 120 }, () => ({
        x: Math.random() * W, y: -Math.random() * H,
        radius: 1 + Math.random() * 2.5, vy: 1.5 + Math.random() * 3.5, vx: (Math.random() - 0.5) * 0.4,
        alpha: Math.random(), ad: 0.02 + Math.random() * 0.04, dir: 1,
        color: '#FFFFFF'
      }));

    case 'jets':
      return Array.from({ length: 3 }, (_, i) => ({
        x: -150 - i * 150, y: 300 + i * 100,
        vx: 4.5, vy: 0.2,
        trail: [], maxTrail: 120,
        color: ['#FF9933', '#FFFFFF', '#138808'][i],
        size: 7
      }));

    case 'jets_cross':
      return [
        { x: -100, y: 200, vx: 5, vy: 1.5, trail: [], maxTrail: 100, color: '#FF9933', size: 8 },
        { x: W + 100, y: 200, vx: -5, vy: 1.5, trail: [], maxTrail: 100, color: '#138808', size: 8 }
      ];

    case 'rays':
      return Array.from({ length: 16 }, () => ({
        angle: Math.random() * Math.PI * 2, length: 0.4 + Math.random() * 0.6,
        width: 0.02 + Math.random() * 0.03, alpha: 0.03 + Math.random() * 0.07,
        speed: 0.003 + Math.random() * 0.006,
        color: ['#FF9933', '#FFD700', '#FFFFFF', '#138808'][Math.floor(Math.random() * 4)]
      }));

    case 'rays_gold':
      return Array.from({ length: 24 }, () => ({
        angle: Math.random() * Math.PI * 2, length: 0.3 + Math.random() * 0.5,
        width: 0.01 + Math.random() * 0.02, alpha: 0.04 + Math.random() * 0.06,
        speed: -0.002 - Math.random() * 0.004,
        color: '#FFD700'
      }));

    case 'balloons_float':
      return Array.from({ length: 25 }, () => ({
        x: Math.random() * W, y: H + Math.random() * 300,
        radius: 20 + Math.random() * 25, vy: -(1 + Math.random() * 1.5),
        vx: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * 3)],
        alpha: 0.6 + Math.random() * 0.3,
        swayPhase: Math.random() * Math.PI * 2, swaySpeed: 0.01
      }));

    case 'pulsing_map':
      return { pulse: 0, speed: 0.02 };

    default:
      return [];
  }
}

// ─── AUDIO SYNTHESIZER ──────────────────────────────────────────
function playSynthesizedStyle(audioCtx, style, destinationNode = null) {
  const dest = destinationNode || audioCtx.destination;
  const time = audioCtx.currentTime + 0.1;

  if (style === 'march') {
    // Snare drum rhythm + brass fanfare
    const notes = [
      { f: 293.7, d: 0.25 }, { f: 293.7, d: 0.25 }, { f: 329.6, d: 0.5 },
      { f: 392.0, d: 0.5 }, { f: 392.0, d: 0.25 }, { f: 440.0, d: 0.25 },
      { f: 392.0, d: 0.5 }, { f: 329.6, d: 0.5 }, { f: 293.7, d: 1.0 }
    ];
    let noteTime = time;
    const loops = Math.ceil(LOOP_DURATION / 3.75) + 1;
    for (let l = 0; l < loops; l++) {
      notes.forEach(note => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = note.f;
        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.03);
        gain.gain.linearRampToValueAtTime(0, noteTime + note.d);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(noteTime);
        osc.stop(noteTime + note.d + 0.01);

        // Snare roll noise simulation
        const bufferSize = audioCtx.sampleRate * note.d;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 1000;
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.015, noteTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.d);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(dest);
        noise.start(noteTime);
        noise.stop(noteTime + note.d);

        noteTime += note.d;
      });
    }
  } else if (style === 'ambient') {
    // Sitar-like soothing drone (Pentatonic)
    const notes = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3];
    let droneTime = time;
    const step = 0.8;
    const loops = Math.ceil(LOOP_DURATION / step) + 1;
    for (let l = 0; l < loops; l++) {
      const f = notes[Math.floor(Math.random() * notes.length)];
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = f;
      // Filter to simulate sitar buzz
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = f * 2;
      filter.Q.value = 10;
      filter.gain.value = 15;

      gain.gain.setValueAtTime(0, droneTime);
      gain.gain.linearRampToValueAtTime(0.04, droneTime + 0.3);
      gain.gain.linearRampToValueAtTime(0, droneTime + step * 2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      osc.start(droneTime);
      osc.stop(droneTime + step * 2 + 0.01);
      droneTime += step;
    }
  } else {
    // Anthem Lead (Jana Gana Mana type majestic brass/sine)
    const notes = [
      { f: 261.6, d: 0.5 }, { f: 293.7, d: 0.5 }, { f: 329.6, d: 0.5 }, { f: 392.0, d: 1.0 },
      { f: 440.0, d: 0.5 }, { f: 392.0, d: 0.5 }, { f: 329.6, d: 0.5 }, { f: 293.7, d: 0.5 }
    ];
    let noteTime = time;
    const loops = Math.ceil(LOOP_DURATION / 4.5) + 1;
    for (let l = 0; l < loops; l++) {
      notes.forEach(note => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = note.f;
        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, noteTime + note.d);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(noteTime);
        osc.stop(noteTime + note.d + 0.01);
        noteTime += note.d;
      });
    }
  }
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  if (!text) return y;
  const words = text.split(' ');
  let line = '', curY = y;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[i] + ' ';
      curY += lineH;
    } else { line = test; }
  }
  ctx.fillText(line.trim(), x, curY);
  return curY + lineH;
}

export default function CanvasEditor({ template, userImage, occasion, badge, heading, userName, patrioticMsg, musicEnabled, audioBuffer, trimStart }) {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const bgImgRef = useRef(null);
  const userImgRef = useRef(null);
  const startTimeRef = useRef(performance.now());
  
  // Real-time preview Audio Context
  const audioCtxRef = useRef(null);
  const localSourceRef = useRef(null);

  const animType = template.animation || 'confetti';
  const musicStyle = template.musicStyle || 'anthem';
  const particlesRef = useRef(initParticles(animType));
  const timeRef = useRef(0);

  const [bgLoaded, setBgLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Initialize unique particles
  useEffect(() => {
    particlesRef.current = initParticles(animType);
    startTimeRef.current = performance.now();
  }, [animType]);

  // Load background
  useEffect(() => {
    setBgLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { bgImgRef.current = img; setBgLoaded(true); };
    img.src = template.image;
  }, [template]);

  // Load user image
  useEffect(() => {
    if (!userImage) { userImgRef.current = null; return; }
    const img = new Image();
    img.onload = () => { userImgRef.current = img; };
    img.src = userImage;
  }, [userImage]);

  // Manage real-time preview audio
  useEffect(() => {
    if (!musicEnabled) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;

    if (audioBuffer) {
      // Preview local audio file
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      source.connect(ctx.destination);
      source.start(0, trimStart, 25);
      localSourceRef.current = source;
    } else {
      // Preview synthesized melody matching template style
      playSynthesizedStyle(ctx, musicStyle);
    }

    return () => {
      if (ctx) {
        ctx.close();
        audioCtxRef.current = null;
      }
    };
  }, [musicEnabled, audioBuffer, trimStart, musicStyle]);

  // ─── RENDER LOOP ──────────────────────────────────────────────
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const elapsed = ((performance.now() - startTimeRef.current) / 1000) % LOOP_DURATION;
    timeRef.current++;

    // Timing timeline phases
    const pTemplate = easeOut(clamp(elapsed / 1.5, 0, 1));
    const pBadge    = easeOut(clamp((elapsed - 1.5) / 1.5, 0, 1));
    const pHeading  = easeOut(clamp((elapsed - 3.5) / 2, 0, 1));
    const pParticles= clamp((elapsed - 2) / 2, 0, 1);
    const pPhoto    = easeOut(clamp((elapsed - 6) / 2, 0, 1));
    const pName     = easeOut(clamp((elapsed - 9) / 1.5, 0, 1));
    const pQuote    = easeOut(clamp((elapsed - 11) / 2, 0, 1));
    const pFade     = elapsed > (LOOP_DURATION - 2) ? easeInOut(clamp((LOOP_DURATION - elapsed) / 2, 0, 1)) : 1;

    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = pFade;

    // 1. Background Image
    ctx.globalAlpha = pTemplate * pFade;
    if (bgImgRef.current) {
      const img = bgImgRef.current;
      const ir = img.width / img.height, cr = W / H;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (ir > cr) { sw = img.height * cr; sx = (img.width - sw) / 2; }
      else { sh = img.width / cr; sy = (img.height - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#1a0a00'); g.addColorStop(0.5, '#0a0a14'); g.addColorStop(1, '#001a00');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    ctx.globalAlpha = pFade;

    // 2. Custom Vignettes (top/bottom)
    const textY = template.text?.y || 0.82;
    const isTop = textY < 0.5;
    if (isTop) {
      const g = ctx.createLinearGradient(0, 0, 0, H * 0.4);
      g.addColorStop(0, 'rgba(0,0,0,0.75)'); g.addColorStop(0.7, 'rgba(0,0,0,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * 0.4);
    } else {
      const g = ctx.createLinearGradient(0, H * 0.5, 0, H);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.4, 'rgba(0,0,0,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    // 3. Unique Particle Animation Renderers
    const p = particlesRef.current;
    if (p && pParticles > 0) {
      ctx.globalAlpha = pParticles * pFade;
      
      if (animType === 'confetti') {
        p.forEach(c => {
          c.y += c.vy; c.phase += c.ps; c.x += c.vx + Math.sin(c.phase) * 1.2; c.rot += c.rs;
          if (c.y > H + 40) { c.y = -40; c.x = Math.random() * W; }
          ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot); ctx.globalAlpha = c.alpha * pParticles * pFade;
          ctx.fillStyle = c.color; ctx.shadowColor = c.color; ctx.shadowBlur = 6;
          ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h); ctx.restore();
        });
      }
      
      else if (animType === 'confetti_slow') {
        p.forEach(c => {
          c.y += c.vy; c.phase += c.ps; c.x += c.vx + Math.sin(c.phase) * 0.8; c.rot += c.rs;
          if (c.y > H + 40) { c.y = -40; c.x = Math.random() * W; }
          ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot); ctx.globalAlpha = c.alpha * pParticles * pFade;
          ctx.fillStyle = c.color; ctx.shadowColor = c.color; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.ellipse(0, 0, c.w/2, c.h/2, 0, 0, Math.PI*2); ctx.fill(); ctx.restore();
        });
      }
      
      else if (animType === 'diyas') {
        p.forEach(d => {
          d.y += d.vy; d.x += d.vx + Math.sin(d.flicker += 0.03) * 0.5;
          d.alpha += d.ad * d.dir; if (d.alpha >= 1) d.dir = -1; if (d.alpha <= 0.2) d.dir = 1;
          if (d.y < -30) { d.y = H + 30; d.x = Math.random() * W; }
          ctx.save(); ctx.globalAlpha = d.alpha * pParticles * pFade;
          const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius * 5);
          grad.addColorStop(0, `hsla(${d.hue},100%,70%,0.4)`); grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad; ctx.fillRect(d.x - d.radius * 5, d.y - d.radius * 5, d.radius * 10, d.radius * 10);
          ctx.beginPath(); ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${d.hue},100%,80%,0.9)`; ctx.shadowColor = `hsla(${d.hue},100%,60%,1)`; ctx.shadowBlur = 15;
          ctx.fill(); ctx.restore();
        });
      }

      else if (animType === 'diyas_ring' && userImgRef.current) {
        const pc = template.photo || {x:0.5,y:0.25,radius:140};
        const cx=W*pc.x, cy=H*pc.y, r=pc.radius;
        p.forEach(d => {
          d.angle += 0.005;
          const dx = cx + (r + 40) * Math.cos(d.angle);
          const dy = cy + (r + 40) * Math.sin(d.angle);
          ctx.save(); ctx.globalAlpha = pParticles * pFade;
          const grad = ctx.createRadialGradient(dx, dy, 0, dx, dy, d.radius * 4);
          grad.addColorStop(0, `hsla(${d.flicker},100%,70%,0.3)`); grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad; ctx.fillRect(dx - d.radius * 4, dy - d.radius * 4, d.radius * 8, d.radius * 8);
          ctx.beginPath(); ctx.arc(dx, dy, d.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#FFD700'; ctx.shadowBlur = 15; ctx.shadowColor = '#FFD700';
          ctx.fill(); ctx.restore();
        });
      }

      else if (animType === 'lotus_diyas') {
        p.forEach(d => {
          d.y += d.vy; d.x += d.vx;
          if (d.y < -30) { d.y = H + 30; d.x = Math.random() > 0.5 ? Math.random() * 200 : W - Math.random() * 200; }
          ctx.save(); ctx.globalAlpha = d.alpha * pParticles * pFade;
          ctx.beginPath(); ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${d.hue},100%,75%,0.95)`; ctx.shadowColor = `hsla(${d.hue},100%,50%,1)`; ctx.shadowBlur = 12;
          ctx.fill(); ctx.restore();
        });
      }

      else if (animType === 'sparkleRain') {
        p.forEach(s => {
          s.y += s.vy; s.x += s.vx; s.alpha += s.ad * s.dir; if (s.alpha >= 1) s.dir = -1; if (s.alpha <= 0) s.dir = 1;
          if (s.y > H + 20) { s.y = -20; s.x = Math.random() * W; }
          ctx.save(); ctx.globalAlpha = Math.max(0, s.alpha) * pParticles * pFade;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = s.color; ctx.shadowColor = s.color; ctx.shadowBlur = 12; ctx.fill(); ctx.restore();
        });
      }

      else if (animType === 'sparkleRain_dense') {
        p.forEach(s => {
          s.y += s.vy; s.x += s.vx; s.alpha += s.ad * s.dir; if (s.alpha >= 1) s.dir = -1; if (s.alpha <= 0) s.dir = 1;
          if (s.y > H + 20) { s.y = -20; s.x = Math.random() * W; }
          ctx.save(); ctx.globalAlpha = Math.max(0, s.alpha) * pParticles * pFade;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = s.color; ctx.shadowColor = s.color; ctx.shadowBlur = 8; ctx.fill(); ctx.restore();
        });
      }

      else if (animType === 'jets') {
        p.forEach(j => {
          j.x += j.vx; j.y += j.vy;
          j.trail.push({ x: j.x, y: j.y });
          if (j.trail.length > j.maxTrail) j.trail.shift();
          if (j.x > W + 200) { j.x = -150; j.trail = []; }
          j.trail.forEach((pt, idx) => {
            const a = (idx / j.trail.length) * 0.6 * pParticles * pFade;
            ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(pt.x, pt.y, j.size * (idx / j.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = j.color; ctx.shadowBlur = 8; ctx.shadowColor = j.color; ctx.fill(); ctx.restore();
          });
        });
      }

      else if (animType === 'jets_cross') {
        p.forEach((j, i) => {
          j.x += j.vx; j.y += j.vy;
          j.trail.push({ x: j.x, y: j.y });
          if (j.trail.length > j.maxTrail) j.trail.shift();
          if (i === 0 && j.x > W + 100) { j.x = -100; j.trail = []; }
          if (i === 1 && j.x < -100) { j.x = W + 100; j.trail = []; }
          j.trail.forEach((pt, idx) => {
            const a = (idx / j.trail.length) * 0.6 * pParticles * pFade;
            ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(pt.x, pt.y, j.size * (idx / j.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = j.color; ctx.shadowBlur = 8; ctx.shadowColor = j.color; ctx.fill(); ctx.restore();
          });
        });
      }

      else if (animType === 'rays') {
        const cx = W / 2, cy = H * 0.4;
        p.forEach(r => {
          r.angle += r.speed;
          ctx.save(); ctx.globalAlpha = r.alpha * pParticles * pFade;
          ctx.translate(cx, cy); ctx.rotate(r.angle);
          const grad = ctx.createLinearGradient(0, 0, W * r.length, 0);
          grad.addColorStop(0, r.color); grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad; ctx.fillRect(0, -W * r.width / 2, W * r.length, W * r.width);
          ctx.restore();
        });
      }

      else if (animType === 'rays_gold') {
        const cx = W / 2, cy = H * 0.4;
        p.forEach(r => {
          r.angle += r.speed;
          ctx.save(); ctx.globalAlpha = r.alpha * pParticles * pFade;
          ctx.translate(cx, cy); ctx.rotate(r.angle);
          const grad = ctx.createLinearGradient(0, 0, W * r.length, 0);
          grad.addColorStop(0, r.color); grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad; ctx.fillRect(0, -W * r.width / 2, W * r.length, W * r.width);
          ctx.restore();
        });
      }

      else if (animType === 'balloons_float') {
        p.forEach(b => {
          b.y += b.vy; b.swayPhase += b.swaySpeed; b.x += b.vx + Math.sin(b.swayPhase) * 1.5;
          if (b.y < -b.radius * 2) { b.y = H + b.radius * 2; b.x = Math.random() * W; }
          ctx.save(); ctx.globalAlpha = b.alpha * pParticles * pFade;
          ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = b.color; ctx.shadowBlur = 10; ctx.shadowColor = b.color; ctx.fill();
          // Draw balloon string
          ctx.beginPath(); ctx.moveTo(b.x, b.y + b.radius); ctx.lineTo(b.x, b.y + b.radius + 35);
          ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2; ctx.stroke();
          ctx.restore();
        });
      }

      else if (animType === 'pulsing_map') {
        p.pulse += p.speed;
        const scale = 1 + 0.03 * Math.sin(p.pulse);
        ctx.save(); ctx.globalAlpha = 0.15 * pParticles * pFade;
        ctx.translate(W/2, H/2); ctx.scale(scale, scale);
        // Draw decorative ring
        ctx.beginPath(); ctx.arc(0, 0, 360, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 6; ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = pFade;
    }

    // 4. User photo (circular with gold ring)
    if (userImgRef.current && pPhoto > 0) {
      const pc = template.photo || { x: 0.5, y: 0.25, radius: 140 };
      const cx = W * pc.x;
      const cy = H * pc.y;
      const r = pc.radius;
      const scale = 0.3 + pPhoto * 0.7;
      const curR = r * scale;

      ctx.save(); ctx.globalAlpha = pPhoto * pFade;
      ctx.beginPath(); ctx.arc(cx, cy, curR + 25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.06)';
      ctx.fill();

      // Golden ring
      const hue = (elapsed * 60) % 360;
      const bg = ctx.createLinearGradient(cx - curR, cy - curR, cx + curR, cy + curR);
      bg.addColorStop(0, `hsl(${(hue + 30) % 360}, 80%, 60%)`);
      bg.addColorStop(0.5, '#FFD700');
      bg.addColorStop(1, `hsl(${(hue + 150) % 360}, 80%, 60%)`);
      ctx.beginPath(); ctx.arc(cx, cy, curR + 5, 0, Math.PI * 2);
      ctx.strokeStyle = bg; ctx.lineWidth = 5; ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 20;
      ctx.stroke();

      // Clip and draw image
      ctx.beginPath(); ctx.arc(cx, cy, curR, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(userImgRef.current, cx - curR, cy - curR, curR * 2, curR * 2);
      ctx.restore();

      // Name underneath photo
      if (userName && pName > 0) {
        ctx.save(); ctx.globalAlpha = pName * pFade; ctx.textAlign = 'center';
        ctx.font = 'bold 42px "Outfit", sans-serif'; ctx.fillStyle = '#FFD700';
        ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 15;
        ctx.fillText(userName, cx, cy + curR + 55);
        ctx.restore();
      }
    }

    // 5. Badge (e.g. Occasion badge)
    if (badge && pBadge > 0) {
      ctx.save(); ctx.globalAlpha = pBadge * pFade; ctx.textAlign = 'center';
      const badgeY = isTop ? H * 0.35 : 80;
      ctx.font = '600 36px "Outfit", sans-serif';
      const mw = ctx.measureText(badge).width + 60;
      ctx.fillStyle = 'rgba(255,153,51,0.15)';
      ctx.beginPath();
      const bx = W / 2 - mw / 2, by = badgeY - 30;
      ctx.roundRect(bx, by, mw, 50, 25); ctx.fill();
      ctx.strokeStyle = 'rgba(255,153,51,0.5)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#FF9933'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 10;
      ctx.fillText(badge, W / 2, badgeY + 5);
      ctx.restore();
    }

    // 6. Main Heading
    if (heading && pHeading > 0) {
      ctx.save(); ctx.globalAlpha = pHeading * pFade; ctx.textAlign = 'center';
      ctx.font = 'bold 78px "Playfair Display", serif'; ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 3;
      const gy = H * (textY - 0.06);
      wrapText(ctx, heading, W / 2, gy, W * 0.85, 95);
      ctx.restore();
    }

    // 7. Patriotic Quote / Message
    if (patrioticMsg && pQuote > 0) {
      ctx.save(); ctx.globalAlpha = pQuote * pFade; ctx.textAlign = 'center';
      ctx.font = 'italic 34px "Outfit", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 10;
      const qy = H * (textY + 0.08);
      wrapText(ctx, `"${patrioticMsg}"`, W / 2, qy, W * 0.8, 44);
      ctx.restore();
    }

    // 8. Bottom Tricolor Line
    ctx.globalAlpha = pFade;
    const barH = 8, barY = H - barH;
    ctx.fillStyle = '#FF9933'; ctx.fillRect(0, barY, W / 3, barH);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(W / 3, barY, W / 3, barH);
    ctx.fillStyle = '#138808'; ctx.fillRect(W / 3 * 2, barY, W / 3, barH);

    animRef.current = requestAnimationFrame(render);
  }, [t, occasion, badge, heading, userName, patrioticMsg, template, animType]);

  // Start/stop animation
  useEffect(() => {
    startTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(render);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [render]);

  // ─── EXPORT VIDEO ─────────────────────────────────────────────
  const handleExport = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isExporting) return;
    setIsExporting(true); setExportProgress(0);

    startTimeRef.current = performance.now();
    particlesRef.current = initParticles(animType);

    const videoStream = canvas.captureStream(30);
    const tracks = [...videoStream.getTracks()];

    let audioCtx2 = null;
    if (musicEnabled) {
      audioCtx2 = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx2.createMediaStreamDestination();

      if (audioBuffer) {
        // Play local custom trim source into destination
        const source = audioCtx2.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(dest);
        source.connect(audioCtx2.destination);
        source.start(0, trimStart, 25);
      } else {
        // Play synthesized music style into destination
        playSynthesizedStyle(audioCtx2, musicStyle, dest);
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
    };

    const duration = LOOP_DURATION * 1000;
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
  }, [isExporting, musicEnabled, audioBuffer, trimStart, animType, musicStyle]);

  return (
    <div className="canvas-editor">
      <div className="canvas-frame">
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
              {t('editor.export')} (25s)
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
