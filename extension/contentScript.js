// PART 1: Initialization and Setup
console.log('LinkedIn Assistant Extension Loaded');

// Webhook URLs
const commentWebhookURL = 'https://hook.eu2.make.com/37ezdlfgwt282g8lbz6mcm4mpa3uzvnv';
const messageWebhookURL = 'https://hook.eu2.make.com/w82i1h07i07vj6zhi69ux2yb4kl0q5s5';

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "generateMessage") {
        const name = document.querySelector('#thread-detail-jump-target')?.innerText.trim();
        if (name) {
            showMessageGenerator(name);
        } else {
            alert('Could not find user name. Please ensure you are in a conversation.');
        }
    } else if (request.action === "showCommentBox") {
        showQuotationBox();
    }
});

// Function to create both buttons
function createButtons() {
    // Create comment button
    const commentButton = document.createElement('button');
    commentButton.id = 'quotation-button';
    commentButton.innerHTML = '💬 Add Comment';
    commentButton.style.position = 'fixed';
    commentButton.style.top = '10px';
    commentButton.style.right = '130px';
    commentButton.style.backgroundColor = '#0073b1';
    commentButton.style.color = '#fff';
    commentButton.style.border = 'none';
    commentButton.style.borderRadius = '5px';
    commentButton.style.padding = '10px';
    commentButton.style.cursor = 'pointer';
    commentButton.style.fontSize = '14px';
    commentButton.style.zIndex = '10000';
    commentButton.style.fontFamily = "'Avenir', sans-serif";

    // Create message button
    const messageButton = document.createElement('button');
    messageButton.id = 'message-button';
    messageButton.innerHTML = '✉️ Generate Message';
    messageButton.style.position = 'fixed';
    messageButton.style.top = '10px';
    messageButton.style.right = '10px';
    messageButton.style.backgroundColor = '#0073b1';
    messageButton.style.color = '#fff';
    messageButton.style.border = 'none';
    messageButton.style.borderRadius = '5px';
    messageButton.style.padding = '10px';
    messageButton.style.cursor = 'pointer';
    messageButton.style.fontSize = '14px';
    messageButton.style.zIndex = '10000';
    messageButton.style.fontFamily = "'Avenir', sans-serif";

    // Add event listeners
    commentButton.addEventListener('click', () => {
        console.log('Comment button clicked');
        showQuotationBox();
    });

    messageButton.addEventListener('click', async () => {
        console.log('Message button clicked');
        const name = document.querySelector('#thread-detail-jump-target')?.innerText.trim();
        if (name) {
            showMessageGenerator(name);
        } else {
            alert('Could not find user name. Please ensure you are in a conversation.');
        }
    });

    // Add buttons to page
    document.body.appendChild(commentButton);
    document.body.appendChild(messageButton);
}
// PART 2: Main Functions
// Function to show the floating comment selection box
function showQuotationBox() {
    console.log('Showing the Quotation Box');

    // Remove any existing box
    if (document.getElementById("quotationBox")) {
        document.getElementById("quotationBox").remove();
    }

    // Create the floating box
    let quotationBox = document.createElement("div");
    quotationBox.id = "quotationBox";
    quotationBox.style.position = "fixed";
    quotationBox.style.top = "20%";
    quotationBox.style.right = "5%";
    quotationBox.style.width = "320px";
    quotationBox.style.padding = "0"; // Remove padding to ensure the gradient covers the full top
    quotationBox.style.background = "#ffffff";
    quotationBox.style.borderRadius = "15px";
    quotationBox.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
    quotationBox.style.zIndex = "10000";
    quotationBox.style.color = "#333";
    quotationBox.style.display = "flex";
    quotationBox.style.flexDirection = "column";
    quotationBox.style.alignItems = "center";
    quotationBox.style.maxHeight = "600px";
    quotationBox.style.overflowY = "auto";

    // Add header with gradient background
    let header = document.createElement('div');
    header.style.width = "100%";
    header.style.padding = "15px";
    header.style.background = "linear-gradient(-45deg, #9C27B0, #E91E63, #9C27B0, #E91E63)";
    header.style.backgroundSize = "400% 400%";
    header.style.animation = "gradientAnimation 5s ease infinite";
    header.style.borderTopLeftRadius = "15px";
    header.style.borderTopRightRadius = "15px";
    header.style.color = "#fff";
    header.style.display = "flex";
    header.style.justifyContent = "center"; // Centering the title
    header.style.alignItems = "center";

    let title = document.createElement('h3');
    title.innerText = "LinkedIN Genie";
    title.style.margin = "0";
    title.style.fontFamily = "'Avenir', sans-serif";
    title.style.fontSize = "16px";
    title.style.fontWeight = "bold"; // Bold title
    title.style.color = "white"; // White text color

    // Add a circular close button above the box
    let closeButton = document.createElement('button');
    closeButton.innerText = "✕";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.color = "#fff";
    closeButton.style.fontSize = "20px";
    closeButton.style.cursor = "pointer";
    closeButton.style.zIndex = "10001";
    closeButton.addEventListener('click', () => quotationBox.remove());

    header.appendChild(title);
    header.appendChild(closeButton);
    quotationBox.appendChild(header);

    // Add loading spinner
    let loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('loading-spinner');
    loadingSpinner.style.marginTop = "100px";
    quotationBox.appendChild(loadingSpinner);

    document.body.appendChild(quotationBox);

    // Load comments after fetching from webhook
    fetchComments(quotationBox, loadingSpinner);
}

// Function to show message generator
function showMessageGenerator(userName) {
    // Remove any existing box
    if (document.getElementById("messageBox")) {
        document.getElementById("messageBox").remove();
    }

    const messageBox = document.createElement('div');
    messageBox.id = "messageBox";
    messageBox.style.position = "fixed";
    messageBox.style.top = "20%";
    messageBox.style.right = "5%";
    messageBox.style.width = "320px";
    messageBox.style.padding = "0";
    messageBox.style.background = "#ffffff";
    messageBox.style.borderRadius = "15px";
    messageBox.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
    messageBox.style.zIndex = "10000";
    messageBox.style.display = "flex";
    messageBox.style.flexDirection = "column";
    messageBox.style.maxHeight = "600px";
    messageBox.style.overflowY = "auto";

    // Add header
    const header = document.createElement('div');
    header.style.width = "100%";
    header.style.padding = "15px";
    header.style.background = "linear-gradient(-45deg, #0077B5, #00A0DC)";
    header.style.backgroundSize = "400% 400%";
    header.style.borderTopLeftRadius = "15px";
    header.style.borderTopRightRadius = "15px";
    header.style.color = "#fff";
    header.style.display = "flex";
    header.style.justifyContent = "center";
    header.style.alignItems = "center";

    const title = document.createElement('h3');
    title.innerText = `Generate Message for ${userName}`;
    title.style.margin = "0";
    title.style.fontFamily = "'Avenir', sans-serif";
    title.style.fontSize = "16px";
    title.style.fontWeight = "bold";
    title.style.color = "white";

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerText = "✕";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.color = "#fff";
    closeButton.style.fontSize = "20px";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener('click', () => messageBox.remove());

    header.appendChild(title);
    header.appendChild(closeButton);
    messageBox.appendChild(header);

    // Add loading spinner
    const loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('loading-spinner');
    loadingSpinner.style.marginTop = "100px";
    messageBox.appendChild(loadingSpinner);

    document.body.appendChild(messageBox);

    // Generate message
    generateMessage(userName, messageBox, loadingSpinner);
}

// Function to fetch comments
function fetchComments(quotationBox, loadingSpinner) {
    const postData = {
        postText: 'Sample post text',
        comments: []
    };

    fetch(commentWebhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.text())
    .then(result => {
        console.log("Webhook response received:", result);

        if (!result || result.trim() === "") {
            throw new Error("Received an empty response from the webhook.");
        }

        // Split the response by lines and treat each line as a comment
        const commentsFromWebhook = result.split("\n").filter(line => line.trim() !== "");
        console.log("Comments from Webhook:", commentsFromWebhook);

        loadingSpinner.remove();

        commentsFromWebhook.forEach(comment => {
            let button = document.createElement('button');
            button.className = "commentButton";
            button.innerText = comment;
            button.style.padding = "10px 15px";
            button.style.margin = "10px 15px";
            button.style.width = "calc(100% - 30px)";
            button.style.backgroundColor = "#fff";
            button.style.color = "#333";
            button.style.border = "1px solid #ddd";
            button.style.borderRadius = "10px";
            button.style.cursor = "pointer";
            button.style.fontSize = "14px";
            button.style.fontFamily = "'Avenir', sans-serif";
            button.style.textAlign = "left";

            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = "#f0f8ff";
                button.style.transform = "scale(1.02)";
            });

            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = "#fff";
                button.style.transform = "scale(1)";
            });

            button.addEventListener('click', () => {
                insertSelectedComment(button.innerText);
                quotationBox.remove();
                showSuccessAnimation();
            });

            quotationBox.appendChild(button);
        });
    })
    .catch(error => {
        console.error('Error fetching comments:', error);
        loadingSpinner.remove();
        
        const errorMessage = document.createElement('div');
        errorMessage.style.padding = "20px";
        errorMessage.style.color = "#dc3545";
        errorMessage.innerText = 'Failed to generate comments. Please try again.';
        quotationBox.appendChild(errorMessage);
    });
}

// Function to generate message
async function generateMessage(userName, messageBox, loadingSpinner) {
    try {
        const response = await fetch(messageWebhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: userName })
        });

        const message = await response.text();
        console.log("Generated message:", message);

        loadingSpinner.remove();

        // Create message button
        const messageButton = document.createElement('button');
        messageButton.innerText = message;
        messageButton.style.padding = "10px 15px";
        messageButton.style.margin = "10px 15px";
        messageButton.style.width = "calc(100% - 30px)";
        messageButton.style.backgroundColor = "#fff";
        messageButton.style.color = "#333";
        messageButton.style.border = "1px solid #ddd";
        messageButton.style.borderRadius = "10px";
        messageButton.style.cursor = "pointer";
        messageButton.style.fontSize = "14px";
        messageButton.style.textAlign = "left";
        messageButton.style.transition = "all 0.2s ease";

        messageButton.addEventListener('mouseover', () => {
            messageButton.style.backgroundColor = "#f0f8ff";
            messageButton.style.transform = "scale(1.02)";
        });

        messageButton.addEventListener('mouseout', () => {
            messageButton.style.backgroundColor = "#fff";
            messageButton.style.transform = "scale(1)";
        });

        messageButton.addEventListener('click', () => {
            insertMessage(message);
            messageBox.remove();
            showSuccessAnimation();
        });

        messageBox.appendChild(messageButton);

    } catch (error) {
        console.error('Error generating message:', error);
        loadingSpinner.remove();
        
        const errorMessage = document.createElement('div');
        errorMessage.style.padding = "20px";
        errorMessage.style.color = "#dc3545";
        errorMessage.innerText = 'Failed to generate message. Please try again.';
        messageBox.appendChild(errorMessage);
    }
}

// PART 3: UI Functions and Styling
// Function to insert message into LinkedIn message box
function insertMessage(message) {
    const messageInput = document.querySelector('div.msg-form__contenteditable[contenteditable="true"]');
    if (messageInput) {
        messageInput.innerHTML = `<p>${message}</p>`;
        console.log('Message inserted:', message);
    } else {
        console.error('Message input not found');
    }
}

// Function to insert comment
function insertSelectedComment(comment) {
    const commentBox = document.querySelector('[contenteditable="true"]');
    if (commentBox) {
        commentBox.innerText = comment;
        console.log("Inserted comment:", comment);
    } else {
        alert("Unable to find the comment box.");
    }
}

// Function to show success animation
function showSuccessAnimation() {
    const success = document.createElement('div');
    success.style.position = 'fixed';
    success.style.top = '50%';
    success.style.left = '50%';
    success.style.transform = 'translate(-50%, -50%)';
    success.style.padding = '20px';
    success.style.backgroundColor = '#28a745';
    success.style.color = '#fff';
    success.style.borderRadius = '10px';
    success.style.zIndex = '10001';
    success.innerText = 'Text copied! ✓';

    document.body.appendChild(success);

    setTimeout(() => {
        success.remove();
    }, 2000);
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    .loading-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #0073b1;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize when page loads
window.addEventListener('load', () => {
    console.log('Page loaded, injecting buttons');
    createButtons();
});