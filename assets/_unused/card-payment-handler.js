// card-payment-handler.js

document.addEventListener('DOMContentLoaded', function() {
    const cardholderNameInput = document.getElementById('cardholderName');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvcInput = document.getElementById('cvc');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const payButton = document.querySelector('.btn-pay');

    function updatePaymentButton() {
        const isCardholderNameValid = cardholderNameInput.value.trim() !== '';
        const isCardNumberValid = cardNumberInput.value.replace(/\s/g, '').length >= 13;
        const isExpiryValid = /^\d{2}\/\d{2}$/.test(expiryDateInput.value);
        const isCvcValid = /^\d{3}$/.test(cvcInput.value);
        const isTermsAccepted = termsCheckbox.checked;

        const isFormValid = isCardholderNameValid && isCardNumberValid && isExpiryValid && isCvcValid && isTermsAccepted;

        payButton.disabled = !isFormValid;
    }

    function simulateProcessing() {
        const payButton = document.querySelector('.btn-pay');
        const btnText = payButton.querySelector('.btn-text');
        const lockIcon = payButton.querySelector('.lock-icon');
        const processingIcon = payButton.querySelector('.processing-icon');
        
        payButton.classList.add('processing');
        payButton.disabled = true;
        btnText.textContent = "Processing..."; // Change button text
        
        lockIcon.style.opacity = '0';
        lockIcon.style.transform = 'scale(0)';
        
        setTimeout(() => {
            processingIcon.style.display = 'inline';
            processingIcon.style.animation = 'fadeInScaleOut 0.3s ease-in-out forwards, spin 1s linear infinite 0.3s';
        }, 300);
        
        setTimeout(() => {
            payButton.classList.remove('processing');
            processingIcon.style.animation = 'none';
            processingIcon.style.display = 'none';
            lockIcon.style.opacity = '1';
            lockIcon.style.transform = 'scale(1)';
            payButton.disabled = false;
            btnText.textContent = "Proceed to pay"; // Reset button text
    
            // Redirect to receipt.html
            window.location.href = 'receipt.html';
        }, 3000);
    }

    // Add event listeners for all inputs
    [cardholderNameInput, cardNumberInput, expiryDateInput, cvcInput, termsCheckbox].forEach(input => {
        input.addEventListener('input', updatePaymentButton);
    });

    // Add click event listener to the pay button
    payButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (!this.disabled) {
            simulateProcessing();
        }
    });

    // Initial button state update
    updatePaymentButton();
});