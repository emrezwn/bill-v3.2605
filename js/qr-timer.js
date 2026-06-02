// qr-timer.js

document.addEventListener('DOMContentLoaded', function() {
    const timerElement = document.querySelector('.qr-timer');
    const qrCodeElement = document.querySelector('.qr-code');
    const qrMessageElement = document.querySelector('.qr-message');
    let timerInterval;

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function interpolateColor(startColor, endColor, factor) {
        const r = Math.round(startColor[0] + factor * (endColor[0] - startColor[0]));
        const g = Math.round(startColor[1] + factor * (endColor[1] - startColor[1]));
        const b = Math.round(startColor[2] + factor * (endColor[2] - startColor[2]));
        return `rgb(${r}, ${g}, ${b})`;
    }

    function startCountdown() {
        if (!timerElement || !qrCodeElement || !qrMessageElement) return;

        // Clear any existing interval
        clearInterval(timerInterval);

        let timeLeft = 5 * 60; // 5 minutes in seconds
        const textStartColor = [10, 10, 10]; // Black for text
        const endColor = [220, 20, 60]; // Crimson (#E8627D)

        // Set the initial message
        qrMessageElement.textContent = 'Please do not refresh this page.';
        qrMessageElement.style.color = ''; // Reset to default color

        function updateTimer() {
            timerElement.textContent = formatTime(timeLeft);

            if (timeLeft <= 60) { // Start text color transition at 1 minute
                const factor = 1 - (timeLeft / 60);
                const interpolatedTextColor = interpolateColor(textStartColor, endColor, factor);
                timerElement.style.color = interpolatedTextColor;
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerElement.textContent = "00:00";
                timerElement.style.color = '#ff8c8c';
                timerElement.style.borderColor = '#ff8c8c';

                // Change the message and its color
                qrMessageElement.textContent = 'QR code has expired. Please refresh.';
                qrMessageElement.style.color = '#ff8c8c';

                qrCodeElement.style.opacity = '1';
            } else {
                timeLeft--;
            }
        }

        // Initial call to set the timer immediately
        updateTimer();

        // Set interval to update every second
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Start the countdown immediately
    startCountdown();

    // Optional: Restart countdown on custom event (if needed)
    document.addEventListener('restartQRTimer', startCountdown);
});