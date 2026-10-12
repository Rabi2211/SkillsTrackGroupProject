const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const closeButton = document.querySelector(".close-btn");

if (form && usernameInput && passwordInput) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        alert("Login successful!");
    });
}

if (closeButton) {
    closeButton.addEventListener("click", () => {
        const overlay = document.querySelector(".overlay");
        if (overlay) {
            overlay.style.display = "none";
        }
    });
}