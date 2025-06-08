// script.js

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOMContentLoaded: Script loaded with all updates.");

    // --- Cart Total Display Logic ---
    const totalPriceFromStorage = localStorage.getItem('cartTotal');
    const displayElement = document.getElementById('display-total');
    const hiddenTotalInput = document.getElementById('hidden-total');

    if (displayElement && hiddenTotalInput) {
        if (totalPriceFromStorage) {
            displayElement.textContent = totalPriceFromStorage;
            const numericTotal = totalPriceFromStorage.replace(/[^\d.]/g, '');
            hiddenTotalInput.value = numericTotal;
        } else {
            displayElement.textContent = '0 EGP (No items)';
            hiddenTotalInput.value = '0';
        }
    }

    // --- Message and Popup Display Logic ---
    const popupElement = document.getElementById("confirmation-popup");
    const successMessageParagraphElement = document.getElementById("success-message");
    const processingMessageElement = document.getElementById("processing-message");

    if (processingMessageElement) processingMessageElement.style.display = 'none';
    if (successMessageParagraphElement) successMessageParagraphElement.style.display = 'none';
    if (popupElement) popupElement.style.display = 'none';

    if (popupElement) {
        const comingFromSuccessfulSubmission = localStorage.getItem('paymentSubmittedShowSuccess') === 'true';
        if (comingFromSuccessfulSubmission) {
            if (successMessageParagraphElement) successMessageParagraphElement.style.display = 'block';
            setTimeout(function() {
                popupElement.style.display = 'block';
                localStorage.removeItem('cartTotal');
                if (displayElement) displayElement.textContent = '0 EGP (No items)';
                if (hiddenTotalInput) hiddenTotalInput.value = '0';
            }, 1500);
            localStorage.removeItem('paymentSubmittedShowSuccess');
        } else {
            if (successMessageParagraphElement) successMessageParagraphElement.style.display = 'block';
            popupElement.style.display = 'block';
            localStorage.removeItem('cartTotal');
            if (displayElement) displayElement.textContent = '0 EGP (No items)';
            if (hiddenTotalInput) hiddenTotalInput.value = '0';
        }
    }
    
    // --- UPDATED: CVV Toggle Event Listener ---
    const cvvInput = document.getElementById('cvv');
    const toggleCvvButton = document.getElementById('toggle-cvv');

    if (cvvInput && toggleCvvButton) {
        toggleCvvButton.addEventListener('click', function() {
            // Check the current input type
            const isPassword = cvvInput.type === 'password';
            
            // Set the new type
            cvvInput.type = isPassword ? 'text' : 'password';

            // Toggle the 'active' class to trigger the strikethrough style
            this.classList.toggle('active');
        });
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
    const monthStr = input.value.trim();
    if (monthStr === "") return true; // Let the 'required' check handle it

    const value = parseInt(monthStr);

    // Fail if the value is 0, or if it has 2 digits and is not between 1-12
    if (value === 0 || (monthStr.length === 2 && (value < 1 || value > 12))) {
        alert("Please enter a valid month (01-12)");
        input.value = "";
        return false;
    }
    return true;
}

function validateExpiryYear(input) {
    const yearStr = input.value.trim();
    const value = parseInt(yearStr);
    const currentYearYY = new Date().getFullYear() % 100;

    // This updated logic checks for single-digits OR past two-digit years
    if (yearStr.length === 1 || (yearStr.length === 2 && value < currentYearYY)) {
        alert("Please enter a valid year (not in the past)");
        input.value = "";
        return false;
    }
    return true;
}

function processPayment(event) {
    event.preventDefault();

    const form = document.getElementById("payment-form");
    const name = document.getElementById("cardholder-name").value.trim();
    const number = document.getElementById("card-number").value.trim();
    const expiryMonth = document.getElementById("expiry-month").value.trim();
    const expiryYear = document.getElementById("expiry-year").value.trim();
    const cvv = document.getElementById("cvv").value.trim();
    
    const processingMessage = document.getElementById("processing-message");
    const successMessage = document.getElementById("success-message");
    const formValidationMessage = document.getElementById("form-validation-message");

    // Hide general validation message at the start
    if (formValidationMessage) formValidationMessage.style.display = "none";

    // 1. Check for empty fields (this now uses the on-page message)
    if (!name || !number || !expiryMonth || !expiryYear || !cvv) {
        if (formValidationMessage) {
            formValidationMessage.textContent = "Please fill in all required fields.";
            formValidationMessage.style.display = "block";
        } else {
            alert("Please fill in all required fields."); // Fallback
        }
        return false;
    }

    // 2. Check card number length
    const numberDigitsOnly = number.replace(/\D/g, '');
    if (numberDigitsOnly.length < 15) {
        if (formValidationMessage) {
            formValidationMessage.textContent = "Please enter a complete and valid card number.";
            formValidationMessage.style.display = "block";
        } else {
            alert("Please enter a complete and valid card number."); // Fallback
        }
        document.getElementById("card-number").focus();
        return false;
    }

    // 3. Re-validate month and year on submission for extra safety
    if (!validateExpiryMonth(document.getElementById('expiry-month')) || !validateExpiryYear(document.getElementById('expiry-year'))) {
        // The individual functions will show their own alerts
        return false;
    }


    console.log("processPayment: Validation passed.");

    const hiddenTotalInput = document.getElementById('hidden-total');
    const totalPrice = localStorage.getItem('cartTotal');
    if (totalPrice && !hiddenTotalInput.value) {
        const numericTotal = totalPrice.replace(/[^\d.]/g, '');
        hiddenTotalInput.value = numericTotal;
    }

    const existingDateInput = document.getElementById("date-field");
    if (!existingDateInput) {
        const dateInput = document.createElement("input");
        dateInput.type = "hidden";
        dateInput.name = "date";
        dateInput.id = "date-field";
        dateInput.value = new Date().toISOString();
        form.appendChild(dateInput);
    }

    const button = form.querySelector("button[type='submit']");
    button.disabled = true;

    if(processingMessage) processingMessage.style.display = "block";
    if(successMessage) successMessage.style.display = "none";

    localStorage.setItem('paymentSubmittedShowSuccess', 'true');

    setTimeout(() => {
        form.submit();
    }, 2000);
}

// Attach event listeners
const paymentForm = document.getElementById("payment-form");
if (paymentForm) {
    paymentForm.addEventListener("submit", processPayment);
} else {
    console.error("Payment form not found on page load.");
}