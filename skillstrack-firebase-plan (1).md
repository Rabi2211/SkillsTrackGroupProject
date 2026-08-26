# SkillsTrack — Firebase Data Model & REST API Plan

Based on the wireframes: role selection (Learner / Administration), auth + password reset,
Learner Portal (Dashboard, Tasks, Bookings, Resources/Guides, Progress, Game), and
Admin Portal (Add Tasks, Add Guides, Learner Progress by gender, Search Learner, Bookings,
Reports, Support).

---

## 1. Firebase Auth

- **Firebase Authentication** (email/password) backs both login screens ("login to learner
  portal" / "login to administration portal").
- Every user gets a custom claim `role: "learner" | "admin"` set server-side on account
  creation (via a Cloud Function trigger on `createUser`, matching the "create account" /
  "create administration account" screens).
- "Forgot password?" → Firebase Auth `sendPasswordResetEmail`. The "Enter email used to
  register" + "Verify" screen maps to `fetchSignInMethodsForEmail` before triggering the
  reset link; the "Type New Password / Retype Password" screen is the reset-confirmation
  page (`confirmPasswordReset` with the `oobCode` from the email link).

---

## 2. Firestore Data Model

```
/users/{uid}
/tasks/{taskId}
    /assignments/{uid}          (subcollection)
/bookings/{bookingId}
/guides/{guideId}
/reports/{reportId}
/gameScores/{scoreId}
```

### `/users/{uid}`
| Field | Type | Notes |
|---|---|---|
| role | string | `"learner"` \| `"admin"` |
| name | string | |
| surname | string | |
| email | string | matches Auth email |
| gender | string | drives admin "Female / Male Learners" pie charts |
| photoUrl | string | profile avatar |
| createdAt | timestamp | |
| updatedAt | timestamp | set by "Update Profile" |

```
// CREATE (triggered by /auth/signup)
function onUserSignUp(uid, name, surname, email, gender, role):
    setCustomClaim(uid, { role })
    db.collection("users").doc(uid).set({
        role, name, surname, email, gender,
        photoUrl: null,
        totalTasks: 0, completed: 0, outstanding: 0, overdue: 0,
        taskAverage: 0, gameAverage: 0,
        createdAt: now(), updatedAt: now()
    })

// READ (GET /users/{uid})
function getProfile(uid, requester):
    assert requester.uid == uid OR requester.role == "admin"
    return db.collection("users").doc(uid).get()

// UPDATE (PATCH /users/{uid}) — "Update Profile"
function updateProfile(uid, requester, { name, surname, photoUrl }):
    assert requester.uid == uid
    db.collection("users").doc(uid).update({
        name, surname, photoUrl, updatedAt: now()
    })

// SEARCH (GET /users?search=&role=learner) — "Search Learner"
function searchLearners(requester, searchText):
    assert requester.role == "admin"
    return db.collection("users")
        .where("role", "==", "learner")
        .where("name", ">=", searchText)   // + prefix match on name/surname
        .get()
```

### `/tasks/{taskId}` (created via Admin "Task Creation Form" / "Add Tasks" PDF upload)
| Field | Type | Notes |
|---|---|---|
| title | string | "task title" |
| description | string | "Task description" |
| otherInfo | string | "Other task information" |
| category | string | shown in learner Tasks table |
| priority | string | `low` \| `medium` \| `high` |
| dueDate | timestamp | `[CALENDER]` field |
| sourceFileUrl | string\|null | if created via PDF upload |
| createdBy | string (uid) | admin uid |
| assignedTo | array\<uid\> | class/learner(s) the task targets |
| createdAt | timestamp | |

```
// CREATE (POST /tasks) — "Task Creation Form" submit
function createTask(requester, { title, description, otherInfo, category, priority, dueDate, assignedTo }):
    assert requester.role == "admin"
    taskRef = db.collection("tasks").add({
        title, description, otherInfo, category, priority, dueDate,
        sourceFileUrl: null, createdBy: requester.uid, assignedTo,
        createdAt: now()
    })
    for uid in assignedTo:
        taskRef.collection("assignments").doc(uid).set({
            status: "outstanding", score: null,
            submittedAt: null, updatedAt: now()
        })
        // triggers incrementUserCounters(uid, {totalTasks:+1, outstanding:+1})
    return taskRef.id

// IMPORT (POST /tasks/import) — "Add Tasks" PDF upload
function importTasksFromPdf(requester, file, assignedTo):
    assert requester.role == "admin"
    fileUrl = uploadToStorage("task-uploads/", file)
    parsedTasks = parsePdfIntoTaskFields(file)   // title/description/dueDate per row
    for t in parsedTasks:
        createTask(requester, { ...t, assignedTo })  // reuse logic above
        setSourceFileUrl(taskId, fileUrl)

// READ (GET /tasks?learnerId=)
function listTasks(requester, learnerId):
    assert requester.uid == learnerId OR requester.role == "admin"
    tasks = db.collection("tasks").where("assignedTo", "array-contains", learnerId).get()
    for task in tasks:
        task.assignment = task.ref.collection("assignments").doc(learnerId).get()
    return tasks

// UPDATE (PATCH /tasks/{taskId})
function updateTask(requester, taskId, changes):
    assert requester.role == "admin"
    db.collection("tasks").doc(taskId).update(changes)

// DELETE (DELETE /tasks/{taskId})
function deleteTask(requester, taskId):
    assert requester.role == "admin"
    deleteSubcollection(taskId, "assignments")   // decrement each learner's counters first
    db.collection("tasks").doc(taskId).delete()
```

#### `/tasks/{taskId}/assignments/{uid}` (per-learner completion — feeds dashboard counters & progress report)
| Field | Type | Notes |
|---|---|---|
| status | string | `outstanding` \| `completed` \| `overdue` |
| score | number\|null | percent scored, feeds "Avg. Score %" |
| submittedAt | timestamp\|null | |
| updatedAt | timestamp | set on View/Done/Delete actions |

```
// UPDATE (PATCH /tasks/{taskId}/assignments/{uid}) — "Done" action
function markTaskDone(requester, taskId, uid, score = null):
    assert requester.uid == uid
    prevStatus = getAssignment(taskId, uid).status
    db.collection("tasks").doc(taskId).collection("assignments").doc(uid).update({
        status: "completed", score, submittedAt: now(), updatedAt: now()
    })
    // fires onAssignmentWrite trigger below

// TRIGGER — Cloud Function on any write to /tasks/{taskId}/assignments/{uid}
function onAssignmentWrite(change, taskId, uid):
    before = change.before.data()
    after  = change.after.data()
    if before.status != after.status:
        decrementUserCounter(uid, before.status)   // e.g. outstanding: -1
        incrementUserCounter(uid, after.status)    // e.g. completed: +1
    if after.score != null:
        recalcTaskAverage(uid)                     // mean of all assignment scores

// nightly scheduled function — flips "outstanding" -> "overdue" past dueDate
function markOverdueTasks():
    for task in db.collection("tasks").where("dueDate", "<", now()):
        for assignment in task.ref.collection("assignments").where("status","==","outstanding"):
            assignment.update({ status: "overdue", updatedAt: now() })
```

> Denormalized counters (`totalTasks`, `completed`, `outstanding`, `overdue`, `taskAverage`)
> are maintained on `/users/{uid}` by a Cloud Function trigger on assignment writes, so the
> Dashboard/Tasks screens can read them with a single doc fetch instead of aggregating.

### `/bookings/{bookingId}` ("Book Session" / "Schedule Support" screens)
| Field | Type | Notes |
|---|---|---|
| learnerId | string (uid) | |
| learnerName | string | denormalized for admin "Schedule Support" list |
| topic | string | "Topic Of Booking" |
| description | string | "Topic description" |
| dueDate | timestamp | |
| scheduledDate | timestamp\|null | set once admin confirms |
| scheduledTime | string\|null | |
| status | string | `pending` \| `scheduled` \| `completed` \| `cancelled` |
| createdAt | timestamp | |

```
// CREATE (POST /bookings) — "Book Session"
function createBooking(requester, { topic, description, dueDate }):
    assert requester.role == "learner"
    db.collection("bookings").add({
        learnerId: requester.uid, learnerName: requester.name + " " + requester.surname,
        topic, description, dueDate,
        scheduledDate: null, scheduledTime: null,
        status: "pending", createdAt: now()
    })

// READ (GET /bookings?learnerId=) — learner's own list
function listMyBookings(requester):
    assert requester.role == "learner"
    return db.collection("bookings").where("learnerId", "==", requester.uid).get()

// READ (GET /bookings?status=pending) — "Schedule Support" admin queue
function listPendingBookings(requester):
    assert requester.role == "admin"
    return db.collection("bookings").where("status", "==", "pending").get()

// UPDATE (PATCH /bookings/{bookingId}) — admin confirms date/time
function scheduleBooking(requester, bookingId, { scheduledDate, scheduledTime }):
    assert requester.role == "admin"
    db.collection("bookings").doc(bookingId).update({
        scheduledDate, scheduledTime, status: "scheduled"
    })

// DELETE (DELETE /bookings/{bookingId})
function cancelBooking(requester, bookingId):
    booking = db.collection("bookings").doc(bookingId).get()
    assert requester.uid == booking.learnerId OR requester.role == "admin"
    db.collection("bookings").doc(bookingId).update({ status: "cancelled" })
```

### `/guides/{guideId}` (Resources — "Add Guide" PDF upload)
| Field | Type | Notes |
|---|---|---|
| title | string | |
| description | string | |
| fileUrl | string | Cloud Storage download URL |
| uploadedBy | string (uid) | |
| createdAt | timestamp | |

```
// CREATE (POST /guides) — "Add Guide" upload
function addGuide(requester, { title, description, file }):
    assert requester.role == "admin"
    fileUrl = uploadToStorage("guides/", file)
    db.collection("guides").add({
        title, description, fileUrl, uploadedBy: requester.uid, createdAt: now()
    })

// READ (GET /guides) — learner "Resources" tab
function listGuides(requester):
    assert requester.role in ["learner", "admin"]
    return db.collection("guides").orderBy("createdAt", "desc").get()

// DELETE (DELETE /guides/{guideId})
function deleteGuide(requester, guideId):
    assert requester.role == "admin"
    guide = db.collection("guides").doc(guideId).get()
    deleteFromStorage(guide.fileUrl)
    db.collection("guides").doc(guideId).delete()
```

### `/gameScores/{scoreId}` ("GAME Center", "Game Average")
| Field | Type | Notes |
|---|---|---|
| learnerId | string (uid) | |
| gameId | string | |
| score | number | |
| playedAt | timestamp | |

```
// CREATE (POST /game-scores) — learner finishes a game
function submitGameScore(requester, { gameId, score }):
    assert requester.role == "learner"
    db.collection("gameScores").add({
        learnerId: requester.uid, gameId, score, playedAt: now()
    })
    // fires trigger to recompute gameAverage on /users/{uid}

// TRIGGER — Cloud Function on create of /gameScores/{scoreId}
function onGameScoreCreate(scoreDoc):
    scores = db.collection("gameScores").where("learnerId", "==", scoreDoc.learnerId).get()
    avg = mean(scores.map(s => s.score))
    db.collection("users").doc(scoreDoc.learnerId).update({ gameAverage: avg })

// READ (GET /users/{uid}/game-scores)
function listGameScores(requester, uid):
    assert requester.uid == uid OR requester.role == "admin"
    return db.collection("gameScores").where("learnerId", "==", uid)
        .orderBy("playedAt", "desc").get()
```

### `/reports/{reportId}` ("Learner Progress Report" — printable, lecturer-signed)
| Field | Type | Notes |
|---|---|---|
| lecturerId | string (uid) | |
| lecturerName / subject / taskRef | string | header fields on the printed form |
| classAvgCompletion | number | |
| classAvgScore | number | |
| rows | array\<{learnerId, learnerName, tasksAssigned, tasksCompleted, completionPct, avgScorePct}\> | snapshot for printing |
| generatedAt | timestamp | |

```
// CREATE (POST /reports) — "PRINT REPORT" / "Download learners report"
function generateReport(requester, { lecturerName, subject, taskRef }):
    assert requester.role == "admin"
    learners = db.collection("users").where("role", "==", "learner").get()
    rows = []
    for learner in learners:
        assigned = countAssignmentsFor(learner.uid)
        completed = countAssignmentsFor(learner.uid, status="completed")
        rows.push({
            learnerId: learner.uid,
            learnerName: learner.name + " " + learner.surname,
            tasksAssigned: assigned,
            tasksCompleted: completed,
            completionPct: (completed / assigned) * 100,
            avgScorePct: learner.taskAverage
        })
    classAvgCompletion = mean(rows.map(r => r.completionPct))
    classAvgScore = mean(rows.map(r => r.avgScorePct))
    reportRef = db.collection("reports").add({
        lecturerId: requester.uid, lecturerName, subject, taskRef,
        classAvgCompletion, classAvgScore, rows, generatedAt: now()
    })
    return reportRef.id

// READ (GET /reports/{reportId})
function getReport(requester, reportId):
    assert requester.role == "admin"
    return db.collection("reports").doc(reportId).get()

// EXPORT (GET /reports/{reportId}/pdf)
function renderReportPdf(requester, reportId):
    assert requester.role == "admin"
    report = getReport(requester, reportId)
    return renderHtmlTemplateToPdf("learner-progress-report", report)
```

### Cloud Storage
```
/profile-photos/{uid}/{file}
/guides/{guideId}/{file}
/task-uploads/{taskId}/{file}
```

---

## 3. REST API Endpoint Plan
Implemented as Firebase Cloud Functions (`onRequest`, HTTPS) sitting in front of Firestore.
All endpoints require an `Authorization: Bearer <Firebase ID token>` header; an `requireRole`
middleware checks the custom claim per endpoint.

### Auth & Account
| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/auth/signup` | public | Create learner/admin account, set custom claim, create `/users/{uid}` |
| POST | `/auth/verify-email` | public | Confirm "Enter email used to register" step |
| POST | `/auth/password-reset/request` | public | Trigger reset email |
| POST | `/auth/password-reset/confirm` | public | Confirm new password (oobCode) |
| GET | `/auth/me` | learner/admin | Return profile + role for session bootstrap |

### Profile
| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/users/{uid}` | self/admin | View profile card |
| PATCH | `/users/{uid}` | self | "Update Profile" (name/surname/photo) |
| GET | `/users?search=&role=learner` | admin | "Search Learner" table |

### Tasks
| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/tasks?learnerId=` | learner/admin | Tasks table (Title, Category, Due Date, Priority, Status) |
| POST | `/tasks` | admin | "Create" — Task Creation Form |
| POST | `/tasks/import` | admin | "Add Tasks" PDF upload |
| GET | `/tasks/{taskId}` | learner/admin | "View" action |
| PATCH | `/tasks/{taskId}` | admin | Edit task |
| DELETE | `/tasks/{taskId}` | admin | "Delete" action |
| PATCH | `/tasks/{taskId}/assignments/{uid}` | learner | "Done" action → status/score update |
| GET | `/users/{uid}/task-summary` | learner/admin | Totals for dashboard circles (Total/Completed/Outstanding/Overdue) |

### Bookings
| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/bookings` | learner | "Book Session" |
| GET | `/bookings?learnerId=` | learner | Own bookings |
| GET | `/bookings?status=pending` | admin | "Schedule Support" queue |
| PATCH | `/bookings/{bookingId}` | admin | Confirm date/time, change status |
| DELETE | `/bookings/{bookingId}` | learner/admin | Cancel |

### Guides / Resources
| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/guides` | learner | Resources tab |
| POST | `/guides` | admin | "Add Guide" upload |
| DELETE | `/guides/{guideId}` | admin | Remove guide |

### Progress & Reports
| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/users/{uid}/progress` | learner | Task Average + Game Average circles |
| GET | `/progress/overview` | admin | Pie chart data (overall / female / male) |
| POST | `/reports` | admin | Generate "Learner Progress Report" snapshot |
| GET | `/reports/{reportId}` | admin | Fetch for print view |
| GET | `/reports/{reportId}/pdf` | admin | "PRINT REPORT" — server-rendered PDF |
| GET | `/reports` | admin | List/download learners report |

### Game
| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/game-scores` | learner | Submit a game result |
| GET | `/users/{uid}/game-scores` | learner/admin | History behind "Game average" |

---

## 4. Security Rules (summary)
- `/users/{uid}`: readable by owner and any `admin`; writable by owner (profile fields only)
  or `admin`.
- `/tasks/**`: writable only by `admin`; `assignments/{uid}` writable by the matching learner
  for `status`/`submittedAt` only — `score` is admin/Cloud-Function only.
- `/bookings/{id}`: create by the owning learner; read/update by owner or `admin`.
- `/guides/**`, `/reports/**`: read by any authenticated user (or learner for guides), write
  by `admin` only.
- All Cloud Storage paths mirror the same owner/admin split via matching Storage rules.
