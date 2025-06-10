// Toggle password visibility
function togglePassword(id) {
    const field = document.getElementById(id);
    const toggleIcon = field.nextElementSibling;
    field.type = field.type === "password" ? "text" : "password";
    toggleIcon.textContent = field.type === "password" ? "👁" : "👁‍🗨";
}

// Hide all forms
function hideAllForms() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "none";
    document.getElementById("selection-form").style.display = "none";
    // Fixed: Uncommented to ensure the admin form is hidden correctly
    document.getElementById("admin-form").style.display = "none";
}

// Show student login form
function showStudent() {
    hideAllForms();
    // Changed to show login form by default for students
    document.getElementById("login-form").style.display = "block";
}

// Show admin login form
function showAdmin() {
    hideAllForms();
    document.getElementById("admin-form").style.display = "block";
}

// Show restaurant login form
function showRestaurant() {
    hideAllForms();
    document.getElementById("restaurant-form").style.display = "block";
}

// UPDATED: Switch to student login form
function showLogin() {
    hideAllForms();
    document.getElementById("login-form").style.display = "block";
    resetFormErrors('signup'); // Clear errors from the other form
}

// UPDATED: Switch to student signup form
function showSignup() {
    hideAllForms();
    document.getElementById("signup-form").style.display = "block";
    resetFormErrors('login'); // Clear errors from the other form
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

// NEW: Student Login Function
async function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    let isValid = true;

    resetFormErrors('login');

    if (!validateEmail(email)) {
        document.getElementById('login-email-error').textContent = 'Email must be a university email ending with @miuegypt.edu.eg.';
        isValid = false;
    }

    if (password === '') {
        document.getElementById('login-password-error').textContent = 'Password cannot be empty.';
        isValid = false;
    }

    if (!isValid) return;

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            showPopup('Login successful');
            // Redirect based on role
            if (data.role === 'student') {
                window.location.href = '/dashboard.html';
            } else if (data.role === 'restaurant') {
                window.location.href = '/restaurant-dashboard.html';
            } else if (data.role === 'admin') {
                window.location.href = '/admin-dashboard.html';
            }
        } else {
            showPopup(data.message || 'Login failed', false);
        }
    } catch (err) {
        console.error('Login error:', err);
        showPopup('Server error', false);
    }
}

// Student Signup Function
async function signUp() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    // Reset any previous errors
    document.getElementById('signup-email-error').textContent = '';
    document.getElementById('signup-password-error').textContent = '';

    if (!email.endsWith('@miuegypt.edu.eg')) {
        document.getElementById('signup-email-error').textContent = 'Use your university email';
        return;
    }

    if (password.length < 6) {
        document.getElementById('signup-password-error').textContent = 'Password must be at least 6 characters';
        return;
    }

    try {
        const res = await fetch('/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            showPopup(data.message);
            showLogin(); // بعد التسجيل نرجّع المستخدم لصفحة تسجيل الدخول
        } else {
            showPopup(data.message);
        }
    } catch (err) {
        console.error('Signup error:', err);
        showPopup('Something went wrong');
    }
}


// Restaurant Login Function
function restaurantLogin() {
    const email = document.getElementById('restaurant-email').value.trim();
    const password = document.getElementById('restaurant-password').value.trim();
    let isValid = true;

    resetFormErrors('restaurant');

    if (!validateEmail(email)) {
        document.getElementById('restaurant-email-error').textContent = 'Please enter a valid restaurant email ending with @miuegypt.edu.eg.';
        isValid = false;
    }

    if (password === '') {
        document.getElementById('restaurant-password-error').textContent = 'Password cannot be empty.';
        isValid = false;
    }

    if (isValid) {
        console.log('Restaurant login successful!');
        // UPDATED: Changed to a relative path. Ensure 'index.html' is in the same folder.
        window.location.href = "index.html";
    }
}

// Admin Login Function
function adminLogin() {
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    let isValid = true;

    resetFormErrors('admin');

    if (!validateEmail(email)) {
        document.getElementById('admin-email-error').textContent = 'Please enter a valid admin email ending with @miuegypt.edu.eg.';
        isValid = false;
    }

    if (password === '') {
        document.getElementById('admin-password-error').textContent = 'Password cannot be empty.';
        isValid = false;
    }

    if (isValid) {
        console.log('Admin login successful!');
        // UPDATED: Changed to a relative path. Ensure 'admin-dashboard.html' is in the same folder.
        window.location.href = "admin-dashboard.html";
    }
}

// Email validation helper
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/;
    return re.test(String(email).toLowerCase());
}

// Close popup on background click
document.getElementById("success-popup").addEventListener("click", function (e) {
    if (e.target === this) {
        this.style.display = "none";
    }
});

// Prevent Enter key from submitting forms (optional but good practice)
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

// Show selection screen on initial load
document.addEventListener("DOMContentLoaded", function () {
    hideAllForms();
    document.getElementById("selection-form").style.display = "block";
});
