const db = window._fb_db;
const chatbox = document.getElementById("chatbox");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message");
const sidebarGroups = document.querySelectorAll('.sidebar-group');
const title = document.querySelector('.title');

let currentChannel = "defunctotrons";

const chatNames = {
  defunctotrons: 'NA',
  pvpenabled: 'SEA'
};

// Validate a username (alphanumeric, max 20 chars)
function validateName(name) {
  return (name || "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 20);
}

// Prompt user for a valid name
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

// Add Purge Chat button if username is Sparrow
function maybeAddPurgeButton() {
  let btn = document.getElementById('purge-btn');
  if (username === 'Sparrow') {
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'purge-btn';
      btn.textContent = 'Purge Chat';
      btn.className = 'sidebar-btn';
      btn.style.marginTop = '1em';
      btn.onclick = function() {
        if (confirm('Are you sure you want to purge all messages in this channel?')) {
          db.ref('chats/' + currentChannel).remove();
          chatbox.innerHTML = '';
        }
      };
      // Insert after logout button
      const logoutBtn = document.getElementById('logout-btn');
      logoutBtn.parentNode.insertBefore(btn, logoutBtn.nextSibling);
    }
  } else if (btn) {
    btn.remove();
  }
}

maybeAddPurgeButton();

// Render a chat message in BBS style
function renderMessage({ timestamp, name, text }) {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  // Always use 207X for year
  const year = '207' + (d.getFullYear() % 10);
  const dateStr = `[${day}/${month}/${year}]`;
  const msgDiv = document.createElement("div");
  msgDiv.className = "bbs-message";
  msgDiv.innerHTML = `<span class='bbs-date'>${dateStr}</span> <span class='bbs-user'>${name}</span><span class='bbs-sep'>:</span> <span class='bbs-text'>${text}</span>`;
  chatbox.appendChild(msgDiv);
}

// Listen for and display messages for the current channel
function fetchAndListen(channel) {
  chatbox.innerHTML = "";
  db.ref("chats/" + channel).off(); // Remove previous listeners
  db.ref("chats/" + channel).limitToLast(100).on("child_added", snapshot => {
    renderMessage(snapshot.val());
    chatbox.scrollTop = chatbox.scrollHeight;
  });
}

// Update the chat title based on the selected channel
function updateTitleForChannel(channel) {
  const region = chatNames[channel] || '';
  title.textContent = 'Dollistan Notes' + (region ? ' - ' + region : ':');
}

// Sidebar switching
sidebarGroups.forEach(group => {
  group.addEventListener("click", () => {
    currentChannel = group.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    fetchAndListen(currentChannel);
    sidebarGroups.forEach(g => g.classList.remove('active'));
    group.classList.add('active');
    maybeAddPurgeButton(); // Update button on channel switch
    updateTitleForChannel(currentChannel); // Update title
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
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.onclick = () => {
  const newName = promptForName("Enter new name:");
  if (newName) {
    username = newName;
    localStorage.setItem('username', username);
    maybeAddPurgeButton();
  }
};

// Initial fetch
fetchAndListen(currentChannel);
updateTitleForChannel(currentChannel);