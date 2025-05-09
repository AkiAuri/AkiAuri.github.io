// --- Dollistan Notes (post/reply) system ---
// Handles the post/reply board logic for the 'Dollistan Notes' sidebar group

const db = window._fb_db;
const notesGroup = document.getElementById('notes-group');
const notesPanel = document.getElementById('notes-panel');
const notesList = document.getElementById('notes-list');
const newPostBtn = document.getElementById('new-post-btn');
const newPostForm = document.getElementById('new-post-form');
const postView = document.getElementById('post-view');
const postContent = document.getElementById('post-content');
const repliesList = document.getElementById('replies-list');
const replyForm = document.getElementById('reply-form');
const backToListBtn = document.getElementById('back-to-list');
const chatboxDiv = document.getElementById('chatbox');
const chatFormDiv = document.getElementById('chat-form');

// Show notes panel, hide chat
notesGroup.addEventListener('click', () => {
    notesPanel.style.display = '';
    chatboxDiv.style.display = 'none';
    chatFormDiv.style.display = 'none';
    loadNotesPosts();
});

// Hide notes panel, show chat when other group is clicked
const sidebarGroups = document.querySelectorAll('.sidebar-group');
sidebarGroups.forEach(group => {
    if (group !== notesGroup) {
        group.addEventListener('click', () => {
            notesPanel.style.display = 'none';
            chatboxDiv.style.display = '';
            chatFormDiv.style.display = '';
            postView.style.display = 'none';
            newPostForm.style.display = 'none';
        });
    }
});

// Load all posts
function loadNotesPosts() {
    notesList.innerHTML = '<em>Loading posts...</em>';
    db.ref('notes/posts').once('value', snap => {
        const posts = snap.val() || {};
        notesList.innerHTML = '';
        Object.entries(posts).reverse().forEach(([id, post]) => {
            const btn = document.createElement('button');
            btn.className = 'notes-post-btn';
            btn.textContent = `[${id.slice(-6)}] ${post.title} (${post.author})`;
            btn.onclick = () => showPost(id, post);
            notesList.appendChild(btn);
        });
        if (!Object.keys(posts).length) notesList.innerHTML = '<em>No posts yet.</em>';
    });
    postView.style.display = 'none';
    newPostForm.style.display = 'none';
}

// Show new post form
newPostBtn.onclick = () => {
    newPostForm.style.display = '';
    postView.style.display = 'none';
};

// Submit new post
newPostForm.onsubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById('post-title').value.trim();
    const body = document.getElementById('post-body').value.trim();
    if (!title || !body) return;
    const username = localStorage.getItem('username') || 'Anonymous';
    const id = 'N' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    db.ref('notes/posts/' + id).set({
        title,
        body,
        author: username,
        timestamp: Date.now()
    }, loadNotesPosts);
    newPostForm.reset();
    newPostForm.style.display = 'none';
};

// Show a post and its replies
function showPost(id, post) {
    postView.style.display = '';
    newPostForm.style.display = 'none';
    postContent.innerHTML = `<b>[${id.slice(-6)}] ${post.title}</b><br><pre>${post.body}</pre><div style='font-size:0.9em;color:#aaa;'>by ${post.author}</div>`;
    loadReplies(id);
    // Reply form
    replyForm.onsubmit = function(e) {
        e.preventDefault();
        const msg = document.getElementById('reply-message').value.trim();
        if (!msg) return;
        const username = localStorage.getItem('username') || 'Anonymous';
        const rid = 'R' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
        db.ref('notes/replies/' + id + '/' + rid).set({
            body: msg,
            author: username,
            timestamp: Date.now()
        }, () => loadReplies(id));
        replyForm.reset();
    };
    backToListBtn.onclick = () => loadNotesPosts();
}

// Load replies for a post
function loadReplies(postId) {
    repliesList.innerHTML = '<em>Loading replies...</em>';
    db.ref('notes/replies/' + postId).once('value', snap => {
        const replies = snap.val() || {};
        repliesList.innerHTML = '';
        Object.entries(replies).forEach(([rid, reply]) => {
            const div = document.createElement('div');
            div.className = 'notes-reply';
            div.innerHTML = `<b>[${rid.slice(-6)}]</b> <span style='color:#ffb347;'>${reply.author}</span>: ${reply.body}`;
            repliesList.appendChild(div);
        });
        if (!Object.keys(replies).length) repliesList.innerHTML = '<em>No replies yet.</em>';
    });
}