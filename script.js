let isMuted = false;
const chatEl = document.getElementById("chat");
const inputBox = document.getElementById("inputBox");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const muteBtn = document.getElementById("muteBtn");

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + (role === "user" ? "user" : "bot");
  div.innerHTML = `<strong>${role === "user" ? "You" : "Bot"}:</strong> ${text}`;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "msg bot typing";
  typingDiv.innerHTML = `<div class="dot"></div><div class="dot"></div><div class="dot"></div>`;
  chatEl.appendChild(typingDiv);
  chatEl.scrollTop = chatEl.scrollHeight;
  return typingDiv;
}

function cleanText(text) {
  return text.replace(/\*/g, "");
}

function speak(text) {
  if (isMuted || !window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  window.speechSynthesis.cancel(); // stop any ongoing speech
  window.speechSynthesis.speak(utter);
}

// === Backend Call ===
async function callServer(userText) {
  const apiURL = "https://mental-health-chatbot-embqgbfvbze8a0cu.azurewebsites.net/api/chat";

  try {
    const res = await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    return data.reply || "No reply.";
  } catch (err) {
    console.error("❌ Fetch error:", err);
    throw new Error("Network or server issue.");
  }
}

async function sendMessage() {
  const text = inputBox.value.trim();
  if (!text) return;

  appendMessage("user", text);
  inputBox.value = "";

  const typingDiv = showTyping();

  try {
    const reply = cleanText(await callServer(text));
    typingDiv.remove();
    appendMessage("bot", reply);
    speak(reply);
  } catch (e) {
    typingDiv.remove();
    appendMessage("bot", "⚠️ Unable to connect to server. Please try again later.");
  }
}

// === Event Listeners ===
sendBtn.addEventListener("click", sendMessage);
inputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "🔇" : "🔊";
  if (isMuted) window.speechSynthesis.cancel();
});

// === Voice Input ===
let recognition = null;
if (window.SpeechRecognition || window.webkitSpeechRecognition) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = "en-US";
  recognition.onresult = (e) => {
    inputBox.value = e.results[0][0].transcript;
    sendMessage();
  };
  recognition.onend = () => { micBtn.textContent = "🎤"; };
} else micBtn.style.display = "none";

micBtn.addEventListener("click", () => {
  if (!recognition) return;
  if (micBtn.dataset.listening === "1") {
    recognition.stop();
    micBtn.dataset.listening = "0";
    micBtn.textContent = "🎤";
  } else {
    recognition.start();
    micBtn.dataset.listening = "1";
    micBtn.textContent = "🔴";
  }
});
