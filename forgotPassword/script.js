const form = document.getElementById("forgotPasswordForm");
const message = document.getElementById("message");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const closeButton = document.querySelector(".close-btn");

if (!form || !message || !newPasswordInput || !confirmPasswordInput) {
    console.error("Required forgot password form elements are missing.");
} else {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword.trim() === "") {
            message.style.color = "red";
            message.textContent = "Please enter a new password.";
            return;
        }

        if (newPassword.length < 8) {
            message.style.color = "red";
            message.textContent = "Password must be at least 8 characters long.";
            return;
        }

        if (newPassword !== confirmPassword) {
            message.style.color = "red";
            message.textContent = "Passwords do not match.";
            return;
        }

        message.style.color = "green";
        message.textContent = "Password reset successfully.";
        form.reset();
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