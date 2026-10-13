import { get, ref } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js';
import { db, snapshotToList } from '../../firebase.js';

const grid = document.querySelector('.resources-grid');

function setEmptyState(message = 'No PDFs uploaded yet.') {
  if (!grid) return;
  grid.innerHTML = `
    <div class="resource-item resource-empty">
      <div class="resource-card" aria-label="No uploaded resources">PDF</div>
      <p class="resource-empty-message">${message}</p>
    </div>
  `;
}

async function downloadResource(resource, button) {
  const fileName = resource.fileName || resource.name || 'resource.pdf';
  const originalLabel = button.textContent;

  button.disabled = true;
  button.textContent = 'Downloading...';

  try {
    // Older records may hold a direct link; new ones keep the file under resourceFiles.
    let href = resource.url || '';
    if (!href) {
      const fileSnapshot = await get(ref(db, `resourceFiles/${resource.id}/dataUrl`));
      href = fileSnapshot.val() || '';
    }

    if (!href) {
      alert('This PDF is no longer available.');
      return;
    }

    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Unable to download resource:', error);
    alert('Failed to download PDF. Please try again.');
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
  }
}

function buildResourceItem(resource) {
  const name = resource.name || resource.fileName || 'PDF resource';

  const item = document.createElement('div');
  item.className = 'resource-item';

  const card = document.createElement('div');
  card.className = 'resource-card';
  card.setAttribute('aria-label', name);
  card.textContent = 'PDF';

  const title = document.createElement('p');
  title.className = 'resource-name';
  title.textContent = name;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'resource-button';
  button.textContent = 'Download';
  button.addEventListener('click', () => downloadResource(resource, button));

  item.append(card, title, button);
  return item;
}

async function loadResources() {
  if (!grid) return;

  try {
    const snapshot = await get(ref(db, 'resources'));
    const resources = snapshotToList(snapshot).reverse();

    if (!resources.length) {
      setEmptyState();
      return;
    }

    grid.replaceChildren(...resources.map(buildResourceItem));
  } catch (error) {
    console.error('Unable to load resource downloads:', error);
    setEmptyState('Unable to load resources. Please sign in and try again.');
  }
}

loadResources();
