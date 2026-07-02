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
    let targetMessageIdForGlobalPicker = null; // Keeps track of which message the full grid picker belongs to

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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </div>
                    <span class="chat-header-user-title">Select a Conversation</span>
                </div>
                <div class="header-close-icon-btn" id="chatCloseXBtn" title="Close Window">✕</div>
            </div>
            
            <div class="chat-history" id="msgChatHistory"></div>
            
            <div class="floating-emoji-picker-panel" id="msgEmojiPickerPanel">
                <div class="emoji-picker-title" id="msgEmojiPickerTitle">Expressions</div>
                <div class="emoji-picker-grid" id="msgEmojiPickerGrid"></div>
            </div>

            <div class="chat-input-row" style="opacity: 0.5; pointer-events: none;" id="msgInputRow">
                <button class="chat-attach-btn" id="msgAttachBtn" title="Upload Image" style="background:none; border:none; color:#64748b; cursor:pointer; padding:0 2px; display:flex; align-items:center;">
                    <svg style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>
                <input type="file" id="msgFileInput" accept="image/*" style="display: none;">
                
                <button class="chat-emoji-trigger-btn" id="msgEmojiToggleBtn" title="Insert Emoji">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M12 18.75a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5ZM9.75 9.75h.008v.008H9.75V9.75Zm4.5 0h.008v.008h-.008V9.75Z" />
                    </svg>
                </button>
                
                <input type="text" id="msgInputField" placeholder="Select an online user to chat..." disabled autocomplete="off">
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
    const fileInput = document.getElementById('msgFileInput');
    const attachButton = document.getElementById('msgAttachBtn');
    
    const emojiToggleBtn = document.getElementById('msgEmojiToggleBtn');
    const emojiPickerPanel = document.getElementById('msgEmojiPickerPanel');
    const emojiPickerGrid = document.getElementById('msgEmojiPickerGrid');
    const emojiPickerTitle = document.getElementById('msgEmojiPickerTitle');

    // Apple/Twemoji Character Code Point Resolver Utility (Strips hidden 'fe0f' flags)
    function getEmojiHex(emoji) {
        return Array.from(emoji)
            .map(char => char.codePointAt(0).toString(16))
            .filter(hex => hex !== 'fe0f')
            .join('-');
    }

    // Floating Picker Dictionary List Array
    const emojiDictionaryList = [
        '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗',
        '😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟',
        '😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶',
        '😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧',
        '😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈',
        '👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽',
        '👍','👎','👊','✊','🤛','🤜','🤞','✌️','🤟','🤘','👌','🤏','👈','👉','👆','👇','☝️','✋',
        '🤚','🖐️','🖖','👋','🤙','💪','🦾','🖕','✍️','🙏','🤝','❤️','🧡','💛','💚','💙','💜','🖤',
        '🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','💟','🌟','🔥','✨','🎉'
    ];

    // Mini Bubble Shortcut Menu List Configuration Matrix
    const quickReactionList = ['👍', '❤️', '🔥', '😂'];

    // Load bottom row dynamic grids
    emojiDictionaryList.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'picker-emoji-cell';
        btn.type = 'button';
        const hex = getEmojiHex(emoji);
        btn.innerHTML = `<img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${hex}.png" alt="${emoji}" style="width: 24px; height: 24px; object-fit: contain; pointer-events: none;" onerror="this.replaceWith('${emoji}')">`;
        
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // If the global picker panel was opened from a message context `+` button:
            if (targetMessageIdForGlobalPicker) {
                await appendReactionToBubble(targetMessageIdForGlobalPicker, emoji);
                emojiPickerPanel.classList.remove('active');
                emojiToggleBtn.classList.remove('active');
                targetMessageIdForGlobalPicker = null;
            } else {
                // Otherwise, it was opened from the chat input box row to insert text
                if (!inputField.disabled) {
                    inputField.value += emoji;
                    inputField.focus();
                }
            }
        });
        emojiPickerGrid.appendChild(btn);
    });

    emojiToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!inputField.disabled) {
            targetMessageIdForGlobalPicker = null; // Typing context mode
            emojiPickerTitle.textContent = "Expressions";
            emojiPickerPanel.classList.toggle('active');
            emojiToggleBtn.classList.toggle('active');
        }
    });

    // Global Click Dispatcher to manage panel states safely
    body.addEventListener('click', (e) => {
        if (!emojiPickerPanel.contains(e.target) && e.target !== emojiToggleBtn && !emojiToggleBtn.contains(e.target)) {
            emojiPickerPanel.classList.remove('active');
            emojiToggleBtn.classList.remove('active');
        }
        
        if (!e.target.closest('.chat-bubble-wrapper')) {
            document.querySelectorAll('.chat-bubble-wrapper.active-menu').forEach(bubble => {
                bubble.classList.remove('active-menu');
            });
        }
    });

    // 2. Initialize Real-Time Presence Telemetry Channel
    const presenceChannel = spClient.channel('gamerack_online_grid', {
        config: { presence: { key: sessionUserId } }
    });

    presenceChannel
        .on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.presenceState();
            liveOnlineUsers = Object.keys(state).map(userId => {
                const primaryMeta = state[userId][0];
                return {
                    id: userId,
                    user_uuid: userId,
                    name: primaryMeta.name,
                    initial: primaryMeta.initial,
                    avatar: primaryMeta.avatar || ""
                };
            }).filter(u => u.id !== sessionUserId);

            if (currentlySelectedUser) {
                const refreshedMatch = liveOnlineUsers.find(u => u.id === currentlySelectedUser.id);
                currentlySelectedUser = refreshedMatch || null;
            }

            renderContactsPage();
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

    // 3. Initialize Direct P2P Broadcast Fabric
    const messagingChannel = spClient.channel('gamerack_chat_fabric');

    messagingChannel
        .on('broadcast', { event: 'p2p_msg' }, (payload) => {
            const packet = payload.payload;
            if (packet.recipientId === sessionUserId && currentlySelectedUser && currentlySelectedUser.user_uuid === packet.senderId) {
                loadChatHistory();
            }
        })
        .on('broadcast', { event: 'p2p_reaction' }, (payload) => {
            const packet = payload.payload;
            if ((packet.recipientId === sessionUserId || packet.senderId === sessionUserId) && currentlySelectedUser) {
                loadChatHistory();
            }
        })
        .subscribe();

    // 4. Interface Rendering Engine
    function renderContactsPage() {
        userListContainer.innerHTML = '';
        if (liveOnlineUsers.length === 0) {
            userListContainer.innerHTML = `<div style="padding: 20px 16px; color: #64748b; font-size: 12px; text-align: center;">● No online users</div>`;
            return;
        }

        liveOnlineUsers.forEach(user => {
            const row = document.createElement('div');
            row.className = `user-row ${currentlySelectedUser && user.id === currentlySelectedUser.id ? 'active' : ''}`;
            let avatarContent = user.avatar ? `<div class="user-avatar" style="background-image: url('${user.avatar}'); text-indent: -9999px;"></div>` : `<div class="user-avatar">${user.initial}</div>`;

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
        
        const { data: dbMessages, error } = await spClient
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${sessionUserId},recipient_id.eq.${currentlySelectedUser.user_uuid}),and(sender_id.eq.${currentlySelectedUser.user_uuid},recipient_id.eq.${sessionUserId})`)
            .order('created_at', { ascending: true });

        if (error) return;
        
        chatHistoryContainer.innerHTML = '';
        
        dbMessages.forEach(msg => {
            const isOutgoing = msg.sender_id === sessionUserId;
            
            const wrapper = document.createElement('div');
            wrapper.className = `chat-bubble-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}`;
            wrapper.dataset.messageId = msg.id;
            
            wrapper.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const alreadyOpen = wrapper.classList.contains('active-menu');
                
                document.querySelectorAll('.chat-bubble-wrapper.active-menu').forEach(b => {
                    b.classList.remove('active-menu');
                });
                
                if (!alreadyOpen) {
                    wrapper.classList.add('active-menu');
                }
            });
            
            // Build Floating Action Quick Reaction Menu Card
            const actionMenu = document.createElement('div');
            actionMenu.className = 'bubble-context-reaction-bar';
            
            // Render basic short list triggers
            quickReactionList.forEach(emoji => {
                const emoBtn = document.createElement('button');
                emoBtn.className = 'bubble-react-emoji-clicker';
                const emojiHex = getEmojiHex(emoji);
                emoBtn.innerHTML = `<img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${emojiHex}.png" alt="${emoji}">`;
                
                emoBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    appendReactionToBubble(msg.id, emoji);
                    wrapper.classList.remove('active-menu'); 
                });
                actionMenu.appendChild(emoBtn);
            });

            // Add '+' Button to load the full panel options grid
            const plusBtn = document.createElement('button');
            plusBtn.className = 'bubble-react-plus-btn';
            plusBtn.type = 'button';
            plusBtn.textContent = '+';
            plusBtn.title = 'More Reactions';
            
            plusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Point tracking reference context index target variable to this specific message
                targetMessageIdForGlobalPicker = msg.id;
                emojiPickerTitle.textContent = "React to Message";
                
                // Toggle open the main expressions grid system panel viewport
                emojiPickerPanel.classList.add('active');
                
                // Instantly collapse and hide the small floating bar so it doesn't overlap the panel
                wrapper.classList.remove('active-menu'); 
            });
            actionMenu.appendChild(plusBtn);
            wrapper.appendChild(actionMenu);

            // Chat Bubble Element Node
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`;
            
            if (msg.message_text) bubble.textContent = msg.message_text;
            if (msg.file_url) {
                const img = document.createElement('img');
                img.src = msg.file_url;
                img.className = 'chat-attached-img';
                img.onclick = (e) => {
                    e.stopPropagation();
                    window.open(msg.file_url, '_blank');
                };
                bubble.appendChild(img);
            }
            wrapper.appendChild(bubble);

            // Build Inline Pill Box Container Row directly under the message bubble
            const pillsContainer = document.createElement('div');
            pillsContainer.className = 'bubble-inline-reactions-container';
            
            let safeReactions = msg.reactions;
            if (typeof safeReactions === 'string') {
                try { safeReactions = JSON.parse(safeReactions); } catch(e) { safeReactions = {}; }
            }
            if (!safeReactions || typeof safeReactions !== 'object') {
                safeReactions = {};
            }

            Object.entries(safeReactions).forEach(([emojiSymbol, userIdsArray]) => {
                if (!Array.isArray(userIdsArray)) {
                    userIdsArray = [];
                }
                const talliesCount = userIdsArray.length;
                
                if (talliesCount > 0) {
                    const pill = document.createElement('div');
                    const hasMyReaction = userIdsArray.includes(sessionUserId);
                    
                    pill.className = `reaction-pill-badge ${hasMyReaction ? 'my-reaction-active' : ''}`;
                    const badgeHex = getEmojiHex(emojiSymbol);
                    pill.innerHTML = `<img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${badgeHex}.png" alt="${emojiSymbol}"> <span>${talliesCount}</span>`;
                    
                    pill.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        appendReactionToBubble(msg.id, emojiSymbol);
                    });
                    pillsContainer.appendChild(pill);
                }
            });
            wrapper.appendChild(pillsContainer);
            chatHistoryContainer.appendChild(wrapper);
        });
        
        chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
    }

    // Handles smart anti-spam toggling: Max 1 unique reaction per user per emoji
    async function appendReactionToBubble(msgId, emoji) {
        const numericId = parseInt(msgId, 10);
        
        const { data: currentMsg, error: fetchError } = await spClient
            .from('messages')
            .select('reactions')
            .eq('id', numericId)
            .single();

        if (fetchError) {
            console.error("Failed to fetch current reactions:", fetchError.message);
            return;
        }

        let reactionMatrix = currentMsg?.reactions || {};
        if (typeof reactionMatrix === 'string') {
            try { reactionMatrix = JSON.parse(reactionMatrix); } catch(e) { reactionMatrix = {}; }
        }
        if (typeof reactionMatrix !== 'object' || reactionMatrix === null) {
            reactionMatrix = {};
        }
        
        if (!Array.isArray(reactionMatrix[emoji])) {
            reactionMatrix[emoji] = [];
        }
        
        const index = reactionMatrix[emoji].indexOf(sessionUserId);
        
        if (index > -1) {
            reactionMatrix[emoji].splice(index, 1);
        } else {
            reactionMatrix[emoji].push(sessionUserId);
        }

        const { error: updateError } = await spClient
            .from('messages')
            .update({ reactions: reactionMatrix })
            .eq('id', numericId);

        if (updateError) {
            console.error("Supabase rejected reaction update:", updateError.message);
        } else {
            messagingChannel.send({
                type: 'broadcast',
                event: 'p2p_reaction',
                payload: { senderId: sessionUserId, recipientId: currentlySelectedUser.user_uuid }
            });
            await loadChatHistory();
        }
    }

    async function processOutgoingMessage() {
        const text = inputField.value.trim();
        if (!text || !currentlySelectedUser) return;

        const { error } = await spClient
            .from('messages')
            .insert({
                sender_id: sessionUserId,
                recipient_id: currentlySelectedUser.user_uuid,
                message_text: text,
                reactions: {} 
            });

        if (error) {
            console.error("Supabase failed to insert message:", error.message);
            alert("Message failed to send: " + error.message);
        } else {
            messagingChannel.send({
                type: 'broadcast',
                event: 'p2p_msg',
                payload: { senderId: sessionUserId, recipientId: currentlySelectedUser.user_uuid }
            });
            inputField.value = '';
            await loadChatHistory(); 
        }
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file || !currentlySelectedUser) return;

        const fileExt = file.name.split('.').pop();
        const pathFileName = `${sessionUserId}/${Date.now()}.${fileExt}`;

        const { data: storageData, error: uploadErr } = await spClient.storage
            .from('messages_bucket')
            .upload(pathFileName, file, { cacheControl: '3600', upsert: true });

        if (uploadErr) return;

        const { data: { publicUrl } } = spClient.storage
            .from('messages_bucket')
            .getPublicUrl(pathFileName);

        const { error: dbErr } = await spClient
            .from('messages')
            .insert({
                sender_id: sessionUserId,
                recipient_id: currentlySelectedUser.user_uuid,
                message_text: '', 
                file_url: publicUrl,
                reactions: {}
            });

        if (!dbErr) {
            messagingChannel.send({
                type: 'broadcast',
                event: 'p2p_msg',
                payload: { senderId: sessionUserId, recipientId: currentlySelectedUser.user_uuid }
            });
            await loadChatHistory();
        }
    }

    // Native DOM Action Bindings
    launcher.addEventListener('click', () => panel.classList.toggle('active'));
    sendButton.addEventListener('click', processOutgoingMessage);
    inputField.addEventListener('keydown', (e) => { if (e.key === 'Enter') processOutgoingMessage(); });
    attachButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleImageUpload);

    body.addEventListener('click', (e) => {
        const selectedUserRow = e.target.closest('.user-row');
        if (selectedUserRow && window.innerWidth <= 768) {
            panel.classList.add('user-is-selected');
        }
    });

    body.addEventListener('click', (e) => {
        if (e.target.closest('#chatCloseXBtn')) {
            panel.classList.remove('active');
            panel.classList.remove('user-is-selected'); 
        }
        if (e.target.closest('#mobileChatBackBtn') && window.innerWidth <= 768) {
            panel.classList.remove('user-is-selected');
        }
        if (e.target.closest('#sidebarBackToAppsBtn')) {
            panel.classList.remove('active');
            panel.classList.remove('user-is-selected');
        }
    });

    renderContactsPage();
});