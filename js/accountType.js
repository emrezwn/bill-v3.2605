document.addEventListener("DOMContentLoaded", function () {
  var tabGroups = document.querySelectorAll(".account-type-tabs");

  tabGroups.forEach(function (tabGroup) {
    var container = tabGroup.closest(".payment-form") || tabGroup.parentElement;
    var tabs = tabGroup.querySelectorAll(".account-type-tab");
    var bankOptions = container.querySelectorAll(".bank-option");
    var bankList = container.querySelector(".bank-list");

    function filterBanks(type) {
      bankOptions.forEach(function (option) {
        var radio = option.querySelector('input[type="radio"]');
        if (option.getAttribute("data-type") === type) {
          option.style.display = "";
        } else {
          option.style.display = "none";
        }
        if (radio) radio.checked = false;
        option.style.color = "";
      });
      if (bankList) bankList.scrollTop = 0;
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        filterBanks(tab.getAttribute("data-type"));
      });
    });

    var activeTab = tabGroup.querySelector(".account-type-tab.active");
    if (activeTab) filterBanks(activeTab.getAttribute("data-type"));
  });
});
