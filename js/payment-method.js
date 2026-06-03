document.addEventListener("DOMContentLoaded", function () {
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim();
  const paymentOptions = document.querySelectorAll(".payment-methods-option");
  const payButton = document.querySelector(".btn-pay");
  const methodsWithSubOptions = ["wallet", "bnpl", "fpx", "duitnow", "card", "duitnowqr"];
  let selectedOption = null;
  let selectedSubOption = null;

  const processingOverlay = document.createElement("div");
  processingOverlay.className = "processing-overlay";
  document.body.appendChild(processingOverlay);

  function closeAllAccordions() {
    paymentOptions.forEach((option) => {
      const content = option.querySelector(".payment-method-content");
      const btn = option.querySelector(".payment-methods-btn");
      if (content) {
        content.classList.remove("active");
      }
      btn.classList.remove("active");
      btn.style.color = "";
      const icon = btn.querySelector(".icon");
      if (icon) {
        icon.style.color = "";
      }
      option.querySelector('input[type="radio"]').checked = false;
    });
    selectedOption = null;
    selectedSubOption = null;
    updatePayButton();

    document
      .querySelectorAll('.payment-option input[type="radio"]')
      .forEach((radio) => {
        radio.checked = false;
        updateSubOptionState(radio.closest(".payment-option"), false);
      });
  }

  document.addEventListener("click", function (event) {
    const isClickInsideAccordion = Array.from(paymentOptions).some((option) =>
      option.contains(event.target)
    );
    const isClickOnPayButton = event.target.closest(".btn-pay");
    if (!isClickInsideAccordion && !isClickOnPayButton) {
      closeAllAccordions();
    }
  });

  function resetAllOptions() {
    paymentOptions.forEach((option) => {
      const content = option.querySelector(".payment-method-content");
      if (content) {
        content.classList.remove("active");
      }
      const btn = option.querySelector(".payment-methods-btn");
      updateButtonState(btn, false);
      option.querySelector('input[type="radio"]').checked = false;
    });
    document
      .querySelectorAll('.payment-option input[type="radio"]')
      .forEach((radio) => {
        radio.checked = false;
        updateSubOptionState(radio.closest(".payment-option"), false);
      });
  }

  function updatePayButton() {
    if (selectedOption) {
      const paymentMethod = selectedOption.querySelector(
        'input[type="radio"]'
      ).value;
      if (methodsWithSubOptions.includes(paymentMethod)) {
        payButton.disabled = !selectedSubOption;
      } else {
        payButton.disabled = false;
      }
    } else {
      payButton.disabled = true;
    }
  }

  function updateButtonState(btn, isSelected) {
    btn.classList.toggle("active", isSelected);
    btn.style.color = isSelected ? primaryColor : "";
    const icon = btn.querySelector(".icon");
    if (icon) {
      icon.style.color = isSelected ? primaryColor : "";
    }
  }

  function updateSubOptionState(label, isSelected) {
    label.style.color = isSelected ? primaryColor : "";
  }

  function getRedirectUrl() {
    if (!selectedOption) return "receipt.html";

    const paymentMethod = selectedOption.querySelector('input[type="radio"]').value;
    if (paymentMethod === "card") return "bill-card.html";
    if (paymentMethod === "qr") return "bill-qr.html";
    if (paymentMethod === "duitnowqr" && selectedSubOption && selectedSubOption.value === "duitnowqr") return "bill-qr.html";
    return "receipt.html";
  }

  function simulateProcessing() {
    if (!payButton) return;

    const redirectUrl = getRedirectUrl();
    const btnText = payButton.querySelector(".btn-text");
    const lockIcon = payButton.querySelector(".lock-icon");
    const processingIcon = payButton.querySelector(".processing-icon");

    payButton.classList.add("processing");
    payButton.disabled = true;
    btnText.textContent = "Processing...";
    processingOverlay.classList.add("active");

    lockIcon.style.opacity = "0";
    lockIcon.style.transform = "scale(0)";

    setTimeout(() => {
      processingIcon.style.display = "inline";
      processingIcon.style.animation =
        "fadeInScaleOut 0.3s ease-in-out forwards, spin 1s linear infinite 0.3s";
    }, 300);

    setTimeout(() => {
      payButton.classList.remove("processing");
      processingIcon.style.animation = "none";
      processingIcon.style.display = "none";
      lockIcon.style.opacity = "1";
      lockIcon.style.transform = "scale(1)";
      payButton.disabled = false;
      btnText.textContent = "Continue to the payment page";
      processingOverlay.classList.remove("active");

      window.location.href = redirectUrl;
    }, 3000);
  }

  paymentOptions.forEach((option) => {
    const radio = option.querySelector('input[type="radio"]');
    const content = option.querySelector(".payment-method-content");
    const btn = option.querySelector(".payment-methods-btn");

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      resetAllOptions();

      if (selectedOption !== option) {
        radio.checked = true;
        if (content) {
          content.classList.add("active");
        }
        selectedOption = option;
        selectedSubOption = null;
      } else {
        selectedOption = null;
        selectedSubOption = null;
        if (content) {
          content.classList.remove("active");
        }
      }

      updateButtonState(btn, selectedOption === option);
      updatePayButton();
    });

    if (methodsWithSubOptions.includes(radio.value)) {
      const subOptions = option.querySelectorAll(
        '.payment-option input[type="radio"]'
      );
      subOptions.forEach((subRadio) => {
        subRadio.addEventListener("change", function () {
          selectedSubOption = this;
          subOptions.forEach((sr) => {
            updateSubOptionState(sr.closest(".payment-option"), sr === this);
          });
          updatePayButton();
        });
      });
    }
  });

  if (payButton) {
    payButton.addEventListener("click", function () {
      if (!this.disabled) {
        simulateProcessing();
      }
    });
  }

  closeAllAccordions();
  resetAllOptions();
  updatePayButton();
});
