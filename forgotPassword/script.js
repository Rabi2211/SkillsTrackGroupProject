const form = document.getElementById("forgotPasswordForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (newPassword.length < 8) {
        message.style.color = "red";
        message.textContent =
            "Password must be at least 8 characters long.";
        return;
    }

    if (newPassword !== confirmPassword) {
        message.style.color = "red";
        message.textContent =
            "Passwords do not match.";
        return;
    }

    message.style.color = "green";
    message.textContent =
        "Password reset successfully.";

    form.reset();
});