document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        alert("Please enter both Username and Password.");
        return;
    }

    alert("Login Successful!");
});

document.querySelector(".close-btn").addEventListener("click", function() {
    alert("Close button clicked.");
});