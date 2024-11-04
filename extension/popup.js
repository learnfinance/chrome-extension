// Add console log to check if script is loading
console.log('Popup script loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Add console log to verify event listener is working
    console.log('DOM Content Loaded');

    // Get buttons
    const commentButton = document.getElementById('triggerComment');
    const messageButton = document.getElementById('triggerMessage');

    // Add click handlers
    if (commentButton) {
        commentButton.addEventListener('click', function() {
            console.log('Comment button clicked');
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "showCommentBox"});
            });
        });
    }

    if (messageButton) {
        messageButton.addEventListener('click', function() {
            console.log('Message button clicked');
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "generateMessage"});
            });
        });
    }
});