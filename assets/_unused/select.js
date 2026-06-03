// select.js

// Initialize the global bank configuration
window.bankConfig = {
  fpx: {
    accountTypes: ['b2c', 'b2b'],
    banks: {}
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const originalSelects = document.querySelectorAll(".form-input");
  let currentlyOpenSelect = null;

  function closeAllCustomSelects() {
    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(select => {
      select.classList.remove('open');
    });
    currentlyOpenSelect = null;
  }

  function populateBankConfig(select) {
    const options = select.querySelectorAll('option');
    options.forEach(option => {
      const [bankCode, status] = option.value.split(' ');
      const type = option.getAttribute('data-type');

      window.bankConfig.fpx.banks[bankCode] = {
        name: bankCode,
        status: status,
        type: type
      };
    });
    console.log('SELECT.JS: Bank configuration updated:', window.bankConfig);
  }

  originalSelects.forEach((originalSelect) => {
    if (!originalSelect || !originalSelect.options) {
      return;
    }

    // Populate bank config for FPX selects
    if (originalSelect.id.startsWith('bankType')) {
      populateBankConfig(originalSelect);
    }

    const customSelectWrapper = originalSelect.parentElement;
    const customSelect = document.createElement("div");
    customSelect.classList.add("custom-select");

    const customSelectTrigger = document.createElement("div");
    customSelectTrigger.classList.add("custom-select-trigger");
    customSelect.appendChild(customSelectTrigger);

    const customOptions = document.createElement("div");
    customOptions.classList.add("custom-options");

    Array.from(originalSelect.options).forEach((option, index) => {
      const customOption = document.createElement("span");
      customOption.classList.add("custom-option");
      option.classList.forEach(cls => customOption.classList.add(cls));
      
      const [bank, status] = option.value.split(' ');
      customOption.setAttribute("data-value", bank);
      customOption.setAttribute("data-status", status);

      const logoSrc = option.getAttribute('data-logo');
      if (logoSrc) {
        const imgElement = document.createElement('img');
        imgElement.src = logoSrc;
        imgElement.alt = option.textContent + " logo";
        imgElement.classList.add('logo');
        customOption.appendChild(imgElement);
      }

      customOption.appendChild(document.createTextNode(option.textContent));
      
      if (status === 'offline') {
        const statusSpan = document.createElement("span");
        statusSpan.classList.add("status");
        statusSpan.textContent = "OFFLINE";
        customOption.appendChild(statusSpan);
        customOption.classList.add('disabled');
      }

      if (index === originalSelect.selectedIndex) {
        customOption.classList.add('selected');
      }

      customOptions.appendChild(customOption);
    });

    function updateTrigger(selectedOption) {
      customSelectTrigger.innerHTML = '';
      const logoSrc = selectedOption.getAttribute('data-logo');
      if (logoSrc) {
        const triggerImage = document.createElement('img');
        triggerImage.src = logoSrc;
        triggerImage.alt = selectedOption.textContent + " logo";
        triggerImage.classList.add('logo');
        customSelectTrigger.appendChild(triggerImage);
      }
      customSelectTrigger.appendChild(document.createTextNode(selectedOption.textContent));
      
      const status = selectedOption.value.split(' ')[1];
      if (status === 'offline') {
        const statusSpan = document.createElement("span");
        statusSpan.classList.add("status");
        statusSpan.textContent = "OFFLINE";
        customSelectTrigger.appendChild(statusSpan);
      }
    }

    updateTrigger(originalSelect.options[originalSelect.selectedIndex]);

    customSelect.appendChild(customOptions);
    customSelectWrapper.appendChild(customSelect);

    customSelectTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentlyOpenSelect && currentlyOpenSelect !== customSelect) {
        currentlyOpenSelect.classList.remove("open");
      }
      customSelect.classList.toggle("open");
      currentlyOpenSelect = customSelect.classList.contains("open") ? customSelect : null;
    });

    customOptions.querySelectorAll(".custom-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        if (option.classList.contains('disabled')) {
          return;
        }
        const selectedValue = option.getAttribute("data-value");
        const selectedStatus = option.getAttribute("data-status");
        updateTrigger(originalSelect.querySelector(`option[value="${selectedValue} ${selectedStatus}"]`));
        customSelect.querySelector(".custom-option.selected")?.classList.remove("selected");
        option.classList.add("selected");
        originalSelect.value = `${selectedValue} ${selectedStatus}`;
        customSelect.classList.remove("open");
        currentlyOpenSelect = null;
        
        originalSelect.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest('.custom-select')) {
        closeAllCustomSelects();
      }
    });
  });

  window.closeAllCustomSelects = closeAllCustomSelects;

  window.updateCustomSelect = function(selectElement) {
    const customSelect = selectElement.nextElementSibling;
    const customSelectTrigger = customSelect.querySelector('.custom-select-trigger');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    
    customSelectTrigger.innerHTML = '';
    const logoSrc = selectedOption.getAttribute('data-logo');
    if (logoSrc) {
        const triggerImage = document.createElement('img');
        triggerImage.src = logoSrc;
        triggerImage.alt = selectedOption.textContent + " logo";
        triggerImage.classList.add('logo');
        customSelectTrigger.appendChild(triggerImage);
    }
    customSelectTrigger.appendChild(document.createTextNode(selectedOption.textContent));

    const customOptions = customSelect.querySelectorAll('.custom-option');
    customOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-value') === selectedOption.value) {
            option.classList.add('selected');
        }
    });
  };
});

// Utility functions for bank configuration
window.getBankInfo = function(bankCode) {
  console.log('SELECT.JS: getBankInfo called with bankCode:', bankCode);
    const bankInfo = window.bankConfig.fpx.banks[bankCode];
    console.log('SELECT.JS: Retrieved bank info:', JSON.stringify(bankInfo, null, 2));
    return bankInfo;
};

window.getBankStatus = function(bankCode) {
  const bank = window.bankConfig.fpx.banks[bankCode];
  return bank ? bank.status : null;
};

window.getOnlineBanks = function(accountType) {
  console.log('SELECT.JS: getOnlineBanks called with accountType:', accountType);
  console.log('SELECT.JS: Current bank config:', JSON.stringify(window.bankConfig.fpx, null, 2));
  
  const onlineBanks = Object.entries(window.bankConfig.fpx.banks)
      .filter(([_, bank]) => bank.status === 'online' && bank[accountType])
      .map(([code, bank]) => ({ code, ...bank }));
  
  console.log('SELECT.JS: Filtered online banks:', JSON.stringify(onlineBanks, null, 2));
  return onlineBanks;
};

console.log('SELECT.JS: Bank configuration initialized:', window.bankConfig);