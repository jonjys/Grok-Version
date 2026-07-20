// ======================
// KARMA — Full App
// ======================

let G = {
    level: 5,
    xp: 1100,
    kc: 186,
    petName: "Luna",
    flashes: []
};

let currentView = 0;
let map = null;

// Ladda / Spara
function loadData() {
    const saved = localStorage.getItem('karmaData');
    if (saved) Object.assign(G, JSON.parse(saved));
}

function saveData() {
    localStorage.setItem('karmaData', JSON.stringify(G));
}

// Rendera
function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="topbar">
            <div class="logo">KARMA <span>🐾</span></div>
            <div>⚡ <span id="xp-val">${G.xp}</span> 💎 <span id="kc-val">${G.kc}</span></div>
        </div>

        <div class="main">
            <div id="view-pet" class="view ${currentView === 0 ? 'active' : ''}">
                <div style="text-align:center;padding:40px 20px">
                    <h1>Level <span id="level-val">${G.level}</span></h1>
                    <div class="pet-container">
                        <canvas id="pet-canvas" width="240" height="240"></canvas>
                    </div>
                    <h2>${G.petName}</h2>
                    <p style="color:var(--green)">Mood: Legendary ✨</p>
                </div>
                <div style="display:flex;gap:15px;justify-content:center;padding:0 20px">
                    <button onclick="feedPet()" style="background:var(--green);color:#000;padding:16px 40px;border:none;border-radius:50px;font-weight:800">🍎 Mata</button>
                    <button onclick="playPet()" style="background:var(--purple);padding:16px 40px;border:none;border-radius:50px;font-weight:800">🎾 Lek</button>
                </div>
            </div>

            <div id="view-flash" class="view ${currentView === 1 ? 'active' : ''}">
                <div style="padding:20px">
                    <h2 style="text-align:center">Flash Feed</h2>
                    <button onclick="postFlash()" style="width:100%;margin:20px 0;background:linear-gradient(var(--pink),var(--purple));padding:18px;border:none;border-radius:50px;color:white;font-weight:800">📹 Posta Flash</button>
                    <div id="flash-list"></div>
                </div>
            </div>

            <div id="view-uppdrag" class="view ${currentView === 2 ? 'active' : ''}">
                <div style="padding:20px">
                    <h2>Dagens Uppdrag</h2>
                    <div class="card" onclick="finishQuest(0)">Posta flash → +60 XP</div>
                    <div class="card" onclick="finishQuest(1)">Gå 8000 steg → +80 XP</div>
                    <div class="card" onclick="finishQuest(2)">IRL samtal → +50 XP</div>
                </div>
            </div>

            <div id="view-map" class="view ${currentView === 3 ? 'active' : ''}">
                <div id="map" style="height:100%"></div>
                <div class="card">
                    <h3>Territorium</h3>
                    <div class="zone-grid" id="zone-grid"></div>
                </div>
            </div>
        </div>

        <div class="bnav">
            <div class="nb ${currentView===0?'on':''}" onclick="switchView(0)">🐾 Pet</div>
            <div class="nb ${currentView===1?'on':''}" onclick="switchView(1)">⚡ Flash</div>
            <div class="nb ${currentView===2?'on':''}" onclick="switchView(2)">🎯 Uppdrag</div>
            <div class="nb ${currentView===3?'on':''}" onclick="switchView(3)">🗺️ Karta</div>
        </div>
    `;

    if (currentView === 3) initMap();
    if (currentView === 1) renderFlashes();
    if (currentView === 0) initWebGL();
}

// Navigering
function switchView(n) {
    currentView = n;
    renderApp();
}

// Pet + WebGL
let gl, program, startTime;
function initWebGL() {
    const canvas = document.getElementById('pet-canvas');
    gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return;

    const vs = `#version 300 es
        in vec4 aPosition;
        void main(){gl_Position = aPosition;}
    `;
    const fs = `#version 300 es
        precision mediump float;
        uniform float uTime;
        out vec4 fragColor;
        void main() {
            vec2 uv = gl_FragCoord.xy / vec2(240.0, 240.0);
            float d = length(uv - vec2(0.5));
            float wave = sin(uTime * 6.0 + d * 25.0) * 0.5 + 0.5;
            vec3 color = mix(vec3(0.0,1.0,0.5), vec3(1.0,0.7,0.0), wave);
            float alpha = 1.0 - smoothstep(0.5, 1.0, d);
            fragColor = vec4(color * (1.0 + wave * 1.5), alpha);
        }
    `;

    function createShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    program = gl.createProgram();
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "uTime");
    startTime = Date.now();

    function render() {
        const t = (Date.now() - startTime) / 1000;
        gl.uniform1f(timeLoc, t);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
    }
    render();
}

function petTap() {
    G.xp += 30;
    updateUI();
    saveData();
}

function feedPet() { G.xp += 50; updateUI(); saveData(); }
function playPet() { G.xp += 40; G.kc += 15; updateUI(); saveData(); }

function updateUI() {
    const xpEl = document.getElementById('xp-val');
    const kcEl = document.getElementById('kc-val');
    if (xpEl) xpEl.textContent = G.xp;
    if (kcEl) kcEl.textContent = G.kc;
}

// Flash, Uppdrag, Karta (placeholder)
function postFlash() { alert("Flash postad!"); }
function finishQuest(i) { alert("Uppdrag klart!"); }
function initMap() { alert("Karta laddas..."); }

window.onload = () => {
    loadData();
    renderApp();
    console.log("%cKARMA — Full app klar", "color:#00ff88;font-weight:bold");
};