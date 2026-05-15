let videoEl = null
let woodBg = null

export function initCamera(controlMode = 'cursor') {
  if (controlMode === 'cursor') {
    // wooden background
    woodBg = document.createElement('div')
    woodBg.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-image: url('/assets/wood.jpg');
      background-size: cover;
      background-position: center;
      z-index: -1;
      filter: brightness(0.4) opacity(0.85);
    `
    document.body.appendChild(woodBg)
    return
  }

  // AR camera for hand mode
  videoEl = document.createElement('video')
  videoEl.setAttribute('playsinline', '')
  videoEl.setAttribute('autoplay', '')
  videoEl.muted = true
  videoEl.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    z-index: -1;
    transform: scaleX(-1);
  `

  navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user' },
    audio: false
  })
  .then(stream => {
    videoEl.srcObject = stream
    document.body.appendChild(videoEl)
  })
  .catch(err => {
    console.error('Camera failed:', err)
  })
}

export function getVideoElement() {
  return videoEl
}