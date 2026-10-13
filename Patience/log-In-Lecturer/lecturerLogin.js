import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { auth, db } from "../../firebase.js";

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const closeButton = document.querySelector(".close-btn");

if (form && usernameInput && passwordInput) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === "" || password === "") {
            alert("Please enter both Username and Password.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let savedUser = {
                uid: user.uid,
                email: user.email || email,
            };

            const lecturerDoc = await getDoc(doc(db, "lecturers", user.uid));
            if (lecturerDoc.exists()) {
                const lecturerData = lecturerDoc.data();
                savedUser = {
                    ...savedUser,
                    firstName: lecturerData.firstName || "",
                    lastName: lecturerData.lastName || "",
                    fullName: lecturerData.fullName || `${lecturerData.firstName || ""} ${lecturerData.lastName || ""}`.trim(),
                };
            }

            localStorage.setItem("skillsTrackCurrentUser", JSON.stringify(savedUser));
            window.location.href = "../../src/pages/lecturerPortal.html";
        } catch (error) {
            console.error("Lecturer login failed:", error);
            alert("Login failed. Please check your email and password.");
        }
    });
}

if (closeButton) {
    closeButton.addEventListener("click", function () {
        const container = document.querySelector(".container");
        if (container) {
            container.style.display = "none";
        }
    });
}