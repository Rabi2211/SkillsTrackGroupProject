const learners = [
  { name: 'Learner [name]', assigned: 8, completed: 6, score: 78 },
  { name: 'Learner [name]', assigned: 8, completed: 7, score: 84 },
  { name: 'Learner [name]', assigned: 8, completed: 5, score: 69 },
  { name: 'Learner [name]', assigned: 8, completed: 8, score: 91 },
  { name: 'Learner [name]', assigned: 8, completed: 6, score: 75 },
  { name: 'Learner [name]', assigned: 8, completed: 7, score: 82 },
  { name: 'Learner [name]', assigned: 8, completed: 4, score: 63 },
  { name: 'Learner [name]', assigned: 8, completed: 8, score: 88 }
];

const completion = (learner) => Math.round((learner.completed / learner.assigned) * 100);
const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const rows = document.querySelector('#learnerRows');

learners.forEach((learner, index) => {
  const row = document.createElement('tr');
  row.innerHTML = `<td>${index + 1}</td><td>${learner.name}</td><td>${learner.assigned}</td><td>${learner.completed}</td><td>${completion(learner)}%</td><td>${learner.score}%</td>`;
  rows.appendChild(row);
});

document.querySelector('#totalLearners').textContent = learners.length;
document.querySelector('#averageCompletion').textContent = `${Math.round(average(learners.map(completion)))}%`;
document.querySelector('#averageScore').textContent = `${Math.round(average(learners.map((learner) => learner.score)))}%`;
document.querySelector('#reportDate').valueAsDate = new Date();
document.querySelector('#printButton').addEventListener('click', () => window.print());
document.querySelector('#backButton').addEventListener('click', () => {
  if (window.history.length > 1) window.history.back();
});
