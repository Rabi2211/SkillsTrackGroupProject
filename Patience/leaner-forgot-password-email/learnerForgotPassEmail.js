import { get, ref } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { db } from "../../firebase.js";

function showMessage(message, text, color) {
  message.style.color = color;
  message.textContent = text;
}

const verifyBtn = document.getElementById("verifyBtn");
const emailInput = document.getElementById("email");
const message = document.getElementById("message");
const closeButton = document.querySelector(".close-btn");

if (closeButton) {
  closeButton.addEventListener("click", () => window.history.back());
}

if (!verifyBtn || !emailInput || !message) {
  console.error("Forgot password form is missing required elements.");
} else {
  verifyBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();

    if (email === "") {
      showMessage(message, "Please enter your email address.", "orange");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage(message, "Please enter a valid email.", "red");
      return;
    }

    verifyBtn.disabled = true;

    try {
      const studentsSnapshot = await get(ref(db, "students"));
      const students = studentsSnapshot.exists() ? studentsSnapshot.val() : {};
      const found = Object.values(students).some((student) => {
        const studentEmail = String(student?.email || "").trim().toLowerCase();
        const studentUsername = String(student?.username || "").trim().toLowerCase();
        const normalizedEmail = email.toLowerCase();

        return studentEmail === normalizedEmail || studentUsername === normalizedEmail;
      });

      if (!found) {
        showMessage(message, "no such email", "red");
        return;
      }

      window.location.href = "../forgot-password-learner/forgotPassLearner.html";
    } catch (error) {
      console.error("Failed to check learner email in database:", error);
      showMessage(message, "no such email", "red");
    } finally {
      verifyBtn.disabled = false;
    }
  });
}
