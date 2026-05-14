import * as THREE from 'three'
import { state, loseLife, getActiveDiff } from './state.js'
import { getRandomFruitModel } from './mesher.js'
import { playMiss } from '../audio/sounds.js'
import { screenShake } from '../ui/fx.js'
import { markMeshCacheDirty } from '../ar/slicer.js'

const fruits = []
let scene
let spawnDelay = 2500
let currentDiff = null

function getDiff() {
  return getActiveDiff()
}

function scheduleNextSpawn() {
  if (!state.running) {
    setTimeout(scheduleNextSpawn, 500)
    return
  }

  const diff = getDiff()
const max = diff.maxPerSpawn || 2
const count = spawnDelay < diff.minDelay * 2
  ? (Math.random() < 0.3 ? max : Math.random() < 0.5 ? Math.max(1, max - 1) : 1)
  : (Math.random() < 0.4 ? Math.min(2, max) : 1)
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      if (state.running) spawnFruit()
    }, i * 200)
  }

  spawnDelay = Math.max(diff.minDelay, spawnDelay - 30)
  setTimeout(scheduleNextSpawn, spawnDelay)
}

export function initSpawner(sceneRef) {
  scene = sceneRef
  spawnDelay = getDiff().spawnDelay
  scheduleNextSpawn()
}

function spawnFruit() {
  const model = getRandomFruitModel()
  if (!model) return

  model.position.set(
    (Math.random() - 0.5) * 0.6,
    -0.5,
    -0.8
  )

  const speedX = (Math.random() - 0.5) * 0.02
  const speedY = 0.04 + Math.random() * 0.02
  const spin = (Math.random() - 0.5) * 0.03

  model.userData.velocity = new THREE.Vector3(speedX, speedY, 0)
  model.userData.spin = spin

  const glowColor = model.userData.isBomb ? 0xff2200 : 0xffdd88
  const glow = new THREE.PointLight(glowColor, 2, 0.5)
  model.add(glow)
  model.userData.glow = glow

  scene.add(model)
  fruits.push(model)
  markMeshCacheDirty() // ← new fruit added, rebuild cache next slice
}

export function updateFruits() {
  const time = Date.now() * 0.005

  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i]
    fruit.userData.velocity.y -= 0.001
    fruit.position.add(fruit.userData.velocity)
    fruit.rotation.z += fruit.userData.spin || 0.02

    if (fruit.userData.glow) {
      fruit.userData.glow.intensity = 1.5 + Math.sin(time + i) * 0.8
    }

    if (fruit.position.y < -1) {
      scene.remove(fruit)
      fruits.splice(i, 1)
      markMeshCacheDirty() // ← fruit fell off, rebuild cache
      if (!fruit.userData.isBomb) {
        loseLife()
        playMiss()
        screenShake(8, 300)
      }
    }
  }
}

export function getFruits() { return fruits }

export function removeFruit(fruit) {
  const index = fruits.indexOf(fruit)
  if (index === -1) return
  scene.remove(fruit)
  fruits.splice(index, 1)
  markMeshCacheDirty() // ← fruit sliced, rebuild cache
}