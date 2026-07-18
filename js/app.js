// State
let G = {
    level: 5,
    xp: 1100,
    kc: 186,
    petName: "Luna",
    flashes: []
};

// Ladda från localStorage
function loadData() {
    const saved = localStorage.getItem('karmaData');
    if (saved) Object.assign(G, JSON.parse(saved));
}

function saveData() {
    localStorage.setItem('karmaData', JSON.stringify(G));
}

// Rendera appen
function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="topbar">
            <div class="logo">KARMA 🐾</div>
            <div>⚡ ${G.xp} 💎 ${G.kc}</div>
        </div>

        <div class="main">
            <div id="view-pet" class="view active">
                <div style="text-align:center;padding:60px 20px">
                    <h1>Level ${G.level}</h1>
                    <div onclick="petTap()" style="font-size:160px;cursor:pointer;margin:30px 0">🐾</div>
                    <h2>${G.petName}</h2>
                    <p style="color:var(--green)">Mood: Legendary ✨</p>
                </div>
                <div style="display:flex;gap:15px;justify-content:center">
                    <button onclick="feedPet()" style="background:var(--green);color:#000;padding:16px 40px;border:none;border-radius:50px">🍎 Mata</button>
                    <button onclick="playPet()" style="background:var(--purple);padding:16px 40px;border:none;border-radius:50px">🎾 Lek</button>
                </div>
            </div>
        </div>

        <div class="bnav">
            <div onclick="switchView(0)">🐾 Pet</div>
            <div onclick="switchView(1)">⚡ Flash</div>
            <div onclick="switchView(2)">🎯 Uppdrag</div>
            <div onclick="switchView(3)">🗺️ Karta</div>
        </div>
    `;
}

// Grundläggande funktioner
function petTap() { G.xp += 30; updateUI(); saveData(); }
function feedPet() { G.xp += 50; updateUI(); saveData(); }
function playPet() { G.xp += 40; G.kc += 15; updateUI(); saveData(); }
function updateUI() { renderApp(); }

function switchView(n) {
    console.log("Byt till vy", n);
    renderApp();
}

// Init
window.onload = () => {
    loadData();
    renderApp();
    console.log("%cKARMA — Projektstruktur klar", "color:#00ff88;font-weight:bold");
};