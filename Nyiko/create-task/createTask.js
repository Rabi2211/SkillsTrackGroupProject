import '../../firebase.js';
import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
import { auth, db } from '../../firebase.js';

const taskForm = document.getElementById('taskForm');

if (!taskForm) {
  throw new Error('Task form not found.');
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!taskForm.reportValidity()) {
    return;
  }

  const task = {
    title: taskForm.elements.taskTitle.value.trim(),
    description: taskForm.elements.taskDescription.value.trim(),
    dueDate: taskForm.elements.taskDueDate.value,
    otherInfo: taskForm.elements.otherInfo.value.trim(),
    status: 'pending',
    createdBy: auth.currentUser?.uid || 'guest-lecturer',
    assignedTo: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, 'tasks'), task);
    window.alert('Task created successfully!');
    taskForm.reset();
    taskForm.elements.taskTitle.focus();
  } catch (error) {
    console.error('Failed to create task:', error);
    window.alert('Failed to save task. Please try again.');
  }
});