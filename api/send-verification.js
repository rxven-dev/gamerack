import 'dotenv/config'; // 🌟 Add this if your local setup isn't reading the .env file automatically
import { Resend } from 'resend';

// This safely extracts your key from the secure environment vault
const resend = new Resend(process.env.RESEND_API_KEY);

async function loadChatHistory() {
        if (!currentlySelectedUser) return;
        
        inputRow.style.opacity = "1";
        inputRow.style.pointerEvents = "auto";
        inputField.disabled = false;
        inputField.placeholder = `Message ${currentlySelectedUser.name}...`;
        sendButton.disabled = false;

        chatTitle.textContent = `Chatting with ${currentlySelectedUser.name}`;
        
        // 🔄 FETCH RECORDS WITH EXPLICIT TYPE CASTS (::uuid)
        // This forces Postgres to parse text variables as native UUID formats!
        const { data: dbMessages, error } = await spClient
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${sessionUserId}::uuid,recipient_id.eq.${currentlySelectedUser.id}::uuid),and(sender_id.eq.${currentlySelectedUser.id}::uuid,recipient_id.eq.${sessionUserId}::uuid)`)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Failed to compile chat logs:", error.message);
            return;
        }

        // Map database schemas perfectly into your incoming/outgoing bubble classes
        currentlySelectedUser.messages = dbMessages.map(msg => ({
            type: msg.sender_id === sessionUserId ? 'outgoing' : 'incoming',
            text: msg.message_text
        }));
        
        chatHistoryContainer.innerHTML = '';
        currentlySelectedUser.messages.forEach(msg => {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${msg.type}`;
            bubble.textContent = msg.text;
            chatHistoryContainer.appendChild(bubble);
        });
        chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
    }