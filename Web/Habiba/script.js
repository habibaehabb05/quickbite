function togglePassword(id) {
    const field = document.getElementById(id);
    const toggleIcon = field.nextElementSibling;
    field.type = field.type === "password" ? "text" : "password";
    toggleIcon.textContent = field.type === "password" ? "👁" : "👁‍🗨";
}

function showLogin() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    resetFormErrors('signup');
    resetFormErrors('restaurant');
}

function showSignup() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
    resetFormErrors('login');
    resetFormErrors('restaurant');
}

function showRestaurant() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "block";
    resetFormErrors('signup');
    resetFormErrors('login');
}
function resetFormErrors(formType) {
    const errors = document.querySelectorAll(`#${formType}-form .error-message`);
    errors.forEach(error => error.textContent = "");
}

function showPopup(message, isSuccess = true) {
    const popup = document.getElementById("success-popup");
    const popupContent = document.querySelector(".popup-content");
    
    document.getElementById("popup-message").textContent = message;
    popupContent.style.backgroundColor = isSuccess ? "#4CAF50" : "#FF4B4B";
    popup.style.display = "flex";
    
    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}

function signUp() {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const emailError = document.getElementById("signup-email-error");
    const passwordError = document.getElementById("signup-password-error");

    resetFormErrors('signup');

    if (!email) {
        emailError.textContent = "Email is required";
        return;
    } else if (!validateEmail(email)) {
        emailError.textContent = "Valid @miuegypt.edu.eg email required";
        return;
    }

    if (!password) {
        passwordError.textContent = "Password is required";
        return;
    } else if (password.length < 8) {
        passwordError.textContent = "Password must be 8+ characters";
        return;
    } else if (!/[A-Z]/.test(password)) {
        passwordError.textContent = "Include at least one uppercase letter";
        return;
    } else if (!/[0-9]/.test(password)) {
        passwordError.textContent = "Include at least one number";
        return;
    }

    showPopup("Account created successfully! Redirecting...");
    setTimeout(showLogin, 3000);
}

function login() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const emailError = document.getElementById("login-email-error");
    const passwordError = document.getElementById("login-password-error");

    resetFormErrors('login');

    if (!email) {
        emailError.textContent = "Email is required";
        return;
    } else if (!validateEmail(email)) {
        emailError.textContent = "Valid @miuegypt.edu.eg email required";
        return;
    }

    if (!password) {
        passwordError.textContent = "Password is required";
        return;
    }
    if (password.length < 6) {
        showPopup("Invalid credentials", false);
        return;
    }

    showPopup("Login successful! Redirecting...");
    setTimeout(() => {
        window.location.href = "file:///C:/Users/MOHANAD/OneDrive/Desktop/Web/Youssef/dashboard.html";
    }, 3000);
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/;
    return re.test(email);
}

document.getElementById("success-popup").addEventListener("click", function(e) {
    if (e.target === this) {
        this.style.display = "none";
    }
});

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});
function showRestaurant() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "block";
    resetFormErrors('signup');
    resetFormErrors('login');
}

function restaurantLogin() {
    const email = document.getElementById("restaurant-email").value.trim();
    const password = document.getElementById("restaurant-password").value.trim();
    const emailError = document.getElementById("restaurant-email-error");
    const passwordError = document.getElementById("restaurant-password-error");

    emailError.textContent = "";
    passwordError.textContent = "";

    if (!email) {
        emailError.textContent = "Email is required";
        return;
    }

    if (!password) {
        passwordError.textContent = "Password is required";
        return;
    }

    showPopup("Restaurant login successful! Redirecting...");
    setTimeout(() => {
        window.location.href = "file:///C:/Users/MOHANAD/OneDrive/Desktop/Web/Mohamed/index.html";
    }, 3000);
}