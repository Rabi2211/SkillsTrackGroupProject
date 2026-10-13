import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-storage.js';
import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
import { storage, db, auth } from '../../firebase.js';

const uploadButton = document.querySelector('.upload-button');
const uploadIconButton = document.querySelector('.upload-icon');
const fileNameLabel = document.getElementById('selected-file-name');
const confirmationMessage = document.createElement('p');

confirmationMessage.textContent = '';
confirmationMessage.style.marginTop = '12px';
confirmationMessage.style.color = '#1ecf6a';
confirmationMessage.style.fontWeight = '600';
confirmationMessage.style.display = 'none';

document.body.appendChild(confirmationMessage);

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.pdf';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

let selectedFile = null;

const openFilePicker = () => {
  fileInput.click();
};

const updateSelectedFileLabel = (file) => {
  if (fileNameLabel) {
    fileNameLabel.textContent = file ? file.name : 'No PDF selected';
  }
};

if (uploadButton) {
  uploadButton.addEventListener('click', async () => {
    if (!selectedFile) {
      alert('Please select a PDF file before uploading.');
      return;
    }

    if (!auth.currentUser) {
      alert('Please sign in before uploading a PDF.');
      return;
    }

    try {
      const safeBaseName = (selectedFile.name || 'resource')
        .replace(/\.pdf$/i, '')
        .trim()
        .replace(/[^a-zA-Z0-9\-_ ]/g, ' ')
        .replace(/\s+/g, '_') || 'resource';

      const storageRef = ref(storage, `resources/${Date.now()}_${safeBaseName}.pdf`);
      await uploadBytes(storageRef, selectedFile);
      const downloadUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'resources'), {
        name: selectedFile.name,
        fileName: selectedFile.name,
        url: downloadUrl,
        uploadedBy: auth.currentUser.uid,
        uploadedAt: serverTimestamp(),
      });

      confirmationMessage.textContent = 'PDF saved in the Firestore resources collection successfully.';
      confirmationMessage.style.display = 'block';
      selectedFile = null;
      fileInput.value = '';
      updateSelectedFileLabel(null);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload PDF. Please try again.');
    }
  });
}

if (uploadIconButton) {
  uploadIconButton.addEventListener('click', openFilePicker);
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files && fileInput.files[0];
  if (!file) {
    selectedFile = null;
    updateSelectedFileLabel(null);
    return;
  }

  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    alert('Please select a PDF file.');
    fileInput.value = '';
    selectedFile = null;
    updateSelectedFileLabel(null);
    return;
  }

  selectedFile = file;
  updateSelectedFileLabel(file);
});
