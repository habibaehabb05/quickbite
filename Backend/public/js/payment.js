// --- INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', function() {
            const totalPrice = localStorage.getItem('cartTotal');
            const displayElement = document.getElementById('display-total');
            
            if (totalPrice) {
                displayElement.textContent = totalPrice;
            } else {
                displayElement.textContent = '0 EGP';
            }
        });

        // --- UI TOGGLES & RESETS ---
        function togglePaymentMethod() {
            const method = document.getElementById("payment-method").value;
            const cardDetails = document.getElementById("card-details");
            cardDetails.style.display = method === "card" ? "block" : "none";
        }

        function resetForm() {
            // Clear all input fields
            document.getElementById('cardholder-name').value = '';
            document.getElementById('card-number').value = '';
            document.getElementById('expiry-month').value = '';
            document.getElementById('expiry-year').value = '';
            document.getElementById('cvv').value = '';

            // Reset payment method dropdown and hide the card details section
            const paymentMethodSelect = document.getElementById('payment-method');
            paymentMethodSelect.value = '';
            document.getElementById('card-details').style.display = 'none';

            // Hide any visible status messages
            document.getElementById('success-message').style.display = 'none';
            document.getElementById('processing-message').style.display = 'none';
            hideAllErrors();

            // Reset the total price in the display and clear it from storage
            document.getElementById('display-total').textContent = '0 EGP';
            localStorage.removeItem('cartTotal');
        }


        function closeModal() {
            document.getElementById('success-modal').classList.remove('visible');
            resetForm(); // Call the new reset function
        }

        function toggleCvvVisibility() {
            const cvvInput = document.getElementById('cvv');
            const eyeOpen = document.getElementById('eye-open');
            const eyeClosed = document.getElementById('eye-closed');

            if (cvvInput.type === 'password') {
                cvvInput.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                cvvInput.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        }

        // --- INPUT FORMATTING & HELPERS ---
        function formatCardNumber(input) {
            let value = input.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            input.value = value.slice(0, 19);
        }

        function isNumberKey(evt) {
            const charCode = evt.which ? evt.which : evt.keyCode;
            return !(charCode > 31 && (charCode < 48 || charCode > 57));
        }

        function showError(fieldId, message) {
            const errorElement = document.getElementById(fieldId);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        function hideAllErrors() {
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.style.display = 'none');
        }

        // --- VALIDATION LOGIC ---
        function validateForm() {
            hideAllErrors();
            let isValid = true;

            const name = document.getElementById("cardholder-name").value.trim();
            const number = document.getElementById("card-number").value.trim();
            const expiryMonth = document.getElementById("expiry-month").value.trim();
            const expiryYear = document.getElementById("expiry-year").value.trim();
            const cvv = document.getElementById("cvv").value.trim();

            if (name === "") {
                showError('name-error', 'Cardholder name is required.');
                isValid = false;
            }

            if (number.length !== 19) {
                showError('number-error', 'Please enter a valid 16-digit card number.');
                isValid = false;
            }
            
            const month = parseInt(expiryMonth, 10);
            if (isNaN(month) || month < 1 || month > 12) {
                showError('expiry-error', 'Month must be between 01 and 12.');
                isValid = false;
            }

            const year = parseInt(expiryYear, 10);
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;
            if (isNaN(year) || year < currentYear || (year === currentYear && month < currentMonth)) {
                 showError('expiry-error', 'Expiry date cannot be in the past.');
                 isValid = false;
            }
            
            if (cvv.length !== 3) {
                showError('cvv-error', 'CVV must be 3 digits.');
                isValid = false;
            }
            
            return isValid;
        }

        // --- PAYMENT PROCESSING ---
        function processPayment() {
            if (!validateForm()) {
                return;
            }

            const processingMessage = document.getElementById("processing-message");
            const successMessage = document.getElementById("success-message");
            
            successMessage.style.display = "none";
            processingMessage.style.display = "block";

            setTimeout(() => {
                processingMessage.style.display = "none";
                successMessage.style.display = "block";
                showSuccessPopup();
            }, 2000);
        }

        function showSuccessPopup() {
            const name = document.getElementById("cardholder-name").value.trim();
            const amount = document.getElementById('display-total').textContent;
            
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const formattedDate = now.toLocaleDateString('en-US', options);

            document.getElementById('popup-name').textContent = name;
            document.getElementById('popup-amount').textContent = amount;
            document.getElementById('popup-date').textContent = formattedDate;
            document.getElementById('success-modal').classList.add('visible');
        }