# ARAVIND GYM 🏋️‍♂️

A clean, modern, and mobile-responsive workout logger web application designed for peak gym performance tracking.

---

## 🌟 Features Implemented

### 1. Initial Setup & Main Dashboard
- **Prominent Header:** Bold, modern branding with **"ARAVIND GYM"** and dumbbell logo icon.
- **6 Distinct Workout Day Cards with Real Routine Photos:**
  - 💥 **Chest Day** (Front aesthetic physique shot)
  - 💥 **Back Day** (Back lat spread in mirror)
  - 💥 **Biceps Day** (Front double biceps flex)
  - 💥 **Triceps Day** (Arm physique focus)
  - 💥 **Shoulder Day** (Deltoid & trap focus shot)
  - 💥 **Leg Day** (Heavy leg extension machine)
- **Sleek Aesthetic:** Modern dark theme with custom accents, hover zoom hero images, and badge split tags.
- **Mobile Responsive:** Adapts seamlessly across desktop, tablet, and mobile phone screens.

### 2. Navigation & Dynamic Routing
- **Single Page App Routing (SPA):** Hash-based routing (`#chest-day`, `#back-day`, `#biceps-day`, etc.) supporting direct navigation, bookmarking, and native browser forward/backward buttons.
- **Dynamic Header:** Displays **"ARAVIND GYM - [Selected Day]"** (e.g. `ARAVIND GYM - Chest Day`).
- **"Back to Home" Button:** Instantly transitions back to the main dashboard.

### 3. 10-Row Editable Input Grid
- **Structured Data Table:** Exactly 10 numbered rows (1 to 10) by default.
- **Dedicated Weight & Reps for Every Set:**
  1. `Exercise Name`
  2. `Set 1`: **Weight** & **Reps**
  3. `Set 2`: **Weight** & **Reps**
  4. `Set 3`: **Weight** & **Reps**
- **Active HTML Inputs:** Every single cell in the grid contains an active `<input type="text">` allowing direct typing.

### 4. Automatic Local State Management & Data Persistence
- **Instant Auto-Save:** Automatically persists input keystrokes directly into `localStorage`.
- **Day Isolation:** Data for all 6 workout days is stored under distinct keys (`aravind_gym_data_[dayId]`), so logging chest exercises does not overwrite back or leg routines.
- **Persistent State:** Navigating back to the dashboard and returning to any day immediately reloads all 10 rows with their saved data.
- **Live Status Indicator:** Real-time feedback badge ("Saving..." / "All changes saved") when editing.
- **Clear Day Option:** Quick action button to safely clear a day's entries with confirmation.

### 5. Date Tracking Everywhere It's Needed 📅
- **Header Live Date:** Prominent live calendar badge in the top navigation displaying the current date (e.g., `Sat, Oct 24, 2026`).
- **Dashboard Card Session Dates:** Each of the 6 workout cards displays its last recorded session date (e.g., `Session: Oct 24, 2026` or `No session recorded`).
- **Editable Workout Date Picker:** Inside every workout detail page, users can select or change the workout date for that routine with a native calendar picker.
- **Last Saved Timestamp Badge:** Tracks and displays the exact time and date when changes were saved to disk.

### 6. Automatic Google Drive Cloud Backend ☁️
- **Automatic Silent Sync:** As you type, entries automatically save locally and silently sync to your personal Google Drive in the background — no manual click required.
- **Cross-Device Recovery:** Automatically loads existing Drive backups upon visiting the app from any phone or PC.
- **Live Sync Badge:** Displays real-time cloud connection state in the top navigation bar.

---

## 🚀 How to Run the Web App

### Option A: Open directly in your browser (Zero setup)
Simply double-click or open `index.html` in any browser (Chrome, Edge, Firefox, Safari).

### Option B: Run with local server (Node.js)
```bash
npm start
```
Then visit `http://localhost:3000` in your web browser.
