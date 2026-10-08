const requests = [
  { id: 1, learner: 'Learner [name]' },
  { id: 2, learner: 'Learner [name]' }
];

const requestList = document.querySelector('#requests');
const emptyState = document.querySelector('#emptyState');
const dialog = document.querySelector('#scheduleDialog');
const form = document.querySelector('#scheduleForm');
const selectedRequest = document.querySelector('#selectedRequest');
let activeRequest;

function renderRequests() {
  requestList.innerHTML = '';
  emptyState.hidden = requests.length !== 0;
  requests.forEach((request) => {
    const item = document.createElement('article');
    item.className = 'request';
    item.innerHTML = `
      <div class="request-header" aria-hidden="true">
        <div>Date:</div><div>Time:</div><div>Schedule</div>
      </div>
      <div class="request-body">
        <div class="message">${request.learner} wants to book for support</div>
        <div><button class="schedule" type="button" data-id="${request.id}">
          <span class="calendar" aria-hidden="true"></span>Schedule
        </button></div>
      </div>`;
    requestList.appendChild(item);
  });
}

requestList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-id]');
  if (!button) return;
  activeRequest = requests.find((request) => request.id === Number(button.dataset.id));
  selectedRequest.textContent = `${activeRequest.learner} wants to book for support.`;
  dialog.showModal();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  requests.splice(requests.indexOf(activeRequest), 1);
  dialog.close();
  form.reset();
  renderRequests();
});

document.querySelector('#closeDialog').addEventListener('click', () => dialog.close());
document.querySelector('#cancelDialog').addEventListener('click', () => dialog.close());
renderRequests();
