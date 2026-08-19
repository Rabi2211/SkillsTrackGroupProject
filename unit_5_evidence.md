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

