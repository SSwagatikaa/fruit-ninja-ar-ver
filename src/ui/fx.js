import * as THREE from 'three'

let scene

// ---- Magic Spark Trail ----
let trailCanvas, trailCtx
const sparks = []

// ---- Juice Splatter ----
let splatCanvas, splatCtx

export function initFX(sceneRef) {
  scene = sceneRef
  initTrail()
  initSplatterCanvas()
}

function initSplatterCanvas() {
  splatCanvas = document.createElement('canvas')
  splatCanvas.width = window.innerWidth
  splatCanvas.height = window.innerHeight
  splatCanvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 997;
  `
  document.body.appendChild(splatCanvas)
  splatCtx = splatCanvas.getContext('2d')

  window.addEventListener('resize', () => {
    splatCanvas.width = window.innerWidth
    splatCanvas.height = window.innerHeight
  })
}

export function juiceSplatter(screenX, screenY, color) {
  const hexColor = '#' + color.toString(16).padStart(6, '0')
  const count = 12

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5
    const dist = 20 + Math.random() * 60
    const x = screenX + Math.cos(angle) * dist
    const y = screenY + Math.sin(angle) * dist
    const radius = 4 + Math.random() * 12

    splatCtx.beginPath()
    splatCtx.arc(x, y, radius, 0, Math.PI * 2)
    splatCtx.fillStyle = hexColor + 'cc'
    splatCtx.fill()

    // drip effect
    if (Math.random() > 0.5) {
      const dripLen = 10 + Math.random() * 30
      splatCtx.beginPath()
      splatCtx.moveTo(x, y + radius)
      splatCtx.lineTo(x + (Math.random() - 0.5) * 10, y + radius + dripLen)
      splatCtx.strokeStyle = hexColor + '99'
      splatCtx.lineWidth = radius * 0.6
      splatCtx.lineCap = 'round'
      splatCtx.stroke()
    }
  }

  // center splat
  splatCtx.beginPath()
  splatCtx.arc(screenX, screenY, 18, 0, Math.PI * 2)
  splatCtx.fillStyle = hexColor + 'aa'
  splatCtx.fill()

  // fade out after 2 seconds
  setTimeout(() => {
    fadeSplat(screenX, screenY, 80)
  }, 1000)
}

function fadeSplat(x, y, radius) {
  let r = 0
  const interval = setInterval(() => {
    splatCtx.save()
    splatCtx.globalCompositeOperation = 'destination-out'
    splatCtx.beginPath()
    splatCtx.arc(x, y, r, 0, Math.PI * 2)
    splatCtx.fillStyle = 'rgba(0,0,0,0.05)'
    splatCtx.fill()
    splatCtx.restore()
    r += 1
    if (r > radius) clearInterval(interval)
  }, 16)
}

function initTrail() {
  trailCanvas = document.createElement('canvas')
  trailCanvas.width = window.innerWidth
  trailCanvas.height = window.innerHeight
  trailCanvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 998;
  `
  document.body.appendChild(trailCanvas)
  trailCtx = trailCanvas.getContext('2d')

  window.addEventListener('resize', () => {
    trailCanvas.width = window.innerWidth
    trailCanvas.height = window.innerHeight
  })

  let isSlicing = false
  window.addEventListener('pointerdown', () => isSlicing = true)
  window.addEventListener('pointerup', () => isSlicing = false)

  window.addEventListener('pointermove', (e) => {
    if (!isSlicing) return

    for (let i = 0; i < 4; i++) {
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1.0,
        decay: 0.05 + Math.random() * 0.05,
        size: 1 + Math.random() * 1.5,
        color: getSparkColor()
      })
    }
  })

  requestAnimationFrame(drawTrail)
}

function getSparkColor() {
  const colors = [
    '255, 215, 0',
    '255, 200, 0',
    '255, 230, 50',
    '255, 180, 0',
    '255, 255, 150',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

function drawTrail() {
  trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height)

  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i]

    s.vy += 0.15
    s.x += s.vx
    s.y += s.vy
    s.life -= s.decay

    if (s.life <= 0) {
      sparks.splice(i, 1)
      continue
    }

    const alpha = s.life

    trailCtx.beginPath()
    trailCtx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2)
    trailCtx.fillStyle = `rgba(${s.color}, ${alpha * 0.12})`
    trailCtx.fill()

    trailCtx.beginPath()
    trailCtx.arc(s.x, s.y, s.size * 1.2, 0, Math.PI * 2)
    trailCtx.fillStyle = `rgba(${s.color}, ${alpha * 0.35})`
    trailCtx.fill()

    trailCtx.beginPath()
    trailCtx.arc(s.x, s.y, s.size * 0.4, 0, Math.PI * 2)
    trailCtx.fillStyle = `rgba(255, 255, 220, ${alpha})`
    trailCtx.fill()

    trailCtx.save()
    trailCtx.translate(s.x, s.y)
    trailCtx.rotate(s.life * 5)
    trailCtx.strokeStyle = `rgba(${s.color}, ${alpha * 0.7})`
    trailCtx.lineWidth = 0.6
    for (let j = 0; j < 4; j++) {
      const angle = (j / 4) * Math.PI * 2
      trailCtx.beginPath()
      trailCtx.moveTo(0, 0)
      trailCtx.lineTo(Math.cos(angle) * s.size * 3, Math.sin(angle) * s.size * 3)
      trailCtx.stroke()
    }
    trailCtx.restore()
  }

  requestAnimationFrame(drawTrail)
}

// ---- Screen Shake ----
export function screenShake(intensity = 10, duration = 400) {
  const body = document.body
  const start = performance.now()

  function shake(time) {
    const elapsed = time - start
    if (elapsed > duration) {
      body.style.transform = 'translate(0, 0)'
      return
    }

    const progress = 1 - elapsed / duration
    const x = (Math.random() - 0.5) * intensity * progress
    const y = (Math.random() - 0.5) * intensity * progress
    body.style.transform = `translate(${x}px, ${y}px)`

    requestAnimationFrame(shake)
  }

  requestAnimationFrame(shake)
}

// ---- Splash ----
export function splashEffect(position, color) {
  const particles = []
  const count = 10

  for (let i = 0; i < count; i++) {
    const geo = new THREE.SphereGeometry(0.015, 6, 6)
    const mat = new THREE.MeshLambertMaterial({ color })
    const p = new THREE.Mesh(geo, mat)

    p.position.copy(position)
    p.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.06,
      Math.random() * 0.06,
      (Math.random() - 0.5) * 0.06
    )
    p.userData.life = 1.0

    scene.add(p)
    particles.push(p)
  }

  animateParticles(particles)
}

// ---- Slice halves ----
export function sliceEffect(position, color) {
  const leftGeo = new THREE.SphereGeometry(0.06, 16, 16, 0, Math.PI)
  const rightGeo = new THREE.SphereGeometry(0.06, 16, 16, Math.PI, Math.PI)

  const matLeft = new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide })
  const matRight = new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide })

  const leftHalf = new THREE.Mesh(leftGeo, matLeft)
  const rightHalf = new THREE.Mesh(rightGeo, matRight)

  leftHalf.position.copy(position)
  rightHalf.position.copy(position)

  leftHalf.userData.velocity = new THREE.Vector3(-0.04, 0.03, 0)
  leftHalf.userData.life = 1.0
  rightHalf.userData.velocity = new THREE.Vector3(0.04, 0.03, 0)
  rightHalf.userData.life = 1.0

  scene.add(leftHalf)
  scene.add(rightHalf)

  animateHalves([leftHalf, rightHalf])
}

function animateHalves(halves) {
  const interval = setInterval(() => {
    let alive = false

    for (let i = halves.length - 1; i >= 0; i--) {
      const h = halves[i]
      h.userData.velocity.y -= 0.002
      h.position.add(h.userData.velocity)
      h.rotation.z += 0.05
      h.userData.life -= 0.02
      h.material.opacity = h.userData.life
      h.material.transparent = true

      if (h.userData.life <= 0) {
        scene.remove(h)
        halves.splice(i, 1)
      } else {
        alive = true
      }
    }

    if (!alive) clearInterval(interval)
  }, 16)
}

function animateParticles(particles) {
  const interval = setInterval(() => {
    let alive = false

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.userData.velocity.y -= 0.003
      p.position.add(p.userData.velocity)
      p.userData.life -= 0.05
      p.material.opacity = p.userData.life
      p.material.transparent = true

      if (p.userData.life <= 0) {
        scene.remove(p)
        particles.splice(i, 1)
      } else {
        alive = true
      }
    }

    if (!alive) clearInterval(interval)
  }, 16)
}