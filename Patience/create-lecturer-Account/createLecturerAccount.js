import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { auth, db } from "../../firebase.js";

const form = document.getElementById("accountForm");
const nameInput = document.getElementById("name");
const usernameInput = document.getElementById("username");
const genderInput = document.getElementById("gender");
const message = document.getElementById("message");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const closeButton = document.querySelector(".close-btn");

if (!form || !message || !passwordInput || !confirmPasswordInput || !usernameInput || !nameInput) {
    console.error("Required account form elements are missing.");
} else {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (location.protocol === "file:") {
            showError("Please run the app through a local web server such as npm run dev or VS Code Live Server. Firebase account creation does not work when the page is opened directly from the file system.");
            return;
        }

        const fullName = nameInput.value.trim();
        const email = usernameInput.value.trim();
        const gender = genderInput?.value.trim() || "";
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const specialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

        if (fullName === "") {
            showError("Name is required.");
            return;
        }

        if (email === "") {
            showError("Email is required.");
            return;
        }

        if (gender === "") {
            showError("Please select your gender.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError("Please enter a valid email address.");
            return;
        }

        if (password.trim() === "" || confirmPassword.trim() === "") {
            showError("Please complete both password fields.");
            return;
        }

        if (!specialCharacter.test(password)) {
            showError("Password must contain at least one special character.");
            return;
        }

        if (password !== confirmPassword) {
            showError("Passwords do not match.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // The account now exists. If the profile cannot be saved, still let the
            // lecturer continue instead of reporting that account creation failed.
            try {
                await set(ref(db, `lecturers/${user.uid}`), {
                    uid: user.uid,
                    email: user.email,
                    name: fullName,
                    fullName,
                    username: email,
                    gender,
                    role: "lecturer",
                    createdAt: new Date().toISOString(),
                });
            } catch (profileError) {
                console.error("Account created, but the lecturer profile could not be saved to the database:", profileError);
            }

            showSuccess("Account created successfully!");
            form.reset();
            setTimeout(() => {
                window.location.href = "../log-In-Lecturer/lecturerLogin.html";
            }, 600);
        } catch (error) {
            const errorMessage = error.code === "auth/email-already-in-use"
                ? "This email is already registered. Please log in instead."
                : error.code === "auth/weak-password"
                    ? "Password is too weak. Please use a stronger password."
                    : error.code === "auth/invalid-email"
                        ? "Please enter a valid email address."
                        : error.code === "auth/network-request-failed"
                            ? "Account creation failed. Please check your internet connection."
                            : `Account creation failed (${error.code || "unknown error"}). Please try again.`;

            showError(errorMessage);
        }
    });
}

function showError(text) {
    message.style.color = "red";
    message.textContent = text;
}

function showSuccess(text) {
    message.style.color = "green";
    message.textContent = text;
}

if (closeButton) {
    closeButton.addEventListener("click", function () {
        const container = document.querySelector(".container");
        if (container) {
            container.style.display = "none";
        }
    });
}