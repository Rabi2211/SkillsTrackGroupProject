const form = document.getElementById("accountForm");
const message = document.getElementById("message");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const closeButton = document.querySelector(".close-btn");

if (!form || !message || !passwordInput || !confirmPasswordInput) {
    console.error("Required password reset form elements are missing.");
} else {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const specialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

        if (password.trim() === "" || confirmPassword.trim() === "") {
            message.style.color = "red";
            message.textContent = "Please complete both password fields.";
            return;
        }

        if (!specialCharacter.test(password)) {
            message.style.color = "red";
            message.textContent = "Password must contain at least one special character.";
            return;
        }

        if (password !== confirmPassword) {
            message.style.color = "red";
            message.textContent = "Passwords do not match.";
            return;
        }

        message.style.color = "green";
        message.textContent = "Password reset successfully!";
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