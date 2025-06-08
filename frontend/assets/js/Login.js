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
    // document.getElementById("admin-form").style.display = "none"; // Uncomment if admin form exists
}

// Show initial student signup
function showStudent() {
    hideAllForms();
    document.getElementById("signup-form").style.display = "block";
}

function showAdmin() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "none";
    document.getElementById("selection-form").style.display = "none";
    document.getElementById("admin-form").style.display = "block";
}


// Show restaurant login
function showRestaurant() {
    hideAllForms();
    document.getElementById("restaurant-form").style.display = "block";
    resetFormErrors('signup');
    resetFormErrors('login');
}
// Switch between login/signup forms
/*function showLogin() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    resetFormErrors('signup');
    resetFormErrors('restaurant');
}*/

/*function showSignup() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("restaurant-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
    resetFormErrors('login');
    resetFormErrors('restaurant');
}*/

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
 
function restaurantLogin() {
    const email = document.getElementById('restaurant-email').value.trim();
    const password = document.getElementById('restaurant-password').value.trim();

    let isValid = true;

    // Clear previous errors
    document.getElementById('restaurant-email-error').textContent = '';
    document.getElementById('restaurant-password-error').textContent = '';

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/;
    if (!emailPattern.test(email)) {
        document.getElementById('restaurant-email-error').textContent = 'Please enter a valid restaurant email ending with @miuegypt.edu.eg.';
        isValid = false;
    }

    // Password validation
    if (password === '') {
        document.getElementById('restaurant-password-error').textContent = 'Password cannot be empty.';
        isValid = false;
    }

    // Redirect if valid
    if (isValid) {
        console.log('Restaurant login successful!');
        window.location.href = "file:///C:/Users/Bob/Desktop/Nimo/index.html"; // ✅ Ensure this file exists in the same folder
    }
}


function adminLogin() {
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    let isValid = true;

    // Clear previous errors
    document.getElementById('admin-email-error').textContent = '';
    document.getElementById('admin-password-error').textContent = '';

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/;
    if (!emailPattern.test(email)) {
        document.getElementById('admin-email-error').textContent = 'Please enter a valid admin email ending with @miuegypt.edu.eg.';
        isValid = false;
    }

    // Password validation
    if (password === '') {
        document.getElementById('admin-password-error').textContent = 'Password cannot be empty.';
        isValid = false;
    }

    // Redirect if valid
    if (isValid) {
        console.log('Admin login successful!');
        window.location.href = "admin-dashboard.html"; // ✅ Make sure this file exists and is correctly linked
    }
}

function signUp() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    let isValid = true;

    // Clear previous errors
    document.getElementById('signup-email-error').textContent = '';
    document.getElementById('signup-password-error').textContent = '';

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/;
    if (!emailPattern.test(email)) {
        document.getElementById('signup-email-error').textContent = 'Email must be a university email ending with @miuegypt.edu.eg.';
        isValid = false;
    }

    // Password validation
    if (password === '') {
        document.getElementById('signup-password-error').textContent = 'Password cannot be empty.';
        isValid = false;
    }

    // If valid, redirect to student home page
    if (isValid) {
        console.log('Signup successful!');
        window.location.href = "C:/Users/Bob/Downloads/dashboard.html"; // Change this to your homepage
    }
}


// Email validation helper
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/;
    return re.test(email);
}
// Close popup on background click
document.getElementById("success-popup").addEventListener("click", function (e) {
    if (e.target === this) {
        this.style.display = "none";
    }
});

// Prevent Enter key from submitting forms
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

// Show selection screen on initial load
document.addEventListener("DOMContentLoaded", function () {
    hideAllForms();
    document.getElementById("selection-form").style.display = "block";
});