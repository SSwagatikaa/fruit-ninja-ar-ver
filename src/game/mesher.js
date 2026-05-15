import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader()
const models = {}

const FRUIT_MODELS = [
  { name: 'apple',      path: '/models/Apple.glb' },
  { name: 'watermelon', path: '/models/Watermelon.glb' },
  { name: 'orange',     path: '/models/Orange.glb' },
  { name: 'banana',     path: '/models/Banana.glb' },
  { name: 'strawberry', path: '/models/Strawberry.glb' },
  { name: 'bomb',       path: '/models/Bomb.glb' },
]

const TARGET_SIZE = 0.24 // all fruits will be this size

function normalizeModel(scene) {
  const box = new THREE.Box3().setFromObject(scene)
  const size = new THREE.Vector3()
  box.getSize(size)
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = TARGET_SIZE / maxDim
  scene.scale.setScalar(scale)
}

export function preloadModels() {
  return Promise.all(
    FRUIT_MODELS.map(({ name, path }) =>
      new Promise((resolve) => {
        loader.load(path, (gltf) => {
          normalizeModel(gltf.scene)
          models[name] = gltf.scene
          resolve()
        }, undefined, (err) => {
          console.warn(`Failed to load ${name}:`, err)
          resolve()
        })
      })
    )
  )
}

export function getRandomFruitModel() {
  const fruitNames = ['apple', 'watermelon', 'orange', 'banana', 'strawberry']
  const isBomb = Math.random() < 0.15
  const name = isBomb ? 'bomb' : fruitNames[Math.floor(Math.random() * fruitNames.length)]

  if (!models[name]) return null

  const clone = models[name].clone()
  clone.userData.isBomb = isBomb
  clone.userData.modelName = name
  return clone
}