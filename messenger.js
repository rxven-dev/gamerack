// ==========================================================================
// 🔌 INTERACTIVE CONSOLE DIRECT MESSENGER SYSTEM (TRUE LIVE PRESENCE BROADCASTER)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // 1. Generate a Unique Session ID and Profile Name for whoever opens this tab
    const sessionUserId = 'USER_' + Math.floor(Math.random() * 900000 + 100000);
    
    // Check if we are the master administrator or a secondary visitor
    const isPrimaryUser = !sessionStorage.getItem('IS_SUB_ACCOUNT');
    const sessionUserName = isPrimaryUser ? "Admin Console" : "Network Guest " + sessionUserId.slice(-4);
    const sessionInitial = isPrimaryUser ? "AD" : "NG";

    // Prepare live synchronized registry array
    let liveOnlineUsers = [];
    let currentlySelectedUser = null;

    // 2. Initialize Real-Time Browser Cross-Tab Interconnect Communication Channel
    const networkBus = new BroadcastChannel('gamerack_presence_grid');

    // Generate Perfect Round Circle Launcher Node
    const launcher = document.createElement('div');
    launcher.className = 'messenger-launcher';
    launcher.setAttribute('title', 'Open Secure Comms Link');
    launcher.innerHTML = `
        <svg style="width:24px; height:24px; fill:none; stroke:currentColor; stroke-width:2.2;" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    `;

    const panel = document.createElement('div');
    panel.className = 'messenger-panel';
    panel.innerHTML = `
        <div class="msg-sidebar">
            <div class="msg-sidebar-header">Core Applications</div>
            <div class="sidebar-page-tab">
                <svg style="width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                <span>Messages</span>
            </div>
            <div class="nested-page-container" id="msgUserList"></div>
        </div>
        
        <div class="msg-chatbox">
            <div class="chat-header" id="msgChatTargetName">No active conversation selected</div>
            <div class="chat-history" id="msgChatHistory"></div>
            <div class="chat-input-row" style="opacity: 0.5; pointer-events: none;" id="msgInputRow">
                <input type="text" id="msgInputField" placeholder="Select an online user to chat..." disabled>
                <button class="chat-send-btn" id="msgSendBtn" disabled>Send</button>
            </div>
        </div>
    `;

    body.appendChild(launcher);
    body.appendChild(panel);

    const userListContainer = document.getElementById('msgUserList');
    const chatHistoryContainer = document.getElementById('msgChatHistory');
    const chatTitle = document.getElementById('msgChatTargetName');
    const inputField = document.getElementById('msgInputField');
    const sendButton = document.getElementById('msgSendBtn');
    const inputRow = document.getElementById('msgInputRow');

    // 3. Interface Rendering Engine
    function renderContactsPage() {
        userListContainer.innerHTML = '';
        
        if (liveOnlineUsers.length === 0) {
            userListContainer.innerHTML = `
                <div style="padding: 20px 16px; color: #64748b; font-size: 12px; text-align: center; line-height: 1.4;">
                    ● You are the only user online<br>
                    <span style="font-size: 11px; opacity: 0.6;">Open another tab or incognito to chat!</span>
                </div>
            `;
            chatHistoryContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #64748b; font-size: 13px; text-align: center; gap: 8px;">
                    <svg style="width: 32px; height: 32px; opacity: 0.4;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    Listening for network connections...
                </div>
            `;
            // Lock input rows safely
            inputRow.style.opacity = "0.5";
            inputRow.style.pointerEvents = "none";
            inputField.disabled = true;
            sendButton.disabled = true;
            chatTitle.textContent = "No active conversation selected";
            return;
        }

        liveOnlineUsers.forEach(user => {
            const row = document.createElement('div');
            row.className = `user-row ${currentlySelectedUser && user.id === currentlySelectedUser.id ? 'active' : ''}`;
            row.innerHTML = `
                <div class="avatar-wrapper">
                    <div class="user-avatar">${user.initial}</div>
                    <div class="status-badge"></div>
                </div>
                <div class="user-name">${user.name}</div>
            `;
            row.addEventListener('click', () => {
                currentlySelectedUser = user;
                renderContactsPage();
                loadChatHistory();
            });
            userListContainer.appendChild(row);
        });
    }

    function loadChatHistory() {
        if (!currentlySelectedUser) return;
        
        inputRow.style.opacity = "1";
        inputRow.style.pointerEvents = "auto";
        inputField.disabled = false;
        inputField.placeholder = `Message ${currentlySelectedUser.name}...`;
        sendButton.disabled = false;

        chatTitle.textContent = `Chatting with ${currentlySelectedUser.name}`;
        
        // Retain or display initial greetings securely
        if (!currentlySelectedUser.messages) {
            currentlySelectedUser.messages = [{ type: 'incoming', text: `Connection verified. Direct data sync with ${currentlySelectedUser.name} online.` }];
        }
        
        chatHistoryContainer.innerHTML = '';
        currentlySelectedUser.messages.forEach(msg => {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${msg.type}`;
            bubble.textContent = msg.text;
            chatHistoryContainer.appendChild(bubble);
        });
        chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
    }

    function processOutgoingMessage() {
        const text = inputField.value.trim();
        if (!text || !currentlySelectedUser) return;

        // Push locally
        if (!currentlySelectedUser.messages) currentlySelectedUser.messages = [];
        currentlySelectedUser.messages.push({ type: 'outgoing', text: text });

        // Broadcast to target tab window instantly via channel packet pipeline
        networkBus.postMessage({
            type: 'CHAT_MESSAGE',
            senderId: sessionUserId,
            recipientId: currentlySelectedUser.id,
            text: text
        });

        inputField.value = '';
        loadChatHistory();
    }

    // 4. Real-time Message Bus Processing Rules
    networkBus.onmessage = (event) => {
        const payload = event.data;

        if (payload.type === 'PING_PRESENCE') {
            // Another tab wants to know who is online, reply back to them immediately
            networkBus.postMessage({
                type: 'PONG_PRESENCE',
                id: sessionUserId,
                name: sessionUserName,
                initial: sessionInitial
            });
            registerOnlineUser(payload.id, payload.name, payload.initial);
        }
        else if (payload.type === 'PONG_PRESENCE') {
            registerOnlineUser(payload.id, payload.name, payload.initial);
        }
        else if (payload.type === 'CHAT_MESSAGE') {
            // Only capture the text packet if it was targeted at our specific user ID session instance
            if (payload.recipientId === sessionUserId) {
                let userMatch = liveOnlineUsers.find(u => u.id === payload.senderId);
                if (userMatch) {
                    if (!userMatch.messages) userMatch.messages = [];
                    userMatch.messages.push({ type: 'incoming', text: payload.text });
                    
                    if (currentlySelectedUser && currentlySelectedUser.id === payload.senderId) {
                        loadChatHistory();
                    }
                }
            }
        }
        else if (payload.type === 'DISCONNECT_PRESENCE') {
            liveOnlineUsers = liveOnlineUsers.filter(u => u.id !== payload.id);
            if (currentlySelectedUser && currentlySelectedUser.id === payload.id) currentlySelectedUser = null;
            renderContactsPage();
        }
    };

    function registerOnlineUser(id, name, initial) {
        if (id === sessionUserId) return; // Ignore ourselves
        if (!liveOnlineUsers.some(u => u.id === id)) {
            liveOnlineUsers.push({ id, name, initial, messages: [] });
            renderContactsPage();
        }
    }

    // 5. Broadcast Lifecycle Transmissions Setup Loop
    launcher.addEventListener('click', () => panel.classList.toggle('active'));
    sendButton.addEventListener('click', processOutgoingMessage);
    inputField.addEventListener('keydown', (e) => { if (e.key === 'Enter') processOutgoingMessage(); });

    // Broadcast our presence immediately out to the network fabric on load sequence activation
    networkBus.postMessage({ type: 'PING_PRESENCE', id: sessionUserId, name: sessionUserName, initial: sessionInitial });
    
    // Run a routine ping checks to locate older existing active client sessions seamlessly
    setTimeout(() => {
        networkBus.postMessage({ type: 'PING_PRESENCE', id: sessionUserId, name: sessionUserName, initial: sessionInitial });
    }, 400);

    // Broadcast disconnection state safely if tab window closing procedures fire
    window.addEventListener('beforeunload', () => {
        networkBus.postMessage({ type: 'DISCONNECT_PRESENCE', id: sessionUserId });
    });

    renderContactsPage();
});