// Display the cart total when page loads
document.addEventListener('DOMContentLoaded', function () {
    const totalPrice = localStorage.getItem('cartTotal');
    const displayElement = document.getElementById('display-total');
    const hiddenTotalInput = document.getElementById('hidden-total');

    if (totalPrice) {
        displayElement.textContent = totalPrice;
        // Fix: Remove 'EGP' text and store only the numeric value
        const numericTotal = totalPrice.replace(/[^\d.]/g, ''); // Extract only numbers and decimal points
        hiddenTotalInput.value = numericTotal;
    } else {
        displayElement.textContent = '0 EGP (No items)';
        hiddenTotalInput.value = '0';
    }

    // ✅ Show confirmation popup and success message if exists
    const popup = document.getElementById("confirmation-popup");
    if (popup) {
        popup.style.display = "block";
        const successMessage = document.getElementById("success-message");
        if (successMessage) {
            successMessage.style.display = "block";
        }
    }
});

function togglePaymentMethod() {
    var method = document.getElementById("payment-method").value;
    var cardDetails = document.getElementById("card-details");
    cardDetails.style.display = method === "card" ? "block" : "none";
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = value.slice(0, 19);
}

function isNumberKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    return charCode >= 48 && charCode <= 57;
}

function validateExpiryMonth(input) {
    let value = parseInt(input.value);
    if (input.value.length === 2 && (value < 1 || value > 12)) {
        alert("Please enter a valid month (01-12)");
        input.value = "";
        return false;
    }
    return true;
}

function validateExpiryYear(input) {
    let value = parseInt(input.value);
    let currentYear = new Date().getFullYear() % 100;
    if (input.value.length === 2 && value < currentYear) {
        alert("Please enter a valid year (not in the past)");
        input.value = "";
        return false;
    }
    return true;
}

function processPayment(event) {
    event.preventDefault(); // Prevent real submit

    const form = document.getElementById("payment-form");
    const name = document.getElementById("cardholder-name").value.trim();
    const number = document.getElementById("card-number").value.trim();
    const expiryMonth = document.getElementById("expiry-month").value.trim();
    const expiryYear = document.getElementById("expiry-year").value.trim();
    const cvv = document.getElementById("cvv").value.trim();
    const processingMessage = document.getElementById("processing-message");
    const successMessage = document.getElementById("success-message");

    if (!name || !number || !expiryMonth || !expiryYear || !cvv) {
        alert("Please fill in all the required fields.");
        return false;
    }

    // Fix: Ensure the hidden total field is populated before submission
    const hiddenTotalInput = document.getElementById('hidden-total');
    const totalPrice = localStorage.getItem('cartTotal');
    if (totalPrice && !hiddenTotalInput.value) {
        const numericTotal = totalPrice.replace(/[^\d.]/g, '');
        hiddenTotalInput.value = numericTotal;
    }

    // Debug: Log form data before submission
    console.log("=== Form Data Before Submission ===");
    console.log("Cardholder Name:", name);
    console.log("Hidden Total Value:", hiddenTotalInput.value);
    console.log("Cart Total from localStorage:", totalPrice);
    console.log("==================================");

    // ✅ Inject current date as hidden input before submit
    const existingDateInput = document.getElementById("date-field");
    if (!existingDateInput) {
        const dateInput = document.createElement("input");
        dateInput.type = "hidden";
        dateInput.name = "date";
        dateInput.id = "date-field";
        dateInput.value = new Date().toISOString();
        form.appendChild(dateInput);
    }

    // ✅ Disable button to prevent double submission
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;

    processingMessage.style.display = "block";
    successMessage.style.display = "none";

    // Remove the fake success message - let the server response handle it
    setTimeout(() => {
        processingMessage.style.display = "none";
        // Don't show success message here - wait for server response
        form.submit(); // Submit immediately after processing delay
    }, 2000);

    return false;
}

document.getElementById("payment-form").addEventListener("submit", processPayment);