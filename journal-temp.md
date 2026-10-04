# Project Journal: GlucoPulse

## 4 Oct 2026: First deployment
**What I worked on:**
Generated the first version of GlucoPulse with an AI agent in Anti Gravity,
initialized Git, pushed to GitHub, and deployed on Vercel.

**What I decided:**
- Store data in the browser so no accounts or servers are needed
- Make the repo public so my work is visible
- Add a medical disclaimer because the app deals with health data

**What confused me:**
Understanding the exact multi-step Git deployment workflow—realizing that `git init`, staging files with `git add`, recording local snapshots with `git commit`, connecting remote repositories with `git remote add`, and uploading changes with `git push` are separate steps that work together. Also, learning how command separators differ in PowerShell (using `;` instead of `&&`).

**What went wrong and how I fixed it:**
When switching glucose units to `mmol/L`, browser HTML5 form validation failed with `Value must be greater than or equal to 10` because of static `min="10"` and `min="40"` attributes on input fields. Fixed it by updating input field validation attributes to `min="0.5"`, `step="0.1"`, and `max="600"`, while dynamically updating input placeholders and target range labels in JavaScript.

**Next:**
- Test the app with real users
- Add downloadable PDF health reports formatted for endocrinologist appointments
