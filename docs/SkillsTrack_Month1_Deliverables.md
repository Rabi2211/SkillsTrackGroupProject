# Pseudocode for login, task creation, progress calculation and deletion confirmation
1. Registration
START.
  Input:
      name,surname
      Email address
      Password

  Process:

     User enters email address and password.
     Check that the password contains at least one special character.

     IF password does not contains at least one special character 
          THEN validation fails 
          DISPLAY an error.
     IF password contains at least one special character AND email           
          THEN send the registration request to Firebase Authentication.
          DISPLAY a check your mail for verification message

     Firebase creates the user account and securely handles the password.
     If successful, the user is registered.
 
  Output:

     IF Registration successful 
         THEN go to login/dashboard.
     IF Registration failed 
         THEN 
         DISPLAY an error message
END.

inputs: student@example.com, Reabetswe Mashigo, Skills@123
| iterations | input | Password Contains Special Character? | email valid? | firebase Request | Registration Status | Output |
|---|---|---|---|---|---|---|
| 1 | student@example.com, Reabetswe Mashigo, Skills@123 | - | - | - | - | - |
| 2 | student@example.com, Reabetswe Mashigo, Skills@123 | yes(@) | - | - | - | - |
| 3 | student@example.com, Reabetswe Mashigo, Skills@123 |yes | yes | - | - | - | - |
| 4 | student@example.com, Reabetswe Mashigo, Skills@123 | yes | yes | sent | - | - |
| 5 | student@example.com, Reabetswe Mashigo, Skills@123 | yes | yes | sent | successful | account created |
| 6 | student@example.com, Reabetswe Mashigo, Skills@123 | yes | yes | sent | successful | verification email sent |
| 7 | student@example.com, Reabetswe Mashigo, Skills@123 | yes | yes | sent | successful | "Please check your email to verify your account." |
| 8 | - | - | - | - | - | go to login |

## Registration Trace Table

**Input:**
`student@example.com, Reabetswe Mashigo, Skills@123`

| Iteration | Input                                                | Password Contains Special Character? | Email Valid? | Firebase Request | Registration Status | Output                                            |
| --------: | ---------------------------------------------------- | ------------------------------------ | ------------ | ---------------- | ------------------- | ------------------------------------------------- |
|         1 | `student@example.com, Reabetswe Mashigo, Skills@123` | -                                    | -            | -                | -                   | -                                                 |
|         2 | `student@example.com, Reabetswe Mashigo, Skills@123` | Yes (`@`)                            | -            | -                | -                   | -                                                 |
|         3 | `student@example.com, Reabetswe Mashigo, Skills@123` | Yes                                  | Yes          | -                | -                   | -                                                 |
|         4 | `student@example.com, Reabetswe Mashigo, Skills@123` | Yes                                  | Yes          | Sent             | -                   | -                                                 |
|         5 | `student@example.com, Reabetswe Mashigo, Skills@123` | Yes                                  | Yes          | Sent             | Successful          | Account created                                   |
|         6 | `student@example.com, Reabetswe Mashigo, Skills@123` | Yes                                  | Yes          | Sent             | Successful          | Verification email sent                           |
|         7 | `student@example.com, Reabetswe Mashigo, Skills@123` | Yes                                  | Yes          | Sent             | Successful          | "Please check your email to verify your account." |
|         8 | -                                                    | -                                    | -            | -                | -                   | Go to login                                       |

### Process Summary

1. User enters their email, name and password.
2. The password is checked for a special character.
3. The email address is validated.
4. A registration request is sent to Firebase.
5. Firebase successfully creates the account.
6. A verification email is sent to the user.
7. The user is instructed to check their email and verify the account.
8. The user proceeds to the login page.

2.
START.
  Input:

     Email address
     Password

  Process:

User enters their email and password.
Send the login request to Firebase Authentication.
Firebase checks the credentials against the registered account.
     If the credentials are valid 
         THEN
         Firebase authenticates the user and returns an authentication state/token.
     If the credentials are invalid 
         THEN 
         Firebase returns an error.

  Output:

     DISPLAY  dashboard.
     login error.
END.

Trace Table - successful login 
Inputs: student@example.com, Skills@123
| steps | email | Password | Credentials Valid? | Firebase Response | Output |
| --- | --- | --- | --- | --- | --- |
| 1 | student@example.com | Skills@123 | - | - | - |
| 2 | student@example.com | Skills@123 | - | Request sent | - |
| 3 | student@example.com | Skills@123 | yes | Authentication successful | - |
| 4 | student@example.com | Skills@123 | yes | authentication token returned | - |
| 5 | student@example.com | Skills@123 | yes | successful | Display dashboard |

Trace Table - failed login 
Inputs: student@example.com, WrongPassword
| steps | email | Password | Credentials Valid? | Firebase Response | Output |
| --- | --- | --- | ---| --- | --- |
| 1 | student@example.com | WrongPassword | - | - | - |
| 2 | student@example.com | WrongPassword | - | Request sent | - |
| 3 | student@example.com | WrongPassword | no | Authentication failed | - |
| 4 | - | - | no | Error returned | Display login error |
| 5 | - | - | no | error returned | User remains on login page |


3. Task Creation — CRUD: Create
START.
  Input
     Task title
     Task description
     Due date
     Other task information

   Process

      Lecturer enters the task information.
      Validate the required fields.
      Send the task data to Firebase Firestore.
      Firestore creates a new task document.
      Associate the task with the relevant student/class/lecturer.

   Output

     IF Task successfully created THEN 
         DISPLAY the new task.
     IF Creation fails  
         DISPLAY an error message.

## Trace Table — Successful Task Creation

| Step | Task Title | Description | Due Date | Required Fields Valid? | Firestore Request | Task Created? | Output |
|---|---|---|---|---|---|---|---|
| 1 | JavaScript Functions | Complete functions exercise | 10/09/2026 | — | — | — | Lecturer enters task information |
| 2 | JavaScript Functions | Complete functions exercise | 10/09/2026 | YES | — | — | Validation successful |
| 3 | JavaScript Functions | Complete functions exercise | 10/09/2026 | YES | Sent | — | Data sent to Firestore |
| 4 | JavaScript Functions | Complete functions exercise | 10/09/2026 | YES | Sent | YES | Firestore creates task document |
| 5 | JavaScript Functions | Complete functions exercise | 10/09/2026 | YES | Sent | YES | Task associated with student/class/lecturer |
| 6 | — | — | — | — | — | YES | Display new task |

4. Progress Calculation — CRUD: Read 
  START.
      Input
         Student task data
         Completed tasks
         Total tasks

      Process

         Request the student's task data from Firebase Firestore.
         Read the task completion status.
         Count completed tasks.
         Count total assigned tasks.
         Calculate the progress percentage.


      Output

           DISPLAY the student's progress percentage.
           DISPLAY completed and remaining tasks.
  END.

## Trace Table — Progress Calculation

| Step | Student Task Data | Completed Tasks | Total Tasks | Task Data Read? | Progress Calculation | Progress Percentage | Output |
|---|---|---:|---:|---|---|---:|---|
| 1 | Student task data | — | — | — | — | — | Request task data from Firebase Firestore |
| 2 | Student task data | 3 | 5 | YES | — | — | Read task completion status |
| 3 | Student task data | 3 | 5 | YES | Count completed tasks | — | 3 completed tasks |
| 4 | Student task data | 3 | 5 | YES | Count total assigned tasks | — | 5 total tasks |
| 5 | Student task data | 3 | 5 | YES | `(3 / 5) × 100` | **60%** | Progress percentage calculated |
| 6 | Student task data | 3 | 5 | YES | `(3 / 5) × 100` | **60%** | Display student's progress percentage |
| 7 | Student task data | 3 | 5 | YES | `(3 / 5) × 100` | **60%** | Display 3 completed and 2 remaining tasks |

5. Task Deletion — CRUD: Delete
START.

     Input
         Task selected by lecturer
         Delete request

     Process

         IF Lecturer selects a task 
             THEN
             DISPLAY  deletion confirmation.
         IF Lecturer confirms deletion 
             THEN
             Send the delete request to Firebase Firestore.
             Firestore deletes the selected task document.
             Refresh the task list.

     Output

          IF Confirmed 
             THEN task deleted successfully.
          IF Cancelled 
             THEN task remains unchanged.
          IF Deletion fails 
             THEN display an error.
END.

## Trace Table — Task Deletion

| Step | Task Selected | Delete Request | Confirmation | Firebase Request | Task Deleted? | Task List Refreshed? | Output |
|---|---|---|---|---|---|---|---|
| 1 | JavaScript Functions | — | — | — | — | — | Lecturer selects a task |
| 2 | JavaScript Functions | Delete | — | — | — | — | Display deletion confirmation |
| 3 | JavaScript Functions | Delete | YES | Sent | — | — | Delete request sent to Firebase Firestore |
| 4 | JavaScript Functions | Delete | YES | Sent | YES | — | Firestore deletes selected task document |
| 5 | JavaScript Functions | Delete | YES | Sent | YES | YES | Task list is refreshed |
| 6 | JavaScript Functions | Delete | YES | Sent | YES | YES | Display "Task deleted successfully." |

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


