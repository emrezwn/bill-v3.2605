document.addEventListener("DOMContentLoaded", function () {
  const paymentOptions = document.querySelectorAll(".payment-methods-option");
  const payButton = document.querySelector(".btn-pay");
  let selectedOption = null;
  let selectedSubOption = null;

  function closeAllAccordions() {
    paymentOptions.forEach((option) => {
      const content = option.querySelector(".payment-method-content");
      const btn = option.querySelector(".payment-methods-btn");
      if (content) {
        content.classList.remove("active");
        content.style.pointerEvents = "none";
        content
          .querySelectorAll("*")
          .forEach((el) => (el.style.pointerEvents = "none"));
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

    closeAllCustomSelects();
  }

  function closeAllCustomSelects() {
    if (typeof window.closeAllCustomSelects === "function") {
      window.closeAllCustomSelects();
    }
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
      if (paymentMethod === "wallet" || paymentMethod === "bnpl" || paymentMethod === "fpx" || paymentMethod === "duitnow" || paymentMethod === "card" || paymentMethod === "duitnowqr") {
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
    btn.style.color = isSelected ? "#0F50FF" : "";
    const icon = btn.querySelector(".icon");
    if (icon) {
      icon.style.color = isSelected ? "#0F50FF" : "";
    }

  }

  function updateSubOptionState(label, isSelected) {
    label.style.color = isSelected ? "#0F50FF" : "";
  }

  function updateCheckMark(label, isSelected) {
    label.style.boxShadow = isSelected ? "inset 0 0 0 2px #0F50FF" : "";
    label.style.borderColor = isSelected ? "#0F50FF" : "";
  }

  function simulateProcessing() {
    if (!payButton) {
      return;
    }

    const btnText = payButton.querySelector(".btn-text");
    const lockIcon = payButton.querySelector(".lock-icon");
    const processingIcon = payButton.querySelector(".processing-icon");

    payButton.classList.add("processing");
    payButton.disabled = true;
    btnText.textContent = "Processing...";

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
      btnText.textContent = "Continue to payment page";

      let redirectUrl = "receipt.html";

      if (selectedOption) {
        const paymentMethod = selectedOption.querySelector(
          'input[type="radio"]'
        ).value;
        if (paymentMethod === "card") {
          redirectUrl = "bill-card.html";
        } else if (paymentMethod === "qr") {
          redirectUrl = "bill-qr.html";
        } else if (paymentMethod === "duitnowqr" && selectedSubOption && selectedSubOption.value === "duitnowqr") {
          redirectUrl = "bill-qr.html";
        }
      }

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
      closeAllCustomSelects();
      resetAllOptions();

      if (selectedOption !== option) {
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;
        if (content) {
          content.classList.add("active");
          content.style.pointerEvents = "auto";
          content
            .querySelectorAll("*")
            .forEach((el) => (el.style.pointerEvents = "auto"));
          void content.offsetWidth;
        }
        selectedOption = option;
        selectedSubOption = null;
      } else {
        selectedOption = null;
        selectedSubOption = null;
        if (content) {
          content.classList.remove("active");
          content.style.pointerEvents = "none";
          content
            .querySelectorAll("*")
            .forEach((el) => (el.style.pointerEvents = "none"));
        }
      }

      updateButtonState(btn, selectedOption === option);
      updatePayButton();
    });

    if (radio.value === "wallet" || radio.value === "bnpl" || radio.value === "fpx" || radio.value === "duitnow" || radio.value === "card" || radio.value === "duitnowqr") {
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
