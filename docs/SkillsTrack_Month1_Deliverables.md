# Firebase data model and REST endpoint plan

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

## REST endpoint plan

Each required feature (brief, section 2.3), paired with its exact REST endpoint(s) and the steps to build it. Base URL for all endpoints: `https://<project-id>-default-rtdb.<region>.firebasedatabase.app/`, every request appends `?auth=<ID_TOKEN>`.

---

## 1. User registration, sign-in, sign-out, authenticated state (REST endpoint plan)

**REST/Firebase calls:**

- Registration/sign-in/sign-out use the **Firebase Authentication SDK**, not the Realtime Database REST API directly.
- POST `/users/<uid>.json` — write the profile record once, right after registration.
- GET `/users/<uid>.json` — read profile/role after sign-in, to drive role-based UI (learner vs assessor).

**Steps:**

1. Enable Email/Password sign-in in Firebase console.
2. Build register form → `createUserWithEmailAndPassword` → on success, POST profile to `/users/<uid>.json` with `role: "learner"`.
3. Build sign-in form → `signInWithEmailAndPassword` → GET `/users/<uid>.json` to confirm role.
4. Add `onAuthStateChanged` listener to restore session on load (see `Flowcharts.md`, login flow).
5. Add sign-out → `signOut()` → clear session → redirect to landing page.
6. Guard protected routes/views against unauthenticated access.

---

## 2. Dashboard: totals, completed, outstanding, progress (REST endpoint plan)

**REST/Firebase calls:**

- GET `/tasks.json?orderBy="userId"&equalTo="<uid>"` — the only endpoint this feature needs; everything else is calculated client-side.

**Steps:**

1. On dashboard load, GET the filtered task list.
2. Pass results into `new TaskManager(tasks)` (see `Class-Design.md`).
3. Call `getTotals()` → total, completed, outstanding, progress %.
4. Render into the DOM; re-run after any task create/update/delete.
5. Matches the calculation flow in `Flowcharts.md`, section 3.

---

## 3. Task manager: create, read, update, delete (REST endpoint plan)

**REST/Firebase calls:**

**Steps:**

1. Read: GET on load, render list.
2. Create: form → client-side validation → POST → refresh list + dashboard totals.
3. Update: edit form pre-filled from a `Task` instance → PATCH.
4. Delete: trigger confirmation dialog (feature 7) → on confirm only → DELETE.
5. After every write, re-instantiate/refresh `TaskManager` so totals stay accurate.

---

## 4. Support-session booking form with validation and status feedback (REST endpoint plan)

**REST/Firebase calls:**

**Steps:**

1. Build form: topic, preferred date, notes.
2. Client-side validation (required fields, no past dates) → block submit until valid, show inline errors.
3. On valid submit, POST with `status: "pending"`.
4. GET the booking back to show live status (pending/confirmed/declined) as feedback.
5. If in scope, build an assessor view that PATCHes only `status` — rules already restrict this server-side.

---

## 5. Search, filter or sort (arrays and higher-order functions) (REST endpoint plan)

**REST/Firebase calls:**

- None — operates entirely on the array already fetched via feature 3's GET request. No extra network calls.

**Steps:**

1. Search: `tasks.filter(t => t.title.toLowerCase().includes(query))`.
2. Filter: `TaskManager.filterByCategory()`.
3. Sort: `TaskManager.sortByDueDate()`.
4. Wire search input / category dropdown / sort control to re-render the list.
5. Persist last-used filter via cookie (feature 6).

---

## 6. Cookie-based preference (REST endpoint plan)

**REST/Firebase calls:**

- None — cookies are entirely client-side (`document.cookie`), no Firebase involvement. This is also why passwords/tokens must never go here — they belong to the Auth SDK/session, not this mechanism.

**Steps:**

1. Choose preferences to store: theme + last filter.
2. Write `setCookie`/`getCookie` helpers.
3. Save on change (theme toggle, filter select).
4. Read on app load, before first render.
5. Confirm no sensitive data ever reaches a cookie.

---

## 7. Confirmation dialog, redirect, printable summary (REST endpoint plan)

**REST/Firebase calls:**

- Confirmation dialog triggers the DELETE call from feature 3 — no separate endpoint of its own.
- Redirect and print summary use no new endpoints; print summary reads from the already-fetched task list via `TaskManager.getTotals()`.

**Steps:**

1. Dialog: reusable `<dialog>` component, wired to task deletion.
2. Redirect: after sign-in → dashboard; after sign-out → landing page.
3. Print summary: `@media print` stylesheet + `window.print()`, driven by the same totals as the dashboard.

---

## 8. JS-timer animation and controlled multimedia element (REST endpoint plan)

**REST/Firebase calls:**

- None — purely front-end behaviour.

**Steps:**

1. Animate the dashboard progress bar with `requestAnimationFrame`/`setInterval` when totals update.
2. Add a `<video>` or `<audio>` element (e.g. resources view).
3. Add custom JS-controlled play/pause buttons via event listeners.

---

## 9. Mini-game (REST endpoint plan)

**REST/Firebase calls:**

- POST `/scores.json` — the only endpoint this feature needs, fired once on game completion.

**Steps:**

1. Confirm framework choice (Phaser.js, Kaboom.js, etc.) with the assessor.
2. Build a small, clearly "basic operable" game.
3. On completion, POST `{ userId, score, duration, completedAt }` to `/scores.json`.
4. Optionally surface results on the dashboard.

---

## 10. Firebase Realtime Database integration and documented REST CRUD (checklist)

This isn't a separate build task — it's the checklist that ties every table above together:

- [ ] Every CRUD action above matches a row in this document (method + path + purpose).
- [ ] `database.rules.json` is deployed and matches every access pattern used above.
- [ ] No endpoint is called without an `auth` token once rules are locked down.
- [ ] Each PATCH sends only the fields intended to change (never a full-record overwrite).

---

## Suggested build order (final plan)

1. Auth (feature 1) — required before any other endpoint can be called with a valid token.
2. Deploy `database.rules.json` (feature 10) — lock down access before writing real data.
3. Task manager CRUD (feature 3) — core data loop other features depend on.
4. Dashboard totals (feature 2) — depends on task data existing.
5. Search/filter/sort (feature 5) — layers on the fetched task list, no new endpoints.
6. Cookie preferences (feature 6) — independent, can run in parallel.
7. Confirmation dialog, redirect, print summary (feature 7) — depends on 2 and 3 being functional.
8. Booking form (feature 4) — independent data path, good for parallel ownership.
9. Animation + multimedia (feature 8) — polish pass.
10. Mini-game (feature 9) — self-contained, single new endpoint, good for independent ownership.


# Pseudocode for login, task creation, progress calculation and deletion confirmation
1. Registration

   START.Registration 

     INPUT email
     INPUT password


       IF (NOT email CONTAINS ".") OR
          (NOT email CONTAINS "@" ) OR
          (NOT email CONTAINS "gmail.com")
          DISPLAY "Incorrect email"
       ENDIF

       IF (LENGTH(password) < 8) OR
          (NOT password CONTAINS special_character) OR
          (NOT password CONTAINS upprcase _letter) THEN
          DISPLAY "please enter correct password"
       ENDIF

       IF (email_is_invalid) OR (password_is_invalid) THEN
          DISPLAY "Registration failed.Please try again"
          RETURN TO REGISTRATION_PAGE
       ELSE 
          DISPLAY "Registration seccessful"
          PROCEED TO BACKEND
       ENDIF

   END RegistrationValidation

2. Login
START.
     INPUT email_address
     INPUT password

     PROCESS
       user enters their email and password
       send the login request to Firebase Authentication with email_address and pass

     IF the credentials are valid THEN 
        Firebase authenticates the user and returns an authentication token
     DISPLAY dashboard
     ELSE IF the credentials are valid THEN
          Firebase returns an error
     DISPLAY login error
     ENDIF

END
3. Task Creation — CRUD: Create
START.
    INPUT taskTitle
    INPUT taskDescription
    INPUT dueDate
    INPUT otherTaskInformation

   PROCESS
    Lecturer enters the task information
    Validate required fields (task_title, due_date, etc.)
    IF validation passes THEN
       Send task data to Firebase Firestore to create a new task document
       Associate task with relevant student/class/lecturer
       IF Firestore confirms task creation THEN
          DISPLAY the new task
       ELSE
          DISPLAY error message (task creation failed)
       ENDIF
    ELSE
       DISPLAY error message (validation failed)
    ENDIF
END

4. Progress Calculation — CRUD: Read 
 START
    INPUT student_id

    PROCESS
       Request student's task data from Firebase Firestore using student_id
       Read completion status for each task
       Count number_of_completed_tasks
       Count total_number_of_tasks
       Calculate progress_percentage = (number_of_completed_tasks / total_number_of_tasks) * 100

    OUTPUT
       DISPLAY progress_percentage
       DISPLAY number_of_completed_tasks
       DISPLAY (total_number_of_tasks - number_of_completed_tasks) as remaining_tasks
END

5. Task Deletion — CRUD: Delete
START
     INPUT selected_task
     INPUT delete_request

     PROCESS
       IF lecturer selects a task THEN
          DISPLAY deletion confirmation message
       IF lecturer confirms deletion THEN
          Send delete request to Firebase Firestore for selected_task
       IF Firestore deletes task successfully THEN
          Refresh task list
          DISPLAY "Task deleted successfully" 
       ELSE
          DISPLAY error message (deletion failed)
       ENDIF   
       ELSE
          DISPLAY "Task remains unchanged"
       ENDIF
    
END
# User Stories

## User Story 1: Register Account
**As a learner, I need to register an account so that I can access the learner portal.**

### Acceptance Criteria
1. The register form includes:
   - Email
   - Password
   - Confirm Password
   - Display Name
2. The password must be at least 8 characters long.
3. If the password is less than 8 characters, an error message is shown.
4. On successful registration:
   - The user is created in Firebase Authentication
   - The user is added to the `users` node in the Realtime Database

---

## User Story 2: Log In
**As a learner, I need to log in so that I can view my tasks.**

### Acceptance Criteria
1. The login form includes:
   - Email
   - Password
2. If the credentials are incorrect, show the message:
   - `"Invalid email or password"`
3. On successful login:
   - The authenticated state is set
   - The user is redirected to the dashboard
---

## User Story 3: Add, View, and Delete Tasks
**As a learner, I need to add, view, and delete my tasks so that I can manage my work.**

### Acceptance Criteria
1. The **Add Task** button is only visible when the user is logged in.
2. The task form requires:
   - Title
   - Due Date
3. Priority defaults to `"medium"`.
4. A new task is posted to `/tasks.json` with the current user's UID.
5. The new task appears in the list without a page refresh.
6. Tasks can be deleted.

---

## User Story 4: Mark Tasks as Complete
**As a learner, I need to mark a task as complete so that my progress updates.**

### Acceptance Criteria
1. Each task includes a checkbox.
2. Clicking the checkbox sends a `PATCH` request to:
   - `/tasks/{taskId}.json`
3. The task is updated with:
   - `completed: true`
4. Dashboard progress is recalculated using:
   - `completed tasks / total tasks * 100`
5. Completed tasks are shown with strikethrough styling.

---

## User Story 5: Switch Between Dark and Light Mode
**As a learner, I want to switch between dark and light mode so that I can reduce eye strain when studying at night.**

### Acceptance Criteria
1. The header includes a theme toggle with an icon.
2. Clicking the toggle adds or removes the theme using JavaScript DOM manipulation.
3. The selected theme is saved in a cookie named `themePreference`.
4. On page load, JavaScript reads the cookie and applies the saved theme before the content is shown.
5. No passwords or user data are stored in the cookie, only the theme string.
6. All text remains readable in both themes, and contrast is checked.

---

## User Story 6: Print Progress Summary
**As a learner, I want to print my progress summary so that I can show my assessor proof of work during check-ins.**

### Acceptance Criteria
1. The dashboard includes a **Print Summary** button.
2. Clicking the button opens the browser print dialog using `window.print()`.
3. The print view uses CSS to hide navigation and buttons, and show only:
   - Learner name
   - Date
   - Task totals
   - Progress
   - List of completed tasks
4. A confirmation dialog appears first with the message:
   - `"Print your current progress summary"`
5. Clicking **Cancel** closes the dialog without printing.
6. The printed page includes the current date in the header.



# SkillsTrack Training Centre Learner Support Portal  
## Project Requirements

### 1. Background
SkillsTrack Training Centre supports learners who attend short occupational programmes.  
At present, learners record goals, tasks, support bookings, and progress in separate documents and messages. This makes it difficult for assessors to track outstanding work, identify learners who need support, and monitor learner progress effectively.

---

## 2. Client Requirements
The system must:

1. Provide a single, clear interface for managing learning support tasks and support requests.
2. Allow users to register, sign in, and view their own information.
3. Store, retrieve, update, and delete application data using Firebase.
4. Provide meaningful calculations and summaries based on stored data.

---

## 3. Project Scope

### 3.1 Included in Scope
The application must include:

1. User registration, sign-in, sign-out, and authenticated user state.
2. A dashboard displaying:
   - task totals
   - completed work
   - outstanding work
   - calculated progress
3. A task manager with:
   - create
   - read
   - update
   - delete
4. Search, filter, or sort functionality using arrays and higher-order functions.
5. Cookie-based preferences such as:
   - theme
   - last selected filter
6. A confirmation dialog before destructive actions.
7. Redirects after appropriate actions.
8. A printable progress summary.

---

## 4. Out of Scope
The following are not required for this project:

1. Support-session booking form with validation and status feedback.
2. At least one animation driven by JavaScript timers and one controlled multimedia element.
3. A basic operable mini-game created with an Assessor-approved JavaScript framework.

---

## 5. Functional Summary

### Authentication
- Users must be able to register, sign in, and sign out.
- The application must maintain authenticated user state.
- Users should only be able to view their own information.

### Task Management
- Users must be able to create, view, update, and delete tasks.
- Tasks should be stored in Firebase.
- The dashboard must show task totals and progress data.

### Search and Filtering
- The system must allow learners to search, filter, or sort data.
- These functions must use arrays and higher-order functions.

### Preferences
- User preferences such as theme or last selected filter must be saved in cookies.

### User Experience
- The system must show confirmation before destructive actions.
- The system must redirect users appropriately after actions.
- The progress summary must be printable.

---

## 6. Data and Reporting Requirements
The application must:
- store data in Firebase
- retrieve data from Firebase
- update existing records
- delete records
- calculate useful summaries such as:
  - total tasks
  - completed tasks
  - outstanding tasks
  - progress percentage

---


