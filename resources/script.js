import '../firebase.js';

const uploadButton = document.querySelector('.upload-button');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.pdf';
fileInput.style.display = 'none';

document.body.appendChild(fileInput);

uploadButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    alert('Selected file: ' + fileName);
  }
});
