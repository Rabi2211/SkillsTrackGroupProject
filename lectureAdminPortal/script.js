const closeButton = document.getElementById("closeButton");
const accountForm = document.getElementById("accountForm");
const message = document.getElementById("message");

if (closeButton) {
    closeButton.addEventListener("click", function () {
        window.location.href = "../lectureWelcomePage/lectureWelcomePage.html";
    });
}

if (accountForm) {
    accountForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const repeatPassword = document.getElementById("repeatPassword").value;

        if (!name || !email || !password || !repeatPassword) {
            message.textContent = "Please complete all fields.";
            message.style.color = "#ffebeb";
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            message.textContent = "Please enter a valid email address.";
            message.style.color = "#ffebeb";
            return;
        }

        if (password.length < 8 || !/[A-Z]/.test(password)) {
            message.textContent = "Password must be at least 8 characters and include a capital letter.";
            message.style.color = "#ffebeb";
            return;
        }

        if (password !== repeatPassword) {
            message.textContent = "Passwords do not match.";
            message.style.color = "#ffebeb";
            return;
        }

        localStorage.setItem(
            "adminAccount",
            JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        );

        message.textContent = "Account created successfully!";
        message.style.color = "#e8f5e9";
        accountForm.reset();
    });
}