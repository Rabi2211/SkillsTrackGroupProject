# SkillsTrack — Firebase Realtime Database Data Model & REST API Plan

 (Firebase Realtime Database, native REST API, suggested
paths) and the wireframes. **Base model = brief's minimum spec** (flat RTDB tree, learner-owned
tasks, direct REST calls to Firebase — no custom backend). Anything from the wireframes that
goes beyond the minimum (assessor-issued tasks, guides library, class reports, gender
breakdown) is called out as an **extension**, 

---

## 1. Firebase Authentication

- **Firebase Authentication** (email/password) backs both login screens. `signUpWithEmailAndPassword`
  / `signInWithEmailAndPassword` return an **ID token** — that token is the `auth` query
  parameter on every Realtime Database REST call below, so RTDB rules can check `auth.uid`.
- `role` (`"learner"` | `"admin"`) is stored on `users/{uid}` at signup and read back into the
  app after login — RTDB has no custom claims, so role checks happen in the `.read`/`.write`
  rules by looking up `root.child('users').child(auth.uid).child('role')`.
- **Extension:** admin logins also collect an `assessorId` (lecturer code), checked against
  `users/{uid}/assessorId` after `signInWithEmailAndPassword` succeeds, then carried on any
  task the assessor issues.
- "Forgot password?" → `sendPasswordResetEmail` (email-link flow); the "Type New Password /
  Retype Password" screen is `confirmPasswordReset` with the `oobCode` from that email.

```js
// LOGIN — client-side, talks to Firebase Auth then reads the RTDB profile directly
async function login(email, password, assessorId = null) {
  const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
  const idToken = await user.getIdToken();
  const res = await fetch(`https://PROJECT_ID.firebaseio.com/users/${user.uid}.json?auth=${idToken}`);
  const profile = await res.json();
  if (profile.role === "admin" && profile.assessorId !== assessorId) {
    throw new Error("Assessor ID does not match this account.");
  }
  return { idToken, uid: user.uid, ...profile };
}
```

---

## 2. Realtime Database Tree (flat JSON, per §3.1)

```
skillstrack-app/
├── users/{uid}
├── tasks/{taskId}
├── bookings/{bookingId}
├── scores/{scoreId}
├── resources/{resourceId}
└── reports/{reportId}        ← extension
```

### `users/{uid}`
| Field | Type | Notes |
|---|---|---|
| displayName | string | required by §3.1 |
| email | string | matches Auth email |
| role | string | `"learner"` \| `"admin"` |
| createdAt | timestamp | required by §3.1 |
| totalTasks / completed / outstanding / overdue | number | denormalized dashboard counters |
| taskAverage / gameAverage | number | denormalized progress circles |
| gender | string | **extension** — admin gender-split pie charts |
| assessorId | string\|null | **extension**, admin-only |
| photoUrl | string | profile avatar |

```js
// CREATE — POST-equivalent write on signup (client sets the node it owns)
async function onUserSignUp(uid, idToken, { displayName, email, role, gender = null, assessorId = null }) {
  await fetch(`https://PROJECT_ID.firebaseio.com/users/${uid}.json?auth=${idToken}`, {
    method: "PUT", // full record, first write
    body: JSON.stringify({
      displayName, email, role, gender, assessorId: role === "admin" ? assessorId : null,
      photoUrl: null, totalTasks: 0, completed: 0, outstanding: 0, overdue: 0,
      taskAverage: 0, gameAverage: 0, createdAt: Date.now()
    })
  });
}

// READ
GET https://PROJECT_ID.firebaseio.com/users/{uid}.json?auth={idToken}

// UPDATE — "Update Profile" (partial)
PATCH https://PROJECT_ID.firebaseio.com/users/{uid}.json?auth={idToken}
Body: { "displayName": "...", "photoUrl": "..." }

// SEARCH — "Search Learner" (RTDB query params, filtered client-side by role)
GET https://PROJECT_ID.firebaseio.com/users.json?auth={idToken}&orderBy="role"&equalTo="learner"
```

### `tasks/{taskId}` — **base model: owned by the learner** (§3.1, Required Users table)
| Field | Type | Notes |
|---|---|---|
| userId | string | owning learner's uid — **not** an array of learners |
| title | string | |
| category | string | |
| dueDate | timestamp | |
| priority | string | `low` \| `medium` \| `high` |
| completed | boolean | §3.1's field name — drives dashboard totals |
| createdAt | timestamp | |
| assessorId | string\|null | **extension** — set when an assessor issues the task |

```js
// CREATE — POST (RTDB generates the push key / taskId)
async function createTask(idToken, uid, { title, category, dueDate, priority, assessorId = null }) {
  const res = await fetch(`https://PROJECT_ID.firebaseio.com/tasks.json?auth=${idToken}`, {
    method: "POST",
    body: JSON.stringify({ userId: uid, title, category, dueDate, priority,
      completed: false, createdAt: Date.now(), assessorId })
  });
  return (await res.json()).name; // RTDB returns the generated taskId as "name"
}

// READ — learner's own tasks
GET https://PROJECT_ID.firebaseio.com/tasks.json?auth={idToken}&orderBy="userId"&equalTo="{uid}"

// UPDATE (partial) — e.g. the "Done" checkbox
PATCH https://PROJECT_ID.firebaseio.com/tasks/{taskId}.json?auth={idToken}
Body: { "completed": true }

// UPDATE (full replace) — the edit form re-saving every field
PUT https://PROJECT_ID.firebaseio.com/tasks/{taskId}.json?auth={idToken}
Body: { "userId": "...", "title": "...", "category": "...", "dueDate": ..., "priority": "...", "completed": false, "createdAt": ... }

// DELETE — with confirmation dialog per §2.3
DELETE https://PROJECT_ID.firebaseio.com/tasks/{taskId}.json?auth={idToken}

// Dashboard totals — computed client-side from the GET above (map/filter/reduce)
function calcTotals(tasks) {
  const list = Object.values(tasks || {});
  const completed = list.filter(t => t.completed).length;
  const overdue = list.filter(t => !t.completed && t.dueDate < Date.now()).length;
  return { total: list.length, completed, outstanding: list.length - completed - overdue, overdue };
}
```

### `bookings/{bookingId}`
| Field | Type | Notes |
|---|---|---|
| userId | string | learner who booked |
| topic | string | |
| preferredDate | string | |
| notes | string | |
| status | string | `pending` \| `scheduled` \| `completed` \| `cancelled` |

```js
// CREATE — "Book Session", client-side validation happens before this call
async function createBooking(idToken, uid, { topic, preferredDate, notes }) {
  await fetch(`https://PROJECT_ID.firebaseio.com/bookings.json?auth=${idToken}`, {
    method: "POST",
    body: JSON.stringify({ userId: uid, topic, preferredDate, notes, status: "pending" })
  });
}

// READ — learner's own bookings
GET https://PROJECT_ID.firebaseio.com/bookings.json?auth={idToken}&orderBy="userId"&equalTo="{uid}"

// READ — admin queue ("Schedule Support")
GET https://PROJECT_ID.firebaseio.com/bookings.json?auth={idToken}&orderBy="status"&equalTo="pending"

// UPDATE — admin confirms date/time or changes status
PATCH https://PROJECT_ID.firebaseio.com/bookings/{bookingId}.json?auth={idToken}
Body: { "status": "scheduled" }

// DELETE — cancel
DELETE https://PROJECT_ID.firebaseio.com/bookings/{bookingId}.json?auth={idToken}
```

### `scores/{scoreId}` (mini-game results, §2.3/§7.3)
| Field | Type | Notes |
|---|---|---|
| userId | string | |
| score | number | |
| duration | number | seconds |
| completedAt | timestamp | |

```js
// CREATE — game finishes
async function submitScore(idToken, uid, { score, duration }) {
  await fetch(`https://PROJECT_ID.firebaseio.com/scores.json?auth=${idToken}`, {
    method: "POST",
    body: JSON.stringify({ userId: uid, score, duration, completedAt: Date.now() })
  });
}

// READ — history behind "Game average" (computed client-side, no denormalized field needed)
GET https://PROJECT_ID.firebaseio.com/scores.json?auth={idToken}&orderBy="userId"&equalTo="{uid}"
```

### `resources/{resourceId}` (optional learning resources, §3.1)
| Field | Type | Notes |
|---|---|---|
| title | string | |
| type | string | e.g. `pdf`, `video`, `link` |
| url | string | Firebase Storage download URL or external link |
| description | string | |
| uploadedBy | string | **extension** — admin uid, for the "Add Guide" wireframe screen |

```js
// CREATE — admin uploads
async function addResource(idToken, { title, type, url, description, uploadedBy }) {
  await fetch(`https://PROJECT_ID.firebaseio.com/resources.json?auth=${idToken}`, {
    method: "POST",
    body: JSON.stringify({ title, type, url, description, uploadedBy })
  });
}

// READ — learner Resources tab
GET https://PROJECT_ID.firebaseio.com/resources.json?auth={idToken}

// DELETE
DELETE https://PROJECT_ID.firebaseio.com/resources/{resourceId}.json?auth={idToken}
```

### `reports/{reportId}` — **extension only** (printable class progress report)
| Field | Type | Notes |
|---|---|---|
| lecturerId, lecturerName, subject | string | header fields on the printed form |
| classAvgCompletion, classAvgScore | number | |
| rows | array | `{learnerId, learnerName, tasksAssigned, tasksCompleted, completionPct, avgScorePct}` snapshot |
| generatedAt | timestamp | |

```js
// CREATE — "PRINT REPORT" snapshot, built from client-side aggregation of tasks + users
async function generateReport(idToken, { lecturerName, subject }) {
  const [usersRes, tasksRes] = await Promise.all([
    fetch(`https://PROJECT_ID.firebaseio.com/users.json?auth=${idToken}&orderBy="role"&equalTo="learner"`),
    fetch(`https://PROJECT_ID.firebaseio.com/tasks.json?auth=${idToken}`)
  ]);
  const learners = await usersRes.json();
  const tasks = Object.values(await tasksRes.json());
  const rows = Object.entries(learners).map(([uid, u]) => {
    const mine = tasks.filter(t => t.userId === uid);
    const done = mine.filter(t => t.completed).length;
    return { learnerId: uid, learnerName: u.displayName, tasksAssigned: mine.length,
      tasksCompleted: done, completionPct: mine.length ? (done / mine.length) * 100 : 0 };
  });
  await fetch(`https://PROJECT_ID.firebaseio.com/reports.json?auth=${idToken}`, {
    method: "POST",
    body: JSON.stringify({ lecturerName, subject, rows, generatedAt: Date.now() })
  });
}
```

---

## 3. REST API Summary (native Firebase RTDB endpoints — no custom backend)

| Feature | Method | Path |
|---|---|---|
| Sign up / login | — | Firebase Auth SDK (not RTDB) |
| Read/update profile | GET / PATCH | `/users/{uid}.json` |
| Search learners | GET | `/users.json?orderBy="role"&equalTo="learner"` |
| Create task | POST | `/tasks.json` |
| List my tasks | GET | `/tasks.json?orderBy="userId"&equalTo="{uid}"` |
| Toggle/patch task | PATCH | `/tasks/{taskId}.json` |
| Full edit task | PUT | `/tasks/{taskId}.json` |
| Delete task | DELETE | `/tasks/{taskId}.json` |
| Book session | POST | `/bookings.json` |
| List my/pending bookings | GET | `/bookings.json?orderBy="userId"\|"status"&equalTo=...` |
| Update booking status | PATCH | `/bookings/{bookingId}.json` |
| Cancel booking | DELETE | `/bookings/{bookingId}.json` |
| Submit game score | POST | `/scores.json` |
| List my scores | GET | `/scores.json?orderBy="userId"&equalTo="{uid}"` |
| Add resource *(ext.)* | POST | `/resources.json` |
| List resources | GET | `/resources.json` |
| Delete resource *(ext.)* | DELETE | `/resources/{resourceId}.json` |
| Generate report *(ext.)* | POST | `/reports.json` |

Every call appends `?auth={idToken}` (or `&auth=` if other params are already present) so the
security rules below can evaluate `auth.uid`.

---

## 4. Realtime Database Security Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        ".write": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')"
      }
    },
    "tasks": {
      ".read": "auth != null",
      "$taskId": {
        ".write": "auth != null && (!data.exists() ? newData.child('userId').val() === auth.uid : (data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'))"
      }
    },
    "bookings": {
      ".read": "auth != null",
      "$bookingId": {
        ".write": "auth != null && (!data.exists() ? newData.child('userId').val() === auth.uid : (data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'))"
      }
    },
    "scores": {
      "$scoreId": {
        ".read": "auth != null && (data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        ".write": "auth != null && newData.child('userId').val() === auth.uid"
      }
    },
    "resources": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "reports": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    }
  }
}
```

No branch permits unrestricted public read/write (per §3.2). Passwords are never written to
any of these paths — they live only in Firebase Authentication.

---

## 5. Base spec vs. extensions — what needs Assessor sign-off

| In the doc | Status |
|---|---|
| `users`, `tasks` (learner-owned), `bookings`, `scores`, `resources`, native RTDB REST, Auth flow | **Base spec** — matches §3.1 directly |
| `gender` on `users`, `assessorId` on `users`/`tasks`, `reports` node, "Add Guide" as a distinct upload flow, gender-split pie charts | **Extension** — beyond the minimum brief; note these in your Month 1 submission as adapted with Assessor approval, per §3.1 |

### 5.1 Extension approval request

> §3.1 states: *"A suggested structure is shown below; teams may adapt it with Assessor
> approval."* The following fields/nodes extend that suggested structure and need sign-off
> at the Month 1 review session (§4.1) before they're relied on for marks:
>
> 1. **`gender` on `users/{uid}`** — drives the admin dashboard's female/male/overall
>    progress pie charts shown in the wireframes.
> 2. **`assessorId` on `users/{uid}` and `tasks/{taskId}`** — traces which assessor a task
>    was issued by, and gates admin login to a matching assessor code.
> 3. **`reports/{reportId}`** — stores a generated snapshot for the printable class
>    progress report ("Learner Progress Report" wireframe).
> 4. **`resources/{resourceId}.uploadedBy`** and the "Add Guide" upload flow as a distinct
>    admin action from general resource management.
>
> Rationale: the base brief's `tasks/{taskId}` model treats tasks as learner-owned and
> gives the admin/assessor role only booking-review access (§2.2). The wireframes call for
> a broader admin surface (issuing tasks, uploading guides, running class-wide reports), so
> these fields close that gap without changing the base learner-owned task shape.

