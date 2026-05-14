// ─── Fonts ───────────────────────────────────────────────────────────────────
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Bebas+Neue&display=swap'
const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href = FONT_URL
document.head.appendChild(fontLink)

// ─── Shared styles ────────────────────────────────────────────────────────────
const globalStyle = document.createElement('style')
globalStyle.textContent = `
  @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes fadeOut    { from{opacity:1} to{opacity:0} }
  @keyframes slideUp    { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes slideDown  { from{transform:translateY(-40px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes scaleIn    { from{transform:scale(0.85);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes flicker    { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.4} 94%{opacity:1} 96%{opacity:.6} 97%{opacity:1} }
  @keyframes pulse      { 0%,100%{box-shadow:0 0 20px rgba(255,140,0,.4)} 50%{box-shadow:0 0 60px rgba(255,140,0,1)} }
  @keyframes scanline   { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes comboIn    { 0%{transform:translate(-50%,-50%) scale(0.5);opacity:0} 30%{transform:translate(-50%,-50%) scale(1.3)} 60%{transform:translate(-50%,-50%) scale(1)} 100%{opacity:1} }
  @keyframes gameOverIn { 0%{transform:scale(2);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes ember      { 0%{transform:translateY(0);opacity:.6} 100%{transform:translateY(-80px);opacity:0} }
  @keyframes recordPop  { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
  @keyframes shimmer    { 0%{background-position:200% center} 100%{background-position:-200% center} }

  @keyframes pipPulse {
    0%,100% { box-shadow:0 0 5px 2px rgba(255,160,0,.9), 0 0 10px 3px rgba(255,80,0,.5); }
    50%     { box-shadow:0 0 8px 3px rgba(255,200,0,1.0), 0 0 18px 6px rgba(255,80,0,.8); }
  }
  @keyframes bladeFlicker {
    0%,100% { opacity:.7; }
    50%     { opacity:1.0; }
  }
  @keyframes loseShake {
    0%   { transform:translateX(0); }
    20%  { transform:translateX(-5px) rotate(-1deg); }
    40%  { transform:translateX(5px) rotate(1deg); }
    60%  { transform:translateX(-3px); }
    80%  { transform:translateX(3px); }
    100% { transform:translateX(0); }
  }

  .page { position:fixed; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:9999; text-align:center; padding:20px; box-sizing:border-box; background:linear-gradient(135deg,#0a0a0a 0%,#1a0800 50%,#0a0a0a 100%); overflow:hidden; }
  .page-enter { animation:fadeIn 0.5s ease forwards; }
  .page-exit  { animation:fadeOut 0.3s ease forwards; }

  .ninja-title {
    font-family:'Cinzel Decorative',serif;
    font-weight:900;
    font-size:64px;
    line-height:1.1;
    background:linear-gradient(180deg,#ffffff 0%,#ffdd00 35%,#ff8800 70%,#ff4400 100%);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    filter:drop-shadow(0 0 40px rgba(255,140,0,.9));
    letter-spacing:6px;
    animation:flicker 4s infinite, float 3s ease-in-out infinite;
  }
  .ninja-sub {
    font-family:'Bebas Neue',sans-serif;
    font-size:15px;
    letter-spacing:8px;
    color:#888;
    text-transform:uppercase;
  }
  .ninja-label {
    font-family:'Cinzel Decorative',serif;
    font-weight:700;
    font-size:11px;
    letter-spacing:4px;
    color:#ff8800;
    text-transform:uppercase;
    margin-bottom:12px;
  }
  .divider { width:220px; height:1px; background:linear-gradient(90deg,transparent,#ff8800,transparent); margin:16px auto; }

  @keyframes cosmicPulse { 0%,100%{box-shadow:0 0 14px rgba(255,120,0,.35),inset 0 0 18px rgba(180,50,0,.15)}
50%{box-shadow:0 0 32px rgba(255,160,0,.7),inset 0 0 28px rgba(220,80,0,.3)} }


  .btn-primary {
    font-family:'Cinzel Decorative',serif;
    font-weight:700;
    font-size:16px;
    padding:14px 48px;
    background: linear-gradient(160deg,#1a0800 0%,#0d0400 50%,#1a0800 100%);
    color: #ffe0c0;
    border: 1px solid rgba(255,120,0,.5);
    text-shadow: 0 0 12px rgba(255,160,0,.8);
    border-radius:4px;
    cursor:pointer;
    letter-spacing:4px;
    position:relative;
    outline:none;
    animation:cosmicPulse 2.5s ease-in-out infinite;
    transition:transform .15s, color .15s;
  }
  .btn-primary::before,.btn-primary::after {
    content:'✦';
    position:absolute;
    top:50%;transform:translateY(-50%);
    font-size:10px;
    color:rgba(255,140,0,.7);
    animation:cosmicShimmer 2s ease-in-out infinite;
  }
  .btn-primary::before{left:14px;}
  .btn-primary::after{right:14px;}
  .btn-primary:hover { transform:scale(1.04); color:#fff; border-color:rgba(200,170,255,.8); }

  .btn-secondary {
    font-family:'Bebas Neue',sans-serif;
    font-size:15px;
    padding:11px 26px;
    background:rgba(80,50,160,.12);
    color:#9980cc;
    border:1px solid rgba(120,90,200,.35);
    border-radius:4px;
    cursor:pointer;
    letter-spacing:2px;
    transition:all .2s;
  }
  .btn-secondary:hover { color:#ddc8ff; border-color:rgba(180,140,255,.6); background:rgba(100,70,200,.2); }
  .btn-selected { color:#fff !important; border-color:rgba(200,170,255,.7) !important; background:rgba(120,90,220,.25) !important; text-shadow:0 0 10px rgba(200,160,255,.7); }

  .btn-outline {
    font-family:'Cinzel Decorative',serif;
    font-weight:700;
    font-size:14px;
    padding:12px 26px;
    background:rgba(255,255,255,.04);
    color:#bba8dd;
    border:1px solid rgba(160,130,220,.35);
    border-radius:4px;
    cursor:pointer;
    letter-spacing:2px;
    transition:all .2s;
  }
  .btn-outline:hover { background:rgba(140,100,255,.12); border-color:rgba(180,150,255,.6); color:#e0d0ff; }

  .diff-card {
    font-family:'Cinzel Decorative',serif;
    width:150px;
    padding:20px 12px;
    border-radius:8px;
    cursor:pointer;
    border:2px solid;
    transition:all .2s;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:8px;
  }
  .diff-card:hover { transform:translateY(-4px); }
  .diff-card.selected { transform:translateY(-4px); }
  .diff-card .diff-name { font-size:18px; letter-spacing:2px; font-weight:700; }
  .diff-card .diff-rules { font-family:'Bebas Neue',sans-serif; font-size:12px; letter-spacing:1px; line-height:1.8; opacity:.8; }

  .rule-card {
    background:rgba(255,136,0,.06);
    border:1px solid rgba(255,136,0,.25);
    border-radius:10px;
    padding:14px 24px;
    max-width:420px;
    font-family:'Cinzel Decorative',serif;
    font-weight:700;
    font-size:13px;
    letter-spacing:1px;
    color:#ccc;
    line-height:1.8;
  }

  .ember-dot  { position:absolute; width:3px; height:3px; border-radius:50%; animation:ember linear infinite; }
  .scanline-el { position:absolute; width:100%; height:2px; background:rgba(255,140,0,.12); animation:scanline 3s linear infinite; pointer-events:none; }
  .vignette-el { position:absolute; top:0; left:0; width:100%; height:100%; background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.85) 100%); pointer-events:none; }

  .hud-text {
    font-family:'Cinzel Decorative',serif;
    font-weight:700;
    color:white;
    text-shadow:0 0 20px rgba(255,140,0,.7), 2px 2px 8px rgba(0,0,0,.9);
  }
  .combo-pop {
    position:fixed;
    top:50%; left:50%;
    transform:translate(-50%,-50%);
    font-family:'Cinzel Decorative',serif;
    font-weight:900;
    font-size:52px;
    background:linear-gradient(180deg,#fff,#ffdd00,#ff8800);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    filter:drop-shadow(0 0 30px rgba(255,140,0,1));
    pointer-events:none;
    z-index:9998;
    opacity:0;
    transition:opacity .2s;
  }

  /* ── Dragon Sword Lives Bar ── */
  .dragon-lives-wrap {
    position: relative;
    width: 320px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .dragon-sword-svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 6px rgba(255,80,0,.65));
    transition: filter .3s ease;
  }
  .dragon-lives-pips {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-44%, -54%);
    display: flex;
    gap: 9px;
    align-items: center;
    pointer-events: none;
  }
  .dragon-pip {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #fff8e0, #ffcc00 40%, #ff6600);
    box-shadow: 0 0 5px 2px rgba(255,160,0,.9), 0 0 10px 3px rgba(255,80,0,.6);
    transition: all .3s ease;
    animation: pipPulse 2s ease-in-out infinite;
  }
  .dragon-pip:nth-child(2) { animation-delay:.2s; }
  .dragon-pip:nth-child(3) { animation-delay:.4s; }
  .dragon-pip:nth-child(4) { animation-delay:.6s; }
  .dragon-pip:nth-child(5) { animation-delay:.8s; }
  .dragon-pip.lost {
    background: radial-gradient(circle at 35% 35%, #444, #1a1a1a);
    box-shadow: inset 0 0 3px rgba(0,0,0,.8);
    animation: none;
  }
  .dragon-lives-wrap.shake { animation: loseShake .4s ease; }
  .dragon-lives-wrap.dead .dragon-sword-svg {
    filter: drop-shadow(0 0 3px rgba(100,0,0,.3)) grayscale(.8) brightness(.35);
  }
  .blade-glow-anim { animation: bladeFlicker 1.8s ease-in-out infinite; }
`
document.head.appendChild(globalStyle)

// ─── Helpers ─────────────────────────────────────────────────────────────────
function embers(container, n = 6) {
  const colors = ['#ff8800','#ffdd00','#ff4400','#ffaa00']
  for (let i = 0; i < n; i++) {
    const e = document.createElement('div')
    e.className = 'ember-dot'
    e.style.cssText = `left:${Math.random()*100}%; top:${60+Math.random()*40}%; background:${colors[i%colors.length]}; animation-duration:${2+Math.random()*3}s; animation-delay:${Math.random()*2}s;`
    container.appendChild(e)
  }
}

function transitionTo(fromEl, buildNext) {
  if (!fromEl) { buildNext(); return }
  fromEl.classList.add('page-exit')
  fromEl.addEventListener('animationend', () => { fromEl.remove(); buildNext() }, { once: true })
}

// ─── Dragon Sword SVG builder ─────────────────────────────────────────────────
function buildDragonSwordSVG() {
  return `
  <svg class="dragon-sword-svg" viewBox="0 0 520 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#1a0000"/>
        <stop offset="15%"  stop-color="#8b1a00"/>
        <stop offset="40%"  stop-color="#ff6600"/>
        <stop offset="60%"  stop-color="#ffcc44"/>
        <stop offset="80%"  stop-color="#ff4400"/>
        <stop offset="100%" stop-color="#3a0000"/>
      </linearGradient>
      <linearGradient id="bladeShine" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stop-color="rgba(255,255,180,0.6)"/>
        <stop offset="50%"  stop-color="rgba(255,255,255,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.4)"/>
      </linearGradient>
      <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#3a1a00"/>
        <stop offset="50%"  stop-color="#8b4513"/>
        <stop offset="100%" stop-color="#3a1a00"/>
      </linearGradient>
    </defs>
    <!-- BLADE -->
    <polygon points="250,19 480,23 480,25 250,29" fill="url(#bladeGrad)" class="blade-glow-anim"/>
    <polygon points="250,19 480,23 480,22 254,17" fill="url(#bladeShine)" opacity="0.7"/>
    <polygon points="480,21 480,27 500,24" fill="#ff6600" class="blade-glow-anim"/>
    <polygon points="480,21 500,24 485,21" fill="#ffcc44" opacity="0.8"/>
    <line x1="254" y1="24" x2="478" y2="24" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
    <!-- CROSSGUARD -->
    <rect x="237" y="14" width="16" height="20" rx="3" fill="#7a3300" stroke="#cc5500" stroke-width="0.7"/>
    <ellipse cx="245" cy="14" rx="6" ry="3" fill="#aa4400" stroke="#ff6600" stroke-width="0.5"/>
    <ellipse cx="245" cy="34" rx="6" ry="3" fill="#aa4400" stroke="#ff6600" stroke-width="0.5"/>
    <ellipse cx="245" cy="24" rx="3.5" ry="3.5" fill="#ff3300" stroke="#ffaa00" stroke-width="0.8"/>
    <ellipse cx="243.5" cy="22.5" rx="1.2" ry="1.2" fill="rgba(255,255,200,0.8)"/>
    <!-- HANDLE -->
    <rect x="130" y="20" width="107" height="8" rx="4" fill="url(#handleGrad)" stroke="#7a3300" stroke-width="0.5"/>
    <line x1="148" y1="20" x2="148" y2="28" stroke="rgba(0,0,0,0.5)" stroke-width="1.2"/>
    <line x1="163" y1="20" x2="163" y2="28" stroke="rgba(0,0,0,0.5)" stroke-width="1.2"/>
    <line x1="178" y1="20" x2="178" y2="28" stroke="rgba(0,0,0,0.5)" stroke-width="1.2"/>
    <line x1="193" y1="20" x2="193" y2="28" stroke="rgba(0,0,0,0.5)" stroke-width="1.2"/>
    <line x1="208" y1="20" x2="208" y2="28" stroke="rgba(0,0,0,0.5)" stroke-width="1.2"/>
    <line x1="223" y1="20" x2="223" y2="28" stroke="rgba(0,0,0,0.5)" stroke-width="1.2"/>
    <rect x="130" y="20" width="107" height="3" rx="2" fill="rgba(255,120,50,0.2)"/>
    <!-- POMMEL -->
    <ellipse cx="126" cy="24" rx="11" ry="9" fill="#6b2200" stroke="#cc4400" stroke-width="0.8"/>
    <ellipse cx="126" cy="24" rx="7" ry="6" fill="#3a1100" stroke="#ff5500" stroke-width="0.7"/>
    <ellipse cx="126" cy="24" rx="4" ry="4" fill="#ff3300" stroke="#ffaa00" stroke-width="0.7"/>
    <ellipse cx="124.5" cy="22.5" rx="1.5" ry="1.5" fill="rgba(255,255,200,0.7)"/>
    <!-- DRAGON HEAD -->
    <path d="M 114,24 Q 104,21 97,18 Q 90,16 86,14 Q 82,13 80,15 Q 78,17 82,18 Q 87,20 90,22 Q 94,23 97,24 Q 94,25 90,26 Q 87,28 82,30 Q 78,31 80,33 Q 82,35 86,34 Q 90,32 97,30 Q 104,27 114,24 Z"
      fill="#8b1a00" stroke="#ff4400" stroke-width="0.5"/>
    <path d="M 80,15 Q 72,13 66,15 Q 60,17 58,20 Q 56,23 60,26 Q 64,28 70,27 Q 74,26 80,23 Q 84,21 84,17 Z"
      fill="#cc2200" stroke="#ff5500" stroke-width="0.7"/>
    <path d="M 58,20 Q 50,22 48,24 Q 50,27 58,26 Q 64,24 64,22 Z"
      fill="#aa1a00" stroke="#ff4400" stroke-width="0.5"/>
    <ellipse cx="66" cy="18" rx="2.5" ry="2" fill="#ffcc00" stroke="#ff6600" stroke-width="0.5"/>
    <ellipse cx="67" cy="18" rx="1.2" ry="1.2" fill="#ff0000"/>
    <ellipse cx="66.5" cy="17.5" rx="0.6" ry="0.6" fill="rgba(255,255,255,0.8)"/>
    <ellipse cx="51" cy="24" rx="1.2" ry="0.8" fill="#660000"/>
    <path d="M 70,15 Q 73,8 77,6 Q 78,10 74,13 Z" fill="#7a1a00" stroke="#cc3300" stroke-width="0.5"/>
    <path d="M 80,15 Q 85,11 90,10 Q 91,13 87,15 Z" fill="#7a1a00"/>
    <path d="M 90,12 Q 95,8 100,7 Q 101,11 97,13 Z" fill="#7a1a00"/>
    <!-- FIRE BREATH -->
    <path d="M 48,24 Q 40,21 34,23 Q 38,25 44,25 Q 40,27 35,28 Q 40,28 45,26"
      fill="none" stroke="#ff6600" stroke-width="1.2" opacity="0.8" class="blade-glow-anim"/>
    <path d="M 46,24 Q 36,23 32,25"
      fill="none" stroke="#ffcc00" stroke-width="0.8" opacity="0.6" class="blade-glow-anim"/>
  </svg>`
}

// ─── HUD ─────────────────────────────────────────────────────────────────────
const hudEl = document.createElement('div')
let comboTimeout = null

export function initHUD() {
  hudEl.style.cssText = `
    position:fixed; top:16px; left:0; width:100%;
    display:flex; justify-content:space-between; align-items:center;
    padding:0 24px; box-sizing:border-box;
    pointer-events:none; z-index:999;
  `

  // Build dragon lives bar HTML
  const livesHTML = `
    <div class="dragon-lives-wrap" id="dragon-lives-wrap">
      ${buildDragonSwordSVG()}
      <div class="dragon-lives-pips" id="dragon-pips">
        <div class="dragon-pip" id="dpip0"></div>
        <div class="dragon-pip" id="dpip1"></div>
        <div class="dragon-pip" id="dpip2"></div>
        <div class="dragon-pip" id="dpip3"></div>
        <div class="dragon-pip" id="dpip4"></div>
      </div>
    </div>
  `

  hudEl.innerHTML = `
    <div id="hud-score" class="hud-text" style="font-size:24px;">Score: 0</div>
    <div id="hud-highscore" class="hud-text" style="font-size:18px; opacity:.7;">Best: 0</div>
    ${livesHTML}
  `
  document.body.appendChild(hudEl)

  const comboEl = document.createElement('div')
  comboEl.id = 'hud-combo'
  comboEl.className = 'combo-pop'
  document.body.appendChild(comboEl)
}

// ─── Update dragon pips ───────────────────────────────────────────────────────
function _updateDragonPips(lives) {
  const wrap = document.getElementById('dragon-lives-wrap')
  if (!wrap) return

  for (let i = 0; i < 5; i++) {
    const pip = document.getElementById('dpip' + i)
    if (!pip) continue
    pip.classList.toggle('lost', i >= lives)
  }

  wrap.classList.toggle('dead', lives <= 0)

  if (lives > 0) {
    wrap.classList.remove('shake')
    // force reflow so shake can re-trigger
    void wrap.offsetWidth
    wrap.classList.add('shake')
    wrap.addEventListener('animationend', () => wrap.classList.remove('shake'), { once: true })
  }
}

export function updateHUD(score, lives, difficulty) {
  const key = `highScore_${window._controlMode || 'cursor'}_${difficulty}`
  document.getElementById('hud-score').textContent = `Score: ${score}`
  document.getElementById('hud-highscore').textContent = `Best: ${localStorage.getItem(key) || 0}`
  _updateDragonPips(lives)
}

export function showCombo(combo, points) {
  if (combo < 2) return
  const el = document.getElementById('hud-combo')
  el.textContent = `✦ x${combo} Combo ✦ +${points}`
  el.style.opacity = '1'
  el.style.fontSize = `${Math.min(48 + combo * 4, 80)}px`
  el.style.animation = 'comboIn .4s ease forwards'
  clearTimeout(comboTimeout)
  comboTimeout = setTimeout(() => { el.style.opacity = '0'; el.style.animation = '' }, 1000)
}

// ─── Page 1 — Title ──────────────────────────────────────────────────────────
export function showStartScreen(onStart) {
  _showTitlePage(onStart)
}

function _showTitlePage(onStart) {
  const el = document.createElement('div')
  el.className = 'page page-enter'
  el.innerHTML = `
    <div class="scanline-el"></div>
    <div class="vignette-el"></div>
    <div style="animation:slideDown .8s ease forwards;">
      <div style="font-family:'Cinzel Decorative',serif; font-weight:700; font-size:11px; letter-spacing:8px; color:#ff8800; margin-bottom:16px;">✦ PRESENTS ✦</div>
      <div class="ninja-title">FRUIT<br>NINJA</div>
      <div style="font-family:'Cinzel Decorative',serif; font-weight:700; font-size:16px; letter-spacing:14px; color:#ff8800; margin-top:10px;">A &nbsp; R</div>
    </div>
    <div class="divider" style="animation:slideUp .6s .3s ease both;"></div>
    <p class="ninja-sub" style="animation:slideUp .6s .4s ease both; margin-bottom:40px;">Slice. Survive. Dominate.</p>
    <button id="title-next" class="btn-primary" style="animation:slideUp .6s .5s ease both;">Begin ›</button>
  `
  embers(el)
  document.body.appendChild(el)
  document.getElementById('title-next').addEventListener('click', () => {
    transitionTo(el, () => _showRulesPage(onStart))
  })
}

// ─── Page 2 — Rules ──────────────────────────────────────────────────────────
function _showRulesPage(onStart) {
  const el = document.createElement('div')
  el.className = 'page page-enter'
  el.innerHTML = `
    <div class="scanline-el"></div>
    <div class="vignette-el"></div>
    <div style="animation:slideDown .6s ease forwards;">
      <div class="ninja-label">The Way of the Blade</div>
      <h2 style="font-family:'Cinzel Decorative',serif; font-weight:900; font-size:36px; color:white; margin-bottom:4px;">Game Rules</h2>
    </div>
    <div class="divider" style="animation:scaleIn .5s .2s ease both;"></div>
    <div style="display:flex; flex-direction:column; gap:10px; max-width:420px; animation:slideUp .6s .3s ease both;">
      <div class="rule-card">🍉 &nbsp;Slice fruits before they fall</div>
      <div class="rule-card">💣 &nbsp;Avoid bombs — instant game over</div>
      <div class="rule-card">🎯 &nbsp;Slice multiple at once for combos</div>
      <div class="rule-card">⚔️ &nbsp;5 misses and the game ends</div>
    </div>
    <div class="divider" style="animation:scaleIn .5s .5s ease both;"></div>
    <div style="display:flex; gap:12px; animation:slideUp .6s .6s ease both;">
      <button id="rules-back" class="btn-outline">‹ Back</button>
      <button id="rules-next" class="btn-primary">Next ›</button>
    </div>
  `
  embers(el)
  document.body.appendChild(el)
  document.getElementById('rules-back').addEventListener('click', () => transitionTo(el, () => _showTitlePage(onStart)))
  document.getElementById('rules-next').addEventListener('click', () => transitionTo(el, () => _showControlPage(onStart)))
}

// ─── Page 3 — Control ────────────────────────────────────────────────────────
function _showControlPage(onStart) {
  const el = document.createElement('div')
  el.className = 'page page-enter'
  el.innerHTML = `
    <div class="scanline-el"></div>
    <div class="vignette-el"></div>
    <div style="animation:slideDown .6s ease forwards; margin-bottom:8px;">
      <div class="ninja-label">Choose Your Weapon</div>
      <h2 style="font-family:'Cinzel Decorative',serif; font-weight:900; font-size:34px; color:white;">Control Mode</h2>
    </div>
    <div class="divider" style="animation:scaleIn .5s .2s ease both;"></div>
    <div style="display:flex; gap:20px; margin-bottom:28px; animation:slideUp .6s .3s ease both;">
      <div id="ctrl-cursor" class="diff-card btn-selected" style="border-color:#ff8800; color:#ff8800; background:rgba(255,136,0,.1);">
        <div style="font-size:36px;">🖱️</div>
        <div class="diff-name">Cursor</div>
        <div class="diff-rules">Hold & drag<br>to slice fruits</div>
      </div>
      <div id="ctrl-finger" class="diff-card" style="border-color:#444; color:#666; background:rgba(255,255,255,.03);">
        <div style="font-size:36px;">☝️</div>
        <div class="diff-name">Finger</div>
        <div class="diff-rules">Index finger<br>via webcam</div>
      </div>
    </div>
    <div style="display:flex; gap:12px; animation:slideUp .6s .5s ease both;">
      <button id="ctrl-back" class="btn-outline">‹ Back</button>
      <button id="ctrl-next" class="btn-primary">Next ›</button>
    </div>
  `
  embers(el)
  document.body.appendChild(el)

  let selectedCtrl = 'cursor'
  const cards = {
    cursor: document.getElementById('ctrl-cursor'),
    finger: document.getElementById('ctrl-finger')
  }

  function selectCtrl(mode) {
    selectedCtrl = mode
    Object.entries(cards).forEach(([k, c]) => {
      if (k === mode) {
        c.style.borderColor = '#ff8800'
        c.style.color = '#ff8800'
        c.style.background = 'rgba(255,136,0,.1)'
        c.classList.add('btn-selected')
      } else {
        c.style.borderColor = '#444'
        c.style.color = '#666'
        c.style.background = 'rgba(255,255,255,.03)'
        c.classList.remove('btn-selected')
      }
    })
  }

  cards.cursor.addEventListener('click', () => selectCtrl('cursor'))
  cards.finger.addEventListener('click', () => selectCtrl('finger'))

  document.getElementById('ctrl-back').addEventListener('click', () => transitionTo(el, () => _showRulesPage(onStart)))
  document.getElementById('ctrl-next').addEventListener('click', () => {
    window._controlMode = selectedCtrl
    transitionTo(el, () => _showDifficultyPage(onStart, selectedCtrl))
  })
}

// ─── Page 4 — Difficulty ─────────────────────────────────────────────────────
function _showDifficultyPage(onStart, controlMode) {
  const isHand = controlMode === 'hand' || controlMode === 'finger'
  const diffs = isHand
    ? [
        { id:'easy',    label:'Easy',    color:'#33cc33', bg:'rgba(51,204,51,.1)',  rules:'One fruit\nat a time\nRelaxed speed' },
        { id:'medium',  label:'Medium',  color:'#ff9900', bg:'rgba(255,153,0,.1)', rules:'Two fruits\nat a time\nNormal speed' },
        { id:'hard',    label:'Hard',    color:'#ff3333', bg:'rgba(255,51,51,.1)', rules:'3 fruits\nat a time\nFast pace'      },
        { id:'extreme', label:'Extreme', color:'#cc00ff', bg:'rgba(200,0,255,.1)', rules:'4 fruits\nat a time\nChaos mode'    },
      ]
    : [
        { id:'easy',   label:'Easy',   color:'#33cc33', bg:'rgba(51,204,51,.1)',  rules:'One fruit\nat a time\nRelaxed speed' },
        { id:'medium', label:'Medium', color:'#ff9900', bg:'rgba(255,153,0,.1)', rules:'Two fruits\nat a time\nNormal speed' },
        { id:'hard',   label:'Hard',   color:'#ff3333', bg:'rgba(255,51,51,.1)', rules:'3 fruits\nat a time\nFast pace'      },
      ]

  const el = document.createElement('div')
  el.className = 'page page-enter'
  el.innerHTML = `
    <div class="scanline-el"></div>
    <div class="vignette-el"></div>
    <div style="animation:slideDown .6s ease forwards; margin-bottom:8px;">
      <div class="ninja-label">${isHand ? '☝️ Finger Mode' : '🖱️ Cursor Mode'}</div>
      <h2 style="font-family:'Cinzel Decorative',serif; font-weight:900; font-size:34px; color:white;">Pick Difficulty</h2>
    </div>
    <div class="divider" style="animation:scaleIn .5s .2s ease both;"></div>
    <div id="diff-row" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-bottom:28px; animation:slideUp .6s .3s ease both;">
      ${diffs.map(d => `
        <div class="diff-card ${d.id==='easy'?'selected':''}" data-diff="${d.id}"
          style="border-color:${d.id==='easy'?d.color:'#444'}; color:${d.id==='easy'?d.color:'#555'}; background:${d.id==='easy'?d.bg:'transparent'};">
          <div class="diff-name">${d.label}</div>
          <div class="diff-rules" style="white-space:pre-line;">${d.rules}</div>
        </div>
      `).join('')}
    </div>
    <div style="display:flex; gap:12px; animation:slideUp .6s .5s ease both;">
      <button id="diff-back" class="btn-outline">‹ Back</button>
      <button id="diff-next" class="btn-primary">Next ›</button>
    </div>
  `
  embers(el)
  document.body.appendChild(el)

  let selectedDiff = 'easy'
  el.querySelectorAll('.diff-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedDiff = card.dataset.diff
      const matched = diffs.find(d => d.id === selectedDiff)
      el.querySelectorAll('.diff-card').forEach(c => {
        c.style.borderColor = '#444'
        c.style.color = '#555'
        c.style.background = 'transparent'
        c.classList.remove('selected')
      })
      card.style.borderColor = matched.color
      card.style.color = matched.color
      card.style.background = matched.bg
      card.classList.add('selected')
    })
  })

  document.getElementById('diff-back').addEventListener('click', () => transitionTo(el, () => _showControlPage(onStart)))

  document.getElementById('diff-next').addEventListener('click', () => {
    if (isHand) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(() => transitionTo(el, () => showMirrorPrompt(() => onStart(selectedDiff, controlMode))))
        .catch(() => {
          alert('Camera access required for Finger mode!')
          transitionTo(el, () => _showControlPage(onStart))
        })
    } else {
      transitionTo(el, () => onStart(selectedDiff, controlMode))
    }
  })
}

// ─── Mirror Prompt ───────────────────────────────────────────────────────────
export function showMirrorPrompt(onDone) {
  const el = document.createElement('div')
  el.className = 'page page-enter'
  el.innerHTML = `
    <div class="scanline-el"></div>
    <div class="vignette-el"></div>
    <div style="animation:slideDown .6s ease forwards; margin-bottom:12px;">
      <div style="font-size:52px; margin-bottom:8px;">☝️</div>
      <h2 style="font-family:'Cinzel Decorative',serif; font-weight:900; font-size:30px; color:white;">Index Finger Mode</h2>
    </div>
    <div class="divider" style="animation:scaleIn .5s .2s ease both;"></div>
    <div style="animation:slideUp .5s .3s ease both;">
      <p style="font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:2px; color:#aaa; max-width:380px; line-height:2.2; margin-bottom:24px;">
        Raise your <span style="color:#ff8800;">index finger</span> in front of the camera and move it to slice fruits.<br>
        If your finger moves in the <span style="color:#ff8800;">wrong direction</span>, toggle mirror below.
      </p>
      <div style="display:flex; gap:14px; justify-content:center; margin-bottom:28px;">
        <button id="mirror-off" class="btn-secondary btn-selected">🔄 &nbsp;Normal</button>
        <button id="mirror-on"  class="btn-secondary">🔁 &nbsp;Mirrored</button>
      </div>
    </div>
    <button id="mirror-done" class="btn-primary" style="animation:slideUp .5s .5s ease both;">✦ Start Game ✦</button>
  `
  embers(el)
  document.body.appendChild(el)

  window.handMirror = false
  document.getElementById('mirror-off').addEventListener('click', () => {
    window.handMirror = false
    document.getElementById('mirror-off').classList.add('btn-selected')
    document.getElementById('mirror-on').classList.remove('btn-selected')
  })
  document.getElementById('mirror-on').addEventListener('click', () => {
    window.handMirror = true
    document.getElementById('mirror-on').classList.add('btn-selected')
    document.getElementById('mirror-off').classList.remove('btn-selected')
  })
  document.getElementById('mirror-done').addEventListener('click', () => {
    transitionTo(el, onDone)
  })
}

// ─── Game Over ────────────────────────────────────────────────────────────────
export function showGameOver(score, highScore, onRestart) {
  const isNewRecord = score >= highScore && score > 0
  const el = document.createElement('div')
  el.className = 'page page-enter'
  el.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)'
  el.innerHTML = `
    <div class="scanline-el"></div>
    <div class="vignette-el"></div>

    <div style="animation:gameOverIn .6s ease forwards; margin-bottom:8px;">
      <div style="font-family:'Cinzel Decorative',serif; font-weight:700; font-size:11px; letter-spacing:8px; color:#ff3333; margin-bottom:8px;">✦ MISSION FAILED ✦</div>
      <h1 style="
        font-family:'Cinzel Decorative',serif;
        font-weight:900;
        font-size:64px;
        line-height:1;
        background:linear-gradient(180deg,#ffffff 0%,#ff4444 40%,#aa0000 100%);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        filter:drop-shadow(0 0 40px rgba(255,0,0,.9));
        letter-spacing:4px;
        margin:0;
      ">GAME<br>OVER</h1>
    </div>

    <div class="divider" style="background:linear-gradient(90deg,transparent,#ff3333,transparent); animation:scaleIn .5s .3s ease both;"></div>

    <div style="animation:slideUp .6s .4s ease both; margin-bottom:4px;">
      ${isNewRecord ? `
        <div style="
          font-family:'Cinzel Decorative',serif;
          font-weight:700;
          font-size:14px;
          letter-spacing:4px;
          color:#ffdd00;
          filter:drop-shadow(0 0 10px rgba(255,220,0,.8));
          animation:recordPop .5s .6s ease both;
          opacity:0;
          animation-fill-mode:forwards;
          margin-bottom:8px;
        ">✦ New High Score ✦</div>
      ` : ''}
      <p style="
        font-family:'Cinzel Decorative',serif;
        font-weight:900;
        font-size:64px;
        background:linear-gradient(180deg,#ffffff,#ffdd00,#ff8800);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        filter:drop-shadow(0 0 20px rgba(255,140,0,.6));
        margin:0;
        line-height:1;
      ">${score}</p>
      <p style="font-family:'Bebas Neue',sans-serif; font-size:14px; letter-spacing:6px; color:#555; margin-top:4px;">BEST &nbsp; ${highScore}</p>
    </div>

    <div class="divider" style="background:linear-gradient(90deg,transparent,#ff3333,transparent); animation:scaleIn .5s .6s ease both;"></div>

    <div style="display:flex; gap:24px; margin-bottom:24px; animation:slideUp .6s .7s ease both;">
      <div style="text-align:center;">
        <div style="font-family:'Cinzel Decorative',serif; font-size:11px; letter-spacing:3px; color:#ff3333; margin-bottom:4px;">MODE</div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:2px; color:white;">${window._controlMode === 'finger' ? '☝️ Finger' : '🖱️ Cursor'}</div>
      </div>
      <div style="width:1px; background:rgba(255,255,255,.1);"></div>
      <div style="text-align:center;">
        <div style="font-family:'Cinzel Decorative',serif; font-size:11px; letter-spacing:3px; color:#ff3333; margin-bottom:4px;">BEST</div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:2px; color:white;">${highScore}</div>
      </div>
      <div style="width:1px; background:rgba(255,255,255,.1);"></div>
      <div style="text-align:center;">
        <div style="font-family:'Cinzel Decorative',serif; font-size:11px; letter-spacing:3px; color:#ff3333; margin-bottom:4px;">RANK</div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:2px; color:${score >= highScore ? '#ffdd00' : '#888'};">${score >= 500 ? 'MASTER' : score >= 200 ? 'NINJA' : score >= 100 ? 'WARRIOR' : 'ROOKIE'}</div>
      </div>
    </div>

    <div style="display:flex; gap:14px; animation:slideUp .6s .8s ease both;">
      <button id="go-home" class="btn-outline">🏠 &nbsp;Home</button>
      <button id="go-again" class="btn-primary" style="background:linear-gradient(180deg,#ff4444,#aa0000);">✦ Play Again ✦</button>
    </div>
  `
  embers(el)
  document.body.appendChild(el)

  document.getElementById('go-home').addEventListener('click', () => {
    transitionTo(el, () => window.location.reload())
  })

  document.getElementById('go-again').addEventListener('click', () => {
    transitionTo(el, () => _showDifficultyPage((diff, ctrl) => {
      onRestart(diff, ctrl || window._controlMode || 'cursor')
    }, window._controlMode || 'cursor'))
  })
}

// ─── Mirror Toggle (in-game) ─────────────────────────────────────────────────
export function initMirrorToggle() {
  const btn = document.createElement('button')
  btn.textContent = window.handMirror ? '🔁 Mirrored' : '🔄 Normal'
  btn.style.cssText = `position:fixed; bottom:20px; right:20px; padding:8px 16px; font-size:13px; font-family:'Cinzel Decorative',serif; font-weight:700; letter-spacing:2px; background:rgba(255,255,255,.12); color:white; border:2px solid rgba(255,255,255,.3); border-radius:8px; cursor:pointer; z-index:9999; transition:all .2s;`
  document.body.appendChild(btn)

  btn.style.background = window.handMirror ? 'rgba(255,215,0,.35)' : 'rgba(255,255,255,.12)'

  btn.addEventListener('click', () => {
    window.handMirror = !window.handMirror
    btn.textContent = window.handMirror ? '🔁 Mirrored' : '🔄 Normal'
    btn.style.background = window.handMirror ? 'rgba(255,215,0,.35)' : 'rgba(255,255,255,.12)'
  })
}
