# Pseudocode for login, task creation, progress calculation and deletion confirmation
1. Registration
START.
  Input:

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

2. Login
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
