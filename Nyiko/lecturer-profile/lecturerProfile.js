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
      window.location.href = '../../src/pages/landing.html';
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
