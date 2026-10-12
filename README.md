#1. Project Title

SkillsTrack Learner Support Portal

## 2. Project Overview

SkillsTrack is a browser-based Learner Support Portal designed to help learners manage learning tasks, book support sessions, view their progress, access learning resources, and complete a programming mini-game.

The application uses HTML, CSS, JavaScript and Firebase and is developed collaboratively using Git and GitHub.

## 3. Client Brief Summary

SkillsTrack Training Centre currently manages learner goals, tasks, support bookings and progress across separate documents and messages. This makes it difficult for assessors to identify outstanding work and monitor learner progress.

The client requires a single browser-based portal where registered users can manage tasks, book support sessions, review progress, access resources and use a coding game

## 4. Project Objectives
Allow users to register, sign in and sign out.
Allow learners to manage their own tasks.
Provide task creation, reading, updating and deletion.
Allow learners to book support sessions.
Calculate and display learner progress.
Provide search, filtering or sorting.
Include a programming mini-game.
Provide a printable progress summary.
Store application data using Firebase.
Use GitHub for team collaboration and version control.

## 5. Technologies

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive interface |
| JavaScript ES6+ | Application logic and DOM manipulation |
| Firebase Authentication | User registration and login |
| Firebase Realtime Database | Application data storage |
| Firebase REST API | CRUD communication |
| JavaScript Framework/Library | Mini-game |
| Git | Version control |
| GitHub | Repository and collaboration |
| GitHub Actions | Automated checks/CI |

## 6. Development Tools
Visual Studio Code — primary IDE
Git — version control
GitHub — repository and collaboration
Firebase Console — Firebase configuration and database management
Browser Developer Tools — debugging and testing
GitHub Actions — continuous integration

The brief specifically requires an IDE with formatting, linting and debugging support, as well as GitHub version control and a basic automated check.

## 7. Team Members and Responsibilities

| Team Member | Responsibility |
|---|---|
| Reabetswe | --- |
| Nyiko | --- |
| Patience |--- |
| All Members | Testing, documentation, GitHub and integration |

## 8. Repository Structure

```text
SkillsTrack/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
│
├── css/
│   ├── style.css
│   └── dashboard.css
│
├── js/
│   ├── auth.js
│   ├── tasks.js
│   ├── progress.js
│   ├── bookings.js
│   ├── game.js
│   └── firebase.js
│
├── assets/
│   ├── images/
│   └── icons/
│
├── game/
│   └── ...
│
├── docs/
│   ├── flowcharts/
│   ├── pseudocode/
│   └── testing/
│
├── .gitignore
├── README.md
└── CHANGELOG.md

## 9. Git Branching Strategy
Each member works on their own branch
main
│
├── Patience
├── Nyiko
└── Reabetswe

## 10. Contribution Guidelines

Team members should:

Work on their assigned feature branches.
Make meaningful commits.
Use clear commit messages.
Test changes before creating a Pull Request.
Review another team member's Pull Request.
Avoid committing passwords, API secrets or private credentials.
Keep the code formatted and organised.
Document significant changes.
Communicate integration issues with the team.

The project specifically requires secrets and service-account files to not be committed to GitHub.

## 11. Setup Instructions
Requirements

Install:

Visual Studio Code
Git
A modern web browser
Firebase project/account
Setup

```
git clone YOUR_REPOSITORY_URL
cd SkillsTrack
```

Configure the Firebase project and add the required Firebase configuration to the application.

Do not place passwords, private credentials or service-account files in the repository.

12. How to Run the Project

Open the project in Visual Studio Code and run it using a local development server.

For example, if using the VS Code Live Server extension:

Right-click index.html
→ Open with Live Server

Then open the displayed local URL in your browser.

The application should connect to Firebase for authentication and database operations.

## 13. Project Milestones
Month 1

Week 1 — Planning

Requirements
User stories
Acceptance criteria
Flowcharts
Pseudocode
Project scope

Week 2 — Environment & Architecture

GitHub repository
Branching strategy
Firebase data model
IDE configuration
CI check

Week 3 — Core JavaScript

Variables
Functions
Arrays
Loops
Calculations
Conditionals
DOM events

Week 4 — Application Foundation

Interface
Validation
Preferences
Debugging
Assessor review
Month 1 submission

These milestones follow the Month 1 schedule in the brief

## 14. CHANGELOG

# CHANGELOG

## [0.1.0] - 2026-08-20

### Added
- Initial project structure
- Login and registration pages
- Dashboard layout
- Firebase project setup
- GitHub repository
- Initial navigation

### Changed
- Updated website colour scheme
- Improved dashboard layout

### Fixed
- Initial layout and styling issues


## 15. Links to figma/Miro 
- GitHub Repository: https://github.com/Rabi2211/SkillsTrackGroupProject.git
- figma prototype: https://www.figma.com/design/Ti3OUPFSX1dTtagAWneo7i/Untitled?node-id=0-1&t=gikLG5qb1HUQMWeQ-1
- miro wireframe: https://miro.com/app/board/uXjVGj_HArA=/?share_link_id=664273580205
