// GET ELEMENTS

const signupLink = document.getElementById("signupLink");
const loginLink = document.getElementById("loginLink");

const signupPopup = document.getElementById("signupPopup");
const loginPopup = document.getElementById("loginPopup");

const closeSignup = document.getElementById("closeSignup");
const closeLogin = document.getElementById("closeLogin");


// OPEN SIGN UP

signupLink.addEventListener("click", function(event) {

    event.preventDefault();

    signupPopup.style.display = "flex";

});


// OPEN LOGIN

loginLink.addEventListener("click", function(event) {

    event.preventDefault();

    loginPopup.style.display = "flex";

});


// CLOSE SIGN UP

closeSignup.addEventListener("click", function() {

    signupPopup.style.display = "none";

});


// CLOSE LOGIN

closeLogin.addEventListener("click", function() {

    loginPopup.style.display = "none";

});


// CLOSE WHEN CLICKING OUTSIDE

window.addEventListener("click", function(event) {

    if (event.target === signupPopup) {

        signupPopup.style.display = "none";

    }

    if (event.target === loginPopup) {

        loginPopup.style.display = "none";

    }

});


// SIGN UP

document.getElementById("signupForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const name =
            document.getElementById("signupName").value;

        const email =
            document.getElementById("signupEmail").value;

        const password =
            document.getElementById("signupPassword").value;


        // Save demo account

        localStorage.setItem(
            "lecturerAccount",
            JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        );


        document.getElementById("signupMessage").textContent =
            "Account created successfully!";


        // Clear form

        document.getElementById("signupForm").reset();

    }
);


// LOGIN

document.getElementById("loginForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;


        const account =
            JSON.parse(
                localStorage.getItem("lecturerAccount")
            );


        if (
            account &&
            account.email === email &&
            account.password === password
        ) {

            document.getElementById("loginMessage").textContent =
                "Login successful! Welcome " + account.name;

        } else {

            document.getElementById("loginMessage").textContent =
                "Incorrect email or password.";

        }

    }
);


// INTERACTIVE LOGO

const logo = document.querySelector(".logo-mark");

if (logo) {
    logo.addEventListener("click", function() {

    logo.animate(

        [
            {
                transform: "rotate(0deg) scale(1)"
            },

            {
                transform: "rotate(360deg) scale(1.2)"
            },

            {
                transform: "rotate(720deg) scale(1)"
            }
        ],

        {
            duration: 1000,

            easing: "ease-in-out"
        }

    );

    });
}