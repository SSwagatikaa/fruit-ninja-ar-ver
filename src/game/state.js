import { showGameOver, showCombo, showMirrorPrompt } from '../ui/hud.js'

// CURSOR difficulties — easier overall
export const CURSOR_DIFFICULTIES = {
  easy: {
    label: 'Easy',
    spawnDelay: 4000, minDelay: 1200, bombChance: 0.05,
    speedMult: 0.7, maxPerSpawn: 1  // one fruit at a time
  },
  medium: {
    label: 'Medium',
    spawnDelay: 2500, minDelay: 600, bombChance: 0.15,
    speedMult: 1.0, maxPerSpawn: 2
  },
  hard: {
    label: 'Hard',
    spawnDelay: 1800, minDelay: 400, bombChance: 0.25,
    speedMult: 1.3, maxPerSpawn: 3
  },
}

// FINGER difficulties — one step harder than cursor equivalent
export const FINGER_DIFFICULTIES = {
  easy: {
    label: 'Easy',
    spawnDelay: 3000, minDelay: 900, bombChance: 0.08,
    speedMult: 0.8, maxPerSpawn: 1  // one fruit at a time
  },
  medium: {
    label: 'Medium',
    spawnDelay: 2500, minDelay: 600, bombChance: 0.15,
    speedMult: 1.0, maxPerSpawn: 2  // cursor medium = finger easy
  },
  hard: {
    label: 'Hard',
    spawnDelay: 1800, minDelay: 400, bombChance: 0.25,
    speedMult: 1.3, maxPerSpawn: 3  // cursor hard = finger medium
  },
  extreme: {
    label: 'Extreme',
    spawnDelay: 1200, minDelay: 250, bombChance: 0.35,
    speedMult: 1.7, maxPerSpawn: 4  // finger only — no cursor equiv
  },
}

// backwards compat — spawner uses DIFFICULTIES
export const DIFFICULTIES = CURSOR_DIFFICULTIES

export const state = {
  score: 0,
  lives: 5,
  running: false,
  combo: 0,
  difficulty: 'medium',
  controlMode: 'cursor'
}

// returns the right difficulty set based on current control mode
export function getDifficultySet() {
  return state.controlMode === 'finger'
    ? FINGER_DIFFICULTIES
    : CURSOR_DIFFICULTIES
}

// returns the active difficulty config object
export function getActiveDiff() {
  const set = getDifficultySet()
  return set[state.difficulty] || set.medium
}

export function addScore(points, count = 1) {
  state.score += points
  if (count >= 2) showCombo(count, points)
}

export function loseLife() {
  state.lives--
  state.combo = 0
  if (state.lives <= 0) gameOver()
}

export function getHighScore() {
  // separate high score per mode + difficulty
  const key = `highScore_${state.controlMode}_${state.difficulty}`
  return parseInt(localStorage.getItem(key) || '0')
}

function saveHighScore() {
  const key = `highScore_${state.controlMode}_${state.difficulty}`
  if (state.score > getHighScore()) {
    localStorage.setItem(key, state.score)
  }
}

export function gameOver() {
  state.running = false
  saveHighScore()
  showGameOver(state.score, getHighScore(), (difficulty, controlMode) => {
    startGame(difficulty || state.difficulty, controlMode || state.controlMode)
  })
}

export function startGame(difficulty = 'medium', controlMode = 'cursor') {
  state.score = 0
  state.lives = 5
  state.combo = 0
  state.difficulty = difficulty
  state.controlMode = controlMode
  state.running = true
}