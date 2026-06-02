# Prototype

### Prerequisites
Before you begin, ensure you have met the following requirements:
- You have installed the latest version of [Node.js and npm](https://nodejs.org/)

### How to run the project
1. npm i
2. npm run dev



# Handover

### Overview
This guide covers the handover of the bill pages for our bill prototype. The frontend is developed using HTML, CSS (compiled from SCSS), and JavaScript. The pages are responsive and include simulated functionality for processing payments and validating card inputs.

### File structure
Refer to root.txt

### Key areas for backend integration
1. Payment Processing
Current Implementation: The simulateProcessing() function in card-payment-handler.js simulates a payment process.
Backend: Replace this with actual payment gateway integration. Ensure secure handling of payment data and proper error handling.

2. Card Validation
Current Implementation: Client-side validation in card-validation.js.
Backend: Implement server-side validation for all card inputs. The frontend validation should be considered a UX feature, not a security measure.

3. Form Submissions
Current Implementation: Forms are handled client-side without actual submission.
Backend: Set up endpoints to handle form submissions, implement CSRF protection, and process the data securely.

### Notes on Frontend assets
1. CSS and SCSS
The project uses SCSS, which is compiled to CSS.
Backend: You don't need to handle SCSS compilation. Use the compiled CSS files in your backend.

2. JavaScript
Review all JS files to understand the current client-side logic.
Backend: Some client-side logic may need to be replicated or enhanced server-side for security and functionality.



# Javascript for FPX

### Overview
This document explains the functionality and interaction between select.js and accountType.js, two key components in our fintech SaaS prototype's payment selection interface.

### File Purposes

select.js
- Creates custom select dropdowns for enhanced UI/UX
- Manages global bank configuration data
- Provides utility functions for bank information

accountType.js
- Manages interaction between account type and bank selections
- Filters bank options based on selected account type


### Key Functionalities

select.js
1. Custom Dropdown Creation
- Replaces standard HTML selects with styled custom dropdowns
- Handles dropdown open/close and option selection

2. Bank Data Management
- Initializes and maintains window.bankConfig object
- Stores information about banks, their statuses, and types (B2C/B2B)

3. Utility Functions
- getBankInfo(bankCode): Retrieves information for a specific bank
- getBankStatus(bankCode): Gets the current status of a bank
- getOnlineBanks(accountType): Lists all online banks for a given account type

accountType.js
1. Dynamic Bank Filtering
- Updates available bank options when account type changes
- Ensures only relevant banks are displayed (B2C or B2B)

2. UI Updates
- Refreshes the custom select UI to reflect current selections
- Updates the visual representation of the selected bank


### Bank Online/Offline Functionality

The system dynamically manages bank availability using 'online' and 'offline' statuses. This feature is crucial for providing real-time information to users about which banks are currently available for transactions.

### How it works:

1. Status Storage:
- Each bank's status is stored in the window.bankConfig.fpx.banks object.
- Status can be either 'online' or 'offline'.

2. Status Representation:
- In the HTML structure, each bank option includes a data attribute for its status.
- This allows for easy access and manipulation of the status information.

3. Visual Indication:
- Online banks are fully selectable in the dropdown.
- Offline banks are visually distinct (e.g., grayed out) and non-selectable.

4. Dynamic Updating:
- The updateBankOptions function in accountType.js filters banks based on both account type and online status.
- Only online banks matching the selected account type are displayed as active options.

5. User Interaction:
- Users can only select online banks for their transactions.
- Offline banks are visible but cannot be chosen, providing transparency about current availability.

6. Status Checking:
- The getBankStatus function in select.js allows for real-time status checks:
- This allows for up-to-date information to be accessed at any point in the user's journey.

7. Filtering Online Banks:
- The getOnlineBanks function returns only the banks that are currently online for a given account type:
- This is useful for populating dropdowns or providing lists of available banks.


### Interaction Flow

1. User selects an account type (personal/business)
2. accountType.js filters the bank list
3. select.js updates the custom bank dropdown
4. User selects a bank
5. select.js updates both the original and custom select elements
6. Selected data is ready for use in the payment process


### Backend Integration
When integrating with your backend systems:
1. Ensure your API can handle the account type and bank selection data
2. Implement server-side validation to verify valid account type and bank combinations
3. Use the selection data to route payments to the appropriate processing systems
4. Implement a mechanism to update bank statuses in real-time


### Troubleshooting
If you encounter issues with bank selection, filtering, or status:

1. Check the browser console for any JavaScript errors
2. Verify that window.bankConfig is properly initialized and updated
3. Ensure that all banks have the correct data-type and data-status attributes in the HTML
4. Test the getBankStatus and getOnlineBanks functions to confirm they're returning expected results


### Next steps
Review this document thoroughly and ask any questions you may have.