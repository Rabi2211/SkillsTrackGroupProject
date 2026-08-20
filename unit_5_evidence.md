 
 # Part 1 - Architecture Investigation
 1. What is client-side development, and where does client-side code execute?
 client-side development is the coding of the interactions the user has with the website via the browser which is the client-side.
 client-side code executes inside the browser with the help of nodejs
 
 2. What is server-side development, and how is it different from code executing in the browser?
 server-side lives in the cloads, does not control the functionality on the browser so its not DOM.

 servers save user data collected while the user uses the client-side so any personal infomation entered is stored on the server for future use.
 3. Within SkillsTrack, explain the role of HTML, CSS, JavaScript, Firebase Authentication, Firebase 
Realtime Database and the Firebase REST API.

   HTML - its the first document the browser reads, hence it has the structure of the website like how elements are placed in what order and links to the styles and javascript files.

   CSS - its the styling of the website like the changing of colours and size of elements.So the css file controls the look of the website.

   javascript - its the fuctionality of the website through the HTML you have the button element but it does lead to where its supposed to or a specific action. So through javascript the action neeeded from the button can be coded so it does the specific action.

   firebase Authentication - its the security of the website so not just anyone can access your profile and its data. It checks for the infomation you provide in real time when logging in and compares to the data in the server then grants access if correct cridentials have been given.

   firebase REST API- Firebase REST API allows a client-side application to communicate with Firebase using HTTP requests. It can be used to create, retrieve, update, and delete data stored in Firebase. The client-side code sends a request to the Firebase REST API, Firebase processes the request, and then returns a response to the application.

 4. isFirebase the same thing as server-side JavaScript? Explain your answer.
   firebase is a cload platform that offers services such as databases, authentication,hosting, and API's. server-side javascript code that runs on a server, commmonly using environments such as node.js

 5. When a learner creates a learning task, which operations happen on the client side and which involve 
a remote/server-side service?

client side-
the learner enters the task details into a form.
JavaScript checks that the information is valid.
The interface displays the new task.
JavaScript sends the task information to the backend.

Remote/server side-
The backend receives the task information.
The information is stored in the database.
Authentication and permissions are checked.
The backend sends a response back to the client.
The client then updates the interface with the saved task
  
  6. Why should authentication, database access and security not be treated as purely client-side concerns?
Client-side JavaScript runs on the user's device, so users can inspect or modify it. If important security responsibilities are placed only on the client side, a user could potentially bypass those checks.
Authentication and database access should therefore be protected by server-side or cloud-based security mechanisms.

  7. Research at least two alternative technologies that could provide backend/server-side functionality 
instead of Firebase. Explain how the architecture would change.
The Express server would handle authentication, validation, business logic, and communication with the database.
Flask would receive requests from the frontend and handle authentication, security, application logic, and database operations.
With Firebase, many backend services are provided as managed cloud services. With Node.js/Express or Flask, the developer has more direct responsibility for building and securing the backend.

  8. Identify at least three security risks that could occur if sensitive information or security 
responsibilities are incorrectly placed in client-side JavaScript.
Exposure of sensitive information — API secrets, passwords, or private keys placed in JavaScript can potentially be viewed by users.
Authentication bypass — If authentication is checked only using client-side JavaScript, someone could modify or bypass the JavaScript and gain access to features they should not have.
Unauthorized database access — If database permissions are not properly enforced on the backend or through database security rules, users could read, modify, or delete information belonging to other users.
Data manipulation — Users can modify client-side code or requests, so important validation should not rely only on the browser.
Cross-site scripting (XSS) — Unsafe user input displayed on a webpage can potentially be used to execute unwanted JavaScript in another user's browser.

# Part 4 - Trace One Complete Project Feature
# User registration/login

1. What action does the user perform?
The user inputs their email as username, password 

2. What does JavaScript do in the browser?
JavaScript collects the information entered into the form and sends it to Firebase using the Firebase API.
3. What validation occurs?
JavaScript can check that required fields are filled in, the email has a valid format, and the password meets the required rules. Firebase also performs its own authentication checks.

4. What information leaves the browser?
The user's email address and password are sent securely to Firebase for authentication. Other registration information may also be sent if the application collects it.

5. Which Firebase service receives the request?
Firebase Authentication receives the registration or login request.

6. What does Firebase do with it?
Firebase Authentication verifies the login details or creates a new user account. It securely manages the user's authentication credentials.

7. What response/data is returned?
Firebase returns a response indicating whether the operation was successful. If successful, information such as the user's authentication status and user ID can be made available to the application.

8. How does JavaScript process the result?
JavaScript checks whether the request succeeded or failed. If successful, it can store the relevant user state and continue to the appropriate page.

9. How is the interface updated?
JavaScript can display the user's logged-in state, show their dashboard, or display a successful registration message.

10. What should happen if the request fails?
JavaScript should handle the error and show a clear message to the user, such as "Incorrect email or password" or "Registration failed. Please try again."
Part 2 Map Your Actual Application

| Feature | Classification | Justification  |
|---------| ---------------| ---------------|
| Registration | both |  Browser collects user details; Firebase Authentication creates account |
| Login | both | Credentials entered in browser and validated by Firebase Authentication |
| Form validation | client side | JavaScript checks required fields before submission |
| Displaying the dashboard | client side | JavaScript renders dashboard content in DOM |
| Creating a learning task | both | JavaScript sends task data and Firebase stores it |
| Retrieving tasks | both | Firebase provides stored tasks and JavaScript displays them |
| Updating a task | both | Browser submits changes and Firebase updates records |
| Deleting a task | both | Browser requests deletion and Firebase removes data |
| Calculating learner progress | client side | JavaScript calculates percentages from retrieved data |
| Filtering/searching tasks | client side | Processed within browser using loaded task data |
| Storing learner data | server | Realtime Database persists data |
| Authentication | server | Firebase Authentication verifies identity |
| Database security/access rules | server | Firebase Security Rules enforce permissions |
| Updating the DOM | client side | JavaScript modifies webpage elements |
| Successs/Error Messages | client server | JavaScript displays feedback to users | 

