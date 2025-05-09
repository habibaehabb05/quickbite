
// Display the cart total when page loads
document.addEventListener('DOMContentLoaded', function() {
    const totalPrice = localStorage.getItem('cartTotal');
    const displayElement = document.getElementById('display-total');
    
    if (totalPrice) {
        displayElement.textContent = totalPrice;
    } else {
        displayElement.textContent = '0 EGP (No items)';
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
            if (charCode < 48 || charCode > 57) {
                return false;
            }
            return true;
        }
        
        function processPayment() {
            var name = document.getElementById("cardholder-name").value.trim();
            var number = document.getElementById("card-number").value.trim();
            var expiryMonth = document.getElementById("expiry-month").value.trim();
            var expiryYear = document.getElementById("expiry-year").value.trim();
            var cvv = document.getElementById("cvv").value.trim();
            var processingMessage = document.getElementById("processing-message");
            var successMessage = document.getElementById("success-message");

            if (name === "" || number === "" || expiryMonth === "" || expiryYear === "" || cvv === "") {
                alert("Please fill in all the required fields.");
                return;
            }
            
            processingMessage.style.display = "block";
            successMessage.style.display = "none";

            setTimeout(() => {
                processingMessage.style.display = "none";
                successMessage.style.display = "block";
            }, 2000);
        }
  