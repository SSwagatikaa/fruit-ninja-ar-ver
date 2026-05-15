const WS_URL = window.location.hostname === 'localhost' 
  ? 'ws://localhost:8765'
  : null  // no hand tracking on deployed version

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

  if (WS_URL) {
    connectWebSocket()
  } else {
    // on deployed version — show message
    showNoHandTrackerMessage()
  }
}

function showNoHandTrackerMessage() {
  const el = document.createElement('div')
  el.style.cssText = `
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.85);
    border: 2px solid #ff8800;
    border-radius: 12px;
    padding: 24px 32px;
    font-family: 'Arial Black', sans-serif;
    color: white;
    text-align: center;
    z-index: 9999;
    max-width: 380px;
  `
  el.innerHTML = `
    <div style="font-size:32px; margin-bottom:12px;">☝️</div>
    <h3 style="color:#ff8800; margin-bottom:8px;">Finger Mode</h3>
    <p style="font-size:14px; color:#aaa; line-height:1.8;">
      Finger mode requires running<br>
      <b style="color:white;">hand_server.py</b> locally.<br><br>
      Clone the repo and run:<br>
      <code style="color:#ffdd00;">py -3.11 hand_server.py</code><br><br>
      Then open <b style="color:white;">localhost:5173</b>
    </p>
    <button id="close-msg" style="
      margin-top:16px;
      padding:10px 24px;
      background:linear-gradient(180deg,#ffdd00,#ff8800);
      color:#000; border:none;
      border-radius:6px; cursor:pointer;
      font-family:'Arial Black',sans-serif;
    ">Got it</button>
  `
  document.body.appendChild(el)
  document.getElementById('close-msg').addEventListener('click', () => el.remove())
}

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