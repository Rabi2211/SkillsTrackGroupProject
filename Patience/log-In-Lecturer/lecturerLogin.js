const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const closeButton = document.querySelector(".close-btn");

if (form && usernameInput && passwordInput) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === "" || password === "") {
            alert("Please enter both Username and Password.");
            return;
        }

        window.location.href = "../../src/pages/lecturerPortal.html";
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