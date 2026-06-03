document.addEventListener('DOMContentLoaded', function() {
    const sectionContentA = document.querySelector('.section-a .section-content-a');
    const sectionContentB = document.querySelector('.section-b .section-content-b');

    function matchHeight() {
        if (window.innerWidth > 920) { // Desktop view
            // Get the natural heights of both sections
            sectionContentA.style.height = 'auto';
            sectionContentB.style.height = 'auto';
            
            const heightA = sectionContentA.offsetHeight;
            const heightB = sectionContentB.offsetHeight;

            // Set both sections to the height of the taller section
            const maxHeight = Math.max(heightA, heightB);
            sectionContentA.style.height = `${maxHeight}px`;
            sectionContentB.style.height = `${maxHeight}px`;
        } else {
            // Reset heights on mobile
            sectionContentA.style.height = '';
            sectionContentB.style.height = '';
        }
    }

    // Initial height match
    matchHeight();

    // Match height on window resize
    window.addEventListener('resize', matchHeight);

    // If you have dynamic content that might change the height, call matchHeight() after those changes
    // For example, if you have an expand/collapse functionality:
    document.querySelector('.btn-details').addEventListener('click', function() {
        setTimeout(matchHeight, 300); // Allow time for any transitions to complete
    });
});