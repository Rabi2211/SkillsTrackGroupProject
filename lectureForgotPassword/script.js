const closeButton = document.getElementById("closeButton");
const resetForm = document.getElementById("resetForm");
const message = document.getElementById("message");

if (closeButton) {
    closeButton.addEventListener("click", function () {
        window.location.href = "../lectureWelcomePage/lectureWelcomePage.html";
    });
}

if (resetForm) {
    resetForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (!newPassword || !confirmPassword) {
            message.textContent = "Please complete both password fields.";
            message.style.color = "#ffebeb";
            return;
        }

        if (newPassword.length < 8 || !/[A-Z]/.test(newPassword)) {
            message.textContent = "Password must be at least 8 characters and include a capital letter.";
            message.style.color = "#ffebeb";
            return;
        }

        if (newPassword !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            message.style.color = "#ffebeb";
            return;
        }

        const storedAdmin = JSON.parse(localStorage.getItem("adminAccount") || "null");

        if (storedAdmin) {
            storedAdmin.password = newPassword;
            localStorage.setItem("adminAccount", JSON.stringify(storedAdmin));
        }

        message.textContent = "Password reset successfully!";
        message.style.color = "#e8f5e9";
        resetForm.reset();
    });
}
