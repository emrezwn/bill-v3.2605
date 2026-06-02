// orgNameFormatter.js

/**
 * Formats a business name by lowercasing all letters and capitalizing the first letter of each word.
 * @param {string} name - The business name to format.
 * @return {string} The formatted business name.
 */
function formatBusinessName(name) {
  // First, lowercase the entire string
  let formattedName = name.toLowerCase();
  
  // Then, capitalize the first letter of each word
  formattedName = formattedName.replace(/\b\w/g, function(letter) {
      return letter.toUpperCase();
  });
  
  return formattedName;
}

/**
* Finds all elements with class "org-name" and formats their text content.
*/
function formatOrgNames() {
  // Select all elements with class "org-name"
  const orgNameElements = document.querySelectorAll('.org-name');

  // Iterate over each element and format its text content
  orgNameElements.forEach(element => {
      const originalName = element.textContent;
      const formattedName = formatBusinessName(originalName);
      element.textContent = formattedName;
  });
}

// Run the formatting function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', formatOrgNames);

// Export the functions for potential use in other scripts
export { formatBusinessName, formatOrgNames };