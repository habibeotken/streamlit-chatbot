// Chat history state
let chatHistory = [];

// Initialize chat interface
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('user-input');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

// Send message function
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    appendMessage('user', message);
    input.value = '';
    
    try {
        const loadingId = showLoading();
        
        // Ollama API'ye direkt bağlan
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gemma3:1b",
                messages: [...chatHistory, { role: "user", content: message }],
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error('API yanıt vermedi');
        }

        // Handle streaming response
        const reader = response.body.getReader();
        let fullResponse = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
                const data = JSON.parse(line);
                if (data.message?.content) {
                    fullResponse = data.message.content;
                    updateLastMessage(fullResponse + '▌');
                }
            }
        }

        removeLoading(loadingId);
        updateLastMessage(fullResponse);
        
        chatHistory.push(
            { role: "user", content: message },
            { role: "assistant", content: fullResponse }
        );

    } catch (error) {
        console.error('Error:', error);
        appendMessage('bot', 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.');
    }
}

// Append message to chat
function appendMessage(role, content) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Update last message in chat
function updateLastMessage(content) {
    const chatMessages = document.getElementById('chat-messages');
    const lastMessage = chatMessages.lastElementChild;
    if (lastMessage) {
        lastMessage.textContent = content;
    }
    scrollToBottom();
}

// Show loading indicator
function showLoading() {
    const chatMessages = document.getElementById('chat-messages');
    const loadingDiv = document.createElement('div');
    const id = 'loading-' + Date.now();
    loadingDiv.id = id;
    loadingDiv.className = 'message bot-message';
    loadingDiv.innerHTML = '<div class="loading"></div>';
    chatMessages.appendChild(loadingDiv);
    scrollToBottom();
    return id;
}

// Remove loading indicator
function removeLoading(id) {
    const loadingDiv = document.getElementById(id);
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Scroll chat to bottom
function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
// Scroll chat to bottom
function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
