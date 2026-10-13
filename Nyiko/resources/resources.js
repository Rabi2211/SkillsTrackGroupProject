import { getPdfProblem, getUploadErrorMessage, uploadPdf } from '../../src/pages/resourceUpload.js';

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

// Returns true when the file can be uploaded, otherwise explains why not.
const selectFile = (file) => {
  selectedFile = null;

  if (!file) {
    updateSelectedFileLabel(null);
    return false;
  }

  const problem = getPdfProblem(file);
  if (problem) {
    updateSelectedFileLabel(null);
    showStatus(problem, 'error');
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
    await uploadPdf(file);

    selectedFile = null;
    fileInput.value = '';
    updateSelectedFileLabel(null);
    showStatus(`"${file.name}" uploaded successfully. Learners can now download it from their Resources page.`, 'success');
  } catch (error) {
    console.error('Upload failed:', error);
    showStatus(getUploadErrorMessage(error), 'error');

    if (error.code === 'not-signed-in') {
      setTimeout(() => {
        window.location.href = LOGIN_PAGE;
      }, 1800);
    }
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
