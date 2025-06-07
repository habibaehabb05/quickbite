// Toggle password visibility
function togglePassword(id) {
    const field = document.getElementById(id);
    const toggleIcon = field.nextElementSibling;
    field.type = field.type === "password" ? "text" : "password";
    toggleIcon.textContent = field.type === "password" ? "👁" : "👁‍🗨";
}

// Switch between login/signup forms
// Show login form (updated)
function showLogin() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    resetFormErrors('signup');
    resetFormErrors('restaurant');
}

// Show signup form (updated)
function showSignup() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
    resetFormErrors('login');
    resetFormErrors('restaurant');
}

// Show restaurant form (updated)
function showRestaurant() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "block";
    resetFormErrors('signup');
    resetFormErrors('login');
}
// Reset form errors
function resetFormErrors(formType) {
    const errors = document.querySelectorAll(`#${formType}-form .error-message`);
    errors.forEach(error => error.textContent = "");
}

// Show popup message
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

// Signup validation
function signUp() {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const emailError = document.getElementById("signup-email-error");
    const passwordError = document.getElementById("signup-password-error");

    // Reset errors
    resetFormErrors('signup');

    // Validate email
    if (!email) {
        emailError.textContent = "Email is required";
        return;
    } else if (!validateEmail(email)) {
        emailError.textContent = "Valid @miuegypt.edu.eg email required";
        return;
    }

    // Validate password
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

    // If validation passes
    showPopup("Account created successfully! Redirecting...");
    setTimeout(showLogin, 3000);
}

// Login validation
function login() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const emailError = document.getElementById("login-email-error");
    const passwordError = document.getElementById("login-password-error");

    // Reset errors
    resetFormErrors('login');

    // Validate email
    if (!email) {
        emailError.textContent = "Email is required";
        return;
    } else if (!validateEmail(email)) {
        emailError.textContent = "Valid @miuegypt.edu.eg email required";
        return;
    }

    // Validate password
    if (!password) {
        passwordError.textContent = "Password is required";
        return;
    }

    // Here you would typically check against a database
    // This is just a mock validation
    if (password.length < 6) {
        showPopup("Invalid credentials", false);
        return;
    }

    // If validation passes
    showPopup("Login successful! Redirecting...");
    setTimeout(() => {
        window.location.href = "http://127.0.0.1:5500/frontend/Pages/dashboard.html";
    }, 3000);
}

// Email validation helper
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/;
    return re.test(email);
}

// Close popup when clicking outside
document.getElementById("success-popup").addEventListener("click", function(e) {
    if (e.target === this) {
        this.style.display = "none";
    }
});

// Prevent form submission on Enter key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});
// Show restaurant login form
function showRestaurant() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "block";
    resetFormErrors('signup');
    resetFormErrors('login');
}

// Restaurant login validation
function restaurantLogin() {
    const email = document.getElementById("restaurant-email").value.trim();
    const password = document.getElementById("restaurant-password").value.trim();
    const emailError = document.getElementById("restaurant-email-error");
    const passwordError = document.getElementById("restaurant-password-error");

    // Reset errors
    emailError.textContent = "";
    passwordError.textContent = "";

    // Validate email
    if (!email) {
        emailError.textContent = "Email is required";
        return;
    }

    // Validate password
    if (!password) {
        passwordError.textContent = "Password is required";
        return;
    }

    // If validation passes
    showPopup("Restaurant login successful! Redirecting...");
    setTimeout(() => {
        window.location.href = "http://127.0.0.1:5500/frontend/Pages/index.html";
    }, 3000);
}