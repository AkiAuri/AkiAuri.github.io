// --- Ensure Firebase Auth before any DB operation ---
async function ensureFirebaseAuth() {
  if (!firebase.auth().currentUser) {
    try {
      await firebase.auth().signInAnonymously();
    } catch (e) {
      alert("Could not authenticate with Firebase. Please try again.");
      throw e;
    }
  }
}

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

async function hasNameLock(name) {
  await ensureFirebaseAuth();
  return db.ref('activeUsers/' + encodeURIComponent(name)).once('value').then(snap => !!snap.val());
}
async function takeNameLock(name) {
  await ensureFirebaseAuth();
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Not authenticated!");
  const uid = user.uid;
  return db.ref('activeUsers/' + encodeURIComponent(name)).set({
    clientId: uid,
    timestamp: Date.now()
  });
}

async function releaseNameLock(name) {
  await ensureFirebaseAuth();
  const user = firebase.auth().currentUser;
  if (!user) return;
  const uid = user.uid;
  return db.ref('activeUsers/' + encodeURIComponent(name)).once('value').then(snap => {
    if (snap.val() && snap.val().clientId === uid) {
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
function updateSidebarUI(name) {
  // Special Kyue button
  const kyueDiv = document.getElementById('kyue-btn-container');
  kyueDiv.innerHTML = '';
  if (name === "'Kyue") {
    const btn = document.createElement('button');
    btn.textContent = "Kyue Power";
    btn.className = "kyue-btn";
    btn.onclick = () => alert("Special Kyue action!");
    kyueDiv.appendChild(btn);
  }

  // Sparrow dev erase button
  const sparrowDiv = document.getElementById('sparrow-btn-container');
  sparrowDiv.innerHTML = '';
  if (name === "'Sparrow") {
    const btn = document.createElement('button');
    btn.textContent = "Delete All Chat Logs";
    btn.className = "sparrow-btn";
    btn.onclick = async function() {
      await ensureFirebaseAuth();
      if (confirm("Are you sure you want to delete ALL chat logs? This cannot be undone.")) {
        await db.ref('chat').remove();
        alert("All chat logs deleted.");
        // Optionally clear chatbox UI
        document.getElementById('chatbox').innerHTML = '';
      }
    };
    sparrowDiv.appendChild(btn);
  }
}

// Sidebar toggle for mobile
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
sidebarToggle.addEventListener('click', function() {
  sidebar.classList.add('open');
});
sidebar.addEventListener('click', function(e) {
  // Close sidebar if background is clicked (not if sidebar-content is clicked)
  if (e.target === sidebar && window.innerWidth <= 900) {
    sidebar.classList.remove('open');
  }
});
// Also close sidebar if clicking outside (mobile)
document.addEventListener('click', function(e) {
  if (
      window.innerWidth <= 900 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      e.target !== sidebarToggle
  ) {
    sidebar.classList.remove('open');
  }
});

// Logout/change name button handler
document.getElementById('logout-btn').addEventListener('click', async function() {
  const oldName = localStorage.getItem('chatUserName');
  if (oldName) await releaseNameLock(oldName);
  localStorage.removeItem('chatUserName');
  updateSidebarUI('');
  userName = await promptForUniqueName();
  updateSidebarUI(userName);
});

// Main chat logic
let userName;
(async function () {
  await ensureFirebaseAuth();
  userName = await getUserName();
  updateSidebarUI(userName);

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
  document.getElementById('chat-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    await ensureFirebaseAuth();
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