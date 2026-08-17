# Firebase data model and Rest endpoint plan planning

## 1. User registration, sign-in, sign-out, authenticated state

1. Enable Email/Password in Firebase Authentication (console).
2. Build register form (name, email, password) → call `createUserWithEmailAndPassword`.
3. On successful registration, write the matching profile to `users/{uid}` (see `Firebase-Data-Model.md`) with `role: "learner"`.
4. Build sign-in form → call `signInWithEmailAndPassword`.
5. Store the returned ID token/session in memory (or `sessionStorage`, never cookies — see feature 6).
6. Add an `onAuthStateChanged` listener to restore session on page load and drive the login flowchart (`Flowcharts.md`, section 1).
7. Add sign-out button → call `signOut`, clear session state, redirect to landing page.
8. Guard dashboard/task manager/booking routes so unauthenticated users are redirected to sign-in.

## 2. Dashboard: totals, completed, outstanding, progress

1. On dashboard load, GET the current user's tasks (REST endpoint in `Firebase-Data-Model.md`, section 2).
2. Instantiate a `TaskManager` with the returned tasks (`Class-Design.md`).
3. Call `getTotals()` to derive total, completed, outstanding, progress %.
4. Render the four figures into the DOM; re-render whenever tasks change (see feature 3).
5. Drive the progress calculation exactly as mapped in `Flowcharts.md`, section 3.

## 3. Task manager: create, read, update, delete

1. Read: GET filtered task list on load (`orderBy="userId"&equalTo="<uid>"`), render as a list.
2. Create: task form → validate required fields client-side → POST to `/tasks.json` (flow in `Flowcharts.md`, section 2).
3. Update: edit form pre-filled from a `Task` instance → PATCH `/tasks/<taskId>.json`.
4. Delete: trigger confirmation dialog (feature 7) → on confirm, DELETE `/tasks/<taskId>.json`.
5. After any create/update/delete, refresh the local `TaskManager` and re-render dashboard totals (feature 2).

## 4. Support-session booking form with validation and status feedback

1. Build form: topic, preferred date, notes.
2. Client-side validation: required fields, date not in the past → show inline errors, block submit until valid.
3. On valid submit, POST to `/bookings.json` with `status: "pending"`.
4. Show status feedback in the UI (pending/confirmed/declined) by reading the booking's `status` field back from Firebase.
5. If assessor-status-update is in scope, build a separate assessor view that PATCHes `status` only (rules in `database.rules.json` already restrict this to the assessor role).

## 5. Search, filter or sort using arrays and higher-order functions

1. Search: `tasks.filter(t => t.title.toLowerCase().includes(query))`.
2. Filter by category: `TaskManager.filterByCategory()` (already defined in `Class-Design.md`).
3. Sort by due date: `TaskManager.sortByDueDate()` (already defined in `Class-Design.md`).
4. Wire a search input, a category dropdown, and a sort toggle to these methods; re-render the list on each change.
5. Persist the last-selected filter via the cookie preference (feature 6).

## 6. Cookie-based preference (theme, display mode, or last filter)

1. Decide the preference(s) to store: theme + last filter (see `Preferences-and-UX-Plan.md`, section 1).
2. Write a small `setCookie`/`getCookie` helper (no library needed for this scope).
3. On preference change (theme toggle, filter select), write the cookie with an expiry.
4. On app load, read the cookie before first render and apply theme/filter immediately.
5. Confirm no password, token, or personal data ever gets written to a cookie — cross-check against `Preferences-and-UX-Plan.md`.

## 7. Confirmation dialog, redirect, printable summary

1. Confirmation dialog: build a reusable `<dialog>` component; wire it to the delete-task action (flow in `Flowcharts.md`, section 4).
2. Redirect: implement after sign-in (→ dashboard) and after sign-out (→ landing), per `Preferences-and-UX-Plan.md`, section 3.
3. Printable summary: build a print-only view/stylesheet (`@media print`) driven by `TaskManager.getTotals()` plus the task list; wire a "Print summary" button to `window.print()`.

## 8. JS-timer animation and controlled multimedia element

1. Animation: animate the dashboard progress bar fill using `requestAnimationFrame` or `setInterval` when totals update, rather than relying on CSS alone.
2. Multimedia: add a short instructional `<video>` or `<audio>` element (e.g. on a resources/onboarding view).
3. Add explicit JS-controlled play/pause buttons (event listeners on custom controls, not just native browser controls) to satisfy "controlled multimedia element."

## 9. Mini-game (Assessor-approved framework/library)

1. Confirm the framework choice with the assessor (Phaser.js, Kaboom.js, or alternative) before building.
2. Scope a small, clearly "basic operable" game reinforcing a programming concept (e.g. a simple quiz or sorting/logic puzzle).
3. On game completion, POST the result to `/scores.json` (`Firebase-Data-Model.md`, section 2).
4. Optionally surface the score/history on the dashboard or a dedicated game results view.

## 10. Firebase Realtime Database integration and documented REST CRUD

1. This threads through every feature above — confirm each CRUD action against the endpoint table in `Firebase-Data-Model.md`, section 2.
2. Deploy `database.rules.json` before any real testing (see prior walkthrough) so all of the above is tested against real access rules, not test-mode.
3. Keep a short doc or comment block per API call noting method, path, and purpose, so "documented REST API CRUD operations" is satisfiable as evidence, not just working code.

## Suggested build order (maps to Month 1/2 schedule)

1. Auth (feature 1) — nothing else works without a signed-in user.
2. Firebase rules + data model deployed (feature 10) — lock this down before writing to real data.
3. Task manager CRUD (feature 3) — the core data loop.
4. Dashboard totals (feature 2) — depends on task data existing.
5. Search/filter/sort (feature 5) — layers on top of the task list.
6. Cookie preferences (feature 6) — small, can be done in parallel with 3–5.
7. Confirmation dialog, redirect, print summary (feature 7) — depends on task manager and dashboard being functional.
8. Booking form (feature 4) — independent of tasks, can be built in parallel by a second team member.
9. Animation + multimedia (feature 8) — polish pass once dashboard and a resources view exist.
10. Mini-game (feature 9) — self-contained, good candidate for the third team member to own independently.
