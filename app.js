/**
 * ARAVIND GYM - Main Application Script
 * Features:
 * - 6 Workout Routine Cards
 * - Hash-based client routing
 * - Dynamic 10-Row editable workout grid
 * - Instant auto-saving to localStorage isolated per workout day
 */

// Configuration & Data Definition
const WORKOUT_DAYS = [
  {
    id: "chest-day",
    name: "Chest Day",
    badge: "Push Split",
    image: "assets/images/chest-day.jpg",
    description: "Target upper, middle, and lower pectorals with presses, flyes, and dips.",
    accent: "#ef4444",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h12M4 8h16M7 12h10M9 16h6M10 20h4"/></svg>`
  },
  {
    id: "back-day",
    name: "Back Day",
    badge: "Pull Split",
    image: "assets/images/back-day.jpg",
    description: "Build back thickness and width with rows, pull-ups, deadlifts, and lat pulldowns.",
    accent: "#38bdf8",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-8 4v10l8 4 8-4V7l-8-4z"/><path d="m12 12 8-4"/><path d="m12 12v9"/><path d="m12 12-8-4"/></svg>`
  },
  {
    id: "biceps-day",
    name: "Biceps Day",
    badge: "Arms Split",
    image: "assets/images/biceps-day.jpg",
    description: "Peak biceps hypertrophy with barbell curls, preacher curls, and hammer curls.",
    accent: "#fbbf24",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h4M2 10h4M6 6h12v8H6zM8 18h8"/></svg>`
  },
  {
    id: "triceps-day",
    name: "Triceps Day",
    badge: "Arms Split",
    image: "assets/images/triceps-day.jpg",
    description: "Maximize lockout power with skull crushers, rope pressdowns, and overhead extensions.",
    accent: "#a855f7",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`
  },
  {
    id: "shoulder-day",
    name: "Shoulder Day",
    badge: "Deltoid Split",
    image: "assets/images/shoulder-day.jpg",
    description: "Sculpt 3D delts with overhead presses, dumbbell lateral raises, and face pulls.",
    accent: "#ec4899",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>`
  },
  {
    id: "leg-day",
    name: "Leg Day",
    badge: "Lower Body",
    image: "assets/images/leg-day.jpg",
    description: "Drive lower body foundation with squats, leg press, lunges, and calf raises.",
    accent: "#10b981",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10M6 14h6"/></svg>`
  }
];

const TOTAL_ROWS = 10;
const STORAGE_PREFIX = "aravind_gym_data_";
const META_PREFIX = "aravind_gym_meta_";
const GDRIVE_URL_KEY = "aravind_gym_gdrive_url";
const GDRIVE_LAST_SYNC_KEY = "aravind_gym_gdrive_last_sync";
const DEFAULT_GDRIVE_URL = "https://script.google.com/macros/s/AKfycbyEDYL2htY7Hs0VumtOSMw48Oxp69S6H4kUP8oSe-KL_r_BezNnmi5eD7tPx23JRKHC/exec";

// App State
let currentDay = null;
let saveTimeout = null;
let driveSyncTimeout = null;

// DOM Elements
const dashboardView = document.getElementById("dashboard-view");
const detailView = document.getElementById("detail-view");
const workoutCardsContainer = document.getElementById("workout-cards-container");
const detailHeaderTitle = document.getElementById("detail-header-title");
const detailDayTag = document.getElementById("detail-day-tag");
const detailDescription = document.getElementById("detail-description");
const btnBackHome = document.getElementById("btn-back-home");
const brandHomeLink = document.getElementById("brand-home-link");
const workoutTbody = document.getElementById("workout-tbody");
const saveStatus = document.getElementById("save-status");
const btnClearTable = document.getElementById("btn-clear-table");
const currentDateText = document.getElementById("current-date-text");
const workoutDateInput = document.getElementById("workout-date-input");
const detailTimestampText = document.getElementById("detail-timestamp-text");

// Drive Sync Elements
const btnDriveSyncSettings = document.getElementById("btn-drive-sync-settings");
const driveSyncStatusText = document.getElementById("drive-sync-status-text");
const driveModalOverlay = document.getElementById("drive-modal-overlay");
const btnCloseModal = document.getElementById("btn-close-modal");
const gdriveScriptUrlInput = document.getElementById("gdrive-script-url");
const btnSaveDriveUrl = document.getElementById("btn-save-drive-url");
const btnTestDriveSync = document.getElementById("btn-test-drive-sync");
const btnCopyGasCode = document.getElementById("btn-copy-gas-code");
const driveModalStatusBox = document.getElementById("drive-modal-status-box");
const modalStatusText = document.getElementById("modal-status-text");

/**
 * Initialize Application
 */
function initApp() {
  initTodayDateDisplay();
  initDriveSync();
  renderDashboardCards();
  setupEventListeners();
  handleRoute();
}

/**
 * Display live today's date in header
 */
function initTodayDateDisplay() {
  if (!currentDateText) return;
  const now = new Date();
  const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
  currentDateText.textContent = now.toLocaleDateString("en-US", options);
}

/**
 * Render the 6 Workout Cards on Dashboard
 */
function renderDashboardCards() {
  workoutCardsContainer.innerHTML = "";

  WORKOUT_DAYS.forEach((day) => {
    const savedData = loadWorkoutData(day.id);
    const savedMeta = loadWorkoutMeta(day.id);
    const activeEntriesCount = savedData.filter((row) => 
      row.exercise || 
      row.set1_weight || row.set1_reps || 
      row.set2_weight || row.set2_reps || 
      row.set3_weight || row.set3_reps
    ).length;

    const formattedDate = savedMeta.workoutDate ? formatCardDate(savedMeta.workoutDate) : null;

    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--card-accent", day.accent);
    card.setAttribute("data-day-id", day.id);

    card.innerHTML = `
      <div class="card-hero-media">
        <img src="${day.image}" alt="${day.name}" class="card-banner-img" loading="lazy">
        <div class="card-media-gradient"></div>
        <div class="card-media-badges">
          <div class="card-icon-box">
            ${day.icon}
          </div>
          <span class="card-badge">${day.badge}</span>
        </div>
      </div>

      <div class="card-content-area">
        <h3 class="card-title">${day.name}</h3>
        <p class="card-subtitle">${day.description}</p>
      </div>

      <div class="card-footer-action">
        <div class="btn-open-grid">
          <span>Open Workout Grid</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      navigateToDay(day.id);
    });

    workoutCardsContainer.appendChild(card);
  });
}

/**
 * Render exactly 10 empty or populated rows in the editable grid table
 */
function renderWorkoutTable(dayId) {
  workoutTbody.innerHTML = "";
  const savedData = loadWorkoutData(dayId);

  for (let i = 0; i < TOTAL_ROWS; i++) {
    const rowData = savedData[i] || {
      exercise: "",
      set1_weight: "",
      set1_reps: "",
      set2_weight: "",
      set2_reps: "",
      set3_weight: "",
      set3_reps: ""
    };

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="row-index-cell">${i + 1}</td>
      <td class="col-exercise">
        <input 
          type="text" 
          class="grid-input" 
          data-row="${i}" 
          data-col="exercise" 
          placeholder="e.g. Exercise ${i + 1}" 
          value="${escapeHtml(rowData.exercise)}"
          autocomplete="off"
          spellcheck="false"
        >
      </td>
      <td class="col-numeric set-border-left">
        <input 
          type="text" 
          class="grid-input" 
          data-row="${i}" 
          data-col="set1_weight" 
          placeholder="kg" 
          value="${escapeHtml(rowData.set1_weight)}"
          autocomplete="off"
        >
      </td>
      <td class="col-numeric">
        <input 
          type="text" 
          class="grid-input" 
          data-row="${i}" 
          data-col="set1_reps" 
          placeholder="reps" 
          value="${escapeHtml(rowData.set1_reps)}"
          autocomplete="off"
        >
      </td>
      <td class="col-numeric set-border-left">
        <input 
          type="text" 
          class="grid-input" 
          data-row="${i}" 
          data-col="set2_weight" 
          placeholder="kg" 
          value="${escapeHtml(rowData.set2_weight)}"
          autocomplete="off"
        >
      </td>
      <td class="col-numeric">
        <input 
          type="text" 
          class="grid-input" 
          data-row="${i}" 
          data-col="set2_reps" 
          placeholder="reps" 
          value="${escapeHtml(rowData.set2_reps)}"
          autocomplete="off"
        >
      </td>
      <td class="col-numeric set-border-left">
        <input 
          type="text" 
          class="grid-input" 
          data-row="${i}" 
          data-col="set3_weight" 
          placeholder="kg" 
          value="${escapeHtml(rowData.set3_weight)}"
          autocomplete="off"
        >
      </td>
      <td class="col-numeric">
        <input 
          type="text" 
          class="grid-input" 
          data-row="${i}" 
          data-col="set3_reps" 
          placeholder="reps" 
          value="${escapeHtml(rowData.set3_reps)}"
          autocomplete="off"
        >
      </td>
    `;

    workoutTbody.appendChild(tr);
  }

  // Attach event delegation for inputs to auto-save immediately
  workoutTbody.querySelectorAll(".grid-input").forEach((input) => {
    input.addEventListener("input", handleInputChange);
    input.addEventListener("change", handleInputChange);
  });
}

/**
 * Handles typing inside any grid input and automatically triggers save
 */
function handleInputChange() {
  triggerSaveStatusIndicator("saving");

  // Debounce saving slightly for optimal performance while maintaining immediate persistence
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveCurrentDayData();
    triggerSaveStatusIndicator("saved");
  }, 120);
}

/**
 * Saves current 10-row grid to localStorage for active day
 */
function saveCurrentDayData() {
  if (!currentDay) return;

  const tableData = [];
  for (let i = 0; i < TOTAL_ROWS; i++) {
    const exerciseInput = workoutTbody.querySelector(`input[data-row="${i}"][data-col="exercise"]`);
    const set1WeightInput = workoutTbody.querySelector(`input[data-row="${i}"][data-col="set1_weight"]`);
    const set1RepsInput = workoutTbody.querySelector(`input[data-row="${i}"][data-col="set1_reps"]`);
    const set2WeightInput = workoutTbody.querySelector(`input[data-row="${i}"][data-col="set2_weight"]`);
    const set2RepsInput = workoutTbody.querySelector(`input[data-row="${i}"][data-col="set2_reps"]`);
    const set3WeightInput = workoutTbody.querySelector(`input[data-row="${i}"][data-col="set3_weight"]`);
    const set3RepsInput = workoutTbody.querySelector(`input[data-row="${i}"][data-col="set3_reps"]`);

    tableData.push({
      exercise: exerciseInput ? exerciseInput.value : "",
      set1_weight: set1WeightInput ? set1WeightInput.value : "",
      set1_reps: set1RepsInput ? set1RepsInput.value : "",
      set2_weight: set2WeightInput ? set2WeightInput.value : "",
      set2_reps: set2RepsInput ? set2RepsInput.value : "",
      set3_weight: set3WeightInput ? set3WeightInput.value : "",
      set3_reps: set3RepsInput ? set3RepsInput.value : ""
    });
  }

  try {
    localStorage.setItem(STORAGE_PREFIX + currentDay.id, JSON.stringify(tableData));

    // Save session date and last updated timestamp
    const dateVal = workoutDateInput ? workoutDateInput.value : getTodayISODate();
    const meta = {
      workoutDate: dateVal,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(META_PREFIX + currentDay.id, JSON.stringify(meta));

    if (detailTimestampText) {
      detailTimestampText.textContent = `Last saved: ${formatTimestamp(meta.lastSaved)}`;
    }

    // Trigger silent background auto-save to Google Drive
    triggerBackgroundDriveSync();
  } catch (err) {
    console.error("Error saving to localStorage:", err);
  }
}

/**
 * Retrieves workout session metadata (date, timestamp)
 */
function loadWorkoutMeta(dayId) {
  try {
    const raw = localStorage.getItem(META_PREFIX + dayId);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error loading workout meta:", err);
  }
  return {
    workoutDate: "",
    lastSaved: ""
  };
}

/**
 * Retrieves workout data for a specific day from localStorage
 */
function loadWorkoutData(dayId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + dayId);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === TOTAL_ROWS) {
        // Handle migration from legacy format if present
        return parsed.map((row) => ({
          exercise: row.exercise || "",
          set1_weight: row.set1_weight !== undefined ? row.set1_weight : (row.set1 || row.weight || ""),
          set1_reps: row.set1_reps !== undefined ? row.set1_reps : (row.reps || ""),
          set2_weight: row.set2_weight !== undefined ? row.set2_weight : (row.set2 || ""),
          set2_reps: row.set2_reps !== undefined ? row.set2_reps : "",
          set3_weight: row.set3_weight !== undefined ? row.set3_weight : (row.set3 || ""),
          set3_reps: row.set3_reps !== undefined ? row.set3_reps : ""
        }));
      }
    }
  } catch (err) {
    console.error("Error reading localStorage:", err);
  }

  // Return exactly 10 empty rows if none saved
  return Array.from({ length: TOTAL_ROWS }, () => ({
    exercise: "",
    set1_weight: "",
    set1_reps: "",
    set2_weight: "",
    set2_reps: "",
    set3_weight: "",
    set3_reps: ""
  }));
}

/**
 * Clears current day data
 */
function clearCurrentDayData() {
  if (!currentDay) return;
  const confirmed = window.confirm(`Clear all entries and date record for ${currentDay.name}? This cannot be undone.`);
  if (confirmed) {
    localStorage.removeItem(STORAGE_PREFIX + currentDay.id);
    localStorage.removeItem(META_PREFIX + currentDay.id);
    renderWorkoutTable(currentDay.id);
    if (workoutDateInput) workoutDateInput.value = getTodayISODate();
    if (detailTimestampText) detailTimestampText.textContent = "New session (no data)";
    triggerSaveStatusIndicator("saved");
  }
}

/**
 * Visual indicator for auto-save state
 */
function triggerSaveStatusIndicator(state) {
  if (!saveStatus) return;
  const textEl = saveStatus.querySelector(".status-text");

  if (state === "saving") {
    saveStatus.classList.add("saving");
    if (textEl) textEl.textContent = "Saving...";
  } else {
    saveStatus.classList.remove("saving");
    if (textEl) textEl.textContent = "All changes saved";
  }
}

/**
 * Client-Side Router
 */
function handleRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "").trim();

  if (!hash || hash === "home") {
    showHomeView();
  } else {
    const day = WORKOUT_DAYS.find((d) => d.id === hash);
    if (day) {
      showDetailView(day);
    } else {
      // Fallback if unrecognized hash
      window.location.hash = "#home";
    }
  }
}

function navigateToDay(dayId) {
  window.location.hash = `#${dayId}`;
}

function navigateHome() {
  // Ensure any pending keystroke is saved before switching view
  if (currentDay) {
    saveCurrentDayData();
  }
  window.location.hash = "#home";
}

function showHomeView() {
  currentDay = null;
  detailView.classList.remove("active");
  dashboardView.classList.add("active");

  // Re-render cards to show up-to-date row counts and dates
  renderDashboardCards();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showDetailView(day) {
  currentDay = day;

  // Header requirement: "ARAVIND GYM - [Selected Day]"
  detailHeaderTitle.textContent = `ARAVIND GYM - ${day.name}`;
  detailDayTag.textContent = day.badge;
  detailDescription.textContent = day.description;

  const detailHeaderImg = document.getElementById("detail-header-img");
  if (detailHeaderImg) {
    detailHeaderImg.src = day.image;
    detailHeaderImg.alt = day.name;
  }

  // Load metadata (session date and timestamp)
  const meta = loadWorkoutMeta(day.id);
  if (workoutDateInput) {
    workoutDateInput.value = meta.workoutDate || getTodayISODate();
  }

  if (detailTimestampText) {
    if (meta.lastSaved) {
      detailTimestampText.textContent = `Last saved: ${formatTimestamp(meta.lastSaved)}`;
    } else {
      detailTimestampText.textContent = `Session Date: ${formatCardDate(workoutDateInput ? workoutDateInput.value : getTodayISODate())}`;
    }
  }

  renderWorkoutTable(day.id);

  dashboardView.classList.remove("active");
  detailView.classList.add("active");
  triggerSaveStatusIndicator("saved");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Event Listeners
 */
function setupEventListeners() {
  window.addEventListener("hashchange", handleRoute);

  btnBackHome.addEventListener("click", (e) => {
    e.preventDefault();
    navigateHome();
  });

  brandHomeLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigateHome();
  });

  btnClearTable.addEventListener("click", clearCurrentDayData);

  if (workoutDateInput) {
    workoutDateInput.addEventListener("change", () => {
      handleInputChange();
    });
  }

  // Google Drive Modal & Sync Listeners
  if (btnDriveSyncSettings) {
    btnDriveSyncSettings.addEventListener("click", openDriveModal);
  }
  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", closeDriveModal);
  }
  if (driveModalOverlay) {
    driveModalOverlay.addEventListener("click", (e) => {
      if (e.target === driveModalOverlay) closeDriveModal();
    });
  }
  if (btnSaveDriveUrl) {
    btnSaveDriveUrl.addEventListener("click", saveDriveUrlAndSync);
  }
  if (btnTestDriveSync) {
    btnTestDriveSync.addEventListener("click", forceDriveSync);
  }
  if (btnCopyGasCode) {
    btnCopyGasCode.addEventListener("click", copyGasCode);
  }
}

/**
 * Google Drive Auto-Sync Logic
 */
function initDriveSync() {
  let savedUrl = localStorage.getItem(GDRIVE_URL_KEY);
  if (!savedUrl && DEFAULT_GDRIVE_URL) {
    savedUrl = DEFAULT_GDRIVE_URL;
    localStorage.setItem(GDRIVE_URL_KEY, savedUrl);
  }

  if (savedUrl && gdriveScriptUrlInput) {
    gdriveScriptUrlInput.value = savedUrl;
  }

  if (savedUrl) {
    const lastSync = localStorage.getItem(GDRIVE_LAST_SYNC_KEY);
    updateDriveStatusBadge("synced", lastSync);
    updateModalStatus(true, lastSync ? `Connected &bull; Last synced: ${formatTimestamp(lastSync)}` : "Connected to Google Drive");
    
    // Check and pull cloud data silently on startup
    pullDriveBackup(savedUrl);
  } else {
    updateDriveStatusBadge("disconnected");
    updateModalStatus(false, "Not connected yet");
  }
}

function openDriveModal() {
  if (!driveModalOverlay) return;
  const savedUrl = localStorage.getItem(GDRIVE_URL_KEY);
  if (savedUrl && gdriveScriptUrlInput) {
    gdriveScriptUrlInput.value = savedUrl;
  }
  driveModalOverlay.classList.add("active");
}

function closeDriveModal() {
  if (!driveModalOverlay) return;
  driveModalOverlay.classList.remove("active");
}

function updateDriveStatusBadge(state, timeIso) {
  if (!btnDriveSyncSettings || !driveSyncStatusText) return;

  btnDriveSyncSettings.classList.remove("synced", "syncing");

  if (state === "syncing") {
    btnDriveSyncSettings.classList.add("syncing");
    driveSyncStatusText.textContent = "Syncing to Drive...";
  } else if (state === "synced") {
    btnDriveSyncSettings.classList.add("synced");
    driveSyncStatusText.textContent = "Drive Auto-Save: Active ✓";
    if (timeIso) {
      btnDriveSyncSettings.title = `Last saved to Google Drive: ${formatTimestamp(timeIso)}`;
    }
  } else {
    driveSyncStatusText.textContent = "Drive Auto-Save: Connect";
    btnDriveSyncSettings.title = "Click to connect your Google Drive for automatic background saving";
  }
}

function updateModalStatus(isConnected, message) {
  if (!driveModalStatusBox || !modalStatusText) return;
  if (isConnected) {
    driveModalStatusBox.classList.add("connected");
  } else {
    driveModalStatusBox.classList.remove("connected");
  }
  modalStatusText.innerHTML = message;
}

function getAllGymDataPayload() {
  const payload = {
    appName: "ARAVIND GYM",
    version: "1.0",
    syncedAt: new Date().toISOString(),
    days: {}
  };

  WORKOUT_DAYS.forEach((day) => {
    payload.days[day.id] = {
      table: loadWorkoutData(day.id),
      meta: loadWorkoutMeta(day.id)
    };
  });

  return payload;
}

/**
 * Trigger background debounced auto-sync to Google Drive
 */
function triggerBackgroundDriveSync() {
  const scriptUrl = localStorage.getItem(GDRIVE_URL_KEY);
  if (!scriptUrl) return;

  clearTimeout(driveSyncTimeout);
  driveSyncTimeout = setTimeout(() => {
    performDriveSync(scriptUrl);
  }, 1200);
}

/**
 * Sends data silently to Google Drive Web App
 */
async function performDriveSync(scriptUrl) {
  if (!scriptUrl) return;
  updateDriveStatusBadge("syncing");

  try {
    const payload = getAllGymDataPayload();
    
    // mode: 'no-cors' allows fire-and-forget POST to Google Apps Script without CORS errors
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const nowIso = new Date().toISOString();
    localStorage.setItem(GDRIVE_LAST_SYNC_KEY, nowIso);
    updateDriveStatusBadge("synced", nowIso);
    updateModalStatus(true, `Synced to Drive &bull; ${formatTimestamp(nowIso)}`);
  } catch (err) {
    console.warn("Drive Auto-Sync Notice:", err);
    // Maintain active indicator if network temporarily blips
    const lastSync = localStorage.getItem(GDRIVE_LAST_SYNC_KEY);
    updateDriveStatusBadge("synced", lastSync);
  }
}

/**
 * Pulls latest backup from Google Drive on startup or force sync
 */
async function pullDriveBackup(scriptUrl) {
  try {
    const res = await fetch(`${scriptUrl}?action=get&t=${Date.now()}`);
    if (!res.ok) return;
    const cloudData = await res.json();

    if (cloudData && cloudData.days) {
      let updatedAny = false;
      WORKOUT_DAYS.forEach((day) => {
        const cloudDay = cloudData.days[day.id];
        if (cloudDay && Array.isArray(cloudDay.table)) {
          // If local has no data or cloud is present, sync it
          const localData = loadWorkoutData(day.id);
          const hasLocalData = localData.some(r => r.exercise || r.set1_weight || r.set2_weight || r.set3_weight);
          if (!hasLocalData && cloudDay.table.some(r => r.exercise || r.set1_weight)) {
            localStorage.setItem(STORAGE_PREFIX + day.id, JSON.stringify(cloudDay.table));
            if (cloudDay.meta) {
              localStorage.setItem(META_PREFIX + day.id, JSON.stringify(cloudDay.meta));
            }
            updatedAny = true;
          }
        }
      });

      if (updatedAny) {
        renderDashboardCards();
        if (currentDay) renderWorkoutTable(currentDay.id);
      }
    }
  } catch (e) {
    // Silent fallback to local storage
  }
}

function saveDriveUrlAndSync() {
  if (!gdriveScriptUrlInput) return;
  const url = gdriveScriptUrlInput.value.trim();

  if (!url) {
    localStorage.removeItem(GDRIVE_URL_KEY);
    localStorage.removeItem(GDRIVE_LAST_SYNC_KEY);
    updateDriveStatusBadge("disconnected");
    updateModalStatus(false, "Disconnected from Google Drive");
    alert("Google Drive sync disabled.");
    closeDriveModal();
    return;
  }

  if (!url.startsWith("https://script.google.com/macros/s/")) {
    alert("Please enter a valid Google Apps Script Web App URL (starts with https://script.google.com/macros/s/...)");
    return;
  }

  localStorage.setItem(GDRIVE_URL_KEY, url);
  updateModalStatus(true, "Connecting and performing first sync...");
  performDriveSync(url);

  setTimeout(() => {
    alert("Google Drive background auto-save is now active! Any changes you make will save to your Drive automatically.");
    closeDriveModal();
  }, 700);
}

function forceDriveSync() {
  const url = gdriveScriptUrlInput ? gdriveScriptUrlInput.value.trim() : localStorage.getItem(GDRIVE_URL_KEY);
  if (!url) {
    alert("Please enter your Google Apps Script Web App URL first.");
    return;
  }
  performDriveSync(url);
}

function copyGasCode() {
  const snippet = document.getElementById("gas-code-snippet");
  if (!snippet) return;

  navigator.clipboard.writeText(snippet.textContent.trim()).then(() => {
    if (btnCopyGasCode) {
      const orig = btnCopyGasCode.textContent;
      btnCopyGasCode.textContent = "Copied! ✓";
      btnCopyGasCode.style.background = "#10b981";
      btnCopyGasCode.style.color = "#000";
      setTimeout(() => {
        btnCopyGasCode.textContent = orig;
        btnCopyGasCode.style.background = "";
        btnCopyGasCode.style.color = "";
      }, 2000);
    }
  }).catch(() => {
    alert("Failed to copy code. Please manually select and copy.");
  });
}

/**
 * Date Helpers
 */
function getTodayISODate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatCardDate(isoDateStr) {
  if (!isoDateStr) return "";
  try {
    const parts = isoDateStr.split("-");
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    const d = new Date(isoDateStr);
    return isNaN(d) ? isoDateStr : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (e) {
    return isoDateStr;
  }
}

function formatTimestamp(isoStr) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      hour: "numeric", 
      minute: "2-digit" 
    });
  } catch (e) {
    return "";
  }
}

/**
 * Utility: HTML Escape
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);
