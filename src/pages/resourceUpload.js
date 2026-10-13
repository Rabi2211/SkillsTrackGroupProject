import { push, ref, serverTimestamp, set } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js';
import { auth, db } from '../../firebase.js';
import { isPdfFile } from './resourceStorage.js';

// The PDF itself is saved in the Realtime Database as a base64 data URL,
// which is larger than the file, so keep uploads well under the 10 MB value limit.
export const MAX_PDF_BYTES = 5 * 1024 * 1024;

// Returns why the file cannot be uploaded, or '' when it is fine.
export function getPdfProblem(file) {
  if (!file) {
    return 'Please choose a PDF file.';
  }

  if (!isPdfFile(file)) {
    return 'Only PDF files can be uploaded. Please choose a PDF.';
  }

  if (file.size > MAX_PDF_BYTES) {
    return 'This PDF is too large. Please choose a file smaller than 5 MB.';
  }

  return '';
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Saves the PDF for every signed-in user to see on the Resources page.
// Throws an error with code "not-signed-in" when nobody is logged in.
export async function uploadPdf(file) {
  await auth.authStateReady();

  if (!auth.currentUser) {
    const error = new Error('You must be signed in to upload a PDF.');
    error.code = 'not-signed-in';
    throw error;
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
    uploadedByEmail: auth.currentUser.email || '',
    uploadedAt: serverTimestamp(),
  });

  return resourceRef.key;
}

export function getUploadErrorMessage(error) {
  const details = `${error?.code || ''} ${error?.message || ''}`.toLowerCase();

  if (error?.code === 'not-signed-in') {
    return 'You are not signed in. Taking you to the login page...';
  }

  if (details.includes('permission')) {
    return 'The database refused the upload (permission denied). The Realtime Database rules must allow signed-in users to write.';
  }

  if (details.includes('network') || details.includes('disconnect')) {
    return 'Upload failed. Please check your internet connection and try again.';
  }

  return `Failed to upload PDF (${error?.code || error?.message || 'unknown error'}). Please try again.`;
}
