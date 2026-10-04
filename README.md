# 🩸 GlucoPulse

A simple, modern blood sugar tracker for people living with Type 1 and Type 2 diabetes.

**Live App:** [https://gluco-pulse.vercel.app/](https://gluco-pulse.vercel.app/)  
**GitHub Repository:** [https://github.com/obithelight/GlucoPulse](https://github.com/obithelight/GlucoPulse)

---

## ❓ The Problem

Managing diabetes requires constant vigilance—tracking blood glucose readings, timing meals, calculating carbs, and adjusting insulin or medication. Traditional logbooks can be cumbersome to maintain, while existing digital tools are often overly complicated, require intrusive account sign-ups, or fail to support both Type 1 and Type 2 tracking needs. 

> *"Keeping track of my readings on paper got messy, and most apps forced me to create accounts just to save a daily blood sugar entry."*

GlucoPulse solves this by providing a clean, instant, and private tracking tool that works directly in your browser without any setup barrier.

---

## 👤 Who It's For

- **People with Type 1 Diabetes**: Who need to log blood glucose alongside rapid-acting (Bolus) and long-acting (Basal) insulin doses and carbohydrate intake (grams).
- **People with Type 2 Diabetes**: Who track glucose levels, oral medication (e.g., Metformin), and physical activity levels.
- **Patients Worldwide**: Supports both `mg/dL` (US standard) and `mmol/L` (Global standard) units with instant toggle conversion.

---

## ✨ What It Does

- **Glucose Logging**: Record blood sugar levels with time-of-day context tags (Fasting, Before Meal, 2h After Meal, Bedtime, Overnight, Random).
- **Dual Condition Support**: Track carbs & insulin for Type 1, or oral medication & physical activity for Type 2.
- **Instant Unit Conversion**: Switch seamlessly between `mg/dL` and `mmol/L`.
- **Health Analytics**: Automatically computes **Average Glucose**, **Estimated A1C (eAG)** (`A1C = (avg_mg_dL + 46.7) / 28.7`), and **Time in Range (TIR %)**.
- **Interactive Trend Chart**: View glucose trends over 7, 14, 30 days, or all time on a custom canvas chart with target range shading (70–180 mg/dL).
- **15-15 Rule Hypo Safety Alert**: Instant emergency advice when a reading falls below 70 mg/dL (consume 15g fast-acting carbs & recheck in 15 minutes).
- **Target Customization**: Adjust target thresholds in settings according to doctor recommendations.
- **Data Export & Backup**: Export readings to **CSV** (to share with your endocrinologist) or **JSON** (for complete backup & restore).

---

## 💡 Decisions I Made and Why

1. **One unified app for both Type 1 and Type 2**  
   Diabetic patients often find apps tailored strictly to one condition. Combining insulin/carb tracking for T1D and medication/exercise tags for T2D makes the app versatile without cluttering the interface.

2. **Built with HTML, CSS, and Vanilla JavaScript only**  
   Keeping the stack minimal means no heavy framework dependencies (No React, No Tailwind), zero build step, maximum speed, and instant browser deployment.

3. **Data stored locally in the browser (`localStorage`)**  
   Health data stays 100% private on the user's device without requiring account registration.  
   *Trade-off*: Data lives on one device/browser only. To address this limitation, full CSV and JSON data export/import capabilities were built in.

4. **Medical disclaimer & doctor-set target ranges**  
   The app is designed to log, inform, and visualize data. It explicitly avoids giving automated medical advice or calculating mandatory insulin doses.

5. **Hosted on Vercel & code backed up on GitHub**  
   Ensures fast continuous deployment from git pushes while maintaining version control on GitHub.

6. **Built in collaboration with an AI Agent**  
   Developed using AI pair programming (Google Antigravity), establishing strict architectural guidelines (zero CSS variables, browser persistence), reviewing execution plans, and auditing runtime UX.

---

## 🎓 What I Learned

- **The Deployment Pipeline**: Mastering the flow from local workspace -> GitHub repository -> Vercel automated build -> live production URL.
- **Git Fundamentals**: Working through initialization, staging (`git add`), committing, and pushing (`git push`) as distinct steps in project lifecycle management.
- **UX & Form Validation Edge Cases**: Identifying and fixing restrictive HTML5 `<input min="..." max="...">` validations that blocked valid decimal entries when users switched to `mmol/L` units.

---

## ⚠️ Known Limitations

- **Single Device / Single Browser Storage**: Because data relies on browser `localStorage`, readings do not automatically sync across multiple devices unless backed up via JSON/CSV export.
- **Manual Log Entry**: Requires manual input (no direct Bluetooth integration with Continuous Glucose Monitors / CGMs yet).

---

## 🔮 What's Next

- **PDF Summary Reports**: Generate downloadable PDF health summaries formatted specifically for endocrinologist appointments.
- **Post-Meal Recheck Reminders**: Browser notifications prompting users to re-test glucose 2 hours after logging a meal.
- **Dark / Light Theme Toggle**: Give users the choice between the modern dark navy theme and a crisp light theme.

---

## 🛠️ Built With

- **HTML5**: Semantic elements & accessible form controls.
- **Vanilla CSS3**: Modern glassmorphism layout, responsive grid, zero CSS variables, zero Tailwind.
- **ES6 JavaScript**: LocalStorage state management, retina Canvas graphics rendering, and CSV/JSON handlers.

---

## 🚀 Quick Start (Local Run)

1. Clone this repository:
   ```bash
   git clone https://github.com/obithelight/GlucoPulse.git
   ```
2. Open `index.html` in any web browser. No `npm install` or build step required!

---

## 🔒 Medical Disclaimer

*This application is for tracking and informational purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. Always consult your doctor or endocrinologist before adjusting your medication or insulin dosages.*
