// ======================
// KARMA APP - NAVIGATION
// ======================

let G = {
    level: 5,
    xp: 1100,
    kc: 186,
    petName: "Luna",
    flashes: []
};

// Ladda / Spara
function loadData() {
    const saved = localStorage.getItem('karmaData');
    if (saved) Object.assign(G, JSON.parse(saved));
}

function saveData() {
    localStorage.setItem('karmaData', JSON.stringify(G));
}

// Navigering
let currentView = 0;

function switchView(viewIndex) {
    currentView = viewIndex;
    
    document.querySelectorAll('.view').forEach((view, index) => {
        view.classList.toggle('active', index === viewIndex);
    });

    document.querySelectorAll('.nb').forEach((nav, index) => {
        nav.classList.toggle('on', index === viewIndex);
    });

    // Special init för vissa vyer
    if (viewIndex === 3) {
        initMap();
    }
}

// Pet interaktion
function petTap() {
    const pet = document.getElementById('pet');
    if (pet) {
        pet.style.transform = 'scale(1.4) rotate(12deg)';
        setTimeout(() => pet.style.transform = '', 280);
    }
    G.xp += 30;
    updateUI();
    saveData();
}

function feedPet() {
    G.xp += 50;
    updateUI();
    saveData();
}

function playPet() {
    G.xp += 40;
    G.kc += 15;
    updateUI();
    saveData();
}

// Flash
function postFlash() {
    const text = prompt("Vad visar din flash?", "Promenad i solnedgången 🌅");
    if (!text) return;
    
    G.flashes.unshift({ text: text, time: "nu" });
    G.xp += 70;
    G.kc += 20;
    
    renderFlashes();
    updateUI();
    saveData();
}

function renderFlashes() {
    const container = document.getElementById('flash-list');
    if (!container) return;
    
    container.innerHTML = G.flashes.map(f => `
        <div class="card">${f.text} <small>(${f.time})</small></div>
    `).join('');
}

// Uppdrag
function finishQuest(i) {
    const xp = [60, 80, 50][i];
    G.xp += xp;
    updateUI();
    saveData();
    alert(`Uppdrag klart! +${xp} XP`);
}

function updateUI() {
    const xpEl = document.getElementById('xp');
    const kcEl = document.getElementById('kc');
    if (xpEl) xpEl.textContent = G.xp;
    if (kcEl) kcEl.textContent = G.kc;
}

// Init
function initApp() {
    loadData();
    
    // Rendera första vyn
    renderApp();
    
    console.log("%cKARMA — Navigering klar", "color:#00ff88;font-weight:bold");
}

// Start
window.onload = initApp;