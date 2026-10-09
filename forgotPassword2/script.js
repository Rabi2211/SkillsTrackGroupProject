const verifyBtn = document.getElementById("verifyBtn");
const message = document.getElementById("message");

verifyBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();

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

document.querySelector(".close-btn").addEventListener("click", () => {
    window.close();
});
    