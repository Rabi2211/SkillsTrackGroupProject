import '../../firebase.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { auth } from '../../firebase.js';

const closeButton = document.querySelector('.close-button');
const settingsButton = document.getElementById('settingsButton');
const settingsPopup = document.getElementById('settingsPopup');
const closePopupButton = document.getElementById('closePopupButton');
const signOutButton = document.querySelector('.menu-card button[type="button"]');

if (settingsButton && settingsPopup) {
  settingsButton.addEventListener('click', () => {
    settingsPopup.hidden = !settingsPopup.hidden;
  });
}

if (closePopupButton && settingsPopup) {
  closePopupButton.addEventListener('click', () => {
    settingsPopup.hidden = true;
  });
}

if (signOutButton) {
  signOutButton.addEventListener('click', async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('skillsTrackCurrentUser');
      window.location.href = '../../src/pages/index.html';
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  });
}

if (closeButton) {
  closeButton.addEventListener('click', () => {
    window.history.back();
  });
}

// Display identity information for the currently signed-in lecturer.
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('skillsTrackCurrentUser') || '{}');
  } catch (error) {
    return {};
  }
}

const identityName = document.querySelector('.identity p:first-child');
const identityEmail = document.querySelector('.identity p:last-child');

function setIdentity(name, email) {
  if (identityName) identityName.textContent = name || '[Name and Surname]';
  if (identityEmail) identityEmail.textContent = email || '[Username(email)]';
}

function populateFromDetail(detail) {
  const data = detail?.data || detail || {};
  const first = data.lecturerName || data.firstName || (data.fullName ? String(data.fullName).split(' ')[0] : '') || '';
  const last = data.lecturerSurname || data.lastName || (data.fullName ? String(data.fullName).split(' ').slice(1).join(' ') : '') || '';
  const fullName = `${first} ${last}`.trim();
  const username = data.username || data.email || data.userEmail || '';
  setIdentity(fullName || getStoredUser().fullName || '', username || getStoredUser().email || '');
}

window.addEventListener('userDataUpdated', (e) => {
  populateFromDetail(e.detail || {});
});

window.addEventListener('userLoggedOut', () => {
  setIdentity('[Name and Surname]', '[Username(email)]');
});

// Initial render from local storage
const stored = getStoredUser();
setIdentity(stored.fullName || stored.lecturerName || '', stored.email || '');
