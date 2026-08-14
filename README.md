# DeshVibes Status Maker 🇮🇳

> A premium, mobile-first React status-builder application utilizing HTML5 Canvas and Web Audio API synthesis to create customized 25-second animated patriotic videos with background music, completely resolving permission-heavy screen recording issues.

[Live Demo](http://localhost:5174) • [GitHub Repository](https://github.com/raviattrash-pro/deshvibes-status-maker.git)

---

## 📌 Overview

**The Problem:** Existing national day status-maker apps are either basic static image creators, generate cartoonish cartoons, or require heavy, privacy-intrusive browser screen-recording permissions to capture animations, leading to high user drop-off rates on mobile devices.

**The Solution:** DeshVibes Status Maker runs completely client-side in the browser. By drawing everything on a high-performance **HTML5 Canvas** (60 FPS particles, vignettes, templates, and dynamic gold ring overlays) and combining it with the **Web Audio API** (synthesizing patriotic tracks or trimming custom uploads), the app uses `canvas.captureStream()` to record a 25-second high-definition WebM/MP4 video silently in the background—requiring **zero permissions** from the user.

---

## 🛠️ Tech Stack

- **Frontend Core:** React.js (Vite environment)
- **Visuals & Compositing:** HTML5 Canvas API (60 FPS rendering loop)
- **Audio Processing:** Web Audio API (real-time melody synthesis & local audio trimming/slicing)
- **Localization:** i18next (full translations for 11 Indian languages)
- **Styling:** CSS3 (Custom Glassmorphism, animations, & mobile-first media queries)
- **Video Packaging:** MediaRecorder API (Real-time stream bundling)

---

## ✨ Key Features

- **🖼️ 13 Premium Photorealistic Templates:** High-quality monument overlays representing Indian heritage (Red Fort, India Gate, Parliament, Taj Mahal, etc.) stored locally for rapid loading.
- **🌐 Deep i18n Localization:** Complete localization for 11 Indian languages (Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, and English). 
- **✍️ Personalized Text Customization:** Interactive inputs for Badge/Occasion, Main Heading, Your Name, and a Patriotic Message that dynamically update based on selected language and occasion.
- **🎵 Dynamic Audio & Trimming:** Real-time synthesized melodies (Brass Anthem, Ambient Sitar, and Fanfare March) or upload your own local song and trim the exact 25-second starting offset with an interactive slider.
- **📱 Mobile-First Responsive Design:** Fully responsive layout with sticky headers and scrollable touch panels, optimized for portrait mobile screens.
- **📥 One-Click Permissionless Export:** Instantly mixes canvas video frames and audio buffer tracks into a downloadable `.webm` status video.

---

## 🏗️ Architecture

```text
  ┌────────────────────────────────────────────────────────┐
  │                       USER INPUTS                      │
  │  (Crop Photo, Input Name/Message, Select Music/Trim)   │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                    REACT CONTROLLER                    │
  │            (State Management & i18n Sync)              │
  └───────┬────────────────────────────────────────┬───────┘
          │                                        │
          ▼ (Real-time Canvas Render)              ▼ (Audio Synthesis/Trim)
  ┌────────────────────────┐              ┌────────────────────────┐
  │      HTML5 CANVAS      │              │     WEB AUDIO API      │
  │    1080x1920 @60FPS    │              │ (Trimmed Buffer/Synth) │
  └───────┬────────────────┘              └────────┬───────────────┘
          │                                        │
          ▼ (canvas.captureStream())               ▼ (dest.stream)
  ┌────────────────────────────────────────────────────────┐
  │                   MEDIARECORDER MIXER                  │
  │        (Combines Video Tracks + Audio Tracks)          │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                  LOCAL FILE DOWNLOAD                   │
  │               (High Quality WebM Video)                │
  └────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```text
D:\NationalDay
├── public/
│   ├── templates/          # 13 Premium patriotic background templates
│   └── favicon.svg         # App Icon
├── src/
│   ├── assets/             # Brand logos and base icons
│   ├── components/
│   │   ├── CanvasEditor.jsx # Core canvas rendering & MediaRecorder export
│   │   ├── ImageCropper.jsx # Responsive round photo cropping tool
│   │   ├── TemplateGallery.jsx # 3D template selector grid
│   │   └── LanguageSelector.jsx # Country/Flag translation selector
│   ├── data/
│   │   └── templates.js    # Per-template placement coordinates & styles
│   ├── i18n.js             # 11-language translation resources dictionary
│   ├── App.jsx             # Main layout, forms, and states coordinator
│   ├── index.css           # Global typography & glassmorphism system
│   └── main.jsx            # Entry point linking React and i18n
├── index.html              # HTML shell & Google Fonts imports
└── vite.config.js          # Vite build config
```

---

## 🔌 API & Integration Workflow

### 1. Silent Stream Capture & Audio Mixing
The application extracts the video stream from the canvas and merges it with the output node of the Web Audio context:
```javascript
const videoStream = canvas.captureStream(30); // Capture 30 FPS video
const tracks = [...videoStream.getTracks()];

if (musicEnabled) {
  const dest = audioCtx.createMediaStreamDestination();
  // Connect synthesized nodes or trimmed source buffers to the destination stream...
  dest.stream.getAudioTracks().forEach(t => tracks.push(t));
}

const combinedStream = new MediaStream(tracks);
```

### 2. Live Audio Trimming Configuration
When a local file is uploaded, it is decoded into an `AudioBuffer` and sliced using standard offsets:
```javascript
const source = audioCtx.createBufferSource();
source.buffer = audioBuffer;
source.connect(audioCtx.destination);
source.start(0, trimStart, 25); // Plays the selected 25s window
```

---

## ⚡ How to Run & Deploy

### Prerequisites
- Node.js (v18 or higher)

### Setup & Local Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open **http://localhost:5173** (or http://localhost:5174) in your browser.

### Cloud Deployment (Vercel)
The project is built specifically to deploy directly on Vercel:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Root Directory:** `./`

---

## 👥 Author
* **Ravi Prasad** — [GitHub Profile](https://github.com/raviattrash-pro)
