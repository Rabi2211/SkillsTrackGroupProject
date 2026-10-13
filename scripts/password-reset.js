import {
  confirmPasswordReset,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "../firebase.js";

function setUpCloseButton() {
  const closeButton = document.querySelector(".close-btn");
  if (closeButton) {
    closeButton.addEventListener("click", () => window.history.back());
  }
}

function showMessage(message, text, color) {
  message.style.color = color;
  message.textContent = text;
}

// "Enter email used to register" page: sends the real Firebase reset email.
export function setUpResetEmailPage() {
  const verifyBtn = document.getElementById("verifyBtn");
  const message = document.getElementById("message");
  const emailInput = document.getElementById("email");

  setUpCloseButton();

  if (!verifyBtn || !emailInput || !message) return;

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
      await sendPasswordResetEmail(auth, email);
      showMessage(
        message,
        "If this email is registered, a password reset link has been sent to it. Open the link in the email (check spam too) to choose a new password, then log in.",
        "#00ff99",
      );
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      const text = error.code === "auth/too-many-requests"
        ? "Too many requests. Please wait a few minutes and try again."
        : error.code === "auth/network-request-failed"
          ? "Could not send the email. Please check your internet connection."
          : `Could not send the reset email (${error.code || "unknown error"}).`;
      showMessage(message, text, "red");
    } finally {
      verifyBtn.disabled = false;
    }
  });
}

// "Type new password" page: only works when opened from the reset email link,
// which carries the one-time code (oobCode) Firebase needs to change the password.
export function setUpNewPasswordPage(loginUrl, resetEmailUrl) {
  const form = document.getElementById("accountForm");
  const message = document.getElementById("message");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const resetCode = new URLSearchParams(window.location.search).get("oobCode");

  setUpCloseButton();

  if (!form || !message || !passwordInput || !confirmPasswordInput) {
    console.error("Required password reset form elements are missing.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const specialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

    if (password === "" || confirmPassword === "") {
      showMessage(message, "Please complete both password fields.", "red");
      return;
    }

    if (password.length < 6) {
      showMessage(message, "Password must be at least 6 characters long.", "red");
      return;
    }

    if (!specialCharacter.test(password)) {
      showMessage(message, "Password must contain at least one special character.", "red");
      return;
    }

    if (password !== confirmPassword) {
      showMessage(message, "Passwords do not match.", "red");
      return;
    }

    if (!resetCode) {
      showMessage(message, "Your password was not changed. Request a reset email first and open the link in that email.", "red");
      setTimeout(() => {
        window.location.href = resetEmailUrl;
      }, 2500);
      return;
    }

    try {
      await confirmPasswordReset(auth, resetCode, password);
      showMessage(message, "Password reset successfully!", "green");
      form.reset();
      setTimeout(() => {
        window.location.href = loginUrl;
      }, 1200);
    } catch (error) {
      console.error("Password reset failed:", error);
      const text = error.code === "auth/expired-action-code" || error.code === "auth/invalid-action-code"
        ? "This reset link has expired or was already used. Please request a new one."
        : error.code === "auth/weak-password"
          ? "Password is too weak. Please use a stronger password."
          : `Password reset failed (${error.code || "unknown error"}).`;
      showMessage(message, text, "red");
    }
  });
}
