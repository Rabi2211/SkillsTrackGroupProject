import { push, ref, serverTimestamp, set } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js';
import { auth, db } from '../../firebase.js';
import { isPdfFile } from '../../src/pages/resourceStorage.js';

// The PDF itself is saved in the Realtime Database as a base64 data URL,
// which is larger than the file, so keep uploads well under the 10 MB value limit.
const MAX_PDF_BYTES = 5 * 1024 * 1024;
const LOGIN_PAGE = '../../Patience/log-In-Lecturer/lecturerLogin.html';

const uploadButton = document.querySelector('.upload-button');
const uploadBox = document.querySelector('.upload-box');
const fileNameLabel = document.getElementById('selected-file-name');
const statusMessage = document.createElement('p');

statusMessage.setAttribute('role', 'status');
statusMessage.style.margin = '12px 0 0';
statusMessage.style.maxWidth = '420px';
statusMessage.style.fontWeight = '600';
statusMessage.style.textAlign = 'center';
statusMessage.style.display = 'none';

if (uploadButton) {
  uploadButton.insertAdjacentElement('afterend', statusMessage);
}

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.pdf,application/pdf';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

let selectedFile = null;
let isUploading = false;
// Set when UPLOAD is pressed before a file is chosen, so the upload
// starts as soon as the file has been picked.
let uploadAfterSelection = false;

const showStatus = (text, type = 'info') => {
  const colors = { info: '#f5efe7', success: '#1ecf6a', error: '#ffb4a8' };
  statusMessage.textContent = text;
  statusMessage.style.color = colors[type];
  statusMessage.style.display = text ? 'block' : 'none';
};

const openFilePicker = () => {
  if (!isUploading) {
    fileInput.click();
  }
};

const updateSelectedFileLabel = (file) => {
  if (fileNameLabel) {
    fileNameLabel.textContent = file ? file.name : 'No PDF selected';
  }
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

const getUploadErrorMessage = (error) => {
  const details = `${error?.code || ''} ${error?.message || ''}`.toLowerCase();

  if (details.includes('permission')) {
    return 'The database refused the upload (permission denied). The Realtime Database rules must allow signed-in users to write.';
  }

  if (details.includes('network') || details.includes('disconnect')) {
    return 'Upload failed. Please check your internet connection and try again.';
  }

  return `Failed to upload PDF (${error?.code || error?.message || 'unknown error'}). Please try again.`;
};

// Returns true when the file can be uploaded, otherwise explains why not.
const selectFile = (file) => {
  selectedFile = null;

  if (!file) {
    updateSelectedFileLabel(null);
    return false;
  }

  if (!isPdfFile(file)) {
    updateSelectedFileLabel(null);
    showStatus('Only PDF files can be uploaded. Please choose a PDF.', 'error');
    return false;
  }

  if (file.size > MAX_PDF_BYTES) {
    updateSelectedFileLabel(null);
    showStatus('This PDF is too large. Please choose a file smaller than 5 MB.', 'error');
    return false;
  }

  selectedFile = file;
  updateSelectedFileLabel(file);
  showStatus('Ready to upload. Click UPLOAD.');
  return true;
};

const uploadSelectedFile = async () => {
  if (isUploading || !selectedFile) return;

  const file = selectedFile;
  isUploading = true;
  uploadButton.disabled = true;
  showStatus('Uploading, please wait...');

  try {
    await auth.authStateReady();

    if (!auth.currentUser) {
      showStatus('You are not signed in. Taking you to the lecturer login page...', 'error');
      setTimeout(() => {
        window.location.href = LOGIN_PAGE;
      }, 1800);
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    const resourceRef = push(ref(db, 'resources'));

    // Save the file first so a listed resource always has a file behind it.
    await set(ref(db, `resourceFiles/${resourceRef.key}`), { dataUrl });
    await set(resourceRef, {
      name: file.name,
      fileName: file.name,
      size: file.size,
      uploadedBy: auth.currentUser.uid,
      uploadedAt: serverTimestamp(),
    });

    selectedFile = null;
    fileInput.value = '';
    updateSelectedFileLabel(null);
    showStatus(`"${file.name}" uploaded successfully. Learners can now download it from their Resources page.`, 'success');
  } catch (error) {
    console.error('Upload failed:', error);
    showStatus(getUploadErrorMessage(error), 'error');
  } finally {
    isUploading = false;
    uploadButton.disabled = false;
  }
};

if (uploadButton) {
  uploadButton.addEventListener('click', () => {
    if (!selectedFile) {
      // No file yet: let the lecturer pick one, then upload it straight away.
      uploadAfterSelection = true;
      openFilePicker();
      return;
    }

    uploadSelectedFile();
  });
}

if (uploadBox) {
  uploadBox.style.cursor = 'pointer';
  uploadBox.addEventListener('click', () => {
    uploadAfterSelection = false;
    openFilePicker();
  });

  // A PDF can also be dragged onto the box.
  uploadBox.addEventListener('dragover', (event) => {
    event.preventDefault();
  });
  uploadBox.addEventListener('drop', (event) => {
    event.preventDefault();
    if (isUploading) return;
    uploadAfterSelection = false;
    selectFile(event.dataTransfer?.files?.[0]);
  });
}

fileInput.addEventListener('cancel', () => {
  uploadAfterSelection = false;
});

fileInput.addEventListener('change', () => {
  const shouldUpload = uploadAfterSelection;
  uploadAfterSelection = false;

  const isValid = selectFile(fileInput.files && fileInput.files[0]);
  if (!isValid) {
    fileInput.value = '';
    return;
  }

  if (shouldUpload) {
    uploadSelectedFile();
  }
});
