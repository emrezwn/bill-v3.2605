(function () {
  var button = document.querySelector(".btn-details");
  var buttonR = document.querySelector(".btn-details-r");
  var content = document.querySelector(".content-details");

  if (!content) return;

  var icon = button ? button.querySelector(".icon") : null;
  var iconR = buttonR ? buttonR.querySelector(".icon") : null;
  var isAnimating = false;

  function toggleContent(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isAnimating) return;
    isAnimating = true;

    var expanded = content.classList.contains("expanded");

    content.style.overflow = "hidden";
    if (expanded) {
      content.style.maxHeight = content.scrollHeight + "px";
      content.offsetHeight;
      content.style.maxHeight = "0";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }

    if (icon) {
      icon.style.transform = expanded ? "rotate(0deg)" : "rotate(180deg)";
    }
    if (iconR) {
      iconR.style.transform = expanded ? "rotate(0deg)" : "rotate(180deg)";
    }

    content.classList.toggle("expanded");
    if (button) button.setAttribute("aria-expanded", String(!expanded));
    if (buttonR) buttonR.setAttribute("aria-expanded", String(!expanded));
  }

  if (button) button.addEventListener("click", toggleContent);
  if (buttonR) buttonR.addEventListener("click", toggleContent);

  function setInitialState() {
    var isMobile = window.innerWidth <= 920;
    var isReceiptPage = !!buttonR;

    if (isReceiptPage) {
      content.classList.remove("expanded");
      content.style.maxHeight = "0";
      content.style.overflow = "hidden";
      if (buttonR) buttonR.setAttribute("aria-expanded", "false");
    } else {
      content.classList.toggle("expanded", !isMobile);
      if (button) {
        button.setAttribute("aria-expanded", String(!isMobile));
      }
      if (!isMobile) {
        content.style.maxHeight = "none";
      } else {
        content.style.maxHeight = "0";
        content.style.overflow = "hidden";
      }
    }
  }

  setInitialState();

  content.addEventListener("transitionend", function (e) {
    if (e.propertyName !== "max-height") return;
    isAnimating = false;

    if (content.style.maxHeight === "0px") {
      content.style.maxHeight = "";
      content.style.overflow = "";
    } else if (content.classList.contains("expanded")) {
      content.style.maxHeight = "none";
      content.style.overflow = "";
    }
  });
})();