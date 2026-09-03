# SkillsTrack — Corrected Pseudocode (Realtime Database, learner-owned tasks)

Fixes applied against the brief and your own user stories:
1. Every Firestore reference replaced with **Firebase Realtime Database REST API** calls
   (`GET/POST/PATCH/DELETE .../<path>.json`), matching your user stories and §3 of the brief.
2. **Task Creation** and **Task Deletion** now show the **learner** acting on their own task
   (owned via `userId`), matching User Story 3 — not a lecturer assigning tasks to a student.
   If you still want a lecturer/assessor task-assignment feature, that's the extension flagged
   in the Firebase plan doc and needs separate sign-off; it isn't mixed into the base flow here.
3. **Login**'s unreachable `ELSE IF the credentials are valid` branch fixed to a plain `ELSE`.
4. **Registration**'s email check now validates a general email shape instead of requiring
   `gmail.com` specifically — flag if you actually need the Gmail-only restriction and why.

---

## 1. Registration

```
START Registration

INPUT email, password, confirmPassword, displayName

// Basic email shape check (local@domain), not restricted to one provider
IF (NOT email CONTAINS "@") OR (NOT email CONTAINS ".") THEN
    DISPLAY "Please enter a valid email address"
    email_is_invalid = true
ENDIF

IF (LENGTH(password) < 8) OR
   (NOT password CONTAINS special_character) OR
   (NOT password CONTAINS uppercase_letter) THEN
    DISPLAY "Password must be at least 8 characters and include a special character and an uppercase letter"
    password_is_invalid = true
ENDIF

IF password != confirmPassword THEN
    DISPLAY "Passwords do not match"
    password_is_invalid = true
ENDIF

IF email_is_invalid OR password_is_invalid THEN
    DISPLAY "Registration failed. Please correct the errors and try again"
    RETURN TO REGISTRATION_PAGE
ELSE
    // Firebase Authentication creates the account
    result = firebaseAuth.createUserWithEmailAndPassword(email, password)
    uid = result.user.uid
    idToken = result.user.getIdToken()

    // Add the user to the users node in the Realtime Database
    PUT https://PROJECT_ID.firebaseio.com/users/{uid}.json?auth={idToken}
    Body: { "displayName": displayName, "email": email, "role": "learner", "createdAt": now() }

    DISPLAY "Registration successful"
    REDIRECT TO DASHBOARD
ENDIF

END Registration
```

---

## 2. Login

```
START Login

INPUT email, password

// Send the login request to Firebase Authentication
result = firebaseAuth.signInWithEmailAndPassword(email, password)

IF result succeeds THEN
    idToken = result.user.getIdToken()
    DISPLAY dashboard
ELSE
    // credentials were invalid — Firebase returned an auth error
    DISPLAY "Invalid email or password"
ENDIF

END Login
```

---

## 3. Task Creation — CRUD: Create

```
START TaskCreation

INPUT taskTitle, dueDate, priority = "medium"

// Learner creates their own task (matches User Story 3)
PROCESS
    Validate required fields (taskTitle, dueDate)
    IF validation passes THEN
        POST https://PROJECT_ID.firebaseio.com/tasks.json?auth={idToken}
        Body: {
            "userId": currentUser.uid,
            "title": taskTitle,
            "dueDate": dueDate,
            "priority": priority,
            "completed": false,
            "createdAt": now()
        }
        IF Realtime Database confirms the write THEN
            DISPLAY the new task in the list without a page refresh
        ELSE
            DISPLAY error message ("Task could not be saved")
        ENDIF
    ELSE
        DISPLAY error message ("Please enter a title and due date")
    ENDIF

END TaskCreation
```

---

## 4. Progress Calculation — CRUD: Read

```
START ProgressCalculation

INPUT userId (currentUser.uid)

PROCESS
    GET https://PROJECT_ID.firebaseio.com/tasks.json?auth={idToken}&orderBy="userId"&equalTo="{userId}"
    tasks = response as array of task objects

    total_number_of_tasks = LENGTH(tasks)
    number_of_completed_tasks = COUNT(tasks WHERE completed == true)
    remaining_tasks = total_number_of_tasks - number_of_completed_tasks

    IF total_number_of_tasks == 0 THEN
        progress_percentage = 0
    ELSE
        progress_percentage = (number_of_completed_tasks / total_number_of_tasks) * 100
    ENDIF

OUTPUT
    DISPLAY progress_percentage
    DISPLAY number_of_completed_tasks
    DISPLAY remaining_tasks

END ProgressCalculation
```

---

## 5. Task Deletion — CRUD: Delete

```
START TaskDeletion

INPUT selected_task

PROCESS
    IF learner selects a task they own THEN
        DISPLAY confirmation dialog ("Delete this task? This cannot be undone")
        IF learner confirms deletion THEN
            DELETE https://PROJECT_ID.firebaseio.com/tasks/{selected_task.id}.json?auth={idToken}
            IF Realtime Database confirms the delete THEN
                Refresh task list
                DISPLAY "Task deleted successfully"
            ELSE
                DISPLAY error message ("Deletion failed, please try again")
            ENDIF
        ELSE
            DISPLAY "Task remains unchanged"
        ENDIF
    ENDIF

END TaskDeletion
```
