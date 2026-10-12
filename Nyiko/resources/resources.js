import '../../firebase.js';

const uploadButton = document.querySelector('.upload-button');
const uploadIconButton = document.querySelector('.upload-icon');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.pdf';
fileInput.style.display = 'none';

document.body.appendChild(fileInput);

const openFilePicker = () => {
  fileInput.click();
};

if (uploadButton) {
  uploadButton.addEventListener('click', openFilePicker);
}

if (uploadIconButton) {
  uploadIconButton.addEventListener('click', openFilePicker);
}

fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    alert('Selected file: ' + fileName);
  }
});
