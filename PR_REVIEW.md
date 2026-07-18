# Pull Request Review Summary
**Branch:** `168-26-14-9-5-2-om-jagtap` vs `master`

## 🚀 Overview of Changes
This Pull Request introduces several major feature implementations, UX enhancements, and backend stability fixes across 6 distinct GitHub issues.

### Commits Included
* `[168] Add interactive multi-step profile wizard`
* `[14] Add due date status badges`
* `[26] Add reusable confirmation dialogs for destructive actions`
* `[5] Cascade delete task submissions`
* `[2] Restrict task assignment to Talent users`
* `[9] Validate task creation payload and reject empty requests`

---

## 🎨 Frontend Features & UX Updates

**1. Interactive Profile Wizard (Issue #168)**
* **Added:** `ProfileWizard.jsx`, `StepBasics.jsx`, `StepSkills.jsx`, `StepInterests.jsx`
* **Changes:** Replaced boring forms with a premium, animated multi-step wizard using selectable cards and pill buttons. 
* **Routing:** Added `/talent/profile` to `App.jsx` and added a link in `TalentSidebar.jsx`.
* **CSS:** Added custom `.wizard-pill` and `.wizard-card` animations to `index.css`.

**2. Due Date Status Badges (Issue #14)**
* **Added:** `dateUtils.js` to calculate "Due Soon" (<= 3 days) and "Overdue" thresholds reliably without time-zone bugs.
* **Changes:** Updated `TasksTable.jsx` (Admin), `TaskCard.jsx` (Talent), and `MyTasksList.jsx` (Talent) to conditionally render high-visibility pill badges next to deadlines. Added matching color profiles to `index.css`.

**3. Destructive Action Confirmation Dialogs (Issue #26)**
* **Added:** `ConfirmationModal.jsx` — A highly reusable, configurable, z-index-safe modal component.
* **Changes:** Integrated into `TasksTable.jsx` (before deleting tasks) and `SubmissionReviewModal.jsx` (before rejecting submissions) to prevent accidental data loss. Requires explicit user intent to dismiss.

---

## ⚙️ Backend Stability & API Updates

**1. Profile Management (Issue #168)**
* **Model:** Updated `User.js` schema to include `bio`, `skills` (Array), and `interests` (Array).
* **Routes/Controllers:** Created `GET /api/users/profile` to fetch the logged-in user and `PUT /api/users/profile` to update them, securely placed in `userController.js` and `userRoutes.js`.

**2. Task & Submission Data Integrity (Issues #2, #5, #9)**
* **Validation:** Modified `taskController.js` to rigidly validate incoming payloads so empty tasks cannot be created.
* **Assignment Restraints:** Modified `taskController.js` so tasks can strictly only be assigned to users with the `Talent` role.
* **Cascade Deletion:** Modified `submissionController.js` and `taskController.js` so that deleting a parent Task correctly cascades and deletes all associated submissions to prevent database orphans.

**3. Infrastructure & Bug Fixes**
* **Ports:** Synchronized the React `axios.js` base URLs to correctly hit the backend on port `5005`.
* **Linting:** Cleaned up unused variable warnings in `authMiddleware.js`.

---

## 📁 Files Modified (Overview)
- **New Files:** 6 (Profile Wizard components, Date utilities, Reusable Modal).
- **Modified Frontend:** 10 core components (`App.jsx`, `TasksTable.jsx`, `TalentSidebar.jsx`, etc.) + `index.css`.
- **Modified Backend:** 5 files (`User.js`, controllers, routes).
- **Lines Changed:** ~+3300 additions / -700 deletions (including package-lock updates).

**✅ Ready for Review.**
