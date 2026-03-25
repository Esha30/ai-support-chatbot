(function () {
  const api_Url = "http://localhost:3000/api/chat";

  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.log("❌ Owner Id not found!");
    return;
  }

  // Chat button
  const button = document.createElement("div");
  button.innerHTML = "💬";
  Object.assign(button.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "22px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
    zIndex: "999999",
  });
  document.body.appendChild(button);

  // Chat box
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    bottom: "90px",
    right: "24px",
    width: "320px",
    height: "420px",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: "999999",
    fontFamily: "Inter, system-ui, sans-serif",
  });

  box.innerHTML = `
    <div style="
      background: #000;
      color: #fff;
      padding: 12px 14px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <span>Customer Support</span>
      <span id="chat-close" style="cursor:pointer; font-size:16px;">❌</span>
    </div>

    <div id="chat-messages" style="
      flex: 1;
      padding: 12px;
      overflow-y: auto;
      background: #f9fafb;
      display: flex;
      flex-direction: column;
      gap: 8px;
    "></div>

    <div style="
      display: flex;
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      gap: 8px;
    ">
      <input id="chat-input" placeholder='Type a message...' style="
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
      "/>
      <button id="chat-send" style="
        padding: 8px 16px;
        background: #000;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
      ">Send</button>
    </div>
  `;

  document.body.appendChild(box);

  // Toggle chat
  button.addEventListener("click", () => {
    box.style.display = box.style.display === "none" ? "flex" : "none";
  });

  document.getElementById("chat-close").addEventListener("click", () => {
    box.style.display = "none";
  });

  const input = document.querySelector("#chat-input");
  const sendBtn = document.querySelector("#chat-send");
  const messageArea = document.querySelector("#chat-messages");

  // Message UI
  function addMessage(text, from) {
    const bubble = document.createElement("div");
    bubble.innerText = text;

    Object.assign(bubble.style, {
      borderRadius: "14px",
      fontSize: "13px",
      lineHeight: "1.4",
      marginBottom: "8px",
      alignSelf: from === "user" ? "flex-end" : "flex-start",
      background: from === "user" ? "#000" : "#e5e7eb",
      color: from === "user" ? "#fff" : "#111",
      padding: "8px 12px",
      maxWidth: "80%",
      wordBreak: "break-word",
    });

    messageArea.appendChild(bubble);
    messageArea.scrollTop = messageArea.scrollHeight;
  }

  // ✅ SINGLE CLEAN CLICK HANDLER
  sendBtn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    // typing indicator
    const typing = document.createElement("div");
    typing.innerText = "Typing...";
    Object.assign(typing.style, {
      fontSize: "12px",
      color: "#6b7280",
      marginBottom: "8px",
      alignSelf: "flex-start",
    });

    messageArea.appendChild(typing);
    messageArea.scrollTop = messageArea.scrollHeight;

    try {
      console.log("📤 Sending:", { ownerId, message: text });

      const res = await fetch(api_Url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId: ownerId,
          message: text,
        }),
      });

      const data = await res.json();
      console.log("📥 Response:", data);

      typing.remove();

      addMessage(data.reply || "No response from bot", "bot");

    } catch (err) {
      console.error("❌ Error:", err);
      typing.remove();
      addMessage("Server error. Try again.", "bot");
    }
  });

})();