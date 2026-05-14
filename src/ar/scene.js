import * as THREE from 'three'
import { initSpawner, updateFruits } from '../game/spawner.js'
import { startGame, state } from '../game/state.js'
import { initSlicer } from './slicer.js'
import { initHUD, updateHUD, showStartScreen, initMirrorToggle } from '../ui/hud.js'
import { initFX } from '../ui/fx.js'
import { initCamera } from './camera.js'
import { preloadModels } from '../game/mesher.js'
import { initSounds } from '../audio/sounds.js'

let camera, scene, renderer

export function initScene() {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    70, window.innerWidth / window.innerHeight, 0.01, 20
  )

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.xr.enabled = false
  document.body.appendChild(renderer.domElement)

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 2)
        scene.add(light)

  const dirLight = new THREE.DirectionalLight(0xffffff, 2)
        dirLight.position.set(1, 2, 3)
        scene.add(dirLight)

  const pointLight = new THREE.PointLight(0xffffff, 1.5, 10)
        pointLight.position.set(0, 1, 1)
        scene.add(pointLight)

  initHUD()
  initFX(scene)
  initSounds()
  initMirrorToggle()

  preloadModels().then(() => {
    showStartScreen((difficulty, controlMode) => {
      initCamera(controlMode)
      startGame(difficulty, controlMode)
      initSpawner(scene)
      initSlicer(scene, camera, controlMode)
    })
  })

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  renderer.setAnimationLoop(animate)
}

function animate() {
  updateFruits()
  updateHUD(state.score, state.lives, state.difficulty)
  renderer.render(scene, camera)
}