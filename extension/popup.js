/**
 * LinkedIn Assistant Popup Script
 * Handles button interactions and messaging to content script
 */

// Log when script loads
console.log('Popup script loaded');

/**
 * Initialize popup functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');

    // Get button elements
    const commentButton = document.getElementById('triggerComment');
    const messageButton = document.getElementById('triggerMessage');

    /**
     * Handle Comment Button
     */
    if (commentButton) {
        commentButton.addEventListener('click', function() {
            console.log('Comment button clicked');
            
            // Send message to content script
            chrome.tabs.query(
                { active: true, currentWindow: true }, 
                function(tabs) {
                    chrome.tabs.sendMessage(
                        tabs[0].id, 
                        { action: "showCommentBox" }
                    );
                }
            );

            // Close popup after action
            window.close();
        });
    }

    /**
     * Handle Message Button
     */
    if (messageButton) {
        messageButton.addEventListener('click', function() {
            console.log('Message button clicked');
            
            // Send message to content script
            chrome.tabs.query(
                { active: true, currentWindow: true }, 
                function(tabs) {
                    chrome.tabs.sendMessage(
                        tabs[0].id, 
                        { action: "generateMessage" }
                    );
                }
            );

            // Close popup after action
            window.close();
        });
    }

    /**
     * Add hover effects
     */
    [commentButton, messageButton].forEach(button => {
        if (button) {
            button.addEventListener('mouseover', function() {
                this.style.transform = 'translateY(-1px)';
            });
            
            button.addEventListener('mouseout', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
});