document.addEventListener('DOMContentLoaded', function() {
    const cardholderNameInput = document.getElementById('cardholderName');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvcInput = document.getElementById('cvc');
    const visaLogo = document.querySelector('.card-logo.visa');
    const mastercardLogo = document.querySelector('.card-logo.mastercard');
    const amexLogo = document.querySelector('.card-logo.amex');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const payButton = document.querySelector('.btn-pay');

    const cardPatterns = {
        visa: { regex: /^4/, length: [13, 16], name: "Visa" },
        mastercard: { regex: /^5[1-5]/, length: [16], name: "Mastercard" },
        amex: { regex: /^3[47]/, length: [15], name: "American Express" }
    };

    let cardholderNameError = false;
    let cardNumberError = false;
    let expiryDateError = false;
    let cvcError = false;
    let cardType = null;

    // Create processing overlay
    const processingOverlay = document.createElement('div');
    processingOverlay.className = 'processing-overlay';
    document.body.appendChild(processingOverlay);

    function detectCardType(number) {
        for (let card in cardPatterns) {
            if (cardPatterns[card].regex.test(number)) {
                return card;
            }
        }
        return null;
    }

    function validateCard(number, type) {
        if (!type) return false;
        return cardPatterns[type].length.includes(number.length);
    }

    function showError(input) {
        input.style.boxShadow = 'inset 0 0 0 1px #E8627D';
    }

    function clearError(input) {
        input.style.boxShadow = '';
    }

    function showAllLogos() {
        [visaLogo, mastercardLogo, amexLogo].forEach(logo => {
            if (logo) {
                logo.style.display = 'inline-block';
                logo.style.opacity = '1';
            }
        });
    }

    function hideAllLogos() {
        [visaLogo, mastercardLogo, amexLogo].forEach(logo => {
            if (logo) {
                logo.style.display = 'none';
                logo.style.opacity = '0';
            }
        });
    }

    function showLogo(type) {
        hideAllLogos();
        const logo = document.querySelector(`.card-logo.${type}`);
        if (logo) {
            logo.style.display = 'inline-block';
            logo.style.opacity = '1';
        }
    }

    function updateErrorDisplay() {
        const cardholderNameErrorDiv = document.getElementById('cardholderNameError');
        const cardDetailsErrorDiv = document.getElementById('cardDetailsError');

        // Update cardholder name error
        if (cardholderNameError) {
            cardholderNameErrorDiv.textContent = 'Cardholder name should not contain numbers';
            showError(cardholderNameInput);
        } else {
            cardholderNameErrorDiv.textContent = '';
            clearError(cardholderNameInput);
        }

        // Compile card details errors
        let invalidFields = [];
        if (cardNumberError) {
            invalidFields.push('card number');
            showError(cardNumberInput);
        } else {
            clearError(cardNumberInput);
        }
        if (expiryDateError) {
            invalidFields.push('expiry date');
            showError(expiryDateInput);
        } else {
            clearError(expiryDateInput);
        }
        if (cvcError) {
            invalidFields.push('CVC');
            showError(cvcInput);
        } else {
            clearError(cvcInput);
        }

        // Display card details errors
        if (invalidFields.length > 0) {
            let errorMessage = 'Invalid: ';
            if (cardType) {
                errorMessage += cardPatterns[cardType].name + ' ';
            }
            errorMessage += invalidFields.join(', ');
            cardDetailsErrorDiv.textContent = errorMessage;
        } else {
            cardDetailsErrorDiv.textContent = '';
        }
    }

    function validateForm() {
        const isCardholderNameValid = cardholderNameInput.value.trim() !== '' && !cardholderNameError;
        const isCardNumberValid = cardNumberInput.value.replace(/\s/g, '').length >= 13 && !cardNumberError;
        const isExpiryValid = /^\d{2}\/\d{2}$/.test(expiryDateInput.value) && !expiryDateError;
        const isCvcValid = /^\d{3}$/.test(cvcInput.value) && !cvcError;
        const isTermsAccepted = termsCheckbox.checked;

        const isFormValid = isCardholderNameValid && isCardNumberValid && isExpiryValid && isCvcValid && isTermsAccepted;

        payButton.disabled = !isFormValid;

        if (isFormValid) {
            payButton.classList.add('valid');
        } else {
            payButton.classList.remove('valid');
        }
    }

    cardholderNameInput.addEventListener('input', function(e) {
        // Remove any numbers from the input
        this.value = this.value.replace(/[0-9]/g, '');
        
        // Check if the input contains any numbers
        if (/\d/.test(e.data)) {
            cardholderNameError = true;
            showError(cardholderNameInput);
        } else {
            cardholderNameError = this.value.trim() === '';
            if (!cardholderNameError) {
                clearError(cardholderNameInput);
            }
        }
        
        updateErrorDisplay();
        validateForm();
    });

    cardholderNameInput.addEventListener('blur', function(e) {
        // Only set error if the field is not empty and contains numbers
        if (this.value.trim() !== '' && /\d/.test(this.value)) {
            cardholderNameError = true;
        } else {
            cardholderNameError = false;
            clearError(cardholderNameInput);
        }
        updateErrorDisplay();
        validateForm();
    });


    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) {
            value = value.slice(0, 16);
        }
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (cardType === 'amex') {
                if (i === 4 || i === 10) formattedValue += ' ';
            } else {
                if (i > 0 && i % 4 === 0) formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        e.target.value = formattedValue.trim();
    
        cardType = detectCardType(value);
        
        if (value.length === 0) {
            showAllLogos();
        } else {
            hideAllLogos();
            if (cardType) {
                showLogo(cardType);
            }
        }
    
        cardNumberError = false;
        clearError(cardNumberInput);
        updateErrorDisplay();
        validateForm();
    });

    cardNumberInput.addEventListener('blur', function(e) {
        const value = e.target.value.replace(/\s/g, '');
        cardType = detectCardType(value);
    
        if (value.length > 0) {
            if (!cardType) {
                cardNumberError = true;
            } else if (!validateCard(value, cardType)) {
                cardNumberError = true;
            } else {
                cardNumberError = false;
            }
        } else {
            cardNumberError = false;
            showAllLogos();
        }
    
        updateErrorDisplay();
        validateForm();
    });

    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.slice(0, 4);
        }
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;

        expiryDateError = false;
        clearError(expiryDateInput);
        updateErrorDisplay();
        validateForm();
    });

    expiryDateInput.addEventListener('blur', function(e) {
        const value = e.target.value;
        if (value.length === 5) {
            const [month, year] = value.split('/');
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;
            if (parseInt(month) < 1 || parseInt(month) > 12) {
                expiryDateError = true;
            } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                expiryDateError = true;
            } else {
                expiryDateError = false;
            }
        } else if (value.length > 0) {
            expiryDateError = true;
        } else {
            expiryDateError = false;
        }

        updateErrorDisplay();
        validateForm();
    });

    cvcInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, cardType === 'amex' ? 4 : 3);
        
        cvcError = false;
        clearError(cvcInput);
        updateErrorDisplay();
        validateForm();
    });

    cvcInput.addEventListener('blur', function(e) {
        const expectedLength = cardType === 'amex' ? 4 : 3;
        cvcError = e.target.value.length > 0 && e.target.value.length !== expectedLength;

        updateErrorDisplay();
        validateForm();
    });

    termsCheckbox.addEventListener('change', validateForm);

    payButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (this.classList.contains('valid') && !this.classList.contains('processing')) {
            this.classList.add('processing');
            
            // Activate the overlay
            processingOverlay.classList.add('active');
            document.body.classList.add('processing');
            
            const lockIcon = this.querySelector('.lock-icon');
            const processingIcon = this.querySelector('.processing-icon');
            
            // Fade out and scale in the lock icon
            lockIcon.style.opacity = '0';
            lockIcon.style.transform = 'scale(0)';
            
            // After a short delay, fade in and scale out the processing icon while rotating
            setTimeout(() => {
                processingIcon.style.display = 'inline';
                processingIcon.style.animation = 'fadeInScaleOut 0.3s ease-in-out forwards, spin 1s linear infinite 0.3s';
            }, 300);
            
            // Simulate processing time (9 seconds)
            setTimeout(() => {
                this.classList.remove('processing');
                
                // Stop animations
                processingIcon.style.animation = 'none';
                processingIcon.style.display = 'none';
                
                // Fade in and scale out the lock icon
                lockIcon.style.opacity = '1';
                lockIcon.style.transform = 'scale(1)';
                
                // Deactivate the overlay
                processingOverlay.classList.remove('active');
                document.body.classList.remove('processing');
                
                // Handle successful payment here
            }, 9000);
        }
    });

    // Initial setup
    showAllLogos();
    validateForm();
});