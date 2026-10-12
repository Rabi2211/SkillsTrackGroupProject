const form = document.getElementById("accountForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const message = document.getElementById("message");

if (form && usernameInput && passwordInput && confirmPasswordInput && message) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const specialCharacter = /[!@#$%^&*(),.?":{}|<>]/;

    if (username === "") {
      showError("Username is required.");
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

    showSuccess("Account created successfully!");
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