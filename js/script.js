(function () {
  var button = document.querySelector(".btn-details");
  var buttonR = document.querySelector(".btn-details-r");
  var content = document.querySelector(".content-details");
  var icon = button ? button.querySelector(".icon") : null;
  var iconR = buttonR ? buttonR.querySelector(".icon") : null;

  // Feature detection
  var supportsTransitions = (function () {
    var b = document.body || document.documentElement;
    var s = b.style;
    return (
      typeof s.transition !== "undefined" ||
      typeof s.WebkitTransition !== "undefined"
    );
  })();

  // Apply a class to the body based on transition support
  document.body.classList.toggle("no-transitions", !supportsTransitions);

  // Function to toggle the content visibility
  function toggleContent(e) {
    e.preventDefault();
    e.stopPropagation();

    var expanded = content.classList.contains("expanded");
    var isDesktop = window.matchMedia("(min-width: 921px)").matches;

    if (supportsTransitions) {
      content.style.overflow = "hidden";
      if (expanded) {
        var currentHeight = content.scrollHeight;
        content.style.maxHeight = currentHeight + "px";

        // Force a reflow
        content.offsetHeight;

        content.style.maxHeight = "0";

      } else {
        content.style.maxHeight = content.scrollHeight + "px";

      }

      if (icon) {
        icon.style.transform = expanded ? "rotate(0deg)" : "rotate(180deg)";
        icon.style.webkitTransform = expanded
          ? "rotate(0deg)"
          : "rotate(180deg)";
      }
      if (iconR) {
        iconR.style.transform = expanded ? "rotate(0deg)" : "rotate(180deg)";
        iconR.style.webkitTransform = expanded
          ? "rotate(0deg)"
          : "rotate(180deg)";
      }
    } else {
      // Fallback for browsers without transition support
      content.style.display = expanded ? "none" : "block";
      if (icon) icon.style.display = expanded ? "inline" : "none";
      if (iconR) iconR.style.display = expanded ? "inline" : "none";

    }

    content.classList.toggle("expanded");
    if (button) button.setAttribute("aria-expanded", !expanded);
    if (buttonR) buttonR.setAttribute("aria-expanded", !expanded);
  }

  var buttonR = document.querySelector(".btn-details-r");
  if (buttonR) buttonR.addEventListener("click", toggleContent);

  // Add click event listener to the buttons
  if (button) button.addEventListener("click", toggleContent);
  if (buttonR) buttonR.addEventListener("click", toggleContent);

  // Function to set initial state based on viewport size
  function setInitialState() {
    var isMobile = window.innerWidth <= 920; // Match your CSS media query
    var isReceiptPage = !!buttonR; // Check if we're on the receipt page

    if (isReceiptPage) {
      // For receipt.html, always start with content hidden
      content.classList.remove("expanded");
      content.style.maxHeight = "0";
      content.style.overflow = "hidden";
      if (buttonR) buttonR.setAttribute("aria-expanded", "false");
    } else {
      // For other pages, maintain the original behavior
      content.classList.toggle("expanded", !isMobile);
      if (button) {
        button.setAttribute("aria-expanded", !isMobile);
      }
    }

    // Set initial maxHeight for transitions
    if (supportsTransitions && !isReceiptPage && !isMobile) {
      content.style.maxHeight = "none";
    } else if (supportsTransitions && (isReceiptPage || isMobile)) {
      content.style.maxHeight = "0";
      content.style.overflow = "hidden";
    }

    // Fallback for browsers without transition support
    if (!supportsTransitions && (isReceiptPage || isMobile)) {
      content.style.display = "none";
    }
  }

  // Function to handle responsive layout changes
  function handleResponsiveChanges() {
  }

  // Set initial state and listen for window resizes
  setInitialState();
  window.addEventListener("resize", handleResponsiveChanges);

  // Listen for transitionend to remove inline styles
  content.addEventListener("transitionend", function () {
    if (content.style.maxHeight === "0px") {
      content.style.maxHeight = "";
      content.style.overflow = "";
    } else if (content.classList.contains("expanded")) {
      content.style.maxHeight = "none"; // Allow content to expand naturally
      content.style.overflow = "";
    }
  });
})();