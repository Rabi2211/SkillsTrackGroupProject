import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { auth, db } from "../../firebase.js";

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const closeButton = document.querySelector(".close-btn");

if (form && usernameInput && passwordInput) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = usernameInput.value.trim();
        const password = passwordInput.value;

        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        let user;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
        } catch (error) {
            console.error("Learner login failed:", error);
            alert(getLoginErrorMessage(error));
            return;
        }

        let savedUser = {
            uid: user.uid,
            email: user.email || email,
        };

        // The email and password were accepted. A problem reading the profile
        // must not be reported as a failed login.
        try {
            const studentDoc = await get(ref(db, `students/${user.uid}`));
            if (studentDoc.exists()) {
                const studentData = studentDoc.val();
                savedUser = {
                    ...savedUser,
                    firstName: studentData.firstName || "",
                    lastName: studentData.lastName || "",
                    fullName: studentData.fullName || `${studentData.firstName || ""} ${studentData.lastName || ""}`.trim(),
                };
            }
        } catch (error) {
            console.error("Signed in, but the learner profile could not be read from the database:", error);
        }

        localStorage.setItem("skillsTrackCurrentUser", JSON.stringify(savedUser));
        window.location.href = "../../src/pages/learner-portal.html";
    });
}

function getLoginErrorMessage(error) {
    switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Login failed. The email or password is incorrect.";
        case "auth/invalid-email":
            return "Login failed. Please enter a valid email address.";
        case "auth/too-many-requests":
            return "Too many failed attempts. Please wait a few minutes or reset your password.";
        case "auth/network-request-failed":
            return "Login failed. Please check your internet connection.";
        case "auth/user-disabled":
            return "This account has been disabled.";
        default:
            return "Login failed (" + (error.code || "unknown error") + "). Please try again.";
    }
}

if (closeButton) {
    closeButton.addEventListener("click", () => {
        const overlay = document.querySelector(".overlay");
        if (overlay) {
            overlay.style.display = "none";
        }
    });
}