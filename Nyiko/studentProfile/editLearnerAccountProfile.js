import { auth, db } from '../../firebase.js';
import { get, ref, update } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js';

const nameInput = document.getElementById('nameInput');
const surnameInput = document.getElementById('surnameInput');
const identityParagraphs = document.querySelectorAll('.identity p');
const updateButton = document.querySelector('.update-button');

function getInitialsFromProfile(data = {}) {
  const candidateName = data.name || data.firstName || data.fullName || '';
  const candidateSurname = data.surname || data.lastName || '';

  if (candidateName && candidateSurname) {
    return { name: candidateName, surname: candidateSurname };
  }

  const fullName = (data.fullName || candidateName || '').trim();
  const parts = fullName.split(/\s+/).filter(Boolean);

  return {
    name: parts[0] || candidateName || '',
    surname: parts.slice(1).join(' ') || candidateSurname || ''
  };
}

async function loadProfile() {
  const user = auth.currentUser;
  if (!user || !nameInput || !surnameInput) return;

  try {
    const profileRef = ref(db, `students/${user.uid}`);
    const snapshot = await get(profileRef);

    if (!snapshot.exists()) return;

    const data = snapshot.val() || {};
    const initials = getInitialsFromProfile(data);

    nameInput.value = initials.name;
    surnameInput.value = initials.surname;

    if (identityParagraphs[0]) {
      const fullName = `${initials.name} ${initials.surname}`.trim();
      identityParagraphs[0].textContent = fullName ? `[${fullName}]` : '[Name and Surname]';
    }
  } catch (error) {
    console.error('Failed to load learner profile data:', error);
  }
}

updateButton.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) {
    alert('Please log in to update your profile.');
    return;
  }

  const nameValue = nameInput.value.trim();
  const surnameValue = surnameInput.value.trim();

  if (!nameValue || !surnameValue) {
    alert('Please complete both fields.');
    return;
  }

  const fullName = `${nameValue} ${surnameValue}`.trim();

  try {
    const profileRef = ref(db, `students/${user.uid}`);
    await update(profileRef, {
      name: nameValue,
      surname: surnameValue,
      firstName: nameValue,
      lastName: surnameValue,
      fullName,
      username: user.email || '',
      email: user.email || ''
    });

    if (identityParagraphs[0]) {
      identityParagraphs[0].textContent = `[${fullName}]`;
    }

    if (identityParagraphs[1]) {
      identityParagraphs[1].textContent = `[${user.email || ''}]`;
    }
  } catch (error) {
    console.error('Failed to update learner profile:', error);
    alert('Could not update your profile. Please try again.');
  }
});

loadProfile();
