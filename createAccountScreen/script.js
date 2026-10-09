const form = document.getElementById("accountForm");
const message = document.getElementById("message");

if (!form || !message) {
    throw new Error("Required form elements are missing.");
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const specialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

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
    message.textContent = "Account created successfully!";
    form.reset();
});