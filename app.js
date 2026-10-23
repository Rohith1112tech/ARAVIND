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

// Curated Exercise Suggestions for each split
const EXERCISE_SUGGESTIONS = {
  chest: [
    "Barbell Bench Press",
    "Incline Dumbbell Press",
    "Incline Barbell Bench Press",
    "Flat Dumbbell Press",
    "Cable Crossover",
    "Pec Deck Fly",
    "Dips (Chest Focus)",
    "Decline Dumbbell Press",
    "Push-Ups",
    "Dumbbell Pullover"
  ],
  back: [
    "Barbell Deadlift",
    "Lat Pulldown (Wide Grip)",
    "Barbell Bent-Over Row",
    "Seated Cable Row",
    "T-Bar Row",
    "Single-Arm Dumbbell Row",
    "Pull-Ups / Chin-Ups",
    "Face Pulls",
    "Hyperextensions",
    "Straight-Arm Lat Pulldown"
  ],
  biceps: [
    "Barbell Bicep Curl",
    "Dumbbell Hammer Curl",
    "Incline Dumbbell Curl",
    "Preacher Curl (EZ-Bar)",
    "Cable Rope Hammer Curl",
    "Concentration Curl",
    "Spider Curl",
    "EZ-Bar 21s",
    "Cable Bicep Curl",
    "Reverse Grip Barbell Curl"
  ],
  triceps: [
    "Tricep Rope Pushdown",
    "Skull Crushers (EZ-Bar)",
    "Close-Grip Bench Press",
    "Overhead Dumbbell Extension",
    "Dips (Tricep Focus)",
    "Cable Straight-Bar Pushdown",
    "Overhead Cable Tricep Extension",
    "Diamond Push-Ups",
    "Single-Arm Cable Tricep Kickback"
  ],
  shoulder: [
    "Overhead Barbell Military Press",
    "Seated Dumbbell Shoulder Press",
    "Dumbbell Lateral Raise",
    "Cable Lateral Raise",
    "Rear Delt Reverse Fly",
    "Arnold Press",
    "Face Pulls",
    "Dumbbell Front Raise",
    "Barbell Upright Row",
    "Dumbbell Shrugs"
  ],
  "leg-day": [
    "Barbell Back Squat",
    "Romanian Deadlift (RDL)",
    "Leg Press",
    "Bulgarian Split Squat",
    "Leg Extension Machine",
    "Lying Leg Curl",
    "Standing Calf Raise",
    "Seated Calf Raise",
    "Walking Dumbbell Lunges",
    "Barbell Hip Thrust"
  ]
};

// App State
let currentDay = null;
let currentSessionDate = getTodayISODate();
let saveTimeout = null;
let driveSyncTimeout = null;

// Rest Timer State
let timerDuration = 60;
let timerRemaining = 60;
let timerInterval = null;
let isTimerRunning = false;
let toastTimeout = null;

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

// Detail Action Elements
const btnCopyPrev = document.getElementById("btn-copy-prev");
const btnToggleTimer = document.getElementById("btn-toggle-timer");
const restTimerPanel = document.getElementById("rest-timer-panel");
const timerDisplayDigits = document.getElementById("timer-display-digits");
const btnTimerStartPause = document.getElementById("btn-timer-start-pause");
const timerStartText = document.getElementById("timer-start-text");
const btnTimerPlus15 = document.getElementById("btn-timer-plus15");
const btnTimerReset = document.getElementById("btn-timer-reset");
const btnTimerHide = document.getElementById("btn-timer-hide");
const timerProgressBar = document.getElementById("timer-progress-bar");
const timerPresetsContainer = document.getElementById("timer-presets-container");
const exerciseSuggestionsDatalist = document.getElementById("exercise-suggestions");
const toastNotification = document.getElementById("toast-notification");

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
const btnPwaInstall = document.getElementById("btn-pwa-install");

let deferredInstallPrompt = null;

/**
 * Initialize Application
 */
function initApp() {
  initTodayDateDisplay();
  initDriveSync();
  initPWA();
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
 * Date-Specific Session Storage Helpers
 */
function getSessionStorageKey(dayId, dateStr) {
  return `aravind_gym_session_${dayId}_${dateStr}`;
}

function getDayDatesKey(dayId) {
  return `aravind_gym_dates_${dayId}`;
}

function getLoggedDatesForDay(dayId) {
  try {
    const raw = localStorage.getItem(getDayDatesKey(dayId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function addLoggedDateForDay(dayId, dateStr) {
  if (!dateStr) return;
  const list = getLoggedDatesForDay(dayId);
  if (!list.includes(dateStr)) {
    list.unshift(dateStr); // newest date first
    localStorage.setItem(getDayDatesKey(dayId), JSON.stringify(list));
  }
}

function removeLoggedDateForDay(dayId, dateStr) {
  if (!dateStr) return;
  let list = getLoggedDatesForDay(dayId);
  list = list.filter(d => d !== dateStr);
  localStorage.setItem(getDayDatesKey(dayId), JSON.stringify(list));
}

function createEmptyGrid() {
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
 * Render exactly 10 empty or populated rows in the editable grid table for a specific date
 */
function renderWorkoutTable(dayId, dateStr) {
  workoutTbody.innerHTML = "";
  const targetDate = dateStr || currentSessionDate || getTodayISODate();
  const savedData = loadWorkoutData(dayId, targetDate);

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
          list="exercise-suggestions"
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
 * Saves current 10-row grid to localStorage for active day & active session date
 */
function saveCurrentDayData() {
  if (!currentDay) return;

  const targetDate = currentSessionDate || (workoutDateInput ? workoutDateInput.value.trim() : getTodayISODate());
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
    const hasData = tableData.some(r => r.exercise || r.set1_weight || r.set1_reps || r.set2_weight || r.set2_reps || r.set3_weight || r.set3_reps);

    // Save into this specific date's session key
    localStorage.setItem(getSessionStorageKey(currentDay.id, targetDate), JSON.stringify(tableData));

    if (hasData) {
      addLoggedDateForDay(currentDay.id, targetDate);
    }

    // Save metadata
    const meta = {
      lastDate: targetDate,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(META_PREFIX + currentDay.id, JSON.stringify(meta));

    updateSessionDateStatus(currentDay.id, targetDate);

    // Trigger silent background auto-save to Google Drive
    triggerBackgroundDriveSync();
  } catch (err) {
    console.error("Error saving session data:", err);
  }
}

/**
 * Handles date picker change:
 * Saves the current date session, switches to the new date, and loads previous entries or fresh 10 empty rows!
 */
function handleDateChange() {
  if (!currentDay || !workoutDateInput) return;

  // 1. Save whatever was currently typed for the old session date first
  saveCurrentDayData();

  // 2. Switch to the newly picked date
  const newDate = workoutDateInput.value.trim() || getTodayISODate();
  currentSessionDate = newDate;

  // 3. Render the table for this new date (loads saved entries if existing, or fresh empty grid if new date!)
  renderWorkoutTable(currentDay.id, currentSessionDate);

  // 4. Update the session status text
  updateSessionDateStatus(currentDay.id, currentSessionDate);
  triggerSaveStatusIndicator("saved");
}

/**
 * Updates status text on detail page showing whether this date is fresh or has saved data
 */
function updateSessionDateStatus(dayId, dateStr) {
  if (!detailTimestampText) return;
  const targetDate = dateStr || currentSessionDate || getTodayISODate();
  const sessionData = loadWorkoutData(dayId, targetDate);
  const hasData = sessionData.some(r => r.exercise || r.set1_weight || r.set1_reps || r.set2_weight || r.set2_reps || r.set3_weight || r.set3_reps);

  if (hasData) {
    detailTimestampText.innerHTML = `Saved entries for <strong>${formatCardDate(targetDate)}</strong> (Auto-saved)`;
  } else {
    detailTimestampText.innerHTML = `Fresh session for <strong>${formatCardDate(targetDate)}</strong> (Ready to log)`;
  }
}

/**
 * Retrieves workout data for a specific day AND specific date from localStorage
 */
function loadWorkoutData(dayId, dateStr) {
  const targetDate = dateStr || currentSessionDate || getTodayISODate();
  const sessionKey = getSessionStorageKey(dayId, targetDate);

  try {
    // 1. Try date-specific session key
    const raw = localStorage.getItem(sessionKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === TOTAL_ROWS) {
        return parsed;
      }
    }

    // 2. Backward compatibility: check if old un-dated single table exists
    const legacyRaw = localStorage.getItem(STORAGE_PREFIX + dayId);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      if (Array.isArray(parsed) && parsed.length === TOTAL_ROWS) {
        const meta = loadWorkoutMeta(dayId);
        const legacyDate = meta.lastDate || meta.workoutDate || getTodayISODate();
        if (targetDate === legacyDate) {
          const migrated = parsed.map((row) => ({
            exercise: row.exercise || "",
            set1_weight: row.set1_weight !== undefined ? row.set1_weight : (row.set1 || row.weight || ""),
            set1_reps: row.set1_reps !== undefined ? row.set1_reps : (row.reps || ""),
            set2_weight: row.set2_weight !== undefined ? row.set2_weight : (row.set2 || ""),
            set2_reps: row.set2_reps !== undefined ? row.set2_reps : "",
            set3_weight: row.set3_weight !== undefined ? row.set3_weight : (row.set3 || ""),
            set3_reps: row.set3_reps !== undefined ? row.set3_reps : ""
          }));
          localStorage.setItem(sessionKey, JSON.stringify(migrated));
          addLoggedDateForDay(dayId, targetDate);
          return migrated;
        }
      }
    }
  } catch (err) {
    console.error("Error reading session data:", err);
  }

  // Fresh date with no data: return 10 clean, empty rows!
  return createEmptyGrid();
}

/**
 * Retrieves workout session metadata (last date, timestamp)
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
    lastDate: "",
    lastSaved: ""
  };
}

/**
 * Clears current session data for the selected date
 */
function clearCurrentDayData() {
  if (!currentDay) return;
  const targetDate = currentSessionDate || getTodayISODate();
  const confirmed = window.confirm(`Clear entries for ${currentDay.name} on ${formatCardDate(targetDate)}? This cannot be undone.`);
  if (confirmed) {
    localStorage.removeItem(getSessionStorageKey(currentDay.id, targetDate));
    removeLoggedDateForDay(currentDay.id, targetDate);
    renderWorkoutTable(currentDay.id, targetDate);
    updateSessionDateStatus(currentDay.id, targetDate);
    triggerSaveStatusIndicator("saved");
    triggerBackgroundDriveSync();
    showToast(`Cleared table for ${formatCardDate(targetDate)}`);
  }
}

/**
 * 1-Click Copy From Previous Workout
 * Auto-populates the current date grid from the most recent previously logged session of this routine!
 */
function copyPreviousWorkout() {
  if (!currentDay) return;

  const allDates = getLoggedDatesForDay(currentDay.id);
  const targetDate = currentSessionDate || getTodayISODate();

  // Find most recent logged date that is NOT the currently selected date
  const pastDates = allDates.filter((d) => d !== targetDate);

  if (pastDates.length === 0) {
    showToast(`No previous ${currentDay.name} workout found to copy.`);
    return;
  }

  const prevDate = pastDates[0];
  const prevData = loadWorkoutData(currentDay.id, prevDate);
  const hasData = prevData.some((r) => r.exercise || r.set1_weight);

  if (!hasData) {
    showToast(`Previous workout on ${formatCardDate(prevDate)} was empty.`);
    return;
  }

  // If user already typed something today, ask before overwriting
  const currentData = loadWorkoutData(currentDay.id, targetDate);
  const currentHasData = currentData.some((r) => r.exercise || r.set1_weight);
  if (currentHasData) {
    const ok = window.confirm(`Replace current entries with previous workout from ${formatCardDate(prevDate)}?`);
    if (!ok) return;
  }

  // Clone data into current session date
  localStorage.setItem(getSessionStorageKey(currentDay.id, targetDate), JSON.stringify(prevData));
  addLoggedDateForDay(currentDay.id, targetDate);

  // Re-render table and status
  renderWorkoutTable(currentDay.id, targetDate);
  updateSessionDateStatus(currentDay.id, targetDate);
  triggerSaveStatusIndicator("saved");
  triggerBackgroundDriveSync();

  showToast(`Loaded previous workout from ${formatCardDate(prevDate)}! 💪`);
}

/**
 * Populates HTML5 Exercise Suggestions DataList dynamically per split
 */
function populateExerciseSuggestions(dayId) {
  if (!exerciseSuggestionsDatalist) return;
  exerciseSuggestionsDatalist.innerHTML = "";
  const list = EXERCISE_SUGGESTIONS[dayId] || [];
  list.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    exerciseSuggestionsDatalist.appendChild(opt);
  });
}

/**
 * Rest Timer Controls & Web Audio Chime
 */
function updateTimerDisplay() {
  if (!timerDisplayDigits || !timerProgressBar) return;
  const mins = Math.floor(timerRemaining / 60);
  const secs = timerRemaining % 60;
  timerDisplayDigits.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const pct = Math.max(0, Math.min(100, (timerRemaining / timerDuration) * 100));
  timerProgressBar.style.width = `${pct}%`;
}

function startTimer() {
  if (isTimerRunning) return;
  isTimerRunning = true;
  if (btnTimerStartPause) {
    btnTimerStartPause.classList.add("running");
    if (timerStartText) timerStartText.textContent = "Pause";
    const icon = document.getElementById("timer-icon-playpause");
    if (icon) {
      icon.innerHTML = `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`;
    }
  }
  if (restTimerPanel) restTimerPanel.classList.add("running");

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timerRemaining > 0) {
      timerRemaining--;
      updateTimerDisplay();
      if (timerRemaining === 0) {
        timerFinished();
      }
    }
  }, 1000);
}

function pauseTimer() {
  isTimerRunning = false;
  clearInterval(timerInterval);
  if (btnTimerStartPause) {
    btnTimerStartPause.classList.remove("running");
    if (timerStartText) timerStartText.textContent = "Resume";
    const icon = document.getElementById("timer-icon-playpause");
    if (icon) {
      icon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
    }
  }
  if (restTimerPanel) restTimerPanel.classList.remove("running");
}

function toggleTimerPlayPause() {
  if (isTimerRunning) {
    pauseTimer();
  } else {
    if (timerRemaining <= 0) {
      timerRemaining = timerDuration;
      updateTimerDisplay();
    }
    startTimer();
  }
}

function resetTimer() {
  pauseTimer();
  timerRemaining = timerDuration;
  if (timerStartText) timerStartText.textContent = "Start";
  const icon = document.getElementById("timer-icon-playpause");
  if (icon) {
    icon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
  }
  updateTimerDisplay();
}

function addTimerSeconds(seconds) {
  timerRemaining += seconds;
  if (timerRemaining > timerDuration) {
    timerDuration = timerRemaining;
  }
  updateTimerDisplay();
  showToast(`Added +${seconds}s to rest timer`);
}

function selectTimerPreset(seconds, targetButton) {
  timerDuration = seconds;
  timerRemaining = seconds;
  pauseTimer();
  if (timerStartText) timerStartText.textContent = "Start";
  const icon = document.getElementById("timer-icon-playpause");
  if (icon) {
    icon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
  }

  if (timerPresetsContainer) {
    timerPresetsContainer.querySelectorAll(".preset-pill").forEach((btn) => btn.classList.remove("active"));
  }
  if (targetButton) {
    targetButton.classList.add("active");
  }

  updateTimerDisplay();
}

function timerFinished() {
  pauseTimer();
  if (timerStartText) timerStartText.textContent = "Start";
  const icon = document.getElementById("timer-icon-playpause");
  if (icon) {
    icon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
  }

  playTimerChime();
  showToast("Rest time complete! Ready for your next set! 🔥");
}

/**
 * 100% Offline Dual-Tone Chime & Mobile Haptic Vibration via Web Audio API
 */
function playTimerChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Tone 1: 880Hz (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0.25, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.28);

    // Tone 2: 1174.66Hz (D6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.28, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.55);

    // Phone vibration in pocket
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 300]);
    }
  } catch (err) {
    console.warn("Chime playback notice:", err);
  }
}

function toggleRestTimerVisibility() {
  if (!restTimerPanel) return;
  restTimerPanel.classList.toggle("active");
  if (restTimerPanel.classList.contains("active")) {
    updateTimerDisplay();
  }
}

function showToast(message) {
  if (!toastNotification) return;
  toastNotification.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;
  toastNotification.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastNotification.classList.remove("show");
  }, 3200);
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
  const initialDate = meta.lastDate || getTodayISODate();
  currentSessionDate = initialDate;

  if (workoutDateInput) {
    workoutDateInput.value = initialDate;
  }

  renderWorkoutTable(day.id, currentSessionDate);
  updateSessionDateStatus(day.id, currentSessionDate);
  populateExerciseSuggestions(day.id);
  updateTimerDisplay();

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

  // Copy Previous Workout
  if (btnCopyPrev) {
    btnCopyPrev.addEventListener("click", copyPreviousWorkout);
  }

  // Rest Timer Controls
  if (btnToggleTimer) {
    btnToggleTimer.addEventListener("click", toggleRestTimerVisibility);
  }
  if (btnTimerHide) {
    btnTimerHide.addEventListener("click", toggleRestTimerVisibility);
  }
  if (btnTimerStartPause) {
    btnTimerStartPause.addEventListener("click", toggleTimerPlayPause);
  }
  if (btnTimerReset) {
    btnTimerReset.addEventListener("click", resetTimer);
  }
  if (btnTimerPlus15) {
    btnTimerPlus15.addEventListener("click", () => addTimerSeconds(15));
  }
  if (timerPresetsContainer) {
    timerPresetsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".preset-pill");
      if (btn && btn.dataset.seconds) {
        selectTimerPreset(parseInt(btn.dataset.seconds, 10), btn);
      }
    });
  }

  if (workoutDateInput) {
    // When date changes, automatically persist current session and switch to new date (fresh grid if new date)
    workoutDateInput.addEventListener("change", handleDateChange);
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
    version: "2.0",
    syncedAt: new Date().toISOString(),
    days: {}
  };

  WORKOUT_DAYS.forEach((day) => {
    const dates = getLoggedDatesForDay(day.id);
    const sessions = {};
    dates.forEach((dateStr) => {
      sessions[dateStr] = loadWorkoutData(day.id, dateStr);
    });

    if (currentSessionDate && !sessions[currentSessionDate]) {
      sessions[currentSessionDate] = loadWorkoutData(day.id, currentSessionDate);
    }

    payload.days[day.id] = {
      dates: dates,
      sessions: sessions,
      table: loadWorkoutData(day.id, currentSessionDate || getTodayISODate()),
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
        if (!cloudDay) return;

        // Restore date-specific sessions
        if (cloudDay.sessions && typeof cloudDay.sessions === "object") {
          Object.keys(cloudDay.sessions).forEach((dateStr) => {
            const table = cloudDay.sessions[dateStr];
            if (Array.isArray(table) && table.some(r => r.exercise || r.set1_weight || r.set1_reps || r.set2_weight || r.set3_weight)) {
              localStorage.setItem(getSessionStorageKey(day.id, dateStr), JSON.stringify(table));
              addLoggedDateForDay(day.id, dateStr);
              updatedAny = true;
            }
          });
        } else if (Array.isArray(cloudDay.table)) {
          // Fallback legacy support
          const localData = loadWorkoutData(day.id, getTodayISODate());
          const hasLocalData = localData.some(r => r.exercise || r.set1_weight || r.set2_weight || r.set3_weight);
          if (!hasLocalData && cloudDay.table.some(r => r.exercise || r.set1_weight)) {
            const targetDate = (cloudDay.meta && cloudDay.meta.lastDate) || getTodayISODate();
            localStorage.setItem(getSessionStorageKey(day.id, targetDate), JSON.stringify(cloudDay.table));
            addLoggedDateForDay(day.id, targetDate);
            updatedAny = true;
          }
        }

        if (cloudDay.meta) {
          localStorage.setItem(META_PREFIX + day.id, JSON.stringify(cloudDay.meta));
        }
      });

      if (updatedAny) {
        renderDashboardCards();
        if (currentDay) {
          renderWorkoutTable(currentDay.id, currentSessionDate);
          updateSessionDateStatus(currentDay.id, currentSessionDate);
        }
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
 * Progressive Web App (PWA) Setup
 */
function initPWA() {
  // Register Service Worker for 100% offline support
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          console.log("ARAVIND GYM Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("Service Worker registration failed:", err);
        });
    });
  }

  // Check if already running in standalone/installed mode
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (isStandalone && btnPwaInstall) {
    btnPwaInstall.classList.add("installed");
  }

  // Capture the install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (btnPwaInstall && !isStandalone) {
      btnPwaInstall.classList.remove("installed");
      btnPwaInstall.style.display = "inline-flex";
    }
  });

  if (btnPwaInstall) {
    btnPwaInstall.addEventListener("click", async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === "accepted") {
          btnPwaInstall.classList.add("installed");
        }
        deferredInstallPrompt = null;
      } else {
        // iOS or already prompt-less browsers guidance
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
          alert("To install ARAVIND GYM on iPhone/iPad:\n\n1. Tap the Share button (square with arrow) at the bottom of Safari.\n2. Scroll down and tap 'Add to Home Screen'.\n3. Tap 'Add' in the top right corner.\n\nNow you can launch it like a native app!");
        } else {
          alert("To install ARAVIND GYM:\n\n1. Tap the browser menu (⋮ in Chrome/Edge).\n2. Select 'Install app' or 'Add to Home screen'.\n\nThe app will work offline in your gym!");
        }
      }
    });
  }

  window.addEventListener("appinstalled", () => {
    if (btnPwaInstall) {
      btnPwaInstall.classList.add("installed");
    }
    deferredInstallPrompt = null;
    console.log("ARAVIND GYM app installed successfully");
  });
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
