import '../../firebase.js';

const taskForm = document.getElementById('taskForm');

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!taskForm.reportValidity()) {
    return;
  }

  const task = {
    title: taskForm.elements.taskTitle.value.trim(),
    description: taskForm.elements.taskDescription.value.trim(),
    dueDate: taskForm.elements.taskDueDate.value,
    otherInfo: taskForm.elements.otherInfo.value.trim()
  };

  const tasks = JSON.parse(localStorage.getItem('skillsTrackTasks') || '[]');
  tasks.push(task);
  localStorage.setItem('skillsTrackTasks', JSON.stringify(tasks));
  window.alert('Task created successfully!');
  taskForm.reset();
  taskForm.elements.taskTitle.focus();
});