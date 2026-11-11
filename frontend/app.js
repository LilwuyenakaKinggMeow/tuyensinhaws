
const API_URL = "http://localhost:3000/api/chat";

const chatContainer = document.getElementById("chatContainer");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

let chatHistory = [];

// ========================================
// 1. MARKDOWN RENDERER
// ========================================

// Chuyển các ký tự HTML nguy hiểm thành văn bản
function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, char => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[char];
    });
}

// Xử lý Markdown cơ bản
function formatInlineMarkdown(text) {
    let result = escapeHTML(text);

    // Inline code
    result = result.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Bold
    result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    result = result.replace(/__(.+?)__/g, "<strong>$1</strong>");

    // Italic
    result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
    result = result.replace(/_(.+?)_/g, "<em>$1</em>");

    return result;
}

// Chuyển Markdown thành HTML
function renderMarkdown(text) {
    if (!text) return "";

    const lines = String(text).replace(/\r\n/g, "\n").split("\n");

    let html = "";
    let paragraph = [];
    let listType = null;

    function closeParagraph() {
        if (paragraph.length > 0) {
            html += `<p>${paragraph.map(formatInlineMarkdown).join("<br>")}</p>`;
            paragraph = [];
        }
    }

    function closeList() {
        if (listType) {
            html += `</${listType}>`;
            listType = null;
        }
    }

    for (const line of lines) {
        const trimmed = line.trim();

        // Dòng trống
        if (!trimmed) {
            closeParagraph();
            closeList();
            continue;
        }

        // Tiêu đề Markdown: #, ##, ###
        const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);

        if (heading) {
            closeParagraph();
            closeList();

            const level = heading[1].length;
            html += `<h${level}>${formatInlineMarkdown(heading[2])}</h${level}>`;
            continue;
        }

        // Danh sách không thứ tự
        const unordered = trimmed.match(/^[-*+]\s+(.+)$/);

        if (unordered) {
            closeParagraph();

            if (listType !== "ul") {
                closeList();
                html += "<ul>";
                listType = "ul";
            }

            html += `<li>${formatInlineMarkdown(unordered[1])}</li>`;
            continue;
        }

        // Danh sách có thứ tự
        const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);

        if (ordered) {
            closeParagraph();

            if (listType !== "ol") {
                closeList();
                html += "<ol>";
                listType = "ol";
            }

            html += `<li>${formatInlineMarkdown(ordered[1])}</li>`;
            continue;
        }

        // Nội dung thông thường
        closeList();
        paragraph.push(trimmed);
    }

    closeParagraph();
    closeList();

    return html;
}

// ========================================
// 2. DISPLAY MESSAGE
// ========================================

function addMessage(text, type, source = null) {
    const message = document.createElement("div");
    message.className = `message ${type}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble markdown-content";

    // Render Markdown thay vì hiển thị text thuần
    bubble.innerHTML = renderMarkdown(text);

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
// 3. LOADING
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
// 4. SEND MESSAGE
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
// 5. ENTER TO SEND
// ========================================

function handleEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// ========================================
// 6. QUICK QUESTIONS
// ========================================

function quickQuestion(question) {
    messageInput.value = question;
    sendMessage();
}

// ========================================
// 7. NEW CHAT
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
// ========================================
// CHAT WIDGET CONTROLS
// ========================================

function openChat() {
    const chatWindow = document.getElementById("chatWindow");

    chatWindow.classList.add("open");
    chatWindow.classList.remove("minimized");

    setTimeout(() => {
        document.getElementById("messageInput")?.focus();
    }, 100);
}

function closeChat() {
    const chatWindow = document.getElementById("chatWindow");

    chatWindow.classList.remove("open");
    chatWindow.classList.remove("minimized");
}

function toggleChat() {
    const chatWindow = document.getElementById("chatWindow");

    if (chatWindow.classList.contains("open")) {
        closeChat();
    } else {
        openChat();
    }
}

function minimizeChat() {
    document.getElementById("chatWindow")
        .classList.toggle("minimized");
}

// Mở chatbot và gửi câu hỏi từ các thẻ chức năng
function askUDA(question) {
    openChat();
    quickQuestion(question);
}

// Tìm kiếm từ thanh tìm kiếm trang chủ
function searchHome() {
    const input = document.getElementById("homeSearch");
    const question = input.value.trim();

    if (!question) {
        input.focus();
        return;
    }

    openChat();
    quickQuestion(question);
    input.value = "";
}
// Khởi tạo Lucide Icons
if (window.lucide) {
    lucide.createIcons();
}
// Kiểm tra trạng thái Backend
async function checkBackendStatus() {
    const statusElement = document.getElementById("backendStatus");

    if (!statusElement) return;

    const textElement = statusElement.querySelector(".status-text");

    statusElement.classList.remove("online", "offline");
    statusElement.classList.add("checking");
    textElement.textContent = "Đang kiểm tra...";

    try {
        const response = await fetch("http://localhost:3000/api/health", {
            method: "GET",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Backend không phản hồi");
        }

        statusElement.classList.remove("checking", "offline");
        statusElement.classList.add("online");
        textElement.textContent = "Trực tuyến";

    } catch (error) {
        statusElement.classList.remove("checking", "online");
        statusElement.classList.add("offline");
        textElement.textContent = "Ngoại tuyến";
    }
}

// Kiểm tra khi mở trang và lặp lại mỗi 5 giây
checkBackendStatus();
setInterval(checkBackendStatus, 5000);