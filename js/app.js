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

// Rendera hela appen
function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="topbar">
            <div class="logo">KARMA <span>🐾</span></div>
            <div>⚡ <span id="xp-val">${G.xp}</span> 💎 <span id="kc-val">${G.kc}</span></div>
        </div>

        <div class="main">
            <!-- Pet -->
            <div id="view-pet" class="view ${currentView === 0 ? 'active' : ''}">
                <div style="text-align:center;padding:40px 20px">
                    <h1 style="font-size:32px">Level <span id="level-val">${G.level}</span></h1>
                    <div id="pet" onclick="petTap()" style="font-size:160px;cursor:pointer;margin:30px 0">🐾</div>
                    <h2>${G.petName}</h2>
                    <p style="color:var(--green)">Mood: Legendary ✨</p>
                </div>
                <div style="display:flex;gap:15px;justify-content:center;padding:0 20px">
                    <button onclick="feedPet()" style="background:var(--green);color:#000;padding:16px 40px;border:none;border-radius:50px;font-weight:800">🍎 Mata</button>
                    <button onclick="playPet()" style="background:var(--purple);padding:16px 40px;border:none;border-radius:50px;font-weight:800">🎾 Lek</button>
                </div>
            </div>

            <!-- Flash -->
            <div id="view-flash" class="view ${currentView === 1 ? 'active' : ''}">
                <div style="padding:20px">
                    <h2 style="text-align:center">Flash Feed</h2>
                    <button onclick="postFlash()" style="width:100%;margin:20px 0;background:linear-gradient(var(--pink),var(--purple));padding:18px;border:none;border-radius:50px;color:white;font-weight:800">📹 Posta Flash</button>
                    <div id="flash-list"></div>
                </div>
            </div>

            <!-- Uppdrag -->
            <div id="view-uppdrag" class="view ${currentView === 2 ? 'active' : ''}">
                <div style="padding:20px">
                    <h2>Dagens Uppdrag</h2>
                    <div class="card" onclick="finishQuest(0)">Posta flash → +60 XP</div>
                    <div class="card" onclick="finishQuest(1)">Gå 8000 steg → +80 XP</div>
                    <div class="card" onclick="finishQuest(2)">IRL samtal → +50 XP</div>
                </div>
            </div>

            <!-- Karta -->
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
}

// Navigering
function switchView(n) {
    currentView = n;
    renderApp();
}

// Pet
function petTap() {
    const pet = document.getElementById('pet');
    if (pet) pet.style.transform = 'scale(1.4)';
    setTimeout(() => { if (pet) pet.style.transform = ''; }, 280);
    G.xp += 30;
    updateUI();
    saveData();
}

function feedPet() { G.xp += 50; updateUI(); saveData(); }
function playPet() { G.xp += 40; G.kc += 15; updateUI(); saveData(); }

// Flash
function postFlash() {
    const text = prompt("Vad visar din flash?", "Promenad i solnedgången 🌅");
    if (!text) return;
    G.flashes.unshift({text: text, time: "nu"});
    G.xp += 70;
    G.kc += 20;
    renderFlashes();
    updateUI();
    saveData();
}

function renderFlashes() {
    const container = document.getElementById('flash-list');
    if (!container) return;
    container.innerHTML = G.flashes.map(f => `<div class="card">${f.text} <small>(${f.time})</small></div>`).join('');
}

// Uppdrag
function finishQuest(i) {
    const xp = [60,80,50][i];
    G.xp += xp;
    updateUI();
    saveData();
    alert(`Uppdrag klart! +${xp} XP`);
}

function updateUI() {
    const xpEl = document.getElementById('xp-val');
    const kcEl = document.getElementById('kc-val');
    if (xpEl) xpEl.textContent = G.xp;
    if (kcEl) kcEl.textContent = G.kc;
}

// Karta
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    // Enkel placeholder för Leaflet (lägg till Leaflet CDN om du vill ha full karta)
    mapContainer.innerHTML = `<div style="height:100%;background:#0a0a0f;display:flex;align-items:center;justify-content:center;color:#00ff88">Karta laddas...</div>`;
}

// Init
window.onload = () => {
    loadData();
    renderApp();
    console.log("%cKARMA — Full app klar (99%)", "color:#00ff88;font-weight:bold");
};