(function () {
  const api_Url = "https://ai-support-chatbot-ten.vercel.app/api/chat";
  let conversationHistory = [];

  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) return console.error("❌ SupportAI: Owner ID missing!");

  // Inject Advanced Styles
  const style = document.createElement("style");
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    
    @keyframes chat-pop { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes slide-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
    
    .support-ai-box { animation: chat-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .chat-bubble { animation: slide-in 0.3s ease-out; }
    .quick-action { 
      background: #fff; border: 1px solid #e5e7eb; padding: 6px 12px; border-radius: 20px; 
      font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .quick-action:hover { background: #000; color: #fff; border-color: #000; }
  `;
  document.head.appendChild(style);

  // Floating Button
  const button = document.createElement("div");
  button.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`;
  Object.assign(button.style, {
    position: "fixed", bottom: "24px", right: "24px", width: "64px", height: "64px",
    borderRadius: "50%", background: "#000", color: "#fff", display: "flex",
    alignItems: "center", justifyContent: "center", cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)", zIndex: "999999", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  });
  button.onmouseover = () => button.style.transform = "scale(1.1) rotate(5deg)";
  button.onmouseout = () => button.style.transform = "scale(1) rotate(0deg)";
  document.body.appendChild(button);

  // Chat Window (Glassmorphism)
  const box = document.createElement("div");
  box.className = "support-ai-box";
  Object.assign(box.style, {
    position: "fixed", bottom: "100px", right: "24px", width: "380px", height: "550px",
    background: "rgba(255, 255, 255, 0.98)", backdropFilter: "blur(10px)",
    borderRadius: "24px", boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
    display: "none", flexDirection: "column", overflow: "hidden", zIndex: "999999",
    fontFamily: "'Inter', sans-serif", border: "1px solid rgba(0,0,0,0.05)"
  });

  box.innerHTML = `
    <div style="background: #000; color: #fff; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-weight: 600; font-size: 16px;">Support AI</div>
        <div style="font-size: 11px; opacity: 0.7; margin-top: 2px;">● Always Online</div>
      </div>
      <span id="chat-close" style="cursor:pointer; padding: 5px;">✕</span>
    </div>

    <div id="chat-messages" style="flex: 1; padding: 20px; overflow-y: auto; background: transparent; display: flex; flex-direction: column; gap: 14px;"></div>

    <div id="quick-actions" style="display: flex; gap: 8px; padding: 0 20px 15px; overflow-x: auto; scrollbar-width: none;">
      <div class="quick-action">How do I start?</div>
      <div class="quick-action">What are your prices?</div>
      <div class="quick-action">Contact Support</div>
    </div>

    <div style="padding: 16px 20px; border-top: 1px solid #eee; display: flex; gap: 10px; background: #fff;">
      <input id="chat-input" placeholder='Message Support AI...' style="flex: 1; border: none; padding: 10px 0; outline: none; font-size: 14px;"/>
      <button id="chat-send" style="background: #000; color: #fff; border: none; border-radius: 12px; padding: 0 20px; cursor: pointer; font-weight: 500; font-size: 14px; transition: opacity 0.2s;">Send</button>
    </div>
    <div style="text-align: center; font-size: 10px; color: #aaa; padding-bottom: 8px;">Powered by SupportAI</div>
  `;

  document.body.appendChild(box);

  const toggle = () => {
    const isHidden = box.style.display === "none";
    box.style.display = isHidden ? "flex" : "none";
    if (isHidden) input.focus();
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
      padding: "12px 16px", borderRadius: role === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
      fontSize: "14px", maxWidth: "85%", lineHeight: "1.5",
      alignSelf: role === "user" ? "flex-end" : "flex-start",
      background: role === "user" ? "#000" : "#f3f4f6",
      color: role === "user" ? "#fff" : "#1f2937",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
    });
    messageArea.appendChild(bubble);
    messageArea.scrollTop = messageArea.scrollHeight;
    conversationHistory.push({ role, text });
    if (conversationHistory.length > 10) conversationHistory.shift();
  }

  async function handleSend(customText) {
    const text = typeof customText === 'string' ? customText : input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    document.getElementById("quick-actions").style.display = "none";

    const typing = document.createElement("div");
    typing.innerHTML = `<span style="display:inline-flex; gap:3px;"><span style="width:4px; height:4px; background:#888; border-radius:50%; animation: bounce 1s infinite"></span><span style="width:4px; height:4px; background:#888; border-radius:50%; animation: bounce 1s infinite 0.2s"></span><span style="width:4px; height:4px; background:#888; border-radius:50%; animation: bounce 1s infinite 0.4s"></span></span>`;
    typing.style.padding = "10px";
    messageArea.appendChild(typing);

    try {
      const res = await fetch(api_Url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, message: text, history: conversationHistory.slice(0, -1) })
      });
      const data = await res.json();
      typing.remove();
      addMessage(data.reply || "I'm having trouble connecting. Please try again.", "assistant");
    } catch (err) {
      typing.remove();
      addMessage("Connection lost. Please check your internet.", "assistant");
    }
  }

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSend(); });

  // Quick Actions Handler
  document.querySelectorAll(".quick-action").forEach(btn => {
    btn.addEventListener("click", () => handleSend(btn.innerText));
  });

  // Welcome Message
  setTimeout(() => addMessage("Welcome! 👋 I'm your AI assistant. How can I help you today?", "assistant"), 600);

})();

