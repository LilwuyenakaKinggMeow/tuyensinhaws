
const API_URL = "http://localhost:3000/api/chat";

const chatContainer = document.getElementById("chatContainer");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

let chatHistory = [];

// ========================================
// 1. DISPLAY MESSAGE
// ========================================

function addMessage(text, type, source = null) {
    const message = document.createElement("div");
    message.className = `message ${type}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    message.appendChild(bubble);

    if (source) {
        const sourceElement = document.createElement("div");
        sourceElement.className = "source";
        sourceElement.textContent = "Nguồn: " + source;

        message.appendChild(sourceElement);
    }

    chatContainer.appendChild(message);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ========================================
// 2. LOADING
// ========================================

function showLoading() {
    const loading = document.createElement("div");

    loading.className = "message bot";
    loading.id = "chatLoading";
    loading.textContent = "UDA Assistant đang suy nghĩ...";

    chatContainer.appendChild(loading);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    return loading;
}

// ========================================
// 3. SEND MESSAGE
// ========================================

async function sendMessage() {
    const message = messageInput.value.trim();

    if (!message || sendButton.disabled) return;

    const welcome = document.getElementById("welcome");

    if (welcome) {
        welcome.remove();
    }

    addMessage(message, "user");

    messageInput.value = "";
    sendButton.disabled = true;

    const loading = showLoading();

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 45000);

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message,
                history: chatHistory
            }),

            signal: controller.signal
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Không thể xử lý câu hỏi."
            );
        }

        // Lưu lịch sử
        chatHistory.push({
            role: "user",
            content: message
        });

        chatHistory.push({
            role: "model",
            content: data.answer
        });

        chatHistory = chatHistory.slice(-8);

        // Hiển thị câu trả lời và nguồn
        addMessage(
            data.answer,
            "bot",
            data.source
        );

        console.log("CHAT RESPONSE:", {
            duration: data.duration,
            sources: data.sources
        });

    } catch (error) {
        console.error("CHAT ERROR:", error);

        const errorMessage = error.name === "AbortError"
            ? "Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại."
            : error.message || "Không thể kết nối đến máy chủ.";

        addMessage(errorMessage, "bot");

    } finally {
        clearTimeout(timeout);

        loading.remove();

        sendButton.disabled = false;
        messageInput.focus();
    }
}

// ========================================
// 4. ENTER TO SEND
// ========================================

function handleEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// ========================================
// 5. QUICK QUESTIONS
// ========================================

function quickQuestion(question) {
    messageInput.value = question;
    sendMessage();
}

// ========================================
// 6. NEW CHAT
// ========================================

function newChat() {
    chatHistory = [];

    chatContainer.innerHTML = `
        <div class="welcome" id="welcome">
            <div class="welcome-icon">🎓</div>

            <h1>Xin chào! Tôi có thể giúp gì cho bạn?</h1>

            <p>
                Hãy đặt câu hỏi về thông tin học vụ
                và tuyển sinh UDA.
            </p>
        </div>
    `;

    messageInput.value = "";
    messageInput.focus();
}
