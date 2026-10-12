INITIALIZE Firebase App(config)
AUTH   = Firebase.auth()
DB     = Firebase.firestore()

// Collections:
//   users/{uid}          → { name, email, role, avatarURL, createdAt }
//   tasks/{taskId}       → { title, description, dueDate, createdBy, assignedTo[], status, createdAt }
//   bookings/{bookingId} → { learnerId, lecturerId, topic, description, date, time, status, createdAt }
//   guides/{guideId}     → { title, fileURL, uploadedBy, createdAt }
//   games/{gameId}       → { learnerId, gameName, score, playedAt }
//   phases/{phaseId}     → { learnerId, phaseName, completionPercent }


SCREEN RoleSelection:
  DISPLAY logo "SKILLSTRACK"
  DISPLAY heading "Welcome To SkillsTrack"
  DISPLAY subheading "Please choose role"

  // Check if user already logged in
  AUTH.onAuthStateChanged(user):
    IF user EXISTS:
      doc = READ DB.collection("users").doc(user.uid)
      IF doc.role == "lecturer" → NAVIGATE TO LecturerDashboard
      IF doc.role == "learner"  → NAVIGATE TO LearnerDashboard

  BUTTON "LECTURER" → NAVIGATE TO LecturerWelcome
  BUTTON "LEARNER"  → NAVIGATE TO LearnerWelcome



SCREEN LearnerWelcome:
  DISPLAY heading "Welcome to learner portal"
  DISPLAY text "Are you NEW to the administration portal?"

  LINK "SIGNUP HERE" → NAVIGATE TO CreateAccount(role="learner")
  LINK "LOGIN"       → NAVIGATE TO Login(role="learner")


SCREEN LecturerWelcome:
  DISPLAY heading "Welcome To Lecturer Portal"
  DISPLAY text "Are you NEW to the administration?"

  LINK "SIGNUP HERE" → NAVIGATE TO CreateAccount(role="lecturer")
  LINK "LOGIN"       → NAVIGATE TO Login(role="lecturer")



SCREEN Login(role):
  MODAL:
    IF role == "lecturer" → DISPLAY title "Login To Administration Portal"
    IF role == "learner"  → DISPLAY title "Login To Learner Portal"

    INPUT username  placeholder="Username"
    INPUT password  placeholder="Password"  type=password

    BUTTON "LOGIN":
      TRY:
        // CREATE auth session (Firebase Auth)
        userCredential = AUTH.signInWithEmailAndPassword(username, password)
        uid = userCredential.user.uid

        // READ user doc to verify role
        userDoc = READ DB.collection("users").doc(uid)

        IF userDoc.role != role:
          SHOW error "Account not registered as {role}"
          AUTH.signOut()
          RETURN

        IF role == "lecturer" → NAVIGATE TO LecturerDashboard
        IF role == "learner"  → NAVIGATE TO LearnerDashboard

      CATCH error:
        IF error.code == "auth/user-not-found"    → SHOW "No account found"
        IF error.code == "auth/wrong-password"     → SHOW "Incorrect password"
        IF error.code == "auth/invalid-email"      → SHOW "Invalid email format"
        ELSE → SHOW error.message

    LINK "forgot password?" → NAVIGATE TO ForgotPassword
    BUTTON "x" → CLOSE modal



SCREEN ForgotPassword:
  MODAL:
    DISPLAY title "Forgot Password"
    DISPLAY text "ENTER EMAIL USED TO REGISTER"
    INPUT email  placeholder="@gmail.com"

    BUTTON "Verify":
      TRY:
        // Firebase Auth sends reset email — no Firestore needed
        AUTH.sendPasswordResetEmail(email)
        SHOW success "Password reset link sent to {email}"
        NAVIGATE TO Login

      CATCH error:
        IF error.code == "auth/user-not-found" → SHOW "Email not registered"
        IF error.code == "auth/invalid-email"  → SHOW "Invalid email format"
        ELSE → SHOW error.message

    BUTTON "x" → CLOSE modal



SCREEN ResetPassword:
  // User arrives here via reset link from email
  // Firebase handles token verification automatically

  MODAL:
    DISPLAY title "Forgot Password"
    INPUT new_password      placeholder="Type New Password"
    INPUT confirm_password  placeholder="Retype New Password"

    BUTTON "Reset Password":
      IF new_password != confirm_password:
        SHOW error "Passwords don't match"
        RETURN
      IF NOT containsSpecialChar(new_password):
        SHOW error "Must have at least one special character"
        RETURN
      IF new_password.length < 6:
        SHOW error "Password must be at least 6 characters"
        RETURN

      TRY:
        // Firebase Auth handles password update via the reset token
        AUTH.confirmPasswordReset(oobCode, new_password)
        SHOW success "Password updated"
        NAVIGATE TO Login

      CATCH error:
        IF error.code == "auth/expired-action-code" → SHOW "Reset link expired"
        IF error.code == "auth/weak-password"       → SHOW "Password too weak"
        ELSE → SHOW error.message

    BUTTON "x" → CLOSE modal




SCREEN CreateAccount(role):
  MODAL:
    DISPLAY title "Create Administration Account"

    INPUT name_surname       placeholder="Name & Surname"
    INPUT email              placeholder="Username (email address)"
    INPUT password           placeholder="Password (must have at least one special character)"
    INPUT confirm_password   placeholder="Retype Password"

    BUTTON "Create Account":
      // --- Validate ---
      IF name_surname.isEmpty      → SHOW error "Name is required"         → RETURN
      IF NOT isValidEmail(email)   → SHOW error "Invalid email"            → RETURN
      IF NOT containsSpecialChar(password) → SHOW error "Need special char" → RETURN
      IF password.length < 6       → SHOW error "Min 6 characters"         → RETURN
      IF password != confirm_password → SHOW error "Passwords don't match" → RETURN

      TRY:
        // CREATE — Firebase Auth user
        userCredential = AUTH.createUserWithEmailAndPassword(email, password)
        uid = userCredential.user.uid

        // CREATE — Firestore user document
        CREATE DB.collection("users").doc(uid) = {
          name:      name_surname,
          email:     email,
          role:      role,           // "lecturer" or "learner"
          avatarURL: null,
          createdAt: serverTimestamp()
        }

        SHOW success "Account created!"
        NAVIGATE TO Login(role)

      CATCH error:
        IF error.code == "auth/email-already-in-use" → SHOW "Email already registered"
        IF error.code == "auth/weak-password"         → SHOW "Password too weak"
        ELSE → SHOW error.message

    BUTTON "x" → CLOSE modal




SCREEN LearnerDashboard:
  uid = AUTH.currentUser.uid

  SIDEBAR:
    LOGO "SkillsTrack"
    NAV_ITEM "Dashboard"   (active)
    NAV_ITEM "Tasks"       → NAVIGATE TO TasksList
    NAV_ITEM "Bookings"    → NAVIGATE TO BookSession
    NAV_ITEM "Resources"   → NAVIGATE TO Resources
    AVATAR icon            → NAVIGATE TO ProfileMenu

  HEADER:
    // READ current user name
    userDoc = READ DB.collection("users").doc(uid)
    DISPLAY "Welcome To Learner Portal"

  KPI_CARDS row:
    // READ all tasks assigned to this learner
    allTasks = READ DB.collection("tasks")
                 .WHERE("assignedTo", "array-contains", uid)

    totalTasks  = allTasks.length
    completed   = allTasks.FILTER(t => t.status == "completed").length
    outstanding = allTasks.FILTER(t => t.status == "pending" AND t.dueDate >= today).length
    overdue     = allTasks.FILTER(t => t.status == "pending" AND t.dueDate < today).length

    CARD "Total Tasks"   → value: totalTasks
    CARD "Completed"     → value: completed
    CARD "Outstanding"   → value: outstanding
    CARD "Overdue"       → value: overdue

  UPCOMING_TASKS section:
    DISPLAY title "Upcoming Tasks"
    // READ tasks that are pending, sorted by due date
    upcoming = READ DB.collection("tasks")
                 .WHERE("assignedTo", "array-contains", uid)
                 .WHERE("status", "==", "pending")
                 .ORDER_BY("dueDate", "asc")
                 .LIMIT(5)

    FOR EACH task IN upcoming:
      DISPLAY task.title, task.dueDate
      LABEL task.status

  PROGRESS section:
    // READ & compute task average
    taskAvg = (completed / totalTasks) * 100  OR  0

    // READ game scores for this learner
    games = READ DB.collection("games")
              .WHERE("learnerId", "==", uid)
    gameAvg = AVERAGE(games.MAP(g => g.score))  OR  0

    RADIAL_CHART "Task Average"  → value: taskAvg%
    RADIAL_CHART "Game Average"  → value: gameAvg%

  PHASES_PROGRESS:
    // READ phases for this learner
    phases = READ DB.collection("phases")
               .WHERE("learnerId", "==", uid)
               .ORDER_BY("phaseName", "asc")

    FOR EACH phase IN phases:
      DISPLAY phase.phaseName
      PROGRESS_BAR phase.completionPercent




SCREEN LecturerDashboard:
  uid = AUTH.currentUser.uid

  HEADER:
    DISPLAY "Welcome To Lecturer Portal"
    HAMBURGER_MENU icon

  ACTION_CARDS:
    CARD "Add Tasks":
      DISPLAY "Fill form to add tasks"
      BUTTON "+" → NAVIGATE TO CreateTask

    CARD "Add Guide":
      DISPLAY "Upload a pdf form of guide"
      BUTTON "+":
        file = OPEN file_picker(accept=".pdf")
        TRY:
          // Upload to Firebase Storage
          storageRef = Storage.ref("guides/{uid}/{timestamp}_{file.name}")
          uploadTask = storageRef.put(file)
          fileURL = AWAIT storageRef.getDownloadURL()

          // CREATE — Firestore guide document
          CREATE DB.collection("guides").ADD({
            title:      file.name,
            fileURL:    fileURL,
            uploadedBy: uid,
            createdAt:  serverTimestamp()
          })
          SHOW success "Guide uploaded"

        CATCH error → SHOW error.message

    CARD "Download learners report":
      BUTTON "Print" → NAVIGATE TO LecturerReport

  LEARNER_PROGRESS section:
    DISPLAY title "Learner's Progress"

    // READ all learners assigned to this lecturer
    allTasks = READ DB.collection("tasks")
                 .WHERE("createdBy", "==", uid)
    learnerIds = UNIQUE(allTasks.FLATMAP(t => t.assignedTo))

    // Compute overall averages
    FOR EACH learnerId IN learnerIds:
      learnerDoc = READ DB.collection("users").doc(learnerId)
      learnerTasks = allTasks.FILTER(t => t.assignedTo.INCLUDES(learnerId))
      progress = (learnerTasks.FILTER(t => t.status == "completed").length
                  / learnerTasks.length) * 100

      // Split by gender if stored in user profile
      COLLECT progress INTO overallList
      IF learnerDoc.gender == "female" → COLLECT INTO femaleList
      IF learnerDoc.gender == "male"   → COLLECT INTO maleList

    RADIAL_CHART "OverAll"         → value: AVERAGE(overallList)%
    RADIAL_CHART "Female Learners" → value: AVERAGE(femaleList)%
    RADIAL_CHART "Male Learners"   → value: AVERAGE(maleList)%





SCREEN ProfileMenu:
  uid = AUTH.currentUser.uid

  // READ user profile
  userDoc = READ DB.collection("users").doc(uid)

  DROPDOWN:
    DISPLAY avatar (userDoc.avatarURL or placeholder)
    DISPLAY userDoc.name
    DISPLAY userDoc.email

    MENU_ITEM "Edit profile" → NAVIGATE TO EditProfile
    MENU_ITEM "Settings"     → NAVIGATE TO Settings
    MENU_ITEM "Sign out":
      AUTH.signOut()
      NAVIGATE TO RoleSelection
    BUTTON "x" → CLOSE dropdown



SCREEN EditProfile:
  uid = AUTH.currentUser.uid

  // READ current profile
  userDoc = READ DB.collection("users").doc(uid)

  DISPLAY avatar (userDoc.avatarURL or placeholder)
  DISPLAY current name:  userDoc.name
  DISPLAY current email: userDoc.email

  DISPLAY title "Edit Profile"
  INPUT edit_name     prefilled=userDoc.name
  INPUT edit_email    prefilled=userDoc.email

  BUTTON "Update Profile":
    changes = {}

    IF edit_name != userDoc.name:
      changes.name = edit_name

    IF edit_email != userDoc.email:
      IF NOT isValidEmail(edit_email):
        SHOW error "Invalid email"
        RETURN
      TRY:
        // UPDATE — Firebase Auth email
        AUTH.currentUser.updateEmail(edit_email)
        changes.email = edit_email
      CATCH error:
        IF error.code == "auth/email-already-in-use" → SHOW "Email taken"
        ELSE → SHOW error.message
        RETURN

    IF changes is NOT empty:
      // UPDATE — Firestore user document
      UPDATE DB.collection("users").doc(uid) = {
        ...changes,
        updatedAt: serverTimestamp()
      }
      SHOW success "Profile updated"
    ELSE:
      SHOW info "No changes made"

  BUTTON "x" → NAVIGATE BACK




SCREEN CreateTask:
  uid = AUTH.currentUser.uid

  HEADER:
    BACK button "<" → NAVIGATE BACK

  FORM:
    INPUT task_title        placeholder="Task Title"
    INPUT task_description  placeholder="Task Description"  multiline=true
    DATE_PICKER due_date    label="Due Date:"  with calendar_icon
    // Optional: learner selector
    SELECT assignees        from learnersList  multi=true

  BUTTON "CREATE TASK":
    IF task_title.isEmpty   → SHOW error "Title required"       → RETURN
    IF due_date is null     → SHOW error "Due date required"    → RETURN
    IF due_date < today     → SHOW error "Due date must be in future" → RETURN

    TRY:
      // CREATE — Firestore task document
      newTaskRef = CREATE DB.collection("tasks").ADD({
        title:       task_title,
        description: task_description,
        dueDate:     due_date,
        createdBy:   uid,
        assignedTo:  assignees OR [],    // array of learner UIDs
        status:      "pending",
        createdAt:   serverTimestamp()
      })

      SHOW success "Task created (ID: {newTaskRef.id})"
      NAVIGATE TO LecturerDashboard

    CATCH error → SHOW error.message



SCREEN BookSession:
  uid = AUTH.currentUser.uid

  FORM:
    INPUT topic        placeholder="Topic Of Booking:"
    INPUT description  placeholder="Topic Description:"  multiline=true
    DATE_PICKER due_date  label="Due Date:"

  BUTTON "BOOK SESSION":
    IF topic.isEmpty       → SHOW error "Topic required"     → RETURN
    IF description.isEmpty → SHOW error "Description required" → RETURN
    IF due_date is null    → SHOW error "Date required"      → RETURN

    TRY:
      // Find assigned lecturer
      learnerTasks = READ DB.collection("tasks")
                       .WHERE("assignedTo", "array-contains", uid)
                       .LIMIT(1)
      lecturerId = learnerTasks[0].createdBy OR null

      // CREATE — Firestore booking document
      CREATE DB.collection("bookings").ADD({
        learnerId:   uid,
        lecturerId:  lecturerId,
        topic:       topic,
        description: description,
        date:        due_date,
        time:        null,           // lecturer sets this later
        status:      "pending",
        createdAt:   serverTimestamp()
      })

      SHOW success "Booking submitted — waiting for lecturer to schedule"

    CATCH error → SHOW error.message

  CALENDAR_VIEW:
    // READ this learner's bookings to highlight on calendar
    myBookings = READ DB.collection("bookings")
                   .WHERE("learnerId", "==", uid)
                   .ORDER_BY("date", "asc")

    DISPLAY monthly calendar grid
    FOR EACH booking IN myBookings:
      HIGHLIGHT booking.date with status color



SCREEN ScheduleSupport:
  uid = AUTH.currentUser.uid

  HEADER:
    BACK button "<" → NAVIGATE BACK
    DISPLAY title "Schedule Support"

  // READ all pending bookings for this lecturer
  pendingBookings = READ DB.collection("bookings")
                      .WHERE("lecturerId", "==", uid)
                      .WHERE("status", "==", "pending")
                      .ORDER_BY("createdAt", "desc")

  BOOKING_REQUESTS list:
    FOR EACH booking IN pendingBookings:

      // READ learner name
      learnerDoc = READ DB.collection("users").doc(booking.learnerId)

      CARD:
        DISPLAY "Learner {learnerDoc.name} wants to book for support"
        DISPLAY "Topic: {booking.topic}"
        DATE_PICKER date  label="Date:"
        TIME_PICKER time  label="Time:"

        BUTTON "Schedule":
          IF date is null OR time is null:
            SHOW error "Date and time required"
            RETURN

          TRY:
            // UPDATE — Firestore booking document
            UPDATE DB.collection("bookings").doc(booking.id) = {
              date:      date,
              time:      time,
              status:    "scheduled",
              updatedAt: serverTimestamp()
            }
            SHOW success "Session scheduled with {learnerDoc.name}"

          CATCH error → SHOW error.message



SCREEN LearnerSearch:
  uid = AUTH.currentUser.uid

  HEADER:
    BACK button "<" → NAVIGATE BACK
    DISPLAY title "Search Learner"

  SEARCH_BAR:
    INPUT searchQuery  placeholder="Search"

  // READ all learners this lecturer has assigned tasks to
  allTasks = READ DB.collection("tasks")
               .WHERE("createdBy", "==", uid)
  learnerIds = UNIQUE(allTasks.FLATMAP(t => t.assignedTo))

  learnersList = []
  FOR EACH learnerId IN learnerIds:
    doc = READ DB.collection("users").doc(learnerId)
    learnerTasks = allTasks.FILTER(t => t.assignedTo.INCLUDES(learnerId))
    learnerBookings = READ DB.collection("bookings")
                        .WHERE("learnerId", "==", learnerId)

    learnersList.ADD({
      id:              learnerId,
      name:            doc.name,
      totalTasks:      learnerTasks.length,
      tasksCompleted:  learnerTasks.FILTER(t => t.status == "completed").length,
      progress:        (tasksCompleted / totalTasks) * 100,
      bookingsCount:   learnerBookings.length
    })

  // Filter by search query (client-side)
  filtered = learnersList.FILTER(l =>
    l.name.toLowerCase().CONTAINS(searchQuery.toLowerCase())
  )

  TABS: [Learner Name | Tasks | Progress | Bookings | Tasks Completed]

  RESULTS_TABLE:
    FOR EACH learner IN filtered:
      ROW learner.name, learner.totalTasks, learner.progress%,
          learner.bookingsCount, learner.tasksCompleted
      ON_CLICK → NAVIGATE TO LearnerProgressReport(learner.id)



SCREEN LecturerReport:
  uid = AUTH.currentUser.uid

  HEADER:
    LOGO "SkillsTrack"
    DISPLAY title "LECTURER REPORT: TASK COMPLETION & PERCENTAGE SCORED"
    BACK button "<" → NAVIGATE BACK

  // READ lecturer info
  lecturerDoc = READ DB.collection("users").doc(uid)

  REPORT_META:
    FIELD "Lecturer Name:"  → lecturerDoc.name
    FIELD "Task:"           → selected_task   // from filter/param
    FIELD "Program:"        → program_name    // from filter/param
    FIELD "Date:"           → TODAY()

  // READ all tasks by this lecturer
  allTasks = READ DB.collection("tasks")
               .WHERE("createdBy", "==", uid)
  learnerIds = UNIQUE(allTasks.FLATMAP(t => t.assignedTo))

  CLASS_SUMMARY section:
    totalLearners  = learnerIds.length
    allCompletions = []
    allScores      = []

    FOR EACH learnerId IN learnerIds:
      learnerTasks     = allTasks.FILTER(t => t.assignedTo.INCLUDES(learnerId))
      completedTasks   = learnerTasks.FILTER(t => t.status == "completed")
      completionPct    = (completedTasks.length / learnerTasks.length) * 100
      allCompletions.ADD(completionPct)

      // READ game scores
      games = READ DB.collection("games")
                .WHERE("learnerId", "==", learnerId)
      avgScore = AVERAGE(games.MAP(g => g.score)) OR 0
      allScores.ADD(avgScore)

    STAT "Total Learners"           → totalLearners
    STAT "Class Avg. Completion %"  → AVERAGE(allCompletions)
    STAT "Class Avg. Scores %"      → AVERAGE(allScores)

  TASK_BREAKDOWN table:
    COLUMNS: [#, Learner Name, Completion %, Avg Score %]
    index = 1
    FOR EACH learnerId IN learnerIds:
      learnerDoc = READ DB.collection("users").doc(learnerId)
      ROW index, learnerDoc.name, allCompletions[index-1], allScores[index-1]
      index++

  FOOTER:
    FIELD "Lecturer's Signature:" ___________
    FIELD "Received by:"          ___________
    FIELD "Date:"                 ___________

    BUTTON "Print" → window.print() OR GENERATE_PDF(this_report)



SCREEN LearnerProgressReport(learnerId):
  uid = AUTH.currentUser.uid  // the lecturer viewing

  HEADER:
    BACK button "<" → NAVIGATE BACK
    DISPLAY title "LEARNER PROGRESS REPORT"

  // READ learner info
  learnerDoc = READ DB.collection("users").doc(learnerId)

  LEARNER_INFO section:
    FIELD "Learner Name"       → learnerDoc.name
    FIELD "Course/Programme"   → learnerDoc.programme OR "N/A"
    FIELD "Report Date"        → TODAY()

  // READ tasks assigned to this learner
  learnerTasks = READ DB.collection("tasks")
                   .WHERE("assignedTo", "array-contains", learnerId)
                   .ORDER_BY("createdAt", "asc")

  completedTasks = learnerTasks.FILTER(t => t.status == "completed")
  taskAvg = (completedTasks.length / learnerTasks.length) * 100  OR  0

  // READ game scores
  games = READ DB.collection("games")
            .WHERE("learnerId", "==", learnerId)
            .ORDER_BY("playedAt", "asc")
  gameAvg = AVERAGE(games.MAP(g => g.score))  OR  0

  SUMMARY section:
    STAT "Average Task Progress" → taskAvg%
    STAT "Average Game Score"    → gameAvg%

  GAMES_TABLE:
    COLUMNS: [#, Game Played, Date, Scores]
    FOR i = 0 TO games.length - 1:
      ROW (i+1), games[i].gameName, games[i].playedAt, games[i].score

  TASKS_TABLE:
    COLUMNS: [#, Task, Status, Progress]
    FOR i = 0 TO learnerTasks.length - 1:
      task = learnerTasks[i]
      ROW (i+1), task.title, task.status,
          IF task.status == "completed" THEN "100%" ELSE "In Progress"

  FACILITATOR section:
    TEXTAREA facilitator_comments
    BUTTON "Save Comments":
      // UPDATE or CREATE a report sub-document
      SET DB.collection("users").doc(learnerId)
            .collection("reports").doc(TODAY()) = {
        facilitatorComments: facilitator_comments,
        taskAvg:             taskAvg,
        gameAvg:             gameAvg,
        generatedBy:         uid,
        createdAt:           serverTimestamp()
      }
      SHOW success "Comments saved"

    FIELD "Signed:" ___________
    FIELD "Date:"   ___________

  BUTTON "PRINT REPORT" → window.print() OR GENERATE_PDF(this_report)




rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users — can read own doc, lecturers can read learner docs
    match /users/{userId} {
      allow read:   if request.auth != null
                    AND (request.auth.uid == userId
                    OR getUserRole(request.auth.uid) == "lecturer");
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId;
      allow delete: if false;  // no self-deletion

      match /reports/{reportId} {
        allow read, write: if getUserRole(request.auth.uid) == "lecturer";
      }
    }

    // Tasks — lecturers CREATE/UPDATE/DELETE, learners READ assigned
    match /tasks/{taskId} {
      allow create: if getUserRole(request.auth.uid) == "lecturer";
      allow read:   if request.auth.uid == resource.data.createdBy
                    OR request.auth.uid in resource.data.assignedTo;
      allow update: if request.auth.uid == resource.data.createdBy
                    OR request.auth.uid in resource.data.assignedTo;
      allow delete: if request.auth.uid == resource.data.createdBy;
    }

    // Bookings — learners CREATE, both READ, lecturers UPDATE
    match /bookings/{bookingId} {
      allow create: if getUserRole(request.auth.uid) == "learner";
      allow read:   if request.auth.uid == resource.data.learnerId
                    OR request.auth.uid == resource.data.lecturerId;
      allow update: if request.auth.uid == resource.data.lecturerId;
      allow delete: if false;
    }

    // Games — system/lecturer writes, learner reads own
    match /games/{gameId} {
      allow read:  if request.auth.uid == resource.data.learnerId
                   OR getUserRole(request.auth.uid) == "lecturer";
      allow write: if getUserRole(request.auth.uid) == "lecturer";
    }

    // Guides — lecturers CRUD, learners READ
    match /guides/{guideId} {
      allow read:   if request.auth != null;
      allow create: if getUserRole(request.auth.uid) == "lecturer";
      allow update: if request.auth.uid == resource.data.uploadedBy;
      allow delete: if request.auth.uid == resource.data.uploadedBy;
    }

    // Phases — system/lecturer writes, learner reads own
    match /phases/{phaseId} {
      allow read:  if request.auth.uid == resource.data.learnerId
                   OR getUserRole(request.auth.uid) == "lecturer";
      allow write: if getUserRole(request.auth.uid) == "lecturer";
    }

    // Helper function
    function getUserRole(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.role;
    }
  }
}
