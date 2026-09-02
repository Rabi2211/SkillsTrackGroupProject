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
| iterations | input | Password Contains Special Character? | email valid? | firebase Request | Registation Status | Output
| 1 | student@example.com, Reabetswe Mashigo, Skills@123 | - | - | - | - | - |
| 2 | student@example.com, Reabetswe Mashigo, Skills@123 | yes(@) | - | - | - | - |
| 3 | student@example.com, Reabetswe Mashigo, Skills@123 |yes | yes | - | - | - | - |
| 4 | student@example.com, Reabetswe Mashigo, Skills@123 | yes | yes | sent | - | - |
| 5 | student@example.com, Reabetswe Mashigo, Skills@123 | yes | yes | sent | successful | account created |
| 6 | student@example.com, Reabetswe Mashigo, Skills@123 | yes | yes | sent | successful | verification email sent |
| 7 | student@example.com, Reabetswe Mashigo, Skills@123 | yes | yes | sent | successful | "Please check your email to verify your account." |
| 8 | - | - | - | - | - | go to login |

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
