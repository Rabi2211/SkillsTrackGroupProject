import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { auth, db } from "../../firebase.js";

const form = document.getElementById("accountForm");
const usernameInput = document.getElementById("username");
const genderInput = document.getElementById("gender");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const message = document.getElementById("message");

if (form && usernameInput && passwordInput && confirmPasswordInput && message) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("name")?.value.trim() || "";
    const email = usernameInput.value.trim();
    const gender = genderInput?.value.trim() || "";
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const specialCharacter = /[!@#$%^&*(),.?":{}|<>]/;

    if (fullName === "") {
      showError("Name and surname are required.");
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

    if (password.length === 0) {
      showError("Password is required.");
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

      const nameParts = fullName.split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] || fullName;
      const lastName = nameParts.slice(1).join(" ") || "";

      await setDoc(doc(db, "students", user.uid), {
        uid: user.uid,
        email: user.email,
        username: email,
        firstName,
        lastName,
        fullName,
        gender,
        role: "student",
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem('skillsTrackCurrentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        fullName,
        gender
      }));

      showSuccess("Account created successfully!");
      form.reset();
      setTimeout(() => {
        window.location.href = "../log-in-learner/learnerLogin.html";
      }, 600);
    } catch (error) {
      const errorMessage = error.code === "auth/email-already-in-use"
        ? "This email is already registered."
        : error.code === "auth/weak-password"
          ? "Password is too weak. Please use a stronger password."
          : "Account creation failed. Please try again.";

      showError(errorMessage);
    }
  });
}

function showError(text) {
    const message = document.getElementById("message");
    if (!message) return;
    message.className = "error";
    message.textContent = text;
}

function showSuccess(text) {
    const message = document.getElementById("message");
    if (!message) return;
    message.className = "success";
    message.textContent = text;
}

function closeForm() {
    const container = document.querySelector(".container");
    if (container) {
        container.style.display = "none";
    }
}