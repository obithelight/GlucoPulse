# 🩸 GlucoPulse - Smart Blood Sugar Monitor App

GlucoPulse is a modern, responsive, and feature-rich blood sugar monitoring application designed for individuals managing **Type 1** and **Type 2 Diabetes**. 

Built entirely with standard **HTML5**, **Vanilla CSS**, and **ES6 JavaScript**, it provides real-time glucose tracking, insulin and carbohydrate counting, medication logs, A1C estimations, Time-in-Range (TIR %) visual metrics, and interactive canvas analytics — storing all patient data securely and persistently in browser `localStorage`.

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
2. Open `index.html` in any web browser. No npm install or server build step required!

---

## 🔒 Privacy & Medical Disclaimer

All data is stored exclusively in your browser's local storage (`localStorage`). No personal medical data is transmitted to external servers.

*Medical Disclaimer: This application is intended for self-tracking purposes only. Consult your endocrinologist or healthcare provider for clinical medical advice or personal insulin dosing adjustments.*
