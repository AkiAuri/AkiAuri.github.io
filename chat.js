// Use window._fb_db as the database reference (set in firebase-client.js)
var db = window._fb_db;

// Listen for new messages
db.ref('chat').on('child_added', function(snapshot) {
  const msg = snapshot.val();
  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += `<b>${msg.name}:</b> ${msg.text}<br>`;
  chatbox.scrollTop = chatbox.scrollHeight;
});

function sendMessage() {
  const name = document.getElementById('name').value || "Anon";
  const text = document.getElementById('message').value;
  if (text.trim() === "") return;
  db.ref('chat').push({ name, text });
  document.getElementById('message').value = "";
}
