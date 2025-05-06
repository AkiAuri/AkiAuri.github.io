// Helper to format date as DD/MM/YYX (last char is weekday initial)
function formatTimestamp(ts) {
  const d = new Date(ts);
  const weekdays = ['S','M','T','W','T','F','S'];
  return `[${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getFullYear()).slice(-2)}${weekdays[d.getDay()]}]`;
}

// Authentication: force user to pick a name before sending
function getUserName() {
  let name = localStorage.getItem('chatUserName') || '';
  while (!name) {
    name = prompt('Enter your name for Dollistan Notes:') || '';
    name = name.trim();
    if (name) localStorage.setItem('chatUserName', name);
  }
  return name;
}

const userName = getUserName();
const db = window._fb_db;

// Render new messages
function renderMessage(msg) {
  const chatbox = document.getElementById('chatbox');
  const timeStr = formatTimestamp(msg.timestamp || Date.now());
  const el = document.createElement('div');
  el.className = 'message';
  el.innerHTML = `<span class="timestamp">${timeStr}</span> – <span class="sender">${msg.name}:</span> ${msg.text}`;
  chatbox.appendChild(el);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Listen for new messages
db.ref('chat').on('child_added', function(snapshot) {
  const msg = snapshot.val();
  renderMessage(msg);
});

// Send message
document.getElementById('chat-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('message');
  const text = input.value.trim();
  if (!text) return;
  db.ref('chat').push({
    name: userName,
    text,
    timestamp: Date.now()
  });
  input.value = '';
});