const userInputElement = document.getElementById('userInput');
const sendButtonElement = document.getElementById('sendButton');
const aiResponseContainerElement = document.getElementById('aiResponse');

// Function to display a user's message
function displayUserMessage(message) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('flex', 'justify-end'); // Aligns the bubble to the right

    const messageBubble = document.createElement('div');
    messageBubble.classList.add('bg-blue-500', 'text-white', 'p-3', 'rounded-lg', 'max-w-xs', 'sm:max-w-sm', 'md:max-w-md', 'break-words');
    messageBubble.textContent = message;

    messageWrapper.appendChild(messageBubble);
    aiResponseContainerElement.appendChild(messageWrapper);
    scrollToBottom();
}

// Function to display a chatbot's message
function displayBotMessage(message) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('flex', 'justify-start'); // Aligns the bubble to the left

    const messageBubble = document.createElement('div');
    messageBubble.classList.add('bg-gray-200', 'text-gray-800', 'p-3', 'rounded-lg', 'max-w-xs', 'sm:max-w-sm', 'md:max-w-md', 'break-words');
    messageBubble.textContent = message;

    messageWrapper.appendChild(messageBubble);
    aiResponseContainerElement.appendChild(messageWrapper);
    scrollToBottom();
    return messageBubble;
}

// Function to scroll the chat container to the bottom
function scrollToBottom() {
    aiResponseContainerElement.scrollTop = aiResponseContainerElement.scrollHeight;
}

// Event listener for the send button
if (sendButtonElement && userInputElement) {
    sendButtonElement.addEventListener('click', async () => { // Make this async
        const messageText = userInputElement.value.trim();
        if (messageText) {
            displayUserMessage(messageText);
            userInputElement.value = ''; // Clear the input field

            // Display a thinking message for the bot
            const thinkingMessage = displayBotMessage("Thinking...");

            try {
                const response = await fetch('http://localhost:3000/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: messageText }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                thinkingMessage.textContent = data.message;
            } catch (error) {
                console.error('Error fetching AI response:', error);
                thinkingMessage.textContent = `Sorry, I encountered an error: ${error.message}`;
            }
        }
    });

    // Optional: Allow sending message with Enter key
    userInputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if it's in a form
            sendButtonElement.click();
        }
    });
}

// Example: If you want to display an initial message from the bot
// displayBotMessage("Hello! How can I help you today?");