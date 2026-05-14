const sounds = {
  slice: new Audio('/src/audio/slice.wav'),
  bomb:  new Audio('/src/audio/bomb.wav'),
  miss:  new Audio('/src/audio/miss.wav'),
  combo: new Audio('/src/audio/combo.wav'),
  bg:    new Audio('/src/audio/bg.wav'),
}
// Web Audio for UI sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

function playUITone(freq, type = 'sine', duration = 0.1, vol = 0.3) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration)
  gain.gain.setValueAtTime(vol, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
  osc.start(audioCtx.currentTime)
  osc.stop(audioCtx.currentTime + duration)
}
// Adjust individual volume levels
sounds.slice.volume = 0.7
sounds.bomb.volume  = 0.9
sounds.miss.volume  = 0.6
sounds.combo.volume = 0.8
sounds.bg.volume    = 0.3
sounds.bg.loop      = true

export function initSounds() {
  // bg music starts on first user interaction
  document.addEventListener('pointerdown', () => {
    sounds.bg.play().catch(() => {})
  }, { once: true })
}

export function playSlice() {
  sounds.slice.currentTime = 0
  sounds.slice.play().catch(() => {})
}

export function playBomb() {
  sounds.bomb.currentTime = 0
  sounds.bomb.play().catch(() => {})
}

export function playMiss() {
  sounds.miss.currentTime = 0
  sounds.miss.play().catch(() => {})
}

export function playCombo() {
  sounds.combo.currentTime = 0
  sounds.combo.play().catch(() => {})
}