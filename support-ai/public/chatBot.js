(function () {
  const api_Url = "https://ai-support-chatbot-ten.vercel.app/api/chat";
  let conversationHistory = [];

  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.error("❌ SupportAI: Owner ID missing!");
    return;
  }

  // Inject Styles
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes chat-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .chat-bubble { animation: chat-fade-in 0.3s ease-out; }
  `;
  document.head.appendChild(style);

  // Chat button
  const button = document.createElement("div");
  button.innerHTML = "💬";
  Object.assign(button.style, {
    position: "fixed", bottom: "24px", right: "24px", width: "60px", height: "60px",
    borderRadius: "50%", background: "#000", color: "#fff", display: "flex",
    alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)", zIndex: "999999", transition: "transform 0.2s"
  });
  button.onmouseover = () => button.style.transform = "scale(1.05)";
  button.onmouseout = () => button.style.transform = "scale(1)";
  document.body.appendChild(button);

  // Chat box
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed", bottom: "100px", right: "24px", width: "350px", height: "500px",
    background: "#fff", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    display: "none", flexDirection: "column", overflow: "hidden", zIndex: "999999",
    fontFamily: "'Inter', sans-serif", border: "1px solid #eee"
  });

  box.innerHTML = `
    <div style="background: #000; color: #fff; padding: 16px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
      <span>AI Assistant</span>
      <span id="chat-close" style="cursor:pointer; opacity: 0.8;">✕</span>
    </div>
    <div id="chat-messages" style="flex: 1; padding: 16px; overflow-y: auto; background: #fcfcfc; display: flex; flex-direction: column; gap: 12px;"></div>
    <div style="padding: 16px; border-top: 1px solid #eee; display: flex; gap: 8px;">
      <input id="chat-input" placeholder='Type your message...' style="flex: 1; border: 1px solid #ddd; border-radius: 8px; padding: 10px; outline: none; font-size: 14px;"/>
      <button id="chat-send" style="background: #000; color: #fff; border: none; border-radius: 8px; padding: 0 16px; cursor: pointer; font-weight: 500;">Send</button>
    </div>
  `;

  document.body.appendChild(box);

  const toggle = () => {
    const isHidden = box.style.display === "none";
    box.style.display = isHidden ? "flex" : "none";
    if (isHidden) document.getElementById("chat-input").focus();
  };

  button.addEventListener("click", toggle);
  document.getElementById("chat-close").addEventListener("click", toggle);

  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  const messageArea = document.getElementById("chat-messages");

  function addMessage(text, role) {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.innerText = text;
    Object.assign(bubble.style, {
      padding: "10px 14px", borderRadius: "12px", fontSize: "14px", maxWidth: "80%",
      lineHeight: "1.5", alignSelf: role === "user" ? "flex-end" : "flex-start",
      background: role === "user" ? "#000" : "#f1f1f1",
      color: role === "user" ? "#fff" : "#333",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
    });
    messageArea.appendChild(bubble);
    messageArea.scrollTop = messageArea.scrollHeight;
    
    // Save to history
    conversationHistory.push({ role, text });
    if (conversationHistory.length > 10) conversationHistory.shift(); // Keep last 10
  }

  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    const typing = document.createElement("div");
    typing.innerText = "Assistant is thinking...";
    typing.style.fontSize = "12px";
    typing.style.color = "#888";
    messageArea.appendChild(typing);

    try {
      const res = await fetch(api_Url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, message: text, history: conversationHistory.slice(0, -1) })
      });
      const data = await res.json();
      typing.remove();
      addMessage(data.reply || "Sorry, I couldn't process that.", "assistant");
    } catch (err) {
      typing.remove();
      addMessage("Technical error. Please try again later.", "assistant");
    }
  }

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSend(); });

  // Initial Greeting
  setTimeout(() => addMessage("Hello! How can I help you today?", "assistant"), 500);

})();

})();