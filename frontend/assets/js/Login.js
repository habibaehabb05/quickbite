// Toggle password visibility
function togglePassword(id) {
    const field = document.getElementById(id);
    const toggleIcon = field.nextElementSibling;
    field.type = field.type === "password" ? "text" : "password";
    toggleIcon.textContent = field.type === "password" ? "👁" : "👁‍🗨";
}

// Switch between login/signup forms
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

// Email validation helper
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/;
    return re.test(email);
}

// ==========================
// ✅ SIGNUP with Fetch
// ==========================
async function signUp() {
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

    try {
        const res = await fetch("http://localhost:3000/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
            showPopup("Account created successfully! Redirecting...");
            setTimeout(showLogin, 3000);
        } else {
            showPopup(data.message || "Signup failed", false);
        }
    } catch (error) {
        console.error(error);
        showPopup("Server error. Try again later.", false);
    }
}

// ==========================
// ✅ LOGIN with Fetch
// ==========================
async function login() {
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

    try {
        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
            showPopup("Login successful! Redirecting...");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 3000);
        } else {
            showPopup(data.message || "Invalid credentials", false);
        }
    } catch (error) {
        console.error(error);
        showPopup("Server error. Try again later.", false);
    }
}

// ==========================
// Restaurant login (local validation)
// ==========================
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
        window.location.href = "index.html";
    }, 3000);
}

// ==========================
// Close popup on background click
// ==========================
document.getElementById("success-popup").addEventListener("click", function(e) {
    if (e.target === this) {
        this.style.display = "none";
    }
});

// Prevent form submit on Enter
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});
