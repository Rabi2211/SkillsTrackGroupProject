const verifyBtn = document.getElementById("verifyBtn");
const message = document.getElementById("message");
const emailInput = document.getElementById("email");
const closeButton = document.querySelector(".close-btn");

if (verifyBtn && emailInput && message) {
    verifyBtn.addEventListener("click", () => {
        const email = emailInput.value.trim();

        if (email === "") {
            message.textContent = "Please enter an email address.";
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            message.textContent = "Invalid email address.";
            return;
        }

        message.textContent = "Verification email sent successfully.";
    });
}

if (closeButton) {
    closeButton.addEventListener("click", () => {
        const container = document.querySelector(".container");
        if (container) {
            container.style.display = "none";
        }
    });
}
