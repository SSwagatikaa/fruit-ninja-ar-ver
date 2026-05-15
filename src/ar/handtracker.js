const IS_LOCAL = window.location.hostname === 'localhost'
const WS_URL = 'ws://localhost:8765'

let onSliceCallback = null
let cursorEl = null
let ws = null

// trail canvas
let trailCanvas, trailCtx
const trailPoints = []
const MAX_TRAIL = 15

export function initHandTracker(onSlice) {
  onSliceCallback = onSlice
  createCursor()
  initFingerTrail()

  if (IS_LOCAL) {
    console.log('Using Python WebSocket hand tracker')
    connectWebSocket()
  } else {
    console.log('Using TensorFlow.js hand tracker')
    initTFHandTracker()
  }
}

// ── TensorFlow.js hand tracking (online) ──────────────────────────────────
async function initTFHandTracker() {
  try {
    // show loading message
    const loading = document.createElement('div')
    loading.id = 'tf-loading'
    loading.style.cssText = `
      position: fixed;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      border: 1px solid #ff8800;
      border-radius: 8px;
      padding: 10px 20px;
      font-family: 'Arial Black', sans-serif;
      font-size: 13px;
      color: #ff8800;
      z-index: 9999;
      letter-spacing: 2px;
    `
    loading.textContent = '⚡ Loading hand tracker...'
    document.body.appendChild(loading)

    await window.tf.ready()

    const model = window.handPoseDetection.SupportedModels.MediaPipeHands
    const detector = await window.handPoseDetection.createDetector(model, {
      runtime: 'tfjs',
      modelType: 'lite',
      maxHands: 1
    })

    loading.textContent = '✅ Hand tracker ready!'
    setTimeout(() => loading.remove(), 2000)

    // get camera feed
    const video = document.createElement('video')
    video.id = 'hand-tracker-video'
    video.setAttribute('playsinline', '')
    video.setAttribute('autoplay', '')
    video.muted = true
    video.style.cssText = `
      position: fixed;
      width: 1px; height: 1px;
      opacity: 0; pointer-events: none;
    `
    document.body.appendChild(video)

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 },
      audio: false
    })
    video.srcObject = stream
    await new Promise(resolve => {
  video.onloadeddata = () => resolve()
})
    await video.play()
    await new Promise(resolve => setTimeout(resolve, 1000))
    detectTFHands(detector, video)

  } catch (err) {
    console.error('TF hand tracker failed:', err)
    const el = document.getElementById('tf-loading')
    if (el) {
      el.textContent = '❌ Hand tracker failed — check camera permissions'
      el.style.color = '#ff3333'
      setTimeout(() => el.remove(), 3000)
    }
  }
}

async function detectTFHands(detector, video) {
  if (!video || video.readyState < 2 || video.videoWidth === 0) {
    requestAnimationFrame(() => detectTFHands(detector, video))
    return
  }

  try {
    const hands = await detector.estimateHands(video, {
      flipHorizontal: true
    })

    if (hands.length > 0) {
      const kp = hands[0].keypoints
      const tip = kp[8]   // index tip
      const mid = kp[6]   // index mid
      const wrist = kp[0] // wrist

      // finger is "up" if tip is above wrist by 20% of video height
      const isPointing = (wrist.y - tip.y) > (video.videoHeight * 0.2)

      const screenX = window.handMirror
        ? (1 - tip.x / video.videoWidth) * window.innerWidth
        : (tip.x / video.videoWidth) * window.innerWidth
      const screenY = (tip.y / video.videoHeight) * window.innerHeight

      updateCursor(screenX, screenY, isPointing)
      addTrailPoint(screenX, screenY, isPointing)
      if (isPointing && onSliceCallback) onSliceCallback(screenX, screenY)

    } else {
      hideCursor()
    }
  } catch (e) {
    console.warn('Detection error:', e)
  }

  await new Promise(r => setTimeout(r, 32))
  requestAnimationFrame(() => detectTFHands(detector, video))
}

// ── Python WebSocket hand tracking (local) ────────────────────────────────
function connectWebSocket() {
  ws = new WebSocket(WS_URL)
  let lastProcess = 0

  ws.onopen = () => console.log('Hand tracker connected!')

  ws.onmessage = (event) => {
    const now = performance.now()

    let data
    try {
      data = JSON.parse(event.data)
    } catch (e) {
      return
    }

    const { x, y, active: isActive } = data

    if (!isActive && now - lastProcess < 16) return
    lastProcess = now

    const screenX = window.handMirror
      ? (1 - parseFloat(x)) * window.innerWidth
      : parseFloat(x) * window.innerWidth

    const screenY = parseFloat(y) * window.innerHeight

    updateCursor(screenX, screenY, isActive)
    addTrailPoint(screenX, screenY, isActive)

    if (isActive && onSliceCallback) onSliceCallback(screenX, screenY)
  }

  ws.onclose = () => {
    console.log('Reconnecting...')
    setTimeout(connectWebSocket, 500)
  }

  ws.onerror = (err) => console.warn('WebSocket error:', err)
}

// ── Trail ─────────────────────────────────────────────────────────────────
function initFingerTrail() {
  trailCanvas = document.createElement('canvas')
  trailCanvas.width = window.innerWidth
  trailCanvas.height = window.innerHeight
  trailCanvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 9996;
  `
  document.body.appendChild(trailCanvas)
  trailCtx = trailCanvas.getContext('2d')

  window.addEventListener('resize', () => {
    trailCanvas.width = window.innerWidth
    trailCanvas.height = window.innerHeight
  })

  requestAnimationFrame(drawFingerTrail)
}

function addTrailPoint(x, y, active) {
  trailPoints.push({ x, y, active, age: 1.0 })
  if (trailPoints.length > MAX_TRAIL) trailPoints.shift()
}

function drawFingerTrail() {
  trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height)

  for (let i = 1; i < trailPoints.length; i++) {
    const p1 = trailPoints[i - 1]
    const p2 = trailPoints[i]
    if (!p2.active) continue

    const alpha = (i / trailPoints.length) * p2.age

    trailCtx.beginPath()
    trailCtx.moveTo(p1.x, p1.y)
    trailCtx.lineTo(p2.x, p2.y)
    trailCtx.strokeStyle = `rgba(255,200,0,${alpha * 0.2})`
    trailCtx.lineWidth = 18 * alpha
    trailCtx.lineCap = 'round'
    trailCtx.stroke()

    trailCtx.beginPath()
    trailCtx.moveTo(p1.x, p1.y)
    trailCtx.lineTo(p2.x, p2.y)
    trailCtx.strokeStyle = `rgba(255,230,50,${alpha * 0.5})`
    trailCtx.lineWidth = 8 * alpha
    trailCtx.lineCap = 'round'
    trailCtx.stroke()

    trailCtx.beginPath()
    trailCtx.moveTo(p1.x, p1.y)
    trailCtx.lineTo(p2.x, p2.y)
    trailCtx.strokeStyle = `rgba(255,255,255,${alpha * 0.9})`
    trailCtx.lineWidth = 2 * alpha
    trailCtx.lineCap = 'round'
    trailCtx.stroke()

    if (i % 2 === 0 && Math.random() > 0.6) {
      trailCtx.beginPath()
      trailCtx.arc(p2.x, p2.y, Math.random() * 3, 0, Math.PI * 2)
      trailCtx.fillStyle = `rgba(255,215,0,${alpha})`
      trailCtx.fill()
    }
  }

  for (let i = trailPoints.length - 1; i >= 0; i--) {
    trailPoints[i].age -= 0.08
    if (trailPoints[i].age <= 0) trailPoints.splice(i, 1)
  }

  requestAnimationFrame(drawFingerTrail)
}

// ── Cursor ────────────────────────────────────────────────────────────────
function createCursor() {
  cursorEl = document.createElement('div')
  cursorEl.style.cssText = `
    position: fixed;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9997;
    transform: translate(-50%, -50%);
    display: none;
    border: 3px solid white;
  `
  document.body.appendChild(cursorEl)
}

function updateCursor(x, y, active) {
  if (!cursorEl) return
  cursorEl.style.display = 'block'
  cursorEl.style.left = `${x}px`
  cursorEl.style.top = `${y}px`
  cursorEl.style.background = active ? 'rgba(255,215,0,0.9)' : 'rgba(255,255,255,0.2)'
  cursorEl.style.boxShadow = active ? '0 0 20px rgba(255,215,0,0.9)' : 'none'
}

function hideCursor() {
  if (cursorEl) cursorEl.style.display = 'none'
}