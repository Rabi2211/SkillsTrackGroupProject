const menuButton = document.querySelector('#menuButton');
const menu = document.querySelector('#menu');
const fileInput = document.querySelector('#pdfFile');
const fileName = document.querySelector('#fileName');
const uploadButton = document.querySelector('#uploadButton');
const status = document.querySelector('#status');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menu.hidden = isOpen;
});

document.addEventListener('click', (event) => {
  if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  fileName.textContent = file ? file.name : 'No file selected';
  status.textContent = '';
});

uploadButton.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (!file) {
    status.textContent = 'Please choose a PDF first.';
    return;
  }
  if (file.type !== 'application/pdf') {
    status.textContent = 'Only PDF files can be uploaded.';
    return;
  }
  status.textContent = `${file.name} is ready to upload.`;
});

document.querySelector('#backButton').addEventListener('click', () => {
  if (window.history.length > 1) window.history.back();
});
