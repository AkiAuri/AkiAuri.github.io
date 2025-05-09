// Dollistan Notes post/reply system
// All logic for the post board is here

// DOM elements
const notesGroup = document.getElementById('dollistan-notes-group');
const sidebar = document.getElementById('sidebar');
const sidebarContent = sidebar.querySelector('.sidebar-content');
const chatbox = document.getElementById('chatbox');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message');

// State
let notesMode = false;
let notesPosts = [];
let currentThreadId = null;

// Firebase setup (assumes firebase is already initialized)
const db = window.firebase && firebase.database ? firebase.database() : null;
const NOTES_DB_PATH = 'dollistanNotesPosts';

// Utility: generate a random 4chan-style ID
function randomId(len = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let out = '';
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}

// Render the list of posts in the sidebar
function renderNotesSidebar(posts) {
    // Remove any old notes list
    let oldList = document.getElementById('dollistan-notes-list');
    if (oldList) oldList.remove();
    // Create new list
    const list = document.createElement('div');
    list.id = 'dollistan-notes-list';
    list.style.marginTop = '0.7em';
    posts.forEach(post => {
        const btn = document.createElement('button');
        btn.className = 'sidebar-btn';
        btn.style.fontSize = '1em';
        btn.textContent = `#${post.id} ${post.title || post.text.slice(0, 24)}`;
        btn.onclick = () => openThread(post.id);
        list.appendChild(btn);
    });
    // Add a button to create a new post
    const newBtn = document.createElement('button');
    newBtn.className = 'sidebar-btn';
    newBtn.style.color = '#7fffd4';
    newBtn.textContent = '+ New Post';
    newBtn.onclick = showNewPostForm;
    list.appendChild(newBtn);
    // Insert after the Dollistan Notes group
    const group = document.getElementById('dollistan-notes-group');
    group.insertAdjacentElement('afterend', list);
}

// Show the new post form in the main area
function showNewPostForm() {
    currentThreadId = null;
    chatbox.innerHTML = `
        <div style="margin-bottom:1em;font-weight:bold;">New Dollistan Note</div>
        <input id="note-title" type="text" placeholder="Title (optional)" style="width:100%;margin-bottom:0.5em;" maxlength="40" />
        <textarea id="note-text" placeholder="Your post..." style="width:100%;height:5em;"></textarea>
        <button id="post-note-btn" style="margin-top:0.7em;">Post</button>
    `;
    document.getElementById('post-note-btn').onclick = submitNewPost;
}

// Submit a new post to Firebase
function submitNewPost() {
    const title = document.getElementById('note-title').value.trim();
    const text = document.getElementById('note-text').value.trim();
    if (!text) return alert('Post cannot be empty.');
    const id = randomId(6);
    const post = {
        id,
        title,
        text,
        time: Date.now(),
        replies: []
    };
    if (db) db.ref(`${NOTES_DB_PATH}/${id}`).set(post);
}

// Open a thread (post + replies)
function openThread(id) {
    currentThreadId = id;
    const post = notesPosts.find(p => p.id === id);
    if (!post) return;
    let html = `<div style="font-weight:bold;">#${post.id} ${post.title ? post.title : ''}</div>`;
    html += `<div style="margin:0.5em 0 1em 0;">${escapeHtml(post.text)}</div>`;
    html += '<div style="margin-bottom:0.7em;font-size:0.95em;">Replies:</div>';
    (post.replies || []).forEach(reply => {
        html += `<div style="margin-bottom:0.5em;padding-left:1em;border-left:2px solid #222;">
            <span style="color:#7fffd4;">#${reply.id}</span> ${escapeHtml(reply.text)}
        </div>`;
    });
    html += `
        <textarea id="reply-text" placeholder="Reply..." style="width:100%;height:3em;"></textarea>
        <button id="reply-btn" style="margin-top:0.5em;">Reply</button>
    `;
    chatbox.innerHTML = html;
    document.getElementById('reply-btn').onclick = submitReply;
}

// Submit a reply to the current thread
function submitReply() {
    const text = document.getElementById('reply-text').value.trim();
    if (!text || !currentThreadId) return;
    const reply = { id: randomId(6), text, time: Date.now() };
    const postRef = db.ref(`${NOTES_DB_PATH}/${currentThreadId}/replies`);
    postRef.once('value', snap => {
        const replies = snap.val() || [];
        replies.push(reply);
        postRef.set(replies);
    });
}

// Escape HTML for safe display
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(tag) {
        const charsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return charsToReplace[tag] || tag;
    });
}

// Listen for changes in posts
if (db) {
    db.ref(NOTES_DB_PATH).on('value', snap => {
        const val = snap.val() || {};
        notesPosts = Object.values(val).sort((a, b) => b.time - a.time);
        if (notesMode) renderNotesSidebar(notesPosts);
        // If viewing a thread, update it
        if (notesMode && currentThreadId) openThread(currentThreadId);
    });
}

// Switch to notes mode when group is clicked
notesGroup.addEventListener('click', () => {
    notesMode = true;
    renderNotesSidebar(notesPosts);
    chatbox.innerHTML = '<div style="color:#7fffd4;">Select a post or create a new one.</div>';
    // Hide chat form in notes mode
    chatForm.style.display = 'none';
});

// Restore chat mode if another group is clicked (basic logic)
const defunctGroup = sidebar.querySelector('.sidebar-group');
defunctGroup.addEventListener('click', () => {
    notesMode = false;
    currentThreadId = null;
    // Remove notes list
    let oldList = document.getElementById('dollistan-notes-list');
    if (oldList) oldList.remove();
    chatbox.innerHTML = '';
    chatForm.style.display = '';
});

// Also restore chat mode if PVP group is clicked
const pvpGroup = sidebar.querySelectorAll('.sidebar-group')[1];
pvpGroup.addEventListener('click', () => {
    notesMode = false;
    currentThreadId = null;
    let oldList = document.getElementById('dollistan-notes-list');
    if (oldList) oldList.remove();
    chatbox.innerHTML = '';
    chatForm.style.display = '';
});

// On page load, ensure chat form is visible
chatForm.style.display = '';
