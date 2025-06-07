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
                // Redirect based on user role:
                if (data.role === "student") {
                    window.location.href = "dashboard.html";
                } else if (data.role === "restaurant") {
                    window.location.href = "restaurant-dashboard.html";
                } else if (data.role === "admin") {
                    window.location.href = "admin-dashboard.html";
                } else {
                    // fallback:
                    window.location.href = "dashboard.html";
                }
            }, 3000);
        } else {
            showPopup(data.message || "Invalid credentials", false);
        }
    } catch (error) {
        console.error(error);
        showPopup("Server error. Try again later.", false);
    }
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
