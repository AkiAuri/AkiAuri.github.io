// Convert a data URL to a Blob object
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){ u8arr[n] = bstr.charCodeAt(n); }
  return new Blob([u8arr], {type:mime});
}

// Compress image files to fit under 2MB (downscale and reduce quality if needed)
async function compressImage(file, maxSizeMB = 2) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let [w, h] = [img.width, img.height];
      // Downscale if huge
      const maxDim = 2000;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
        else { w = Math.round(w * maxDim / h); h = maxDim; }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      let quality = 0.92;
      function tryCompress() {
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const blob = dataURLtoBlob(dataUrl);
        if (blob.size <= maxSizeMB * 1024 * 1024 || quality < 0.5) {
          resolve(blob);
        } else {
          quality -= 0.07;
          tryCompress();
        }
      }
      tryCompress();
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Add file input to chat form if not present
const chatFormEl = document.getElementById('chat-form');
let fileInput = document.getElementById('file-input');
if (!fileInput) {
  fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'file-input';
  fileInput.style.display = 'none';
  chatFormEl.appendChild(fileInput);
}

// Add a button to trigger file input if not present
let fileBtn = document.getElementById('file-btn');
if (!fileBtn) {
  fileBtn = document.createElement('button');
  fileBtn.type = 'button';
  fileBtn.id = 'file-btn';
  fileBtn.textContent = '📎';
  fileBtn.title = 'Attach file (max 2MB)';
  fileBtn.style.marginRight = '0.5em';
  chatFormEl.insertBefore(fileBtn, chatFormEl.firstChild);
}

fileBtn.onclick = () => fileInput.click();

// Handle file selection, compress if needed, and validate size
fileInput.onchange = async function(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024 && file.type.startsWith('image/')) {
    // Compress image
    const compressed = await compressImage(file, 2);
    if (compressed.size > 2 * 1024 * 1024) {
      alert('Image is too large even after compression.');
      return;
    }
    uploadFile(compressed, file.name);
  } else if (file.size > 2 * 1024 * 1024) {
    alert('File is too large (max 2MB).');
    return;
  } else {
    uploadFile(file, file.name);
  }
}

// Dummy uploadFile function (replace with backend logic to upload file and send URL in chat)
function uploadFile(file, filename) {
  // TODO: Replace with actual upload logic
  alert('File ready to upload: ' + filename + ' (' + file.size + ' bytes)');
  // After upload, send file URL in chat
}