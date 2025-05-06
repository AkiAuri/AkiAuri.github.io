// --- Unique name lock logic start ---
const CLIENT_ID = (function() {
  let id = localStorage.getItem('chatClientId');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('chatClientId', id);
  }
  return id;
})();

const db = window._fb_db;

function hasNameLock(name) {
  return db.ref('activeUsers/' + encodeURIComponent(name)).once('value').then(snap => !!snap.val());
}
function takeNameLock(name) {
  return db.ref('activeUsers/' + encodeURIComponent(name)).set({
    clientId: CLIENT_ID,
    timestamp: Date.now()
  });
}
function releaseNameLock(name) {
  return db.ref('activeUsers/' + encodeURIComponent(name)).once('value').then(snap => {
    if (snap.val() && snap.val().clientId === CLIENT_ID) {
      return db.ref('activeUsers/' + encodeURIComponent(name)).remove();
    }
  });
}
function clearNameAndLock() {
  const name = localStorage.getItem('chatUserName');
  if (name) releaseNameLock(name);
  localStorage.removeItem('chatUserName');
}
window.addEventListener('beforeunload', clearNameAndLock);

async function promptForUniqueName() {
  let name = '';
  while (!name) {
    name = prompt('Enter your unique name for Dollistan Notes:') || '';
    name = name.trim();
    if (!name) continue;
    if (await hasNameLock(name)) {
      alert('This name is already in use. Please pick another.');
      name = '';
    } else {
      await takeNameLock(name);
      localStorage.setItem('chatUserName', name);
      break;
    }
  }
  return name;
}

async function getUserName() {
  let name = localStorage.getItem('chatUserName') || '';
  if (name) {
    // Try to reacquire lock
    await takeNameLock(name);
    return name;
  }
  return await promptForUniqueName();
}
// --- Unique name lock logic end ---

// UI logic for sidebar
function updateSidebarUsername(name) {
  document.getElementById('sidebar-username').textContent = name ? `Signed in as: ${name}` : '';
}

// Logout/change name button handler
document.getElementById('logout-btn').addEventListener('click', async function() {
  const oldName = localStorage.getItem('chatUserName');
  if (oldName) await releaseNameLock(oldName);
  localStorage.removeItem('chatUserName');
  updateSidebarUsername('');
  // Prompt for a new name and reload UI with new name
  userName = await promptForUniqueName();
  updateSidebarUsername(userName);
});

// Main chat logic
let userName;
(async function () {
  userName = await getUserName();
  updateSidebarUsername(userName);

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
})();

// Helper to format date as DD/MM/YYX (last char is weekday initial)
function formatTimestamp(ts) {
  const d = new Date(ts);
  const weekdays = ['S','M','T','W','T','F','S'];
  return `[${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getFullYear()).slice(-2)}${weekdays[d.getDay()]}]`;
}