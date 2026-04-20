let ws = null;
let token = null;
let currentUser = null;
let currentUserId = null;
let selectedUserId = null;
let selectedUsername = null;

// Check if user is logged in on page load
window.addEventListener('load', () => {
    token = localStorage.getItem('chat_token');
    currentUser = localStorage.getItem('chat_username');
    currentUserId = localStorage.getItem('chat_user_id');
    
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
    connectWebSocket();
    loadUsers();
});

// Connect to WebSocket
function connectWebSocket() {
    ws = new WebSocket(`ws://localhost:8000/chat/ws?token=${token}`);
    
    ws.onopen = () => {
        document.getElementById('connection-status').textContent = 'Connected';
        console.log('Connected to chat');
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleMessage(data);
    };
    
    ws.onclose = () => {
        document.getElementById('connection-status').textContent = 'Disconnected';
        console.log('Disconnected');
        setTimeout(connectWebSocket, 3000);
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

// Handle incoming messages
function handleMessage(data) {
    if (data.type === 'private_message') {
        // Received message from someone
        if (data.from_user_id === selectedUserId) {
            addMessage('received', data.from_username, data.content, data.timestamp);
        } else {
            // Message from someone else (show notification)
            showNotification('New message from ' + data.from_username);
        }
    } else if (data.type === 'message_sent') {
        // Confirmation that our message was sent
        if (data.to_user_id === selectedUserId) {
            addMessage('sent', 'You', data.content, data.timestamp);
        }
    } else if (data.type === 'user_joined') {
        console.log(data.username + ' joined');
        loadUsers();
    } else if (data.type === 'user_left') {
        console.log(data.username + ' left');
        loadUsers();
    }
}

// Search users
async function searchUsers() {
    const query = document.getElementById('user-search').value.trim();
    if (!query) return;
    
    try {
        const response = await fetch('/chat/users/search?q=' + query + '&current_user_id=' + currentUserId);
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Search failed:', error);
    }
}

// Load all users
async function loadUsers() {
    try {
        const response = await fetch('/chat/users/search?q=&current_user_id=' + currentUserId);
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Load users failed:', error);
    }
}

// Display users in sidebar
function displayUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    
    if (users.length === 0) {
        userList.innerHTML = '<p class="no-users">No users found</p>';
        return;
    }
    
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        userDiv.innerHTML = '<div class="user-info"><strong>' + user.username + '</strong><small>' + user.email + '</small></div>';
        userDiv.onclick = () => selectUser(user.id, user.username);
        userList.appendChild(userDiv);
    });
}

// Select user to chat with
function selectUser(userId, username) {
    selectedUserId = userId;
    selectedUsername = username;
    
    document.getElementById('chat-with').textContent = 'Chat with ' + username;
    document.getElementById('message-input').disabled = false;
    document.getElementById('send-btn').disabled = false;
    
    loadChatHistory(userId);
}

// Load chat history with selected user
async function loadChatHistory(otherUserId) {
    try {
        const response = await fetch('/chat/history/' + otherUserId + '?current_user_id=' + currentUserId);
        const messages = await response.json();
        
        const messagesDiv = document.getElementById('chat-messages');
        messagesDiv.innerHTML = '';
        
        messages.forEach(msg => {
            const type = msg.sender_id === currentUserId ? 'sent' : 'received';
            const from = type === 'sent' ? 'You' : msg.sender_username;
            addMessage(type, from, msg.content, msg.timestamp);
        });
    } catch (error) {
        console.error('Load history failed:', error);
    }
}

// Send message
function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    
    if (!content || !ws || !selectedUserId) return;
    
    ws.send(JSON.stringify({
        receiver_id: selectedUserId,
        content: content
    }));
    
    input.value = '';
}

// Add message to chat display
function addMessage(type, from, text, timestamp) {
    const messagesDiv = document.getElementById('chat-messages');
    
    const placeholder = messagesDiv.querySelector('.placeholder');
    if (placeholder) placeholder.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + type;
    messageDiv.innerHTML = '<div class="message-header"><span class="from">' + from + '</span><span class="time">' + timestamp + '</span></div><div class="message-content">' + text + '</div>';
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Show notification
function showNotification(text) {
    document.title = 'New message - ' + text;
    setTimeout(() => { document.title = 'Chat - Real-Time Chat'; }, 3000);
}

// Enter key to send
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('message-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});