const form = document.getElementById("accountForm");

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
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
    message.className = "error";
    message.textContent = text;
}

function showSuccess(text) {
    const message = document.getElementById("message");
    message.className = "success";
    message.textContent = text;
}

function closeForm() {
    document.querySelector(".container").style.display = "none";
}