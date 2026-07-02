// ==========================================================================
// 🔌 INTERACTIVE CONSOLE DIRECT MESSENGER SYSTEM (ADVANCED CORE SUITE)
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
    const body = document.body;
    const spClient = window.globalSupabase;

    if (!spClient) {
        console.error("Supabase cluster client engine missing. Messenger initialized offline.");
        return;
    }

    // 1. Authenticate & Resolve Profile State Identity Manifest Metrics Context
    const { data: { user } } = await spClient.auth.getUser();
    if (!user) return;

    // Fetch live localized variables matching the authenticated user profile
    const { data: currentProfile } = await spClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    const sessionUserId = user.id;
    const sessionUserName = currentProfile?.profile_name || "Agent_" + user.id.substring(0, 5);
    const sessionInitial = sessionUserName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || "U";

    // Prepare live synchronized registry arrays
    let liveOnlineUsers = [];
    let currentlySelectedUser = null;

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
            <div class="msg-sidebar-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div id="sidebarBackToAppsBtn" style="display: flex; align-items: center; gap: 4px; cursor: pointer; color: #8b5cf6; font-size: 12px; font-weight: 600; user-select: none;">
                    <svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    <span>← Back to Apps</span>
                </div>
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Chat Desk</span>
            </div>
            <div class="sidebar-page-tab">
                <svg style="width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                <span>Messages</span>
            </div>
            <div class="nested-page-container" id="msgUserList"></div>
        </div>
        
        <div class="msg-chatbox">
            <div class="chat-header" id="msgChatTargetName" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="mobile-back-action" id="mobileChatBackBtn">
                        <svg viewBox="0 0 24 24" fill="none; stroke:currentColor; stroke-width:2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </div>
                    <span class="chat-header-user-title">Select a Conversation</span>
                </div>
                <div class="header-close-icon-btn" id="chatCloseXBtn" title="Close Window">✕</div>
            </div>
            <div class="chat-history" id="msgChatHistory"></div>
            <div class="chat-input-row" style="opacity: 0.5; pointer-events: none;" id="msgInputRow">
                <button class="chat-attach-btn" id="msgAttachBtn" title="Upload Image" style="background:none; border:none; color:#64748b; cursor:pointer; padding:0 4px; display:flex; align-items:center;">
                    <svg style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>
                <input type="file" id="msgFileInput" accept="image/*" style="display: none;">
                
                <input type="text" id="msgInputField" placeholder="Select an online user to chat..." disabled>
                <button class="chat-send-btn" id="msgSendBtn" disabled>Send</button>
            </div>
        </div>
    `;

    body.appendChild(launcher);
    body.appendChild(panel);

    // CSS Injector extension for reaction pills and utility modules
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .chat-bubble-wrapper { position: relative; display: flex !important; flex-direction: column; max-width: 75%; margin-bottom: 4px; width: auto; }
        .chat-bubble-wrapper.outgoing { align-self: flex-end !important; align-items: flex-end !important; }
        .chat-bubble-wrapper.incoming { align-self: flex-start !important; align-items: flex-start !important; }
        .chat-bubble { display: inline-block !important; width: auto !important; max-width: 100% !important; word-break: break-word; white-space: pre-wrap; }
        .reaction-trigger-panel { display: none; position: absolute; top: -28px; background: #1e1e2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2px 6px; gap: 4px; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
        .chat-bubble-wrapper:hover .reaction-trigger-panel { display: flex; }
        .chat-bubble-wrapper.outgoing .reaction-trigger-panel { right: 0; }
        .chat-bubble-wrapper.incoming .reaction-trigger-panel { left: 0; }
        .react-emoji-btn { background: none; border: none; padding: 0 2px; cursor: pointer; font-size: 14px; transition: transform 0.1s; }
        .react-emoji-btn:hover { transform: scale(1.3); }
        .bubble-reaction-badge { position: absolute; bottom: -10px; background: #2a2b3d; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1px 5px; font-size: 11px; display: flex; gap: 2px; align-items: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3); z-index: 5; }
        .chat-bubble-wrapper.outgoing .bubble-reaction-badge { right: 10px; }
        .chat-bubble-wrapper.incoming .bubble-reaction-badge { left: 10px; }
        .chat-attached-img { max-width: 200px; max-height: 200px; border-radius: 8px; margin-top: 4px; display: block; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); }
        .chat-attach-btn:hover { color: #8b5cf6 !important; }
    `;
    document.head.appendChild(styleSheet);

    const userListContainer = document.getElementById('msgUserList');
    const chatHistoryContainer = document.getElementById('msgChatHistory');
    const chatTitle = document.getElementById('msgChatTargetName');
    const inputField = document.getElementById('msgInputField');
    const sendButton = document.getElementById('msgSendBtn');
    const inputRow = document.getElementById('msgInputRow');
    const fileInput = document.getElementById('msgFileInput');
    const attachButton = document.getElementById('msgAttachBtn');

    // 2. Initialize Real-Time Presence Telemetry Channel (TRUE ACCURATE DB SESSIONS)
    const presenceChannel = spClient.channel('gamerack_online_grid', {
        config: { presence: { key: sessionUserId } }
    });

    presenceChannel
        .on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.presenceState();
            
            // Map keys exclusively to other external network profiles (Hides Self-Messaging Clones)
            liveOnlineUsers = Object.keys(state).map(userId => {
                const primaryMeta = state[userId][0];
                const existingUserRecord = liveOnlineUsers.find(u => u.id === userId);

                return {
                    id: userId,
                    user_uuid: userId,
                    name: primaryMeta.name,
                    initial: primaryMeta.initial,
                    avatar: primaryMeta.avatar || "",
                    messages: existingUserRecord ? existingUserRecord.messages : []
                };
            }).filter(u => u.id !== sessionUserId); // Clean production rule: Hidden from self-views

            if (currentlySelectedUser) {
                const refreshedMatch = liveOnlineUsers.find(u => u.id === currentlySelectedUser.id);
                currentlySelectedUser = refreshedMatch || null;
            }

            renderContactsPage();
            if (currentlySelectedUser) loadChatHistory();
        })
        .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await presenceChannel.track({
                    name: sessionUserName,
                    initial: sessionInitial,
                    avatar: currentProfile?.avatar_url || "",
                    onlineAt: new Date().toISOString()
                });
            }
        });

    // 3. Initialize Direct P2P Messaging Broadcast Fabrication Fabric
    const messagingChannel = spClient.channel('gamerack_chat_fabric');

    messagingChannel
        .on('broadcast', { event: 'p2p_msg' }, (payload) => {
            const packet = payload.payload;
            if (packet.recipientId === sessionUserId) {
                if (currentlySelectedUser && currentlySelectedUser.user_uuid === packet.senderId) {
                    loadChatHistory();
                }
            }
        })
        .on('broadcast', { event: 'p2p_reaction' }, (payload) => {
            const packet = payload.payload;
            if (packet.recipientId === sessionUserId && currentlySelectedUser && currentlySelectedUser.user_uuid === packet.senderId) {
                loadChatHistory();
            }
        })
        .subscribe();

    // 4. Interface Rendering Engine
    function renderContactsPage() {
        userListContainer.innerHTML = '';
        
        if (liveOnlineUsers.length === 0) {
            userListContainer.innerHTML = `
                <div style="padding: 20px 16px; color: #64748b; font-size: 12px; text-align: center; line-height: 1.4;">
                    ● No other users online<br>
                    <span style="font-size: 11px; opacity: 0.6;">Waiting for network peers...</span>
                </div>
            `;
            chatHistoryContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #64748b; font-size: 13px; text-align: center; gap: 8px;">
                    <svg style="width: 32px; height: 32px; opacity: 0.4;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    Listening for telemetry...
                </div>
            `;
            inputRow.style.opacity = "0.5";
            inputRow.style.pointerEvents = "none";
            inputField.disabled = true;
            sendButton.disabled = true;
            chatTitle.innerHTML = `<span class="chat-header-user-title">Select a Conversation</span>`;
            return;
        }

        liveOnlineUsers.forEach(user => {
            const row = document.createElement('div');
            row.className = `user-row ${currentlySelectedUser && user.id === currentlySelectedUser.id ? 'active' : ''}`;
            
            let avatarContent = `<div class="user-avatar">${user.initial}</div>`;
            if (user.avatar) {
                avatarContent = `<div class="user-avatar" style="background-image: url('${user.avatar}'); text-indent: -9999px;"></div>`;
            }

            row.innerHTML = `
                <div class="avatar-wrapper">
                    ${avatarContent}
                    <div class="status-badge" style="background: #10b981;"></div>
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

    async function loadChatHistory() {
        if (!currentlySelectedUser) return;
        
        inputRow.style.opacity = "1";
        inputRow.style.pointerEvents = "auto";
        inputField.disabled = false;
        inputField.placeholder = `Message ${currentlySelectedUser.name}...`;
        sendButton.disabled = false;

        // Kept layout structure intact with back arrow elements
        chatTitle.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div class="mobile-back-action" id="mobileChatBackBtn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </div>
                <span class="chat-header-user-title">Chatting with ${currentlySelectedUser.name}</span>
            </div>
        `;
        
        // 🔄 MATCHED EXACTLY: sender_id, recipient_id
        const { data: dbMessages, error } = await spClient
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${sessionUserId},recipient_id.eq.${currentlySelectedUser.user_uuid}),and(sender_id.eq.${currentlySelectedUser.user_uuid},recipient_id.eq.${sessionUserId})`)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Failed to compile chat logs:", error.message);
            return;
        }
        
        chatHistoryContainer.innerHTML = '';
        
        dbMessages.forEach(msg => {
            const isOutgoing = msg.sender_id === sessionUserId;
            
            const wrapper = document.createElement('div');
            wrapper.className = `chat-bubble-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}`;
            
            const reactionPanel = document.createElement('div');
            reactionPanel.className = 'reaction-trigger-panel';
            ['👍', '❤️', '🔥', '😂'].forEach(emoji => {
                const btn = document.createElement('button');
                btn.className = 'react-emoji-btn';
                btn.innerText = emoji;
                btn.addEventListener('click', () => appendReaction(msg.id, emoji));
                reactionPanel.appendChild(btn);
            });
            wrapper.appendChild(reactionPanel);

            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`;
            
            // 🔄 MATCHED EXACTLY: message_text
            if (msg.message_text) {
                bubble.textContent = msg.message_text;
            }
            
            if (msg.file_url) {
                const img = document.createElement('img');
                img.src = msg.file_url;
                img.className = 'chat-attached-img';
                img.addEventListener('click', () => window.open(msg.file_url, '_blank'));
                bubble.appendChild(img);
            }
            wrapper.appendChild(bubble);

            if (msg.reactions && Object.keys(msg.reactions).length > 0) {
                const badge = document.createElement('div');
                badge.className = 'bubble-reaction-badge';
                badge.innerText = Object.entries(msg.reactions).map(([emo, count]) => `${emo} ${count}`).join(' ');
                wrapper.appendChild(badge);
            }

            chatHistoryContainer.appendChild(wrapper);
        });
        
        chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
        inputField.focus();
    }

    async function processOutgoingMessage() {
        const text = inputField.value.trim();
        if (!text || !currentlySelectedUser) return;

        // 🔄 MATCHED EXACTLY: recipient_id, message_text
        const { error } = await spClient
            .from('messages')
            .insert({
                sender_id: sessionUserId,
                recipient_id: currentlySelectedUser.user_uuid,
                message_text: text
            });

        if (error) {
            console.error("Message drop detected:", error.message);
            return;
        }

        messagingChannel.send({
            type: 'broadcast',
            event: 'p2p_msg',
            payload: { senderId: sessionUserId, recipientId: currentlySelectedUser.user_uuid }
        });

        inputField.value = '';
        await loadChatHistory(); 
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file || !currentlySelectedUser) return;

        const fileExt = file.name.split('.').pop();
        const pathFileName = `${sessionUserId}/${Date.now()}.${fileExt}`;

        // Upload to storage bucket
        const { data: storageData, error: uploadErr } = await spClient.storage
            .from('messages_bucket')
            .upload(pathFileName, file, { cacheControl: '3600', upsert: true });

        if (uploadErr) {
            console.error("Storage delivery error:", uploadErr.message);
            return;
        }

        const { data: { publicUrl } } = spClient.storage
            .from('messages_bucket')
            .getPublicUrl(pathFileName);

        // 🔄 REPAIRED HERE: Swapped message_content back to message_text
        const { error: dbErr } = await spClient
            .from('messages')
            .insert({
                sender_id: sessionUserId,
                recipient_id: currentlySelectedUser.user_uuid,
                message_text: '', // 👈 Fixed column target name match
                file_url: publicUrl
            });

        if (dbErr) {
            console.error("Media relation generation failure:", dbErr.message);
            return;
        }

        messagingChannel.send({
            type: 'broadcast',
            event: 'p2p_msg',
            payload: { senderId: sessionUserId, recipientId: currentlySelectedUser.user_uuid }
        });

        fileInput.value = '';
        await loadChatHistory();
    }

    async function appendReaction(msgId, emoji) {
        if (!currentlySelectedUser) return;

        const numericMsgId = parseInt(msgId, 10);

        const { data: messageItem } = await spClient
            .from('messages')
            .select('reactions')
            .eq('id', numericMsgId)
            .single();

        let currentReactions = messageItem?.reactions || {};
        currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;

        const { error } = await spClient
            .from('messages')
            .update({ reactions: currentReactions })
            .eq('id', numericMsgId);

        if (error) {
            console.error("Reaction matrix drop:", error.message);
            return;
        }

        messagingChannel.send({
            type: 'broadcast',
            event: 'p2p_reaction',
            payload: { senderId: sessionUserId, recipientId: currentlySelectedUser.user_uuid }
        });

        await loadChatHistory();
    }

    // 5. Native DOM Action Bindings
    launcher.addEventListener('click', () => panel.classList.toggle('active'));
    sendButton.addEventListener('click', processOutgoingMessage);
    inputField.addEventListener('keydown', (e) => { if (e.key === 'Enter') processOutgoingMessage(); });
    attachButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleImageUpload);

    /* ==================================================================
       🚀 MOBILE PAGE-FLIP NAVIGATION ENGINE ROUTER
       ================================================================== */
    
    // 1. When an online user row container item is clicked, slide in Screen 2 (Chat box view)
    body.addEventListener('click', (e) => {
        const selectedUserRow = e.target.closest('.user-row');
        if (selectedUserRow) {
            // Check if we are running inside mobile layout widths
            if (window.innerWidth <= 768) {
                panel.classList.add('user-is-selected');
            }
        }
    });

    // Target the specific close button located inside the active chat header
    body.addEventListener('click', (e) => {
        // Find the specific button using e.target.closest to catch clicks on child text nodes
        if (e.target.closest('#chatCloseXBtn')) {
            e.preventDefault();
            e.stopPropagation();
            // Close the main messenger frame context
            panel.classList.remove('active');
            // Clean up the routing state so that it returns to Screen 1 upon reopening
            panel.classList.remove('user-is-selected'); 
        }
    });

    // 3. Tapping the chat header title back arrow slides Screen 2 away to return to Screen 1
    body.addEventListener('click', (e) => {
        if (e.target.closest('#mobileChatBackBtn')) {
            e.preventDefault();
            e.stopPropagation();
            if (window.innerWidth <= 768) {
                panel.classList.remove('user-is-selected');
            }
        }
    });

    // 4. Added new listener for your "Back to Apps" button to shut the view cleanly
    body.addEventListener('click', (e) => {
        if (e.target.closest('#sidebarBackToAppsBtn')) {
            e.preventDefault();
            e.stopPropagation();
            panel.classList.remove('active');
            panel.classList.remove('user-is-selected');
        }
    });

    renderContactsPage();
});