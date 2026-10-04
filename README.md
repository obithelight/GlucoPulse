# 🩸 GlucoPulse - Smart Blood Sugar Monitor App

GlucoPulse is a modern, responsive, and feature-rich blood sugar monitoring application designed for individuals managing **Type 1** and **Type 2 Diabetes**. 

---

**Live app:** https://gluco-pulse.vercel.app/

---

Built entirely with standard **HTML5**, **Vanilla CSS**, and **ES6 JavaScript**, it provides real-time glucose tracking, insulin and carbohydrate counting, medication logs, A1C estimations, Time-in-Range (TIR %) visual metrics, and interactive canvas analytics — storing all patient data securely and persistently in browser `localStorage`.

## The problem
Tracking blood sugar on paper logbooks or relying on memory easily leads to lost entries, missed pattern trends, and inaccurate recollections during doctor visits. Without visual trends or calculated metrics like Time in Range, patients struggle to recognize post-meal spikes or early hypoglycemia risks.

> *"Keeping track of my readings on paper got messy, and most mobile apps forced me to create accounts just to save a daily blood sugar entry."*

## Who it's for
Adults living with Type 1 or Type 2 diabetes who check their blood sugar at home with a glucometer and want an instant, private digital record to review and share with their doctor.

## Decisions I made and why
1. **Browser storage instead of a database with accounts.**  
   Chosen because health data should remain 100% private on the user's device without requiring sign-ups or account registration. Alternative: a server with logins.  
   Trade-off: data stays on one device, and clearing the browser deletes it. That is why I added JSON backup and CSV export.
2. **One app for both Type 1 and Type 2.**  
   Diabetic patients often find apps tailored strictly to one condition. Combining insulin & carb tracking for T1D and medication & exercise tags for T2D makes the app versatile for everyone without cluttering the UI.
3. **mg/dL and mmol/L both supported.**  
   Diabetic patients use different standard units depending on their region (`mg/dL` in the US vs `mmol/L` globally). Instant unit toggling allows international usability without manual math.
4. **Plain HTML, CSS and JavaScript, no frameworks.**  
   Simple, lightweight, zero build tooling overhead, zero heavy framework dependencies (No React, No Tailwind), and deploys in seconds.
5. **A disclaimer and no dosing advice.**  
   The app tracks and informs. It does not advise or give medical recommendations, because medical dosing requires clinical diagnosis and personal endocrinologist supervision.

## Known limitations
- Data lives on one device and browser only
- Not encrypted
- No accounts or syncing across devices
- Manual log entry (no direct Bluetooth Sync with continuous glucose monitors / CGMs yet)

## What's next
- Downloadable PDF report for doctor visits
- Test with real users
- Automated post-meal (2-hour after meal) recheck reminder notifications

---

## ✨ Features

- **🩸 Dual Glucose Unit Support**: Switch seamlessly between `mg/dL` (US standard) and `mmol/L` (UK/Global standard) with automatic conversion.
- **💉 Type 1 Diabetes Features**: Rapid-acting (Bolus) & Long-acting (Basal) insulin dosage tracking + Carbohydrate counting (grams).
- **💊 Type 2 Diabetes Features**: Oral medication logging + Physical activity intensity tags.
- **🚨 15-15 Rule Hypo Alert**: Automated emergency alert guidance whenever a reading falls below 70 mg/dL.
- **📈 Interactive Canvas Trend Chart**: Color-coded glucose nodes (Hypo, Normal, High, Hyper), shaded target range band (70 – 180 mg/dL), and interactive hover tooltips.
- **📊 Estimated A1C (eAG)**: Automatically calculated using the official eAG formula (`A1C = (avg_mg_dL + 46.7) / 28.7`).
- **🎯 Time in Range (TIR %)**: Displays percentage of readings within target range.
- **📑 Data Management & Doctor Export**:
  - Filter readings by context tags (Fasting, Before Meal, 2h Post-Meal, Bedtime, Overnight, Random).
  - Search notes, medications, or logs.
  - Full CRUD (Add, Edit, Delete).
  - Export logs to **CSV** for doctor/endocrinologist visits.
  - Export/Import full **JSON** backups.

---

## 🛠️ Built With

- **HTML5**: Semantic markup & accessible form inputs.
- **Vanilla CSS3**: Modern glassmorphism, responsive grid layout, zero CSS variables, zero Tailwind.
- **ES6 JavaScript**: LocalStorage state management, retina Canvas graphics rendering, and CSV/JSON handlers.

---

## 🚀 Quick Start

1. Clone this repository:
   ```bash
   git clone https://github.com/obithelight/GlucoPulse.git
   ```
2. Open `index.html` in any web browser. No `npm install` or server build step required!

---

## 🔒 Medical Disclaimer

*This application is for tracking and informational purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. Always consult your doctor or endocrinologist before adjusting your medication or insulin dosages.*
