// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const newChatButton = document.getElementById('new-chat-button');
const tokenCounter = document.getElementById('token-counter');
const themeSwitch = document.getElementById('checkbox');

// Configuration
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = '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';
const MODEL = 'nousresearch/deephermes-3-mistral-24b-preview:free';
const TOKEN_WARNING_THRESHOLD = 2000; // Show warning at 2000 tokens
const TOKEN_LIMIT = 4000; // Maximum tokens before forcing new chat

// State
let currentTokens = 0;
let messageHistory = [];

// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);
themeSwitch.checked = savedTheme === 'light';

// Event Listeners
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

newChatButton.addEventListener('click', startNewChat);

themeSwitch.addEventListener('change', (e) => {
    setTheme(e.target.checked ? 'light' : 'dark');
});

// Auto-resize textarea
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});

// Functions
function startNewChat() {
    // Clear chat messages
    chatMessages.innerHTML = '';
    // Reset token counter
    currentTokens = 0;
    updateTokenCounter();
    // Clear message history
    messageHistory = [];
    // Add initial greeting
    addMessage('Hello! I\'m your AI assistant powered by DeepHermes. How can I help you today?', 'ai');
}

function updateTokenCounter() {
    tokenCounter.textContent = `Tokens: ${currentTokens}`;
    if (currentTokens >= TOKEN_WARNING_THRESHOLD) {
        tokenCounter.classList.add('token-warning');
        if (currentTokens >= TOKEN_LIMIT) {
            addMessage('You\'ve reached the token limit. Please start a new chat for better performance.', 'ai');
            newChatButton.style.backgroundColor = '#ff6b6b';
        }
    } else {
        tokenCounter.classList.remove('token-warning');
        newChatButton.style.backgroundColor = '';
    }
}

async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';

    // Show typing indicator
    const typingIndicator = addTypingIndicator();

    try {
        // Get AI response
        const response = await getAIResponse(message);
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Add AI response to chat
        addMessage(response, 'ai');

        // Update token count (rough estimation)
        currentTokens += message.length / 4; // Rough estimation of tokens
        currentTokens += response.length / 4;
        updateTokenCounter();

    } catch (error) {
        console.error('Error:', error);
        typingIndicator.remove();
        addMessage('Sorry, I encountered an error. Please try again.', 'ai');
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    // Format message text with proper line breaks and spacing
    const formattedText = text
        .replace(/\n/g, '<br>')
        .replace(/\s{2,}/g, ' ')
        .trim();
    
    messageDiv.innerHTML = formattedText;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add to message history
    messageHistory.push({
        role: sender === 'user' ? 'user' : 'assistant',
        content: text
    });
}

function addTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('typing-indicator');
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicator;
}

async function getAIResponse(message) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'AI Chat Application'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: messageHistory,
                temperature: 0.7,
                max_tokens: 1000
            }),
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Initialize chat
window.addEventListener('load', () => {
    startNewChat();
}); 