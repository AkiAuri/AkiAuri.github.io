const db = window._fb_db;
const chatbox = document.getElementById("chatbox");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message");
const sidebarGroups = document.querySelectorAll('.sidebar-group');

let currentChannel = "defuntotrons";

function validateName(name) {
  return (name || "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 20);
}

function promptForName(message = "Enter your name:") {
  let name;
  do {
    name = prompt(message) || "";
    name = validateName(name);
    if (!name) alert("Name must be 1-20 alphanumeric characters (a-z, A-Z, 0-9) only.");
  } while (!name);
  return name;
}

let username = localStorage.getItem('username');
username = validateName(username);
if (!username) {
  username = promptForName();
  localStorage.setItem('username', username);
}

function renderMessage({ timestamp, name, text }) {
  const dateStr = new Date(timestamp).toLocaleString();
  const msgDiv = document.createElement("div");
  msgDiv.textContent = `[${dateStr}] - ${name}: ${text}`;
  chatbox.appendChild(msgDiv);
}

function fetchAndListen(channel) {
  chatbox.innerHTML = "";
  db.ref("chats/" + channel).off(); // Remove previous listeners
  db.ref("chats/" + channel).limitToLast(100).on("child_added", snapshot => {
    renderMessage(snapshot.val());
    chatbox.scrollTop = chatbox.scrollHeight;
  });
}

// Sidebar switching
sidebarGroups.forEach(group => {
  group.addEventListener("click", () => {
    currentChannel = group.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    fetchAndListen(currentChannel);
    sidebarGroups.forEach(g => g.classList.remove('active'));
    group.classList.add('active');
  });
});

// Sending messages
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  db.ref("chats/" + currentChannel).push({
    timestamp: Date.now(),
    name: username,
    text
  });
  messageInput.value = "";
});

// Change name
document.getElementById("logout-btn").onclick = () => {
  const newName = promptForName("Enter new name:");
  if (newName) {
    username = newName;
    localStorage.setItem('username', username);
  }
};

// Initial fetch
fetchAndListen(currentChannel);