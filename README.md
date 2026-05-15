# 🍉 AR Fruit Ninja

A real-time AR Fruit Ninja game built with Three.js + Python MediaPipe hand tracking.

![Game Preview](src/assets/hero.png)

## ✨ Features
- 3D fruit models with slice effects
- Wooden AR background
- AI hand tracking via webcam (index finger mode)
- Golden magic slash trail
- Juice splatter effects
- Combo multiplier system
- Easy / Medium / Hard difficulty
- Epic cinematic UI with animations
- High score saving per difficulty

## 🛠️ Tech Stack
- **Frontend:** Three.js, Vite, JavaScript
- **Hand Tracking:** Python 3.11, MediaPipe, OpenCV, WebSockets

## 🚀 How to Run

### 1. Clone the repo
```bash
git clone https://github.com/SSwagatikaa/fruit-ninja-ar-ver.git
cd fruit-ninja-ar-ver
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install Python dependencies
```bash
py -3.11 -m pip install mediapipe==0.10.9 opencv-python websockets cvzone
```

### 4. Download hand tracking model
```bash
curl -o hand_landmarker.task https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task
```

### 5. Run the game

**Terminal 1 — Start game server:**
```bash
npm run dev
```

**Terminal 2 — Start hand tracker (finger mode only):**
```bash
py -3.11 hand_server.py
```

Then open **http://localhost:5173** in your browser.

## 🎮 How to Play

### 🖱️ Cursor Mode
- Hold & drag mouse to slice fruits
- Avoid bombs — instant game over
- Slice multiple fruits at once for combos
- Miss 3 fruits and it's game over

### ☝️ Finger Mode (AI Hand Tracking)
- Make sure `hand_server.py` is running
- Select **Finger** mode on start screen
- Allow camera access when prompted
- Raise your **index finger** in front of webcam
- Move it across fruits to slice them
- Toggle **Mirror** if direction feels wrong

## 📦 3D Assets
Fruit GLB models from [poly.pizza](https://poly.pizza) and [kenney.nl](https://kenney.nl)

## 🙏 Credits
Built with ❤️ using Three.js, MediaPipe, and OpenCV
## 🖥️ Run Locally (with Finger Mode)

Select **Finger Mode** → allow camera → raise index finger to slice!

## 🌐 Play Online (Cursor Mode only)
👉 https://fruit-ninja-ar-ver.netlify.app