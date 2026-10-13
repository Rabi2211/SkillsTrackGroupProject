import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { auth, db } from "../../firebase.js";

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const closeButton = document.querySelector(".close-btn");

if (form && usernameInput && passwordInput) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let savedUser = {
                uid: user.uid,
                email: user.email || email,
            };

            const studentDoc = await getDoc(doc(db, "students", user.uid));
            if (studentDoc.exists()) {
                const studentData = studentDoc.data();
                savedUser = {
                    ...savedUser,
                    firstName: studentData.firstName || "",
                    lastName: studentData.lastName || "",
                    fullName: studentData.fullName || `${studentData.firstName || ""} ${studentData.lastName || ""}`.trim(),
                };
            }

            localStorage.setItem("skillsTrackCurrentUser", JSON.stringify(savedUser));
            window.location.href = "../../src/pages/learner-portal.html";
        } catch (error) {
            console.error("Learner login failed:", error);
            alert("Login failed. Please check your email and password.");
        }
    });
}

if (closeButton) {
    closeButton.addEventListener("click", () => {
        const overlay = document.querySelector(".overlay");
        if (overlay) {
            overlay.style.display = "none";
        }
    });
}