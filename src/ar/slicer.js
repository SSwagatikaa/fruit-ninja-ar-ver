import * as THREE from 'three'
import { getFruits, removeFruit } from '../game/spawner.js'
import { addScore, gameOver, state } from '../game/state.js'
import { splashEffect, sliceEffect, screenShake, juiceSplatter } from '../ui/fx.js'
import { playSlice, playBomb, playCombo } from '../audio/sounds.js'
import { initHandTracker } from './handtracker.js'

let camera, scene
const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let slicing = false

// mesh cache — rebuilt only when fruits change
let cachedMeshes = []
let meshCacheDirty = true

// cooldown — prevents same fruit being hit twice in one swipe
const slicedThisSwipe = new Set()

const FRUIT_COLORS = {
  apple: 0xff2222,
  watermelon: 0xff4488,
  orange: 0xff8800,
  banana: 0xffee00,
  strawberry: 0xff1144,
}

export function markMeshCacheDirty() {
  meshCacheDirty = true
}

export function initSlicer(sceneRef, cameraRef, controlMode = 'cursor') {
  scene = sceneRef
  camera = cameraRef

  if (controlMode === 'cursor') {
    window.addEventListener('pointerdown', () => {
      slicing = true
      slicedThisSwipe.clear()
    })
    window.addEventListener('pointerup', () => {
      slicing = false
      slicedThisSwipe.clear()
    })
    window.addEventListener('pointermove', (e) => {
      if (!slicing) return
      handleSliceAt(e.clientX, e.clientY)
    })
  } else {
   initHandTracker((x, y) => handleSliceAt(x, y))
  }
}

function handleSliceAt(clientX, clientY) {
  mouse.x = (clientX / window.innerWidth) * 2 - 1
  mouse.y = -(clientY / window.innerHeight) * 2 + 1
  checkSlice()
}

function toScreenPosition(position) {
  const vec = position.clone()
  vec.project(camera)
  return {
    x: (vec.x + 1) / 2 * window.innerWidth,
    y: -(vec.y - 1) / 2 * window.innerHeight
  }
}

function rebuildMeshCache() {
  cachedMeshes = []
  getFruits().forEach(f => f.traverse(child => {
    if (child.isMesh) {
      child.userData.parentFruit = f
      cachedMeshes.push(child)
    }
  }))
  meshCacheDirty = false
}

function checkSlice() {
  // rebuild cache only when needed
  if (meshCacheDirty) rebuildMeshCache()

  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObjects(cachedMeshes)
  if (hits.length === 0) return

  // deduplicate to parent fruit, skip already sliced this swipe
  const hitFruits = []
  hits.forEach(hit => {
    const parent = hit.object.userData.parentFruit
    if (parent && !hitFruits.includes(parent)) hitFruits.push(parent)
  })

  const validFruits = hitFruits.filter(f =>
    getFruits().includes(f) && !slicedThisSwipe.has(f.uuid)
  )
  if (validFruits.length === 0) return

  // handle bomb first
  const bomb = validFruits.find(f => f.userData.isBomb)
  if (bomb) {
    const screenPos = toScreenPosition(bomb.position.clone())
    playBomb()
    splashEffect(bomb.position.clone(), 0x111111)
    juiceSplatter(screenPos.x, screenPos.y, 0x333333)
    removeFruit(bomb)
    screenShake(15, 500)
    meshCacheDirty = true
    gameOver()
    return
  }

  // slice all valid fruits
  validFruits.forEach(f => {
    const screenPos = toScreenPosition(f.position.clone())
    const juiceColor = FRUIT_COLORS[f.userData.modelName] || 0xff4444
    sliceEffect(f.position.clone(), juiceColor)
    juiceSplatter(screenPos.x, screenPos.y, juiceColor)
    slicedThisSwipe.add(f.uuid)
    removeFruit(f)
  })

  meshCacheDirty = true

  // scoring
  const count = validFruits.length
  const points = 10 * count
  if (count >= 2) {
    state.combo += count
    addScore(points, count)
    playCombo()
  } else {
    addScore(points, 1)
    playSlice()
  }
}