// Dollistan Notes (threaded post/reply system)
// This file handles the post/reply logic for the Dollistan Notes sidebar group.

const notesDb = window._fb_db;
const notesFeed = document.getElementById('notes-feed');
const newNoteForm = document.getElementById('new-note-form');
const threadView = document.getElementById('thread-view');

// Utility: Generate a unique post ID (timestamp + random)
function generatePostId() {
    return 'N' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

// Utility: Escape HTML for safe rendering
function escapeHtml(str) {
    return (str||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}

// Render all posts as horizontal cards
function renderNotesFeed(posts) {
    notesFeed.innerHTML = '';
    if (!posts || Object.keys(posts).length === 0) {
        notesFeed.innerHTML = '<div class="bbs-message">No posts yet. Be the first to post!</div>';
        return;
    }
    Object.values(posts).sort((a, b) => b.timestamp - a.timestamp).forEach(post => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
            <div class="note-card-header">
                <span class="note-id">#${post.id}</span>
                <span class="note-title">${escapeHtml(post.title || '(untitled)')}</span>
                <span class="note-author">by ${escapeHtml(post.author)}</span>
            </div>
            <div class="note-card-content">${escapeHtml(post.content)}</div>
            <button class="sidebar-btn note-reply-btn">View & Reply</button>
        `;
        card.querySelector('.note-reply-btn').onclick = () => showThread(post.id);
        notesFeed.appendChild(card);
    });
}

// Show a thread (post and its replies)
function showThread(postId) {
    notesFeed.style.display = 'none';
    newNoteForm.style.display = 'none';
    threadView.style.display = '';
    notesDb.ref('notes/' + postId).once('value', snap => {
        const post = snap.val();
        if (!post) {
            threadView.innerHTML = '<div class="bbs-message">Post not found.</div>';
            return;
        }
        notesDb.ref('notesReplies/' + postId).once('value', repliesSnap => {
            const replies = repliesSnap.val() || {};
            let html = `<div class='note-card thread-main'>
                <div class="note-card-header">
                    <span class="note-id">#${post.id}</span>
                    <span class="note-title">${escapeHtml(post.title || '(untitled)')}</span>
                    <span class="note-author">by ${escapeHtml(post.author)}</span>
                </div>
                <div class="note-card-content">${escapeHtml(post.content)}</div>
            </div>`;
            html += '<div class="thread-replies">';
            Object.values(replies).sort((a,b)=>a.timestamp-b.timestamp).forEach(reply => {
                html += `<div class='note-card reply-card'>
                    <div class="note-card-header">
                        <span class="note-author">${escapeHtml(reply.author)}</span>
                    </div>
                    <div class="note-card-content">${escapeHtml(reply.content)}</div>
                </div>`;
            });
            html += '</div>';
            html += `
                <form id="reply-form" class="chat-input-bar" autocomplete="off" style="flex-direction:column;gap:0.5em;margin-top:1em;">
                    <textarea id="reply-content" placeholder="Write a reply..." required style="min-height:3em;"></textarea>
                    <button type="submit" class="sidebar-btn" style="margin-top:0.5em;">Reply</button>
                    <button type="button" class="sidebar-btn" id="back-to-feed" style="margin-top:0.5em;">Back to Posts</button>
                </form>
            `;
            threadView.innerHTML = html;
            document.getElementById('reply-form').onsubmit = function(e) {
                e.preventDefault();
                const content = document.getElementById('reply-content').value.trim();
                if (!content) return;
                const reply = {
                    content,
                    author: localStorage.getItem('username') || 'Anon',
                    timestamp: Date.now()
                };
                notesDb.ref('notesReplies/' + postId).push(reply, () => showThread(postId));
            };
            document.getElementById('back-to-feed').onclick = showFeed;
        });
    });
}

// Show the main feed and new post form
function showFeed() {
    threadView.style.display = 'none';
    notesFeed.style.display = '';
    newNoteForm.style.display = '';
}

// Handle new post submission
newNoteForm.onsubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();
    if (!content) return;
    const id = generatePostId();
    const post = {
        id,
        title,
        content,
        author: localStorage.getItem('username') || 'Anon',
        timestamp: Date.now()
    };
    notesDb.ref('notes/' + id).set(post, () => {
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        showFeed();
    });
};

// Listen for changes to notes and update feed
notesDb.ref('notes').on('value', snap => {
    renderNotesFeed(snap.val() || {});
});

let lastNotesSnapshot = null;
function fetchNotesAndUpdateFeed() {
    notesDb.ref('notes').once('value', snap => {
        const val = snap.val() || {};
        // Only update if changed
        if (JSON.stringify(val) !== JSON.stringify(lastNotesSnapshot)) {
            renderNotesFeed(val);
            lastNotesSnapshot = val;
        }
    });
}
// Poll every 5 seconds for updates
setInterval(fetchNotesAndUpdateFeed, 5000);
// Initial fetch
fetchNotesAndUpdateFeed();

// Show feed on load
showFeed();
