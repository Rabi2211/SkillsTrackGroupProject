const verifyBtn = document.getElementById("verifyBtn");
const message = document.getElementById("message");

verifyBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();

    if (email === "") {
        message.style.color = "orange";
        message.textContent = "Please enter your email address.";
        return;
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        message.style.color = "red";
        message.textContent = "Please enter a valid email.";
        return;
    }

    message.style.color = "#00ff99";
    message.textContent = "Verification email sent successfully!";
});